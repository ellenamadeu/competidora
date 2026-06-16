import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'competid4c3793e0_node',
    port: 3306
  });

  let output = `Connected to NODE DB: competid4c3793e0_node\n\n`;
  const databases = await connection.query('SHOW DATABASES');
  const [pedidosCount]: any = await connection.query('SELECT COUNT(*) as count FROM pedidos');
  const [itensCount]: any = await connection.query('SELECT COUNT(*) as count FROM itens');
  const [clientesCount]: any = await connection.query('SELECT COUNT(*) as count FROM clientes');
  
  output += `Pedidos: ${pedidosCount[0].count}\n`;
  output += `Itens: ${itensCount[0].count}\n`;
  const [clientesCols]: any = await connection.query('DESCRIBE clientes');
  output += `Colunas Clientes: ${clientesCols.map((c: any) => c.Field).join(', ')}\n\n`;

  const [tables] = await connection.query('SHOW TABLES');
  const tableNames = (tables as any[]).map(row => Object.values(row)[0]);

  for (const tableName of tableNames) {
    output += `--- TABLE: ${tableName} ---\n`;
    const [columns] = await connection.query(`DESCRIBE ${tableName}`);
    (columns as any[]).forEach(col => {
        output += `COL: ${col.Field} | ${col.Type}\n`;
    });
    output += '\n';
  }

  fs.writeFileSync(path.join(__dirname, '../php_schema.txt'), output, 'utf8');
  console.log('Schema written to server/php_schema.txt');

  await connection.end();
}

main().catch(console.error);
