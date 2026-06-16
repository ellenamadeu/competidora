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
    console.log('Fetching orders from new database with ID <= 50656...');
    const [pedidosRows]: any = await nodeConnection.query('SELECT id_pedido FROM pedidos WHERE id_pedido <= 50656');
    const orderIds = pedidosRows.map((p: any) => p.id_pedido);
    console.log(`Found ${orderIds.length} orders <= 50656 in the new database.`);

    let importedItensCount = 0;
    let importedPaymentsCount = 0;
    let importedAgendamentosCount = 0;

    // We process orders in batches to be efficient
    const batchSize = 100;
    for (let i = 0; i < orderIds.length; i += batchSize) {
      const batchIds = orderIds.slice(i, i + batchSize);
      const idsPlaceholder = batchIds.map(() => '?').join(',');

      // 1. Check and Import Itens
      const [legacyItens]: any = await phpConnection.query(
        `SELECT * FROM itens WHERE id_pedido IN (${idsPlaceholder})`,
        batchIds
      );
      
      for (const item of legacyItens) {
        const [existing]: any = await nodeConnection.query(
          'SELECT id_item FROM itens WHERE id_item = ?',
          [item.id_item]
        );
        if (existing.length === 0) {
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
          importedItensCount++;
        }
      }

      // 2. Check and Import Payments (Caixa Entrada)
      const [legacyPayments]: any = await phpConnection.query(
        `SELECT * FROM caixa_entrada WHERE id_pedido IN (${idsPlaceholder})`,
        batchIds
      );

      for (const pay of legacyPayments) {
        const [existing]: any = await nodeConnection.query(
          'SELECT id_caixa_entrada FROM caixa_entrada WHERE id_caixa_entrada = ?',
          [pay.id_caixa_entrada]
        );
        if (existing.length === 0) {
          await nodeConnection.query(
            `INSERT INTO caixa_entrada (
              id_caixa_entrada, id_pedido, data, forma_pagamento, valor
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              pay.id_caixa_entrada, pay.id_pedido, pay.data, pay.forma_pagamento, pay.valor
            ]
          );
          importedPaymentsCount++;
        }
      }

      // 3. Check and Import Agendamentos
      const [legacyAgendamentos]: any = await phpConnection.query(
        `SELECT * FROM agendamento WHERE id_pedido IN (${idsPlaceholder})`,
        batchIds
      );

      for (const ag of legacyAgendamentos) {
        const [existing]: any = await nodeConnection.query(
          'SELECT id_agendamento FROM agendamento WHERE id_agendamento = ?',
          [ag.id_agendamento]
        );
        if (existing.length === 0) {
          await nodeConnection.query(
            `INSERT INTO agendamento (
              id_agendamento, id_pedido, data_agendamento, hora_agendamento, ordem, responsavel, instrucao, status_agendamento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              ag.id_agendamento, ag.id_pedido, ag.data_agendamento, ag.hora_agendamento, ag.ordem, ag.responsavel, ag.instrucao, ag.status_agendamento
            ]
          );
          importedAgendamentosCount++;
        }
      }
    }

    console.log('\n--- SYNC REPORT ---');
    console.log(`Imported Itens: ${importedItensCount}`);
    console.log(`Imported Payments: ${importedPaymentsCount}`);
    console.log(`Imported Agendamentos: ${importedAgendamentosCount}`);
    console.log('-------------------\n');

  } catch (err) {
    console.error('ERROR DURING SYNC:', err);
  } finally {
    await phpConnection.end();
    await nodeConnection.end();
  }
}

main();
