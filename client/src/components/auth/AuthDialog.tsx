import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseClient } from "@/lib/supabaseClient";

type AuthDialogProps = {
  triggerLabel: string;
};

export function AuthDialog({ triggerLabel }: AuthDialogProps) {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSignIn = async () => {
    if (!supabase) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in / Sesión iniciada");
      setOpen(false);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      toast.error("Sign in failed / Error al iniciar sesión", { description: message, duration: 8000 });
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async () => {
    if (!supabase) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Check your email to confirm / Revisa tu correo para confirmar");
      setOpen(false);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      toast.error("Sign up failed / Error al registrarse", { description: message, duration: 8000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account / Cuenta</DialogTitle>
          <DialogDescription>
            Sign in to save analyses and get more credits. / Inicia sesión para guardar análisis y obtener más créditos.
          </DialogDescription>
        </DialogHeader>

        {!supabase ? (
          <div className="text-sm text-muted-foreground">
            Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
          </div>
        ) : (
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email-signin">Email / Correo</Label>
                <Input
                  id="auth-email-signin"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password-signin">Password / Contraseña</Label>
                <Input
                  id="auth-password-signin"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignIn} disabled={busy || !email || !password} className="w-full">
                {busy ? "Working..." : "Sign in"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email-signup">Email / Correo</Label>
                <Input
                  id="auth-email-signup"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password-signup">Password / Contraseña</Label>
                <Input
                  id="auth-password-signup"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignUp} disabled={busy || !email || !password} className="w-full">
                {busy ? "Working..." : "Create account"}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
