import { prisma } from './src/config/prisma';

async function main() {
  const orderId = 50641;
  const idItem = 472506; // I don't know the real test item id, but I'll try to guess from common increments or use a known one. Actually, I'll search for one first.
  
  try {
    const item = await prisma.$queryRawUnsafe('SELECT id_item FROM itens ORDER BY id_item DESC LIMIT 1');
    const realIdItem = (item as any)[0].id_item;
    
    console.log(`Simulating update for item ${realIdItem}`);
    
    const res = await prisma.$executeRaw`
        UPDATE itens SET
          altura = '1.500',
          largura = '1.200',
          comprimento = '0.000',
          quantidade = '2.000',
          valor_unitario = '800.00',
          valor_total = '1600.00',
          observacoes = 'Test Edit',
          variacoes = ${JSON.stringify({ "Test": { "id": 1, "opcao": "B" } })}
        WHERE id_item = ${realIdItem} AND id_pedido = ${orderId}
      `;
    console.log('Success:', res);
  } catch (err: any) {
    console.error('Failure:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
