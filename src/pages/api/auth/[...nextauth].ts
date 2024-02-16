import { api } from "@/services/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "email", type: "text", placeholder: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            const { email, password } = credentials as any;

            let res;
    
            try {
                res = await api.post('/login', { email, password });
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
                throw new Error( JSON.stringify({ errors: message ?? error, status: false }))
            }

            if(res.status === 200) {
                return res.data;
            } else return null;
        }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  }
}

export default NextAuth(authOptions)