import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3).max(20),
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

export const WsServerMessageSchema = z.object({
  type: z.enum(["joinRoom","leaveRoom","chat"]),
  roomId: z.string().optional(),
  chat: z.string().optional(),
})