
const mysql = require('mysql2/promise');

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
    await connection.query(`USE \`${mainDB}\``);

    console.log('Alterando tipo da coluna `acesso` para VARCHAR(50)...');
    await connection.query('ALTER TABLE `orc_funcionarios` MODIFY COLUMN `acesso` VARCHAR(50) NULL');

    console.log('Atualizando credenciais de Ellen...');
    const [result] = await connection.query(
        'UPDATE `orc_funcionarios` SET `login` = ?, `senha` = ?, `acesso` = ? WHERE `id_funcionario` = ?',
        ['ellen', 'Eao@031626', 'Administrador', 1]
    );

    if (result.affectedRows > 0) {
        console.log('✅ Credenciais atualizadas com sucesso para Ellen.');
    } else {
        console.log('⚠️ Nenhum registro atualizado. Verifique se o ID 1 corresponde a Ellen.');
    }

    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

main();
