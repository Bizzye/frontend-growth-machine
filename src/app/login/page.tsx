"use client"

import { LoginForm } from "@/components/login-form/login-form";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export default function LoginPage() {
    const { data: session } = useSession();

    if(session) {
        redirect('/home');
    }
    
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    )
}