"use client"

import { Header } from "@/components/header/header";
import { UserTable } from "@/components/table/user-table";
import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if(session) {
    console.log('session', session);
  }

  const { data: users,  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });
  
  return (
    <main className="min-h-screen max-h-screen">
      <Header />
      <div className="flex flex-col items-center p-24">
        <h1 className="text-2xl font-bold mb-8">Usuários</h1>
        { 
          users && <UserTable dados={users}/>
        }
      </div>
    </main>
  );
}
