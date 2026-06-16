import { prisma } from './src/config/prisma';

async function main() {
  try {
    const clients = await prisma.$queryRawUnsafe('SELECT id_cliente, nome, telefone, telefone2, telefone3 FROM clientes WHERE nome LIKE "%Ellen Amadeu de Oliveira%"');
    console.log(JSON.stringify(clients, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
