const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  try {
    const tables = ['agendamento', 'agendamento_hora', 'agendamento_ordem'];
    for (const table of tables) {
      console.log(`--- Structure of ${table} ---`);
      const [rows] = await connection.execute(`DESCRIBE \`${table}\``);
      console.log(JSON.stringify(rows, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

main();
