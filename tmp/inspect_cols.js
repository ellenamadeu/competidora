const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  try {
    const [cols1] = await conn.execute('SHOW COLUMNS FROM agendamento_hora');
    console.log('agendamento_hora columns:', JSON.stringify(cols1, null, 2));
    
    const [cols2] = await conn.execute('SHOW COLUMNS FROM agendamento_ordens');
    console.log('agendamento_ordens columns:', JSON.stringify(cols2, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await conn.end();
  }
}

main();
