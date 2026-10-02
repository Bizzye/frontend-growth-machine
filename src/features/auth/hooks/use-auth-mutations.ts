"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { toAppError } from "@/lib/errors";
import { toIsoDate } from "@/lib/format";
import { authService } from "@/services/auth.service";

import type { LoginFormValues, RegisterFormValues } from "../schemas";

const AFTER_LOGIN_ROUTE = "/home";

function useErrorToast() {
  const { toast } = useToast();

  return (error: unknown) => {
    const { title, description } = toAppError(error);
    toast({ title, description, variant: "destructive" });
  };
}

export function useLogin() {
  const router = useRouter();
  const showError = useErrorToast();

  return useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: () => {
      router.replace(AFTER_LOGIN_ROUTE);
      router.refresh();
    },
    onError: showError,
  });
}

export function useRegister() {
  const router = useRouter();
  const showError = useErrorToast();

  return useMutation({
    mutationFn: async ({ birthDate, ...values }: RegisterFormValues) => {
      await authService.register({ ...values, birthDate: toIsoDate(birthDate) });
      await authService.login({ email: values.email, password: values.password });
    },
    onSuccess: () => {
      router.replace(AFTER_LOGIN_ROUTE);
      router.refresh();
    },
    onError: showError,
  });
}
