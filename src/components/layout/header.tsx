"use client";

import { LogOut, UsersRound } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-bold">
          <UsersRound className="size-6 text-primary" aria-hidden />
          Userz Growth
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.name && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Hi, <span className="font-medium text-foreground">{session.user.name}</span>
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => authService.logout()}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
