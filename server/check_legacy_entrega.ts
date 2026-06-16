import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('SELECT * FROM competid4c3793e0_competidor1_1.orc_entrega');
  console.log('LEGACY ORC_ENTREGA ROWS:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
