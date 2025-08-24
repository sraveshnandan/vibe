import { PrismaClient } from "@prisma/client";

const GlobalPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = GlobalPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") GlobalPrisma.prisma = prisma;

export { prisma };
