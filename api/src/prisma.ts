import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const enum PrismaErrorCode {
  NotFound = 'P2025',
  NotUnique = 'P2002',
}

export { prisma, PrismaErrorCode };
