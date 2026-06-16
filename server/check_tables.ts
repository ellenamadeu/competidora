import { prisma } from './src/config/prisma';
async function main() {
  try {
    const rows = await prisma.$queryRawUnsafe('SHOW TABLES');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
