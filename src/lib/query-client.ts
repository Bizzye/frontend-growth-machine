import { QueryCache, QueryClient } from "@tanstack/react-query";

import { API_ERROR_CODES, AppError } from "@/lib/errors";
import { authService } from "@/services/auth.service";

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof AppError && error.code === API_ERROR_CODES.UNAUTHORIZED;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      // The API token expired or was revoked: end the session instead of leaving the user stuck.
      onError: (error) => {
        if (isUnauthorizedError(error)) void authService.logout();
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // Retrying cannot fix an authentication error.
        retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
