import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const enum PrismaErrorCodes {
  NotFound = 'P2025',
}

export { prisma, PrismaErrorCodes };
