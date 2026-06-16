
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

    // Listar tabelas nos dois bancos
    const [backTables] = await connection.query(`SHOW TABLES FROM \`${backDB}\``);
    const backTableNames = backTables.map(t => Object.values(t)[0]);

    const [mainTables] = await connection.query(`SHOW TABLES FROM \`${mainDB}\``);
    const mainTableNames = mainTables.map(t => Object.values(t)[0]);

    const missingInMain = backTableNames.filter(t => !mainTableNames.includes(t));
    
    if (missingInMain.length === 0) {
        console.log('Nenhuma tabela nova para transferir.');
        await connection.end();
        return;
    }

    console.log(`Iniciando transferência de ${missingInMain.length} tabelas...`);

    for (const tableName of missingInMain) {
        try {
            console.log(`Transferindo tabela: ${tableName}...`);
            
            // Criar estrutura da tabela no banco principal igual ao backup
            await connection.query(`CREATE TABLE \`${mainDB}\`.\`${tableName}\` LIKE \`${backDB}\`.\`${tableName}\``);
            
            // Copiar dados
            await connection.query(`INSERT INTO \`${mainDB}\`.\`${tableName}\` SELECT * FROM \`${backDB}\`.\`${tableName}\``);
            
            console.log(`✅ Tabela ${tableName} transferida com sucesso.`);
        } catch (err) {
            console.error(`❌ Erro ao transferir ${tableName}:`, err.message);
        }
    }

    console.log('Transferência concluída.');
    await connection.end();
  } catch (error) {
    console.error('Erro de conexão:', error);
  }
}

main();
