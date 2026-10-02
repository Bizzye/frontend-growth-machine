"use client";

import { AlertCircle, Loader2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUsers } from "../hooks/use-users";
import { UsersTable } from "./users-table";

/** Handles the loading / error / empty states around the users table. */
export function UsersList() {
  const { data: users, isPending, isError, error, refetch, isRefetching } = useUsers();

  if (isPending) {
    return (
      <div role="status" className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertCircle className="size-8 text-destructive" aria-hidden />
        <div>
          <p className="font-medium">Could not load users</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
          Try again
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Users className="size-8" aria-hidden />
        No users registered yet.
      </div>
    );
  }

  return <UsersTable users={users} />;
}
