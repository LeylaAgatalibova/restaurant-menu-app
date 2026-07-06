"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/services/auth.service";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthorized, isLoading } = useAdminAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  // If already logged in as the owner, skip straight to the dashboard.
  useEffect(() => {
    if (!isLoading && isAuthorized) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, isAuthorized, router]);

  async function onSubmit(data: LoginForm) {
    setServerError(null);
    try {
      await loginAdmin(data.email, data.password);
      router.replace("/admin/dashboard");
    } catch {
      setServerError("Incorrect email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-6"
      >
        <h1 className="text-lg font-semibold mb-1">Admin Login</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Restaurant owner access only.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-400"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-400"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-xs text-red-500">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
