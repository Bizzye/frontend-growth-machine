import { IUserRegister } from "@/interfaces/user.interface";
import { signIn as nxSignIn } from "next-auth/react";
import { api } from "./api";

export async function signIn(email: string, password: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await nxSignIn('credentials', {
                redirect: false,
                email: email,
                password: password,
            });

            if(!res?.ok) {
                const errMessage = res?.error ? JSON.parse(res?.error).errors : '';
                console.log(res)
                throw errMessage;
            }

            resolve(true);
        } catch (err: any) {
            const error = err ?? '';
        
            let title = 'Erro inesperado';
            let description = 'Ocorreu um erro inesperado, tente novamente';
        
            if(error == 'User not found') {
                title = 'Usuário não encontrado';
                description = 'Usuário não cadastrado, verifique se o e-mail está correto ou tente outro email';
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
        }
        // nxSignIn('credentials', {
        //     redirect: false,
        //     email: email,
        //     password: password,
        // }).then((res) => {
        //     resolve(true);
        // }).catch((err: any) => {
        //     const error = err?.response?.data?.message ?? '';
        //     console.log(error)
        
        //     let title = 'Erro inesperado';
        //     let description = 'Ocorreu um erro inesperado, tente novamente';
        
        //     if(error == 'User not found') {
        //         title = 'Usuário não encontrado';
        //         description = 'Usuário não cadastrado, verifique se o e-mail está correto ou tente outro email';
        //     }
        
        //     if(error == 'Email and password are required') {
        //         title = 'Campos obrigatórios';
        //         description = 'Preencha os campos de e-mail e senha';
        //     }
        
        //     if(error == 'Invalid password') {
        //         title = 'Senha inválida';
        //         description = 'Senha inválida, verifique se a senha está correta';
        //     }

        //     reject({ title, description, error: true });
        // });
    });
}

export async function signUp({ email, firstName, lastName, birthDate, password }: IUserRegister): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const obj = {
            email,
            password,
            birthDate,
            firstName,
            lastName
        };

        api.post('/users', obj).then(() => {
            resolve(true);
        }).catch((err: any) => {
            const error = err?.response?.data?.message ?? '';
        
            let title = 'Erro inesperado';
            let description = 'Ocorreu um erro inesperado, tente novamente';
        
            if(error == 'User already exists') {
                title = 'Usuário já cadastrado';
                description = 'Usuário já cadastrado, verifique se o e-mail está correto';
            }
        
            reject({ title, description, error: true });
        })
    });
}