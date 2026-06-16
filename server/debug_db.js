
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const dbName = 'competid4c3793e0_back';
    const tables = await prisma.$queryRawUnsafe(`SHOW TABLES FROM \`${dbName}\``);
    console.log(`Tables in ${dbName}:`);
    tables.forEach(t => console.log(' - ' + Object.values(t)[0]));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
