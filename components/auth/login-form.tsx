"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { getApiError, getErrorMessage } from "@/lib/api/errors";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Work email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

/** Only ever redirect back to a path within this app, never an external URL. */
function isSafeRedirectTarget(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);

    try {
      await login(values);
      const next = searchParams.get("next");
      router.push(next && isSafeRedirectTarget(next) ? next : "/dashboard");
    } catch (error) {
      const apiError = getApiError(error);
      let mappedToField = false;
      for (const field of ["email", "password"] as const) {
        const message = apiError.fields[field]?.[0];
        if (message) {
          setError(field, { message });
          mappedToField = true;
        }
      }
      if (!mappedToField) {
        const invalidCredentialsMessage = apiError.fields.non_field_errors?.[0];
        setFormError(invalidCredentialsMessage ?? getErrorMessage(error));
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3.5"
    >
      {formError && <Alert tone="error">{formError}</Alert>}

      <div>
        <Label
          htmlFor="email"
          className="text-text-label mb-1.5 text-[12.5px] font-semibold"
        >
          Work email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@numida.com"
          aria-invalid={!!errors.email}
          className="h-[38px] text-[13.5px]"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive mt-1 text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-text-label text-[12.5px] font-semibold"
          >
            Password
          </Label>
          <span className="text-primary text-xs font-semibold">Forgot?</span>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className="h-[38px] text-[13.5px]"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive mt-1 text-xs">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-10 w-full text-[13.5px]"
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
