
const mysql = require('mysql2/promise');

async function main() {
  const config = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306
  };

  const oldDB = 'competid4c3793e0_competidor1_1';
  const newDB = 'competid4c3793e0_node';

  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to server.');

    // List tables in old DB
    const [tables] = await connection.query(`SHOW TABLES FROM \`${oldDB}\``);
    console.log(`Tables in ${oldDB}:`, tables.map(t => Object.values(t)[0]));

    // Check if new DB is accessible
    try {
        await connection.query(`USE \`${newDB}\``);
        console.log(`Switched to ${newDB}.`);
    } catch (e) {
        console.error(`Error accessing ${newDB}:`, e.message);
        return;
    }

    for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0];
        console.log(`Copying table ${tableName}...`);
        
        // Drop table if exists in new DB
        await connection.query(`DROP TABLE IF EXISTS \`${newDB}\`.\`${tableName}\``);
        
        // Create table structure
        await connection.query(`CREATE TABLE \`${newDB}\`.\`${tableName}\` LIKE \`${oldDB}\`.\`${tableName}\``);
        
        // Copy data
        await connection.query(`INSERT INTO \`${newDB}\`.\`${tableName}\` SELECT * FROM \`${oldDB}\`.\`${tableName}\``);
        
        console.log(`Table ${tableName} copied successfully.`);
    }

    await connection.end();
    console.log('All tables copied.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
