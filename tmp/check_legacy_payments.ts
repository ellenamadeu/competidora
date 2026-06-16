import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT * FROM competid4c3793e0_competidor1_1.orc_pagamento`;
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('Error querying legacy table:', e);
  }
}
main().finally(() => prisma.$disconnect());
