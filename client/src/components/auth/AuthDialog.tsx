import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AuthDialogProps = {
  triggerLabel: string;
};

export function AuthDialog({ triggerLabel }: AuthDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <DialogContent className="sm:max-w-[440px] p-0">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          forceRedirectUrl="/analyze"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border-0 w-full',
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
