"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

import { createQueryClient } from "@/lib/query-client";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  // One client per browser session; avoids sharing cache between requests on the server.
  const [queryClient] = useState(createQueryClient);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
