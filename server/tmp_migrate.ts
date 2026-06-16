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
    console.log('Fetching orc_funcionarios from legacy...');
    const [rows]: any[] = await legacyConn.execute('SELECT * FROM orc_funcionarios');
    console.log(`Found ${rows.length} employees.`);

    // Check if table exists, create if not
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS orc_funcionarios (
        id_funcionario INT PRIMARY KEY,
        nome VARCHAR(100),
        status INT DEFAULT 1,
        contato VARCHAR(50),
        email VARCHAR(100)
      )
    `);

    for (const row of rows) {
      await prisma.$executeRawUnsafe(
        'INSERT INTO orc_funcionarios (id_funcionario, nome, status, contato, email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nome=?, status=?, contato=?, email=?',
        row.id_funcionario, row.nome, row.status, row.contato, row.email, row.nome, row.status, row.contato, row.email
      );
    }

    console.log('Migration via Prisma done!');
  } catch (err) {
    console.error(err);
  } finally {
    await legacyConn.end();
    await prisma.$disconnect();
  }
}

main();
