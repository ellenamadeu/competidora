import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('--- Alterando colunas prazo e parcelamento ---');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE pedidos 
    MODIFY COLUMN prazo VARCHAR(100),
    MODIFY COLUMN parcelamento VARCHAR(100)
  `);
  console.log('--- Finalizado ---');
}
main().finally(() => prisma.$disconnect());
