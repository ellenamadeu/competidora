import { PrismaClient } from '@prisma/client';
const mysql = require('mysql2/promise');

const prisma = new PrismaClient();

async function main() {
  const legacyConn = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  try {
    const tablesToMigrate = ['orc_pagamento', 'agendamento_hora', 'agendamento_ordem'];
    
    for (const tableName of tablesToMigrate) {
      console.log(`Migrating ${tableName}...`);
      const [rows]: any[] = await legacyConn.execute(`SELECT * FROM ${tableName}`);
      console.log(`Found ${rows.length} rows in ${tableName}.`);

      if (tableName === 'orc_pagamento') {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS orc_pagamento (
            id_pagamento INT PRIMARY KEY,
            pagamento VARCHAR(100),
            status INT DEFAULT 1
          )
        `);
        for (const row of rows) {
          await prisma.$executeRawUnsafe(
            'INSERT INTO orc_pagamento (id_pagamento, pagamento, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE pagamento=?, status=?',
            row.id_pagamento, row.pagamento, row.status, row.pagamento, row.status
          );
        }
      } else if (tableName === 'agendamento_hora') {
        // Table created by Prisma, just populate
        for (const row of rows) {
          await prisma.$executeRawUnsafe(
            'INSERT INTO agendamento_hora (id_agendamento_hora, hora_agendamento) VALUES (?, ?) ON DUPLICATE KEY UPDATE hora_agendamento=?',
            row.id_agendamento_hora, row.hora_agendamento, row.hora_agendamento
          );
        }
      } else if (tableName === 'agendamento_ordem') {
        // Table created by Prisma, just populate
        for (const row of rows) {
          await prisma.$executeRawUnsafe(
            'INSERT INTO agendamento_ordem (id_agendamento_ordem, ordem) VALUES (?, ?) ON DUPLICATE KEY UPDATE ordem=?',
            row.id_agendamento_ordem, row.ordem, row.ordem
          );
        }
      }
    }

    console.log('Migration of lookup tables done!');
  } catch (err) {
    console.error(err);
  } finally {
    await legacyConn.end();
    await prisma.$disconnect();
  }
}

main();
