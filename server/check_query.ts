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
      LEFT JOIN item_produto pd ON i.produto = pd.id_produto
      LEFT JOIN item_descricao ds ON i.descricao = ds.id_descricao
      LEFT JOIN item_espessura es ON i.espessura = es.id_espessura
      LEFT JOIN item_acabamento ac ON i.acabamento = ac.id_acabamento
      WHERE i.id_pedido = ${orderId}
    `;
    console.log('Query succeeded! Row count:', itemRows.length);
  } catch (err: any) {
    console.error('Query failed!', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
