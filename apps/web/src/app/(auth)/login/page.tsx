import { LoginForm } from "~/components/forms/auth-form";
import { Card, CardContent } from "~/components/ui/card";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-bold text-2xl">Login to your account</h1>
          <p className="text-balance text-muted-foreground text-sm">
            Enter your credentials below to sign in to your account
          </p>
        </div>
        <Card>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
