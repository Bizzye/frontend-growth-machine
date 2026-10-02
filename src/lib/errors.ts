import { isAxiosError } from "axios";

export interface ErrorMessage {
  title: string;
  description: string;
}

/** Machine-readable error codes sent by the backend in the `code` field of error responses. */
export const API_ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
} as const;

/** Code NextAuth returns when `authorize` resolves to `null`. */
const NEXTAUTH_CREDENTIALS_SIGNIN = "CredentialsSignin";

const UNEXPECTED_ERROR: ErrorMessage = {
  title: "Unexpected error",
  description: "Something went wrong. Please try again.",
};

const INVALID_CREDENTIALS: ErrorMessage = {
  title: "Invalid credentials",
  description: "The e-mail or password you entered is incorrect.",
};

const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  [API_ERROR_CODES.INVALID_CREDENTIALS]: INVALID_CREDENTIALS,
  [NEXTAUTH_CREDENTIALS_SIGNIN]: INVALID_CREDENTIALS,
  [API_ERROR_CODES.USER_ALREADY_EXISTS]: {
    title: "User already registered",
    description: "This e-mail is already in use. Try signing in instead.",
  },
  [API_ERROR_CODES.VALIDATION_ERROR]: {
    title: "Invalid data",
    description: "Please review the highlighted fields and try again.",
  },
  [API_ERROR_CODES.UNAUTHORIZED]: {
    title: "Session expired",
    description: "Please sign in again to continue.",
  },
  [API_ERROR_CODES.TOO_MANY_REQUESTS]: {
    title: "Too many attempts",
    description: "Please wait a few minutes before trying again.",
  },
};

/** Domain error carrying a user-facing message, ready to be displayed in a toast. */
export class AppError extends Error {
  readonly title: string;
  readonly description: string;
  readonly code?: string;

  constructor({ title, description }: ErrorMessage, code?: string) {
    super(description);
    this.name = "AppError";
    this.title = title;
    this.description = description;
    this.code = code;
  }

  static fromCode(code?: string | null): AppError {
    const message = (code && ERROR_MESSAGES[code]) || UNEXPECTED_ERROR;
    return new AppError(message, code ?? undefined);
  }
}

/** Extracts the error code (`{ code }`) from an API error response. */
export function getApiErrorCode(error: unknown): string | undefined {
  if (isAxiosError<{ code?: unknown }>(error)) {
    const code = error.response?.data?.code;
    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  return AppError.fromCode(getApiErrorCode(error));
}
