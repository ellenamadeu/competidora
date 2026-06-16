
const mysql = require('mysql2/promise');

async function main() {
  const config = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306
  };
  const mainDB = 'competid4c3793e0_competidor1_1';

  try {
    const connection = await mysql.createConnection(config);
    await connection.query(`USE \`${mainDB}\``);

    const [rows] = await connection.query('SELECT * FROM orc_funcionarios WHERE nome LIKE "%Ellen%"');
    console.log('Registros encontrados para Ellen:');
    console.log(rows);

    const [types] = await connection.query('DESCRIBE orc_funcionarios acesso');
    console.log('Tipo atual do campo acesso:');
    console.log(types);

    await connection.end();
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
