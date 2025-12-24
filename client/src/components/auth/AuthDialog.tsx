import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      toast.success(t("authDialog.toasts.signedIn"));
      setOpen(false);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      toast.error(t("authDialog.toasts.signInFailed"), { description: message, duration: 8000 });
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
      toast.success(t("authDialog.toasts.signUpConfirm"));
      setOpen(false);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      toast.error(t("authDialog.toasts.signUpFailed"), { description: message, duration: 8000 });
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
          <DialogTitle>{t("authDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("authDialog.description")}
          </DialogDescription>
        </DialogHeader>

        {!supabase ? (
          <div className="text-sm text-muted-foreground">
            {t("authDialog.supabaseNotConfigured")}
          </div>
        ) : (
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("authDialog.tabs.signIn")}</TabsTrigger>
              <TabsTrigger value="signup">{t("authDialog.tabs.signUp")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email-signin">{t("authDialog.fields.email")}</Label>
                <Input
                  id="auth-email-signin"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password-signin">{t("authDialog.fields.password")}</Label>
                <Input
                  id="auth-password-signin"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignIn} disabled={busy || !email || !password} className="w-full">
                {busy ? t("authDialog.status.working") : t("authDialog.actions.signIn")}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email-signup">{t("authDialog.fields.email")}</Label>
                <Input
                  id="auth-email-signup"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password-signup">{t("authDialog.fields.password")}</Label>
                <Input
                  id="auth-password-signup"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignUp} disabled={busy || !email || !password} className="w-full">
                {busy ? t("authDialog.status.working") : t("authDialog.actions.signUp")}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}