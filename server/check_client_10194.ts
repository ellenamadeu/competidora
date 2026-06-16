import { prisma } from './src/config/prisma';

async function main() {
  try {
    const clients = await prisma.$queryRawUnsafe('SELECT * FROM clientes WHERE id_cliente = 10194');
    console.log(JSON.stringify(clients[0], null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
