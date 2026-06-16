import { prisma } from './src/config/prisma';

async function main() {
  try {
    const itemRows: any[] = await prisma.$queryRaw`
      SELECT 
        i.*, 
        p.nome as produto_nome, 
        p.sku as produto_sku,
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
      WHERE i.id_pedido <= 50656
    `;

    console.log(`Checking ${itemRows.length} items for "Produto Custom" fallback...`);

    const customItems = [];
    for (const item of itemRows) {
      if (!item.produto_id) {
        const nameParts: string[] = [];
        if (item.produto_sc) {
          nameParts.push(item.produto_sc);
        } else if (item.legacy_produto_nome) {
          nameParts.push(item.legacy_produto_nome);
        }
        if (item.legacy_descricao_nome) nameParts.push(item.legacy_descricao_nome);
        if (item.legacy_espessura_nome) nameParts.push(item.legacy_espessura_nome);
        if (item.legacy_acabamento_nome) nameParts.push(item.legacy_acabamento_nome);
        if (item.acabamento2) nameParts.push(item.acabamento2);

        const finalName = nameParts.length > 0 ? nameParts.join(' - ') : 'Produto Custom';
        if (finalName === 'Produto Custom') {
          customItems.push(item);
        }
      }
    }

    console.log(`Found ${customItems.length} items that fell back to "Produto Custom".`);
    if (customItems.length > 0) {
      console.log('Sample custom items (first 10):');
      console.log(JSON.stringify(customItems.slice(0, 10), null, 2));
    }
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
