import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const dbClient = new PrismaClient();
export { Prisma };