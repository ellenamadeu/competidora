
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1'
  });

  console.log("--- Investigando Funcionário ID 10 ---");
  const [user10] = await connection.execute('SELECT id_funcionario, login, acesso, nome FROM orc_funcionarios WHERE id_funcionario = 10');
  console.log("Dados do ID 10:", user10);

  console.log("\n--- Procurando outros usuários com login 'ellen' ---");
  const [others] = await connection.execute("SELECT id_funcionario, login, nome FROM orc_funcionarios WHERE login = 'ellen' AND id_funcionario != 10");
  console.log("Outros usuários com login 'ellen':", others);

  console.log("\n--- Verificando tipo da coluna 'acesso' ---");
  const [columns] = await connection.execute("SHOW COLUMNS FROM orc_funcionarios LIKE 'acesso'");
  console.log("Coluna 'acesso':", columns);

  await connection.end();
}

main().catch(console.error);
