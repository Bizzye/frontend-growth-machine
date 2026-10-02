"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRegister } from "../hooks/use-auth-mutations";
import { type RegisterFormValues, registerSchema } from "../schemas";

export function RegisterForm() {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", birthDate: "", email: "", password: "" },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Fill in your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit((values) => registerUser(values))} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First name"
              autoComplete="given-name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              id="lastName"
              label="Last name"
              autoComplete="family-name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <Input
            id="birthDate"
            label="Birth date"
            type="date"
            autoComplete="bday"
            error={errors.birthDate?.message}
            {...register("birthDate")}
          />
          <Input
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?
        <Button variant="link" asChild className="px-1">
          <Link href="/login">Sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
