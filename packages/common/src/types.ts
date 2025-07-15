import * as z from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(50),
});