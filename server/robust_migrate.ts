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
    // 1. orc_pagamento
    console.log('Migrating orc_pagamento...');
    const [pagamentos]: any[] = await legacyConn.execute('SELECT * FROM orc_pagamento');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS orc_pagamento (
        id_pagamento INT PRIMARY KEY,
        pagamento VARCHAR(100),
        status INT DEFAULT 1
      )
    `);
    for (const p of pagamentos) {
      await prisma.$executeRawUnsafe(
        'INSERT INTO orc_pagamento (id_pagamento, pagamento, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE pagamento=?, status=?',
        p.id_pagamento, p.pagamento, p.status, p.pagamento, p.status
      );
    }

    // 2. agendamento_hora
    console.log('Migrating agendamento_hora...');
    const [horas]: any[] = await legacyConn.execute('SELECT * FROM agendamento_hora');
    for (const h of horas) {
      const idVal = h.id_agendamento_hora || h.id_aghora || h.id;
      const horaVal = h.agendamento_hora || h.hora;
      await prisma.$executeRawUnsafe(
        'INSERT INTO agendamento_hora (id_aghora, hora) VALUES (?, ?) ON DUPLICATE KEY UPDATE hora=?',
        idVal, horaVal, horaVal
      );
    }

    // 3. agendamento_ordem
    console.log('Migrating agendamento_ordem...');
    let ordens: any[] = [];
    try {
      const [res] = await legacyConn.execute('SELECT * FROM agendamento_ordens');
      ordens = res as any[];
    } catch {
      const [res] = await legacyConn.execute('SELECT * FROM agendamento_ordem');
      ordens = res as any[];
    }
    
    for (const o of ordens) {
      const idVal = o.id_agendamento_ordem || o.id_ordem || o.id;
      const ordemVal = o.ordem;
      await prisma.$executeRawUnsafe(
        'INSERT INTO agendamento_ordem (id_ordem, ordem) VALUES (?, ?) ON DUPLICATE KEY UPDATE ordem=?',
        idVal, ordemVal, ordemVal
      );
    }

    console.log('ALL LOOKUP MIGRATIONS DONE!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await legacyConn.end();
    await prisma.$disconnect();
  }
}

main();
