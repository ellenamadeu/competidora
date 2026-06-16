
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- Investigando Funcionário ID 10 ---");
  const user10 = await prisma.$queryRaw`SELECT id_funcionario, login, acesso, nome FROM orc_funcionarios WHERE id_funcionario = 10`;
  console.log("Dados do ID 10:", user10);

  console.log("\n--- Procurando outros usuários com login 'ellen' ---");
  const others = await prisma.$queryRaw`SELECT id_funcionario, login, nome FROM orc_funcionarios WHERE login = 'ellen' AND id_funcionario != 10`;
  console.log("Outros usuários com login 'ellen':", others);

  console.log("\n--- Verificando tipo da coluna 'acesso' ---");
  const columns = await prisma.$queryRaw`SHOW COLUMNS FROM orc_funcionarios LIKE 'acesso'`;
  console.log("Coluna 'acesso':", columns);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
