import { Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import type { LoginInput, SignupInput } from "./auth.validation.js";

const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  createdAt: true
} satisfies Prisma.UserSelect;

export const authService = {
  async signup(input: SignupInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    const passwordHash = await hashPassword(input.password);

    return prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash
      },
      select: publicUserSelect
    });
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new ApiError(401, "Invalid email or password");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
  }
};
