import { IUser } from "@/interfaces/user.interface";
import { signIn as nxSignIn } from "next-auth/react";

interface IError {
    title: string;
    description: string;
    err: true;
}

type IUserAtualizada = Omit<IUser, 'createdAt' | 'id'> & { password: string };

export async function signIn(email: string, password: string): Promise<boolean | IError> {
    return new Promise((resolve, reject) => {
        nxSignIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        }).then((res) => {
            resolve(true);
        }).catch((err: any) => {
            const error = JSON.parse(err?.error as any)?.errors;
        
            let title = 'Erro inesperado';
            let description = 'Ocorreu um erro inesperado, tente novamente';
        
            if(error == 'User not found') {
                title = 'Usuário não encontrado';
                description = 'Usuário não cadastrado, verifique se o e-mail está correto';
            }
        
            if(error == 'Email and password are required') {
                title = 'Campos obrigatórios';
                description = 'Preencha os campos de e-mail e senha';
            }
        
            if(error == 'Invalid password') {
                title = 'Senha inválida';
                description = 'Senha inválida, verifique se a senha está correta';
            }

            reject({ title, description, error: true });
        });
    });
}

export async function register({ email, password, birthDate, firstName, lastName }: IUserAtualizada): Promise<boolean | IError> {
    return new Promise((resolve, reject) => {
        
    });
}