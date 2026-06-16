import { prisma } from './src/config/prisma';

async function main() {
  try {
    const items: any[] = await prisma.$queryRaw`
      SELECT i.id_item, i.id_pedido, i.produto_sc, i.categoria, i.produto, i.descricao, i.espessura, i.acabamento, i.acabamento2,
             pd.produto AS legacy_produto_nome,
             ds.descricao AS legacy_descricao_nome,
             es.espessura AS legacy_espessura_nome,
             ac.acabamento AS legacy_acabamento_nome,
             cat.categoria AS legacy_categoria_nome
      FROM itens i
      LEFT JOIN item_produto pd ON i.produto = pd.id_produto
      LEFT JOIN item_descricao ds ON i.descricao = ds.id_descricao
      LEFT JOIN item_espessura es ON i.espessura = es.id_espessura
      LEFT JOIN item_acabamento ac ON i.acabamento = ac.id_acabamento
      LEFT JOIN item_categoria cat ON i.categoria = cat.id_categoria
      WHERE i.produto IS NOT NULL AND i.produto != 0 AND i.id_pedido > 50000 AND i.id_pedido <= 50656
      LIMIT 10
    `;
    console.log('Legacy items with descriptions:', JSON.stringify(items, null, 2));
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
