import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import SignInPage from "./auth-form";

export function SignInDialog() {
  return (
    <ResponsiveDialog
      trigger={<Button variant="ghost" className="text-foreground/80 hover:text-foreground px-4 py-2 text-sm font-medium transition-colors duration-200">Sign In</Button>}
      title="Sign In"
      description="Sign in to your account"
      classes={{
        root: "max-w-2xl",
      }}
    >
      <SignInPage />
    </ResponsiveDialog>
  );
}
