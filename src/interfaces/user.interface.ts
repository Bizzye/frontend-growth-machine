export interface IUser {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    createdAt: string;
    birthDate: string;
}

export type IUserRegister = Omit<IUser, 'createdAt' | 'id'> & { password: string };