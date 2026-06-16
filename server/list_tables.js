
const mysql = require('mysql2/promise');

async function main() {
  const config = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306
  };

  const backDB = 'competid4c3793e0_back';
  const targetDB = 'competid4c3793e0_competidor1_1';

  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to server.');

    const [backTables] = await connection.query(`SHOW TABLES FROM \`${backDB}\``);
    console.log(`Tables in ${backDB}:`, backTables.map(t => Object.values(t)[0]));

    const [targetTables] = await connection.query(`SHOW TABLES FROM \`${targetDB}\``);
    console.log(`Tables in ${targetDB}:`, targetTables.map(t => Object.values(t)[0]));

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
