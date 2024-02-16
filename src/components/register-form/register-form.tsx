"use client"

import Link from 'next/link';

import { api } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useToast } from '../ui/use-toast';

const registerFormSchema = z.object({
  email: z.string().email('Preencha um e-mail válido'),
  firstName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
  lastName: z.string().min(3, 'Sobrenome deve ter pelo menos 3 caracteres.'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida').optional(),
  password: z.string()
    .regex(/[A-Z]/, 'Senha deve conter 1 letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter 1 letra minúscula')
    .regex(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/, 'Senha deve conter 1 caractere especial')
    .regex(/\d/, 'Senha deve conter 1 número')
    .min(8, 'Senha deve ter pelo menos 8 caracteres.')
});

type registerFormSchema = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<registerFormSchema>({
    resolver: zodResolver(registerFormSchema)
  });

  async function registerUser(dados: registerFormSchema) {
    const { email, firstName, lastName, birthDate, password } = dados;
    const obj = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate ? new Date(birthDate!) : null,
      password: password
    }

    let res: any;

    try {
      res = await api.post('/users', obj);

      await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

    } catch (error: any) {
      let message = 'Erro inesperado';
      if (error.response) {
        const { data } = error.response;
        message = data.message;
      } else if (error.request) {
        message = error.request;
      } else {
        message = 'Error ' + error.message;
        message = 'Config ' + error.config;
      }

      
      let title = 'Erro inesperado';
      let description = 'Ocorreu um erro inesperado, tente novamente';
        
      if(message == 'User already exists') {
        title = 'Usuário já cadastrado';
        description = 'Usuário já cadastrado, verifique se o e-mail está correto';
      }

      toast({
        title,
        description,
      });
    }
  }

  return (
      <Card className="w-[350px]">
        <CardHeader className='text-center'>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>Realize o cadastro no nosso incrível site!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(registerUser)}>
            <div className="grid w-full items-center gap-4">

              <Input id="name" label="Nome" type="text" error={errors.firstName?.message} {...register('firstName')} placeholder="Digite seu nome..." />
              <Input id="lastName" label="Sobrenome" type="text" error={errors.lastName?.message} {...register('lastName')} placeholder="Digite seu sobrenome..." />
              <Input id="birthDate" label="Data de nascimento" error={errors.birthDate?.message} type="date" {...register('birthDate')} />
              <Input id="email" label="Email" type="text" error={errors.email?.message} {...register('email')} placeholder="Digite seu email..." />
              <Input id="password" label="Senha" type="password" error={errors.password?.message} {...register('password')} placeholder="Digite seu senha..." />

              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant='link'>
              <Link href="/login">Já tenho conta</Link>
          </Button>
        </CardFooter>
      </Card>
  )
}