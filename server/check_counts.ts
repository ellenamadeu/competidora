import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const phpConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  const nodeConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    database: 'competid4c3793e0_node',
    port: 3306
  });

  try {
    const [[{ count: phpItens }]] = await phpConnection.query('SELECT COUNT(*) as count FROM itens') as any;
    const [[{ count: nodeItens }]] = await nodeConnection.query('SELECT COUNT(*) as count FROM itens') as any;
    console.log(`ITENS: Legacy PHP = ${phpItens} | New Node = ${nodeItens}`);

    const [[{ count: phpPayments }]] = await phpConnection.query('SELECT COUNT(*) as count FROM caixa_entrada') as any;
    const [[{ count: nodePayments }]] = await nodeConnection.query('SELECT COUNT(*) as count FROM caixa_entrada') as any;
    console.log(`PAYMENTS: Legacy PHP = ${phpPayments} | New Node = ${nodePayments}`);

    const [[{ count: phpAgendamentos }]] = await phpConnection.query('SELECT COUNT(*) as count FROM agendamento') as any;
    const [[{ count: nodeAgendamentos }]] = await nodeConnection.query('SELECT COUNT(*) as count FROM agendamento') as any;
    console.log(`AGENDAMENTOS: Legacy PHP = ${phpAgendamentos} | New Node = ${nodeAgendamentos}`);

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await phpConnection.end();
    await nodeConnection.end();
  }
}

main();
