const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_node',
    port: 3306
  });

  try {
    const orderId = 50656;
    console.log(`Checking order ${orderId} in competid4c3793e0_node...`);

    // 1. Pedido
    const [pedidos] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ?', [orderId]);
    console.log('Pedido:', JSON.stringify(pedidos, null, 2));

    // 2. Itens
    const [itens] = await connection.query('SELECT * FROM itens WHERE id_pedido = ?', [orderId]);
    console.log(`Itens (count: ${itens.length}):`, JSON.stringify(itens, null, 2));

    // 3. Pagamentos
    const [pagamentos] = await connection.query('SELECT * FROM caixa_entrada WHERE id_pedido = ?', [orderId]);
    console.log(`Pagamentos (count: ${pagamentos.length}):`, JSON.stringify(pagamentos, null, 2));

    // 4. Agendamentos
    const [agendamentos] = await connection.query('SELECT * FROM agendamento WHERE id_pedido = ?', [orderId]);
    console.log(`Agendamentos (count: ${agendamentos.length}):`, JSON.stringify(agendamentos, null, 2));

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await connection.end();
  }
}

main();
