import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRaw`SELECT * FROM orc_pagamento ORDER BY pagamento ASC`;
  console.log('Payment Methods found in _node:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
