import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.agendamento.count();
    console.log(`Agendamento count: ${count}`);
    if (count > 0) {
      const data = await prisma.agendamento.findMany({ take: 5 });
      console.log('Sample data:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
