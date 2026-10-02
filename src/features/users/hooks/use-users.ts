"use client";

import { useQuery } from "@tanstack/react-query";

import { usersService } from "@/services/users.service";

export const usersQueryKeys = {
  all: ["users"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKeys.all,
    queryFn: usersService.list,
  });
}
