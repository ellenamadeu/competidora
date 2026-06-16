import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('SELECT DISTINCT entrega FROM pedidos');
  console.log('ENTREGA VALUES:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
