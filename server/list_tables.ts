import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('SHOW TABLES');
  console.log('TABLES:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
