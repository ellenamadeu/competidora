const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_node',
    port: 3306
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM agendamento LIMIT 5');
    console.log('Sample data:', JSON.stringify(rows, null, 2));
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables in node DB:', JSON.stringify(tables, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

main();
