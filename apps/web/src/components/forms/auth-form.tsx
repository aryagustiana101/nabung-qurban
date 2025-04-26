"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FormSchema, formSchema } from "@repo/common/schemas/auth-schema";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { fullUrl } from "~/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const loader = useTopLoader();
  const searchParams = useSearchParams();

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
      router.replace(searchParams?.get("from") ?? "/dashboard");
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

export function LogoutForm() {
  const loader = useTopLoader();

  const mutation = useMutation({
    mutationFn: async () => {
      return await signOut({ redirect: true, redirectTo: fullUrl("/login") });
    },
    onError: (error) => {
      console.error(error);
      toast("Logout Failed");
      mutation.reset();
    },
  });

  const disabled = React.useMemo(
    () => mutation.isPending || mutation.isSuccess,
    [mutation.isPending, mutation.isSuccess],
  );

  return (
    <Button
      type="button"
      className="w-full"
      disabled={disabled}
      loading={mutation.isPending}
      onClick={() => {
        loader.start();
        mutation.mutate();
      }}
    >
      Logout
    </Button>
  );
}
