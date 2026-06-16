import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- DATABASE DIAGNOSIS ---');
    const tables: any[] = await prisma.$queryRawUnsafe('SHOW TABLES');
    console.log('Tables:', JSON.stringify(tables, null, 2));

    const checkTable = async (name: string) => {
      try {
        const cols: any[] = await prisma.$queryRawUnsafe(`SHOW COLUMNS FROM ${name}`);
        console.log(`Columns for ${name}:`, JSON.stringify(cols.map(c => c.Field), null, 2));
      } catch (e: any) {
        console.log(`Table ${name} ERROR: ${e.message}`);
      }
    };

    await checkTable('agendamento');
    await checkTable('agendamento_hora');
    await checkTable('agendamento_ordem');
    await checkTable('orc_funcionarios');
    await checkTable('orc_pagamento');

  } catch (err: any) {
    console.error('Diagnosis ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
