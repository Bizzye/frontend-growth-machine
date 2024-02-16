"use client"

import { RegisterForm } from "@/components/register-form/register-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function RegisterPage() {
    const { data: session } = useSession();

    if(session) {
        redirect('/home');
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <RegisterForm />
        </div>
    )
}