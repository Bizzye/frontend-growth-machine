import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersList } from "@/features/users/components/users-list";

export const metadata: Metadata = { title: "Users" };

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Everyone who has signed up to the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersList />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
