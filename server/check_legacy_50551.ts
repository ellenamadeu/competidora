import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const orderId = 50551;
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  try {
    const [itens] = await connection.query('SELECT * FROM itens WHERE id_pedido = ?', [orderId]);
    console.log(`LEGACY ITENS for 50551 (count: ${itens.length}):`, JSON.stringify(itens, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await connection.end();
  }
}

main();
