import { LogoutForm } from "~/components/forms/auth-form";
import { Card, CardContent } from "~/components/ui/card";

export const metadata = {
  title: "Logout",
};

export default function LogoutPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-bold text-2xl">Logout from your account</h1>
          <p className="text-balance text-muted-foreground text-sm">
            Terminate your session and log out of your account
          </p>
        </div>
        <Card>
          <CardContent>
            <LogoutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
