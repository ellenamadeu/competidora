import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const orderId = 50656;
  console.log(`Checking order ${orderId} in legacy database (competid4c3793e0_competidor1_1)...`);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  try {
    const [pedido] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ?', [orderId]);
    console.log('LEGACY PEDIDO:', JSON.stringify(pedido, null, 2));

    const [itens] = await connection.query('SELECT * FROM itens WHERE id_pedido = ?', [orderId]);
    console.log(`LEGACY ITENS (count: ${itens.length}):`, JSON.stringify(itens, null, 2));

    const [pagamentos] = await connection.query('SELECT * FROM caixa_entrada WHERE id_pedido = ?', [orderId]);
    console.log(`LEGACY PAGAMENTOS (count: ${pagamentos.length}):`, JSON.stringify(pagamentos, null, 2));

    const [agendamentos] = await connection.query('SELECT * FROM agendamento WHERE id_pedido = ?', [orderId]);
    console.log(`LEGACY AGENDAMENTOS (count: ${agendamentos.length}):`, JSON.stringify(agendamentos, null, 2));

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await connection.end();
  }
}

main();
