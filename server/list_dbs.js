
const mysql = require('mysql2/promise');

async function main() {
  const config = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to server.');

    const [dbs] = await connection.query('SHOW DATABASES');
    console.log('Databases:', dbs.map(db => db.Database));

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
