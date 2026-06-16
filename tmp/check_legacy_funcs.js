const mysql = require('mysql2/promise');

async function main() {
  const legacyConn = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  try {
    const [tables] = await legacyConn.execute('SHOW TABLES LIKE "orc_%"');
    console.log('Legacy Tables starting with orc_:', JSON.stringify(tables, null, 2));
    
    const [structure] = await legacyConn.execute('DESCRIBE orc_funcionarios');
    console.log('Structure of orc_funcionarios:', JSON.stringify(structure, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await legacyConn.end();
  }
}

main();
