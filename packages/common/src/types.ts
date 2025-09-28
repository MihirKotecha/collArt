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
  type: z.enum(["joinRoom", "leaveRoom", "chat"]),
  roomId: z.string().optional(),
  chat: z.string().optional(),
});

export const RectSchema = z.object({
  type: z.literal("rect"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const EllipseSchema = z.object({
  type: z.literal("ellipse"),
  x: z.number(), // center x
  y: z.number(), // center y
  radiusX: z.number(),
  radiusY: z.number(),
  rotation: z.number(), // in radians
  startAngle: z.number(), // in radians
  endAngle: z.number(), // in radians
});

export const LineSchema = z.object({
  type: z.literal("line"),
  x: z.number(),
  y: z.number(),
  endX: z.number(),
  endY: z.number(),
});

export type RectSchemaType = z.infer<typeof RectSchema>;
export type EllipseSchemaType = z.infer<typeof EllipseSchema>;
export type LineSchemaType = z.infer<typeof LineSchema>;