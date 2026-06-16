import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('SELECT * FROM orc_entrega');
  console.log('ORC_ENTREGA ROWS:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
