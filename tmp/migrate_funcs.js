const mysql = require('mysql2/promise');

async function migrate() {
  const legacyConn = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  const nodeConn = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_node',
    port: 3306
  });

  try {
    console.log('Fetching orc_funcionarios structure and data...');
    const [rows] = await legacyConn.execute('SELECT * FROM orc_funcionarios');
    console.log(`Found ${rows.length} employees.`);

    // Create table if not exists (Simplified structure based on typical orc_funcionarios)
    await nodeConn.execute(`
      CREATE TABLE IF NOT EXISTS orc_funcionarios (
        id_funcionario INT PRIMARY KEY,
        nome VARCHAR(100),
        status INT DEFAULT 1,
        contato VARCHAR(50),
        email VARCHAR(100)
      )
    `);

    // Insert data
    for (const row of rows) {
      await nodeConn.execute(
        'INSERT INTO orc_funcionarios (id_funcionario, nome, status, contato, email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nome=?, status=?, contato=?, email=?',
        [row.id_funcionario, row.nome, row.status, row.contato, row.email, row.nome, row.status, row.contato, row.email]
      );
    }
    console.log('Migration completed successfully!');

  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await legacyConn.end();
    await nodeConn.end();
  }
}

migrate();
