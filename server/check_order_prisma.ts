import { prisma } from './src/config/prisma';

async function main() {
  const orderId = 50656;
  console.log(`Checking order ${orderId} in Prisma...`);

  try {
    const pedido = await prisma.$queryRawUnsafe('SELECT * FROM pedidos WHERE id_pedido = ?', orderId);
    console.log('PEDIDO:', JSON.stringify(pedido, null, 2));

    const itens = await prisma.$queryRawUnsafe('SELECT * FROM itens WHERE id_pedido = ?', orderId);
    console.log('ITENS:', JSON.stringify(itens, null, 2));

    const pagamentos = await prisma.$queryRawUnsafe('SELECT * FROM caixa_entrada WHERE id_pedido = ?', orderId);
    console.log('PAGAMENTOS:', JSON.stringify(pagamentos, null, 2));

    const agendamentos = await prisma.$queryRawUnsafe('SELECT * FROM agendamento WHERE id_pedido = ?', orderId);
    console.log('AGENDAMENTOS:', JSON.stringify(agendamentos, null, 2));

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
