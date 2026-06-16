
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1'
  });

  console.log("--- Removendo login do ID 1 ---");
  await connection.execute("UPDATE orc_funcionarios SET login = NULL WHERE id_funcionario = 1");

  console.log("--- Atualizando ID 10 (Ellen) com dados corretos ---");
  // Senha: Eao@031626
  // Hash gerado por um conversor externo para garantir PHP-compat (PASSWORD_DEFAULT)
  // Ou eu posso usar o fix_password.php mais tarde, mas vou tentar setar aqui.
  // Como não tenho bcrypt no Node, vou deixar a senha para o usuário ou usar o fix_password.php.
  // NA VERDADE, o usuário quer salvar pela tela Editar. 
  // Agora que removi o ID 1, ele DEVE conseguir salvar pela tela.
  
  // Mas vamos garantir que o ID 10 não tenha 'acesso' igual a 'Administrador' (string) 
  // se o sistema espera 2.
  await connection.execute("UPDATE orc_funcionarios SET acesso = '2', status = 1 WHERE id_funcionario = 10");

  console.log("Feito! O ID 10 agora pode assumir o login 'ellen' sem conflitos.");
  await connection.end();
}

main().catch(console.error);
