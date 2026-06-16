import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  const phpConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  const nodeConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'competid4c3793e0_node',
    port: 3306
  });

  console.log('Connected to both databases.');

  // 1. Migrar Pedidos
  console.log('Migrating pedidos...');
  const [phpPedidos]: any = await phpConnection.query('SELECT * FROM pedidos');
  for (const pedido of phpPedidos) {
    await nodeConnection.query(`
      INSERT IGNORE INTO pedidos (
        id_pedido, id_cliente, data_pedido, titulo, subtotal, total, 
        status, medicao_dia, medicao_turno, instalacao_dia, instalacao_turno, 
        funcionario, desconto, valor_pago, saldo, forma_pagamento, 
        observacoes, newtemper, prazo, parcelamento, avista, entrega, descontopix
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pedido.id_pedido, pedido.id_cliente, pedido.data_pedido, pedido.titulo, pedido.subtotal, pedido.total,
      pedido.status, pedido.medicao_dia, pedido.medicao_turno, pedido.instalacao_dia, pedido.instalacao_turno,
      pedido.funcionario, pedido.desconto, pedido.valor_pago, pedido.saldo, pedido.forma_pagamento,
      pedido.observacoes, pedido.newtemper, pedido.prazo, pedido.parcelamento, pedido.avista, pedido.entrega, pedido.descontopix
    ]);
  }
  console.log(`${phpPedidos.length} pedidos processed.`);

  // 2. Migrar Itens (Marcando como formato 'PHP')
  console.log('Migrating itens...');
  const [phpItens]: any = await phpConnection.query('SELECT * FROM itens');
  for (const item of phpItens) {
    await nodeConnection.query(`
      INSERT IGNORE INTO itens (
        id_item, id_pedido, id_cliente, 
        altura, largura, quantidade, valor_unitario, valor_total,
        produto_sc, categoria, produto, descricao, espessura, acabamento, acabamento2, m2,
        formato
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      item.id_item, item.id_pedido, item.id_cliente,
      item.altura, item.largura, item.quantidade, item.valor_unitario, item.valor_total,
      item.produto_sc, item.categoria, item.produto, item.descricao, item.espessura, item.acabamento, item.acabamento2, item.m2,
      'PHP'
    ]);
  }
  console.log(`${phpItens.length} itens processed.`);

  // 3. Migrar Agendamentos
  console.log('Migrating agendamentos...');
  const [phpAgendamentos]: any = await phpConnection.query('SELECT * FROM agendamento');
  for (const ag of phpAgendamentos) {
    await nodeConnection.query(`
      INSERT IGNORE INTO agendamento (
        id_agendamento, id_pedido, data_agendamento, hora_agendamento, 
        ordem, responsavel, instrucao, status_agendamento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ag.id_agendamento, ag.id_pedido, ag.data_agendamento, ag.hora_agendamento,
      ag.ordem, ag.responsavel, ag.instrucao, ag.status_agendamento
    ]);
  }
  console.log(`${phpAgendamentos.length} agendamentos processed.`);

  await phpConnection.end();
  await nodeConnection.end();
  console.log('Migration completed!');
}

main().catch(console.error);
