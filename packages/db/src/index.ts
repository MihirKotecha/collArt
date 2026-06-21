import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";

const dbAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const dbClient = new PrismaClient({ adapter: dbAdapter });
export { Prisma };