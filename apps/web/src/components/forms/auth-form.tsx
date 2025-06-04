"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import PasswordInput, { Input } from "~/components/ui/input";
import { cn, fullUrl } from "~/lib/utils";
import { type FormSchema, formSchema } from "~/schemas/auth-schema";

export function LoginForm({ redirect }: { redirect?: string | null }) {
  const router = useRouter();
  const loader = useTopLoader();

  const mutation = useMutation({
    mutationFn: async (input: FormSchema["login"]) => {
      return await signIn("credentials", { redirect: false, ...input });
    },
    onSuccess: async (output) => {
      if (!output?.ok || output?.error) {
        toast("Login Failed");
        mutation.reset();
        return;
      }

      loader.start();
      toast("Login Success");
      router.replace(redirect ?? "/dashboard");
    },
    onError: (error) => {
      console.error(error);
      toast("Login Failed");
      mutation.reset();
    },
  });

  const disabled = React.useMemo(
    () => mutation.isPending || mutation.isSuccess,
    [mutation.isPending, mutation.isSuccess],
  );

  const form = useForm<FormSchema["login"]>({
    disabled,
    resolver: zodResolver(formSchema.login),
    defaultValues: { username: "", password: "" },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit((input: FormSchema["login"]) =>
          mutation.mutate(input),
        )}
      >
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={disabled}
          loading={mutation.isPending}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}

export function LogoutForm({
  className,
  setDisabled,
  disabled: _disabled,
}: {
  disabled?: boolean;
  className?: string;
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const loader = useTopLoader();

  const mutation = useMutation({
    onMutate: () => {
      setDisabled?.(true);
      loader.start();
    },
    mutationFn: async () => {
      return await signOut({ redirect: true, redirectTo: fullUrl("/login") });
    },
    onError: (error) => {
      setDisabled?.(false);
      console.error(error);
      toast("Logout Failed");
      mutation.reset();
    },
  });

  const disabled = React.useMemo(
    () => mutation.isPending || mutation.isSuccess || _disabled,
    [mutation.isPending, mutation.isSuccess, _disabled],
  );

  return (
    <Button
      type="button"
      disabled={disabled}
      className={cn(className)}
      loading={mutation.isPending}
      onClick={() => {
        mutation.mutate();
      }}
    >
      Logout
    </Button>
  );
}

export function LogoutDialogForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [disabled, setDisabled] = React.useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        if (!disabled) {
          setOpen((prev) => !prev);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to terminate your session, are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LogoutForm disabled={disabled} setDisabled={setDisabled} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
