import { prisma } from './src/config/prisma';
async function main() {
  try {
    // We try to list tables in the other database if the user has permissions
    const rows = await prisma.$queryRawUnsafe('SHOW TABLES FROM `competidor1_1`');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Error accessing competidor1_1:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
