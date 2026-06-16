
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
    console.log('Conectado ao servidor.');

    const [desc] = await connection.query(`DESCRIBE \`${mainDB}\`.\`orc_funcionarios\``);
    console.log('Estrutura atual de orc_funcionarios:');
    console.table(desc);

    const [create] = await connection.query(`SHOW CREATE TABLE \`${mainDB}\`.\`orc_funcionarios\``);
    console.log('SQL de criação atual:');
    console.log(create[0]['Create Table']);

    await connection.end();
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
