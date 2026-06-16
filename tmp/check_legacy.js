const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://competid4c3793e0_loja:Eao%40031626@a16-asgard3.hospedagemuolhost.com.br:3306/competid4c3793e0_competidor1_1"
    }
  }
});
async function main() {
  try {
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('Tables:', JSON.stringify(tables, null, 2));
    
    // Check if orc_pagamento exists
    const orc_pag = await prisma.$queryRaw`SELECT * FROM orc_pagamento LIMIT 10`;
    console.log('orc_pagamento data:', JSON.stringify(orc_pag, null, 2));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
