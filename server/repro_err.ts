import { prisma } from './src/config/prisma';

async function main() {
  const orderId = 50641;
  const produto_id = 4;
  const id_cliente = 1;
  const altura = '1.200';
  const largura = '1.200';
  const comprimento = '0.000';
  const quantidade = '1.000';
  const valor_unitario = '834.20';
  const valor_total = '834.20';
  const observacoes = '';
  const formato = 'NODE';
  const variacoesJson = JSON.stringify({ "Cor": { "id": 1, "opcao": "Branco" } });

  try {
    const res = await prisma.$executeRaw`
      INSERT INTO itens (
        id_pedido, id_cliente, produto_id, 
        altura, largura, comprimento, 
        quantidade, valor_unitario, valor_total, 
        observacoes, formato, variacoes
      ) VALUES (${orderId}, ${id_cliente}, ${produto_id}, 
        ${altura}, ${largura}, ${comprimento}, 
        ${quantidade}, ${valor_unitario}, ${valor_total}, 
        ${observacoes}, ${formato}, ${variacoesJson})
    `;
    console.log('Success:', res);
  } catch (err: any) {
    console.error('Failure:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
