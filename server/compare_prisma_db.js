
const mysql = require('mysql2/promise');
const fs = require('fs');

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

    const prismaContent = fs.readFileSync('full_schema.prisma', 'utf8');
    
    // Simplistic parser for Prisma models to extract fields
    const models = {};
    let currentModel = null;
    
    prismaContent.split('\n').forEach(line => {
        const modelMatch = line.match(/model\s+(\w+)\s+\{/);
        if (modelMatch) {
            currentModel = modelMatch[1];
            models[currentModel] = { map: currentModel, fields: [] };
        } else if (line.includes('@@map("')) {
            const mapMatch = line.match(/@@map\("(\w+)"\)/);
            if (mapMatch) models[currentModel].map = mapMatch[1];
        } else if (currentModel && line.trim() && !line.trim().startsWith('@@') && !line.trim().startsWith('}')) {
            const parts = line.trim().split(/\s+/);
            const fieldName = parts[0];
            models[currentModel].fields.push(fieldName);
        }
        if (line.includes('}')) currentModel = null;
    });

    for (const modelName in models) {
        const tableName = models[modelName].map;
        try {
            const [columns] = await connection.query(`SHOW COLUMNS FROM \`${mainDB}\`.\`${tableName}\``);
            const dbColumnNames = columns.map(c => c.Field);
            
            const missingColumns = models[modelName].fields.filter(f => !dbColumnNames.includes(f));
            
            if (missingColumns.length > 0) {
                console.log(`Tabela \`${tableName}\` está sem os campos:`, missingColumns);
            }
        } catch (err) {
            console.log(`Tabela \`${tableName}\` não encontrada no banco (Prisma model: ${modelName}).`);
        }
    }

    await connection.end();
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
