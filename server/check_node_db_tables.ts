import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    port: 3306
  });

  const legacyDB = 'competid4c3793e0_competidor1_1';
  const nodeDB = 'competid4c3793e0_node';

  try {
    console.log(`--- Checking items count for legacy orders (ID <= 50656) ---`);
    const [legacyItensCnt]: any = await connection.query(`SELECT COUNT(*) as cnt FROM \`${legacyDB}\`.itens WHERE id_pedido <= 50656`);
    const [nodeItensCnt]: any = await connection.query(`SELECT COUNT(*) as cnt FROM \`${nodeDB}\`.itens WHERE id_pedido <= 50656`);
    console.log(`Legacy DB items count: ${legacyItensCnt[0].cnt}`);
    console.log(`Node DB items count: ${nodeItensCnt[0].cnt}`);

    console.log(`\n--- Querying order 49339 items from both databases ---`);
    const [legacyOrder]: any = await connection.query(`SELECT id_item, produto, descricao, espessura, acabamento, categoria FROM \`${legacyDB}\`.itens WHERE id_pedido = 49339`);
    const [nodeOrder]: any = await connection.query(`SELECT id_item, produto, descricao, espessura, acabamento, categoria FROM \`${nodeDB}\`.itens WHERE id_pedido = 49339`);
    
    console.log(`Legacy DB order 49339 items:`, legacyOrder);
    console.log(`Node DB order 49339 items:`, nodeOrder);

    console.log(`\n--- Querying lookup records for item 80851 in BOTH databases (id_produto = 17, id_categoria = 2) ---`);
    // Legacy Lookup DB checks
    const [legacyProd]: any = await connection.query(`SELECT * FROM \`${legacyDB}\`.item_produto WHERE id_produto = 17`);
    const [legacyCat]: any = await connection.query(`SELECT * FROM \`${legacyDB}\`.item_categoria WHERE id_categoria = 2`);
    console.log(`Legacy Lookup - Product 17:`, legacyProd);
    console.log(`Legacy Lookup - Category 2:`, legacyCat);

    // Node Lookup DB checks
    const [nodeProd]: any = await connection.query(`SELECT * FROM \`${nodeDB}\`.item_produto WHERE id_produto = 17`);
    const [nodeCat]: any = await connection.query(`SELECT * FROM \`${nodeDB}\`.item_categoria WHERE id_categoria = 2`);
    console.log(`Node Lookup - Product 17:`, nodeProd);
    console.log(`Node Lookup - Category 2:`, nodeCat);

    // Let's also list categories inside item_categoria in nodeDB
    const [nodeCats]: any = await connection.query(`SELECT * FROM \`${nodeDB}\`.item_categoria`);
    console.log(`\nAll categories in ${nodeDB}.item_categoria:`, nodeCats);

    const [nodeProds]: any = await connection.query(`SELECT id_produto, produto FROM \`${nodeDB}\`.item_produto LIMIT 10`);
    console.log(`\nSample products in ${nodeDB}.item_produto:`, nodeProds);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

main();
