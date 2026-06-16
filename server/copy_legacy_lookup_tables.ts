import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load server .env
dotenv.config({ path: path.join(__dirname, './.env') });

const tableSchemas: Record<string, string> = {
  item_categoria: `
    CREATE TABLE IF NOT EXISTS \`item_categoria\` (
      \`id_categoria\` int NOT NULL AUTO_INCREMENT,
      \`categoria\` varchar(20) NOT NULL,
      PRIMARY KEY (\`id_categoria\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  item_produto: `
    CREATE TABLE IF NOT EXISTS \`item_produto\` (
      \`id_produto\` int NOT NULL AUTO_INCREMENT,
      \`id_categoria\` int NOT NULL,
      \`produto\` varchar(100) NOT NULL,
      PRIMARY KEY (\`id_produto\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  item_descricao: `
    CREATE TABLE IF NOT EXISTS \`item_descricao\` (
      \`id_descricao\` int NOT NULL AUTO_INCREMENT,
      \`id_categoria\` int NOT NULL,
      \`descricao\` varchar(50) NOT NULL,
      PRIMARY KEY (\`id_descricao\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  item_espessura: `
    CREATE TABLE IF NOT EXISTS \`item_espessura\` (
      \`id_espessura\` int NOT NULL AUTO_INCREMENT,
      \`espessura\` varchar(10) NOT NULL,
      PRIMARY KEY (\`id_espessura\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  item_acabamento: `
    CREATE TABLE IF NOT EXISTS \`item_acabamento\` (
      \`id_acabamento\` int NOT NULL AUTO_INCREMENT,
      \`id_categoria\` int NOT NULL,
      \`acabamento\` varchar(50) NOT NULL,
      PRIMARY KEY (\`id_acabamento\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL not defined in server/.env');
    process.exit(1);
  }

  // Parse destination DATABASE_URL
  let destConfig: mysql.ConnectionConfig;
  try {
    const dbUrl = new URL(databaseUrl);
    destConfig = {
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      port: Number(dbUrl.port) || 3306,
      database: dbUrl.pathname.replace('/', '')
    };
  } catch (err: any) {
    console.error('❌ Error parsing DATABASE_URL:', err.message);
    process.exit(1);
  }

  // Source configuration (Legacy UOL Database)
  const srcConfig: mysql.ConnectionConfig = {
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    port: 3306,
    database: 'competid4c3793e0_competidor1_1'
  };

  console.log(`🔌 Connecting to source legacy database...`);
  const srcConn = await mysql.createConnection(srcConfig);

  console.log(`🔌 Connecting to destination database (${destConfig.host}/${destConfig.database})...`);
  const destConn = await mysql.createConnection(destConfig);

  try {
    for (const [table, schema] of Object.entries(tableSchemas)) {
      console.log(`\n📦 Processing table: ${table}...`);
      
      // 1. Read from source FIRST (before running create/truncate)
      console.log(`  - Reading records from source database...`);
      const [rows]: any = await srcConn.query(`SELECT * FROM \`${table}\``);
      console.log(`  - Found ${rows.length} records to copy.`);

      // 2. Create table schema if not exists
      console.log(`  - Recreating table structure on destination...`);
      await destConn.query(schema);

      // 3. Clear destination table
      console.log(`  - Cleaning old records on destination...`);
      await destConn.query(`TRUNCATE TABLE \`${table}\``);

      if (rows.length > 0) {
        // 4. Insert into destination
        const keys = Object.keys(rows[0]);
        const placeholders = keys.map(() => '?').join(', ');
        const insertSql = `INSERT INTO \`${table}\` (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;

        console.log(`  - Inserting ${rows.length} records into destination...`);
        for (const row of rows) {
          const values = keys.map(k => row[k]);
          await destConn.query(insertSql, values);
        }
        console.log(`  - ✅ Table ${table} copied successfully.`);
      } else {
        console.log(`  - ℹ️ Table ${table} was empty on source.`);
      }
    }

    console.log('\n🎉 All legacy lookup tables copied successfully to destination!');
  } catch (err: any) {
    console.error('\n❌ Error during copy process:', err.message);
  } finally {
    await srcConn.end();
    await destConn.end();
  }
}

main();
