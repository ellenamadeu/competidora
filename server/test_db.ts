import { prisma } from './src/config/prisma';
async function main() {
  try {
    const rows: any = await prisma.$queryRawUnsafe('DESCRIBE itens');
    console.log(JSON.stringify(rows.map((r: any) => r.Field), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
