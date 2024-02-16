"use client"

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { z } from 'zod';

import { useToast } from "@/components/ui/use-toast";
import { signIn } from "@/services/auth";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z.string().email('Preencha um e-mail válido'),
  password: z.string()
    .regex(/[A-Z]/, 'Senha deve conter 1 letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter 1 letra minúscula')
    .regex(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/, 'Senha deve conter 1 caractere especial')
    .regex(/\d/, 'Senha deve conter 1 número')
    .min(8, 'Senha deve ter pelo menos 8 caracteres.')
});

type loginFormSchema = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();

  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<loginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  });

  async function login(data: loginFormSchema) {
    const { email, password } = data;

    signIn(email, password)
    .then(() => {
      router.push('/home');
    })
    .catch((err: any) => {
      const { title, description } = err;
      toast({
        title,
        description,
      });
    });
  }

  return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex items-center"
           onSubmit={handleSubmit(login)}>
            <div className="grid w-full items-center gap-4">
              <Input id="email" label="Email" type="text" {...register('email')} placeholder="Digite seu email..." />

              <Input id="password" label="Senha" type="password" {...register('password')}  placeholder="Digite seu senha..." />

              <div className="flex flex-col space-y-1.5 text-sm text-red-500">
                {
                  errors.email?.message && <Label htmlFor="error">{errors.email?.message}</Label>
                }
                {
                  errors.password?.message && !errors.email?.message && <Label htmlFor="error">{errors.password?.message}</Label>
                }
              </div>
              <Button type="submit">LOGIN</Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
            <Button variant='link'>
              <Link href="/register">Registre-se</Link>
            </Button>
          </CardFooter>
      </Card>
  )
}