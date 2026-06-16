import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('DESCRIBE competid4c3793e0_competidor1_1.pedidos');
  console.log('DESCRIBE LEGACY pedidos:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
