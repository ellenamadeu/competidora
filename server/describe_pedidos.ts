import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('DESCRIBE pedidos');
  console.log('DESCRIBE pedidos:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
