import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.$queryRawUnsafe('SELECT prazo, parcelamento FROM pedidos WHERE prazo IS NOT NULL OR parcelamento IS NOT NULL LIMIT 10');
  console.log('PEDIDO FIELDS:', JSON.stringify(rows, null, 2));
}
main().finally(() => prisma.$disconnect());
