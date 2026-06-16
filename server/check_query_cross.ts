import { prisma } from './src/config/prisma';

async function main() {
  const orderId = 50656;
  try {
    const itemRows: any[] = await prisma.$queryRaw`
      SELECT 
        i.*, 
        p.nome as produto_nome, 
        p.sku as produto_sku,
        (SELECT url FROM produto_imagens WHERE produto_id = i.produto_id ORDER BY principal DESC, id ASC LIMIT 1) as produto_imagem,
        pd.produto AS legacy_produto_nome,
        ds.descricao AS legacy_descricao_nome,
        es.espessura AS legacy_espessura_nome,
        ac.acabamento AS legacy_acabamento_nome
      FROM itens i
      LEFT JOIN produtos p ON i.produto_id = p.id
      LEFT JOIN competid4c3793e0_competidor1_1.item_produto pd ON i.produto = pd.id_produto
      LEFT JOIN competid4c3793e0_competidor1_1.item_descricao ds ON i.descricao = ds.id_descricao
      LEFT JOIN competid4c3793e0_competidor1_1.item_espessura es ON i.espessura = es.id_espessura
      LEFT JOIN competid4c3793e0_competidor1_1.item_acabamento ac ON i.acabamento = ac.id_acabamento
      WHERE i.id_pedido = ${orderId}
    `;
    console.log('Cross-database query succeeded! Row count:', itemRows.length);
  } catch (err: any) {
    console.error('Cross-database query failed!', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
