import { UsersRound } from "lucide-react";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <UsersRound className="size-8 text-primary" aria-hidden />
        Userz Growth
      </div>
      {children}
    </main>
  );
}
