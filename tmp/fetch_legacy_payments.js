const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1'
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM orc_pagamento');
    console.log('PAYMENT_METHODS:', JSON.stringify(rows));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await connection.end();
  }
}

main();
