
const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  const config = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306,
    multipleStatements: true
  };
  const mainDB = 'competid4c3793e0_competidor1_1';

  try {
    const connection = await mysql.createConnection(config);
    console.log('Conectado ao servidor.');
    
    await connection.query(`USE \`${mainDB}\``);

    const sql = fs.readFileSync('restore_structure.sql', 'utf8');
    
    console.log('Executando restauração de estrutura...');
    await connection.query(sql);
    
    console.log('Estrutura restaurada com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

main();
