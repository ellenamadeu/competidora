import { prisma } from './src/config/prisma';

async function main() {
  try {
    // Let's find one item where i.produto is not null
    const sampleItems: any[] = await prisma.$queryRaw`
      SELECT id_item, id_pedido, produto, descricao, espessura, acabamento, categoria, produto_sc
      FROM itens
      WHERE produto IS NOT NULL AND produto != 0 AND id_pedido <= 50656
      LIMIT 5
    `;
    console.log('Sample items with legacy IDs:', JSON.stringify(sampleItems, null, 2));

    if (sampleItems.length > 0) {
      const item = sampleItems[0];
      const joined: any[] = await prisma.$queryRaw`
        SELECT 
          i.id_item,
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
        WHERE i.id_item = ${item.id_item}
      `;
      console.log('Joined result for item:', JSON.stringify(joined, null, 2));
    }
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
