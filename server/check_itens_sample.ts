import { prisma } from './src/config/prisma';

async function main() {
  try {
    const itens = await prisma.$queryRawUnsafe('SELECT id_item, id_pedido, id_cliente, produto_sc FROM itens LIMIT 10');
    console.log('SAMPLE ITENS IN NODE DB:', JSON.stringify(itens, null, 2));

    const [[{ count: legacyItens }]] = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM item_produto') as any;
    console.log('Legacy item_produto count:', legacyItens);

  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
