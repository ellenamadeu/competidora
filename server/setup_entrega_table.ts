import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('--- Criando tabela orc_entrega ---');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS orc_entrega (
      id_entrega INT PRIMARY KEY,
      entrega VARCHAR(100) NOT NULL
    )
  `);

  console.log('--- Populando tabela orc_entrega ---');
  const values = [
    [1, 'Retirada na loja'],
    [2, 'Entrega sem instalação'],
    [3, 'Entrega e instalação']
  ];

  for (const [id, label] of values) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO orc_entrega (id_entrega, entrega) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE entrega = VALUES(entrega)
    `, id, label);
  }

  console.log('--- Finalizado ---');
}
main().finally(() => prisma.$disconnect());
