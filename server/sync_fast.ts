import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const phpConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    database: 'competid4c3793e0_competidor1_1',
    port: 3306
  });

  const nodeConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'a16-asgard3.hospedagemuolhost.com.br',
    user: process.env.DB_USER || 'competid4c3793e0_loja',
    password: process.env.DB_PASS || 'Eao@031626',
    database: 'competid4c3793e0_node',
    port: 3306
  });

  try {
    // 1. Sync Itens
    console.log('Finding missing items...');
    const [phpItens]: any = await phpConnection.query('SELECT id_item, id_pedido, id_cliente, produto_sc, categoria, produto, descricao, espessura, acabamento, acabamento2, altura, largura, quantidade, m2, valor_unitario, valor_total FROM itens');
    const [nodeItens]: any = await nodeConnection.query('SELECT id_item FROM itens');
    const nodeItemIds = new Set(nodeItens.map((i: any) => i.id_item));

    const missingItens = phpItens.filter((i: any) => !nodeItemIds.has(i.id_item));
    console.log(`Found ${missingItens.length} missing items. Importing...`);
    
    for (const item of missingItens) {
      await nodeConnection.query(
        `INSERT INTO itens (
          id_item, id_pedido, id_cliente, produto_sc, categoria, produto, descricao,
          espessura, acabamento, acabamento2, altura, largura, quantidade, m2,
          valor_unitario, valor_total, formato
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id_item, item.id_pedido, item.id_cliente, item.produto_sc, item.categoria, item.produto, item.descricao,
          item.espessura, item.acabamento, item.acabamento2, item.altura, item.largura, item.quantidade, item.m2,
          item.valor_unitario, item.valor_total, 'PHP'
        ]
      );
    }

    // 2. Sync Payments
    console.log('Finding missing payments...');
    const [phpPayments]: any = await phpConnection.query('SELECT id_caixa_entrada, id_pedido, data, forma_pagamento, valor FROM caixa_entrada');
    const [nodePayments]: any = await nodeConnection.query('SELECT id_caixa_entrada FROM caixa_entrada');
    const nodePaymentIds = new Set(nodePayments.map((p: any) => p.id_caixa_entrada));

    const missingPayments = phpPayments.filter((p: any) => !nodePaymentIds.has(p.id_caixa_entrada));
    console.log(`Found ${missingPayments.length} missing payments. Importing...`);

    for (const pay of missingPayments) {
      await nodeConnection.query(
        `INSERT INTO caixa_entrada (
          id_caixa_entrada, id_pedido, data, forma_pagamento, valor
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          pay.id_caixa_entrada, pay.id_pedido, pay.data, pay.forma_pagamento, pay.valor
        ]
      );
    }

    // 3. Sync Agendamentos
    console.log('Finding missing agendamentos...');
    const [phpAgendamentos]: any = await phpConnection.query('SELECT id_agendamento, id_pedido, data_agendamento, hora_agendamento, ordem, responsavel, instrucao, status_agendamento FROM agendamento');
    const [nodeAgendamentos]: any = await nodeConnection.query('SELECT id_agendamento FROM agendamento');
    const nodeAgendamentoIds = new Set(nodeAgendamentos.map((a: any) => a.id_agendamento));

    const missingAgendamentos = phpAgendamentos.filter((a: any) => !nodeAgendamentoIds.has(a.id_agendamento));
    console.log(`Found ${missingAgendamentos.length} missing agendamentos. Importing...`);

    for (const ag of missingAgendamentos) {
      await nodeConnection.query(
        `INSERT INTO agendamento (
          id_agendamento, id_pedido, data_agendamento, hora_agendamento, ordem, responsavel, instrucao, status_agendamento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ag.id_agendamento, ag.id_pedido, ag.data_agendamento, ag.hora_agendamento, ag.ordem, ag.responsavel, ag.instrucao, ag.status_agendamento
        ]
      );
    }

    console.log('Sync finished successfully!');
  } catch (err) {
    console.error('Error during sync:', err);
  } finally {
    await phpConnection.end();
    await nodeConnection.end();
  }
}

main();
