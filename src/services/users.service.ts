import { toAppError } from "@/lib/errors";
import type { User } from "@/types/user";

import { bffClient } from "./http-client";

export const usersService = {
  async list(): Promise<User[]> {
    try {
      const { data } = await bffClient.get<User[]>("/users");
      return data;
    } catch (error) {
      throw toAppError(error);
    }
  },
};
