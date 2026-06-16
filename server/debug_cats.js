const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const cats = await prisma.categoria.findMany();
  console.log('Total em categorias:', cats.length);
  cats.forEach(c => console.log(c.id, c.nome, c.categoria_pai_id));
  await prisma.$disconnect();
}
check();
