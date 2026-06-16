
const mysql = require('mysql2/promise');

async function main() {
  const config = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306
  };

  const backDB = 'competid4c3793e0_back';
  const mainDB = 'competid4c3793e0_competidor1_1';

  try {
    const connection = await mysql.createConnection(config);
    console.log('Conectado ao servidor.');

    const [backTables] = await connection.query(`SHOW TABLES FROM \`${backDB}\``);
    const backTableNames = backTables.map(t => Object.values(t)[0]);
    console.log(`Tabelas no Backup (${backDB}):`, backTableNames.length);

    const [mainTables] = await connection.query(`SHOW TABLES FROM \`${mainDB}\``);
    const mainTableNames = mainTables.map(t => Object.values(t)[0]);
    console.log(`Tabelas no Principal (${mainDB}):`, mainTableNames.length);

    const missingInMain = backTableNames.filter(t => !mainTableNames.includes(t));
    console.log('Tabelas que serão transferidas:', missingInMain.length);
    console.log(missingInMain);

    await connection.end();
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
