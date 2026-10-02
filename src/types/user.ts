export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type RegisterUserPayload = Omit<User, "id" | "createdAt"> & {
  password: string;
};

/** Payload returned by the backend `POST /auth/login` endpoint. */
export interface LoginResponse {
  token: string;
  user: Pick<User, "id" | "email" | "firstName" | "lastName">;
}
