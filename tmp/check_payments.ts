import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const res = await prisma.$queryRaw`SELECT * FROM orc_pagamento`;
  console.log(JSON.stringify(res, null, 2));
}
main().finally(() => prisma.$disconnect());
