import { PrismaClient } from '@prisma/client';

const legacyPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://competid4c3793e0_loja:Eao%40031626@a16-asgard3.hospedagemuolhost.com.br:3306/competid4c3793e0_competidor1_1"
    }
  }
});

async function main() {
  try {
    const tables = ['agendamento', 'agendamento_hora', 'agendamento_ordem'];
    for (const table of tables) {
      console.log(`--- Structure of ${table} ---`);
      const structure = await legacyPrisma.$queryRawUnsafe(`DESCRIBE \`${table}\``);
      console.log(JSON.stringify(structure, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await legacyPrisma.$disconnect();
  }
}

main();
