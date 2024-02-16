import { UserTableRowProps } from "@/interfaces/table.interface";
import { api } from "./api";

export function getUsers(): Promise<UserTableRowProps[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const res = (await api.get('/users')).data;
            resolve(res);
        } catch (err: any) {
            // const error = JSON.parse(err?.error as any)?.errors;
        
            let title = 'Erro inesperado';
            let description = 'Ocorreu um erro inesperado, tente novamente';
        
            reject({ title, description, error: true });
        }
    });
} 