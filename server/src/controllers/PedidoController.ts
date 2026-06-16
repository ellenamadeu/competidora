import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class PedidoController {
  // GET /api/pedidos
  static async list(req: Request, res: Response) {
    try {
      const { q, status, date, page = '1', limit = '30' } = req.query;
      const currentPage = Number(page);
      const limitVal = Number(limit);
      const skip = (currentPage - 1) * limitVal;

      console.log(`Fetching orders via Prisma: page=${currentPage}, limit=${limitVal}, q=${q || ''}, status=${status || ''}, date=${date || ''}`);

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];

      if (q) {
        const searchTerm = String(q).trim();
        const isNum = !isNaN(Number(searchTerm));
        if (isNum) {
          whereClause += ` AND (p.id_pedido = ? OR c.nome LIKE ? OR c.telefone LIKE ? OR c.telefone2 LIKE ? OR c.telefone3 LIKE ? OR c.endereco LIKE ? OR c.bairro LIKE ? OR p.titulo LIKE ?)`;
          params.push(Number(searchTerm), `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        } else {
          whereClause += ` AND (c.nome LIKE ? OR c.telefone LIKE ? OR c.telefone2 LIKE ? OR c.telefone3 LIKE ? OR c.endereco LIKE ? OR c.bairro LIKE ? OR p.titulo LIKE ?)`;
          params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        }
      }

      if (status !== undefined && status !== null && status !== '') {
        whereClause += ` AND p.status = ?`;
        params.push(Number(status));
      }

      if (date) {
        whereClause += ` AND DATE(p.data_pedido) = ?`;
        params.push(String(date));
      }

      // Query total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM pedidos p 
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
        ${whereClause}
      `;

      // Query data (using safe inline values for limit and offset to avoid driver binding bugs)
      const dataQuery = `
        SELECT 
          p.*, 
          c.nome as cliente_nome,
          c.bairro as cliente_bairro,
          c.telefone as cliente_telefone,
          c.telefone2 as cliente_telefone2,
          c.telefone3 as cliente_telefone3,
          c.endereco as cliente_endereco
        FROM pedidos p 
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
        ${whereClause}
        ORDER BY p.id_pedido DESC
        LIMIT ${limitVal} OFFSET ${skip}
      `;

      const countResult: any[] = await prisma.$queryRawUnsafe(countQuery, ...params);
      
      // Handle BigInt from MySQL COUNT
      const totalRaw = countResult[0]?.total;
      const total = typeof totalRaw === 'bigint' ? Number(totalRaw) : Number(totalRaw || 0);

      const rows: any[] = await prisma.$queryRawUnsafe(dataQuery, ...params);
      
      // Fix BigInt and Decimal serialization
      const data = JSON.parse(JSON.stringify(rows, (key, value) => {
        if (typeof value === 'bigint') return value.toString();
        if (['subtotal', 'total', 'saldo', 'desconto', 'valor_pago'].includes(key)) {
          return parseFloat(value || 0);
        }
        return value;
      }));

      console.log(`Orders fetched: ${data.length}, total count: ${total}`);
      
      res.json({
        data,
        meta: {
          total,
          page: currentPage,
          last_page: Math.ceil(total / limitVal)
        }
      });
    } catch (error: any) {
      console.error('ERROR LISTING ORDERS:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/pedidos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderId = Number(id);
      console.log(`Getting order by ID: ${orderId}`);
      
      // Detalhes do Pedido
      const pedidoRows: any[] = await prisma.$queryRaw`
        SELECT 
          p.id_pedido, p.id_cliente, p.data_pedido, p.titulo, 
          p.subtotal, p.total, p.status, p.desconto, 
          p.valor_pago, p.saldo, p.observacoes, p.forma_pagamento,
          p.prazo, p.parcelamento, p.entrega, p.descontopix,
          c.nome as cliente_nome, c.contato, c.ddd, c.telefone, c.telefone2, c.telefone3, c.email,
          c.endereco, c.bairro, c.cep,
          e.entrega as entrega_nome
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
        LEFT JOIN orc_entrega e ON p.entrega = e.id_entrega
        WHERE p.id_pedido = ${orderId}
      `;
      
      if (!pedidoRows || pedidoRows.length === 0) {
        console.log(`Order ${orderId} not found`);
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      
      const pedido = pedidoRows[0];
      // Map cliente_nome back to nome for the mapping logic below
      pedido.nome = pedido.cliente_nome;
      console.log('Order found, processing client data...');
 
      // Cliente data
      pedido.cliente = {
        id_cliente: pedido.id_cliente,
        nome: pedido.nome,
        contato: pedido.contato,
        ddd: pedido.ddd,
        telefone: pedido.telefone,
        telefone2: pedido.telefone2,
        telefone3: pedido.telefone3,
        email: pedido.email,
        endereco: pedido.endereco,
        bairro: pedido.bairro,
        cep: pedido.cep,
      };
      
      // Remove redundant fields
      delete pedido.nome;
      delete pedido.contato;
      delete pedido.ddd;
      delete pedido.telefone;
      delete pedido.telefone2;
      delete pedido.telefone3;
      delete pedido.email;
      delete pedido.endereco;
      delete pedido.bairro;
      delete pedido.cep;

      console.log('Fetching items...');
      // Itens
      const itemRows: any[] = await prisma.$queryRaw`
        SELECT 
          i.*, 
          p.nome as produto_nome, 
          p.sku as produto_sku,
          (SELECT url FROM produto_imagens WHERE produto_id = i.produto_id ORDER BY principal DESC, id ASC LIMIT 1) as produto_imagem,
          pd.produto AS legacy_produto_nome,
          ds.descricao AS legacy_descricao_nome,
          es.espessura AS legacy_espessura_nome,
          ac.acabamento AS legacy_acabamento_nome,
          cat.categoria AS legacy_categoria_nome
        FROM itens i
        LEFT JOIN produtos p ON i.produto_id = p.id
        LEFT JOIN item_produto pd ON i.produto = pd.id_produto
        LEFT JOIN item_descricao ds ON i.descricao = ds.id_descricao
        LEFT JOIN item_espessura es ON i.espessura = es.id_espessura
        LEFT JOIN item_acabamento ac ON i.acabamento = ac.id_acabamento
        LEFT JOIN item_categoria cat ON i.categoria = cat.id_categoria
        WHERE i.id_pedido = ${orderId}
      `;

      // Formata itens legados concatenando atributos em produto_nome se produto_id for nulo
      if (itemRows && itemRows.length > 0) {
        for (const item of itemRows) {
          if (!item.produto_id) {
            const nameParts: string[] = [];
            if (item.legacy_categoria_nome) nameParts.push(item.legacy_categoria_nome);
            
            if (item.produto_sc) {
              nameParts.push(item.produto_sc);
            } else if (item.legacy_produto_nome) {
              nameParts.push(item.legacy_produto_nome);
            }
            
            if (item.legacy_descricao_nome) nameParts.push(item.legacy_descricao_nome);
            if (item.legacy_espessura_nome) nameParts.push(item.legacy_espessura_nome);
            if (item.legacy_acabamento_nome) nameParts.push(item.legacy_acabamento_nome);
            if (item.acabamento2) nameParts.push(item.acabamento2);

            item.produto_nome = nameParts.length > 0 ? nameParts.join(' - ') : 'Produto Custom';
          }
        }
      }

      pedido.itens = itemRows || [];

      console.log('Fetching appointments...');
      // Agendamentos
      const agendamentoRows: any[] = await prisma.$queryRaw`SELECT * FROM agendamento WHERE id_pedido = ${orderId}`;
      pedido.agendamentos = agendamentoRows || [];

      console.log('Fetching payments...');
      // Pagamentos (Caixa Entrada)
      const caixaRows: any[] = await prisma.$queryRaw`
        SELECT c.*, p.pagamento as forma_nome 
        FROM caixa_entrada c
        LEFT JOIN orc_pagamento p ON c.forma_pagamento = p.id_pagamento
        WHERE c.id_pedido = ${orderId} 
        ORDER BY c.data DESC
      `;
      pedido.pagamentos = caixaRows || [];

      // Unified BigInt and Decimal serialization fix
      const data = JSON.parse(JSON.stringify(pedido, (key, value) => {
        if (typeof value === 'bigint') return value.toString();
        // Convert decimals (often returned as strings or objects) to numbers for the frontend
        if (['subtotal', 'total', 'saldo', 'desconto', 'valor_pago', 'valor_unitario', 'valor_total', 'valor'].includes(key)) {
          return parseFloat(value || 0);
        }
        return value;
      }));

      res.json(data);
    } catch (error: any) {
      console.error('ERROR GETTING ORDER BY ID:', error);
      res.status(500).json({ error: error.message || String(error) });
    }
  }

  // GET /api/pedidos/pagamentos/metodos
  static async listPaymentMethods(req: Request, res: Response) {
    try {
      console.log('API: listing payment methods...');
      const rows = await prisma.$queryRaw`SELECT * FROM orc_pagamento ORDER BY pagamento ASC`;
      console.log('Result from DB:', JSON.stringify(rows));
      res.json(rows);
    } catch (error: any) {
      console.error('ERROR listing methods:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/pedidos/config/entregas
  static async listDeliveryMethods(req: Request, res: Response) {
    try {
      const rows = await prisma.$queryRawUnsafe('SELECT id_entrega as id, entrega as name FROM orc_entrega ORDER BY entrega ASC');
      res.json(rows);
    } catch (error: any) {
      console.error('ERROR LISTING DELIVERY METHODS:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/pedidos/:id/pagamentos
  static async addPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderId = Number(id);
      const { forma_pagamento, valor, data } = req.body;
      const dataPayment = data ? new Date(data) : new Date();

      await prisma.$executeRaw`
        INSERT INTO caixa_entrada (id_pedido, forma_pagamento, valor, data)
        VALUES (${orderId}, ${forma_pagamento}, ${valor}, ${dataPayment})
      `;

      await PedidoController.recalculateTotals(orderId);
      res.status(201).json({ message: 'Pagamento adicionado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/pedidos/:id/pagamentos/:idPagamento
  static async updatePayment(req: Request, res: Response) {
    try {
      const { id, idPagamento } = req.params;
      const orderId = Number(id);
      const paymentId = Number(idPagamento);
      const { forma_pagamento, valor, data } = req.body;

      await prisma.$executeRaw`
        UPDATE caixa_entrada SET
          forma_pagamento = ${forma_pagamento},
          valor = ${valor},
          data = ${new Date(data)}
        WHERE id_caixa_entrada = ${paymentId} AND id_pedido = ${orderId}
      `;

      await PedidoController.recalculateTotals(orderId);
      res.json({ message: 'Pagamento atualizado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/pedidos/:id/pagamentos/:idPagamento
  static async deletePayment(req: Request, res: Response) {
    try {
      const { id, idPagamento } = req.params;
      const orderId = Number(id);
      const paymentId = Number(idPagamento);

      await prisma.$executeRaw`DELETE FROM caixa_entrada WHERE id_caixa_entrada = ${paymentId} AND id_pedido = ${orderId}`;
      
      await PedidoController.recalculateTotals(orderId);
      res.json({ message: 'Pagamento removido com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/pedidos/:id
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const orderId = Number(id);
    try {
      const data = req.body;
      console.log(`--- Updating order ${orderId} ---`);
      console.log('Payload:', JSON.stringify(data, null, 2));

      // Build dynamic update
      const allowedFields = [
        'titulo', 'status', 'prazo', 'entrega', 
        'parcelamento', 'descontopix', 'observacoes', 'desconto',
        'subtotal', 'total', 'saldo', 'valor_pago'
      ];
      
      const sets: string[] = [];
      const values: any[] = [];

      for (const [key, value] of Object.entries(data)) {
        if (allowedFields.includes(key)) {
          sets.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (sets.length > 0) {
        // Use executeRawUnsafe for dynamic where
        const sql = `UPDATE pedidos SET ${sets.join(', ')} WHERE id_pedido = ?`;
        values.push(orderId);
        await prisma.$executeRawUnsafe(sql, ...values);
      }

      await PedidoController.recalculateTotals(orderId);
      res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (error: any) {
      console.error('ERROR UPDATING ORDER:', error);
      res.status(500).json({ error: error.message || 'Erro interno no servidor' });
    }
  }

  // POST /api/pedidos/:id/itens
  static async addItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderId = Number(id);
      const { 
        produto_id, 
        altura, largura, comprimento, 
        quantidade, valor_unitario, valor_total, 
        observacoes, formato, variacoes
      } = req.body;

      console.log(`--- Adicionando item ao pedido ${orderId} ---`);
      console.log('Payload:', JSON.stringify(req.body, null, 2));

      // Pegar id_cliente do pedido
      const pedidoRows: any[] = await prisma.$queryRaw`SELECT id_cliente FROM pedidos WHERE id_pedido = ${orderId}`;
      if (pedidoRows.length === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
      const id_cliente = pedidoRows[0].id_cliente;

      const variacoesJson = variacoes ? JSON.stringify(variacoes) : null;

      await prisma.$executeRaw`
        INSERT INTO itens (
          id_pedido, id_cliente, produto_id, 
          altura, largura, comprimento, 
          quantidade, valor_unitario, valor_total, 
          observacoes, formato, variacoes
        ) VALUES (${orderId}, ${id_cliente}, ${produto_id}, 
          ${altura}, ${largura}, ${comprimento}, 
          ${quantidade}, ${valor_unitario}, ${valor_total}, 
          ${observacoes}, ${formato || 'NODE'}, ${variacoesJson})
      `;

      await PedidoController.recalculateTotals(orderId);
      res.status(201).json({ message: 'Item adicionado com sucesso' });
    } catch (error: any) {
      const errLog = `\n--- ERRO AO ADICIONAR ITEM (${new Date().toISOString()}) ---\nPayload: ${JSON.stringify(req.body, null, 2)}\nError: ${error.message}\nStack: ${error.stack}\n`;
      require('fs').appendFileSync('debug_item_error.txt', errLog);
      res.status(500).json({ error: 'ERRO_BACKEND', details: error.message });
    }
  }

  // PUT /api/pedidos/:id/itens/:itemId
  static async updateItem(req: Request, res: Response) {
    try {
      const { id, itemId } = req.params;
      const orderId = Number(id);
      const idItem = Number(itemId);
      const { 
        altura, largura, comprimento, 
        quantidade, valor_unitario, valor_total, 
        observacoes, variacoes 
      } = req.body;

      console.log(`--- Atualizando item ${idItem} do pedido ${orderId} ---`);
      console.log('Payload:', JSON.stringify(req.body, null, 2));

      const variacoesJson = variacoes ? JSON.stringify(variacoes) : null;

      await prisma.$executeRaw`
        UPDATE itens SET
          altura = ${altura},
          largura = ${largura},
          comprimento = ${comprimento},
          quantidade = ${quantidade},
          valor_unitario = ${valor_unitario},
          valor_total = ${valor_total},
          observacoes = ${observacoes},
          variacoes = ${variacoesJson}
        WHERE id_item = ${idItem} AND id_pedido = ${orderId}
      `;

      await PedidoController.recalculateTotals(orderId);
      res.json({ message: 'Item atualizado com sucesso' });
    } catch (error: any) {
      const errLog = `\n--- ERRO AO ATUALIZAR ITEM (${new Date().toISOString()}) ---\nPayload: ${JSON.stringify(req.body, null, 2)}\nError: ${error.message}\nStack: ${error.stack}\n`;
      require('fs').appendFileSync('debug_item_error.txt', errLog);
      res.status(500).json({ error: 'ERRO_BACKEND', details: error.message });
    }
  }

  // DELETE /api/pedidos/:id/itens/:itemId
  static async deleteItem(req: Request, res: Response) {
    try {
      const { id, itemId } = req.params;
      const orderId = Number(id);
      const idItem = Number(itemId);

      await prisma.$executeRaw`DELETE FROM itens WHERE id_item = ${idItem} AND id_pedido = ${orderId}`;
      
      await PedidoController.recalculateTotals(orderId);
      res.json({ message: 'Item removido com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private static async recalculateTotals(orderId: number) {
    // 1. Somar Itens
    const items: any[] = await prisma.$queryRaw`SELECT valor_total FROM itens WHERE id_pedido = ${orderId}`;
    const newSubtotal = items.reduce((acc, item) => {
      const val = item.valor_total ? parseFloat(item.valor_total.toString()) : 0;
      return acc + val;
    }, 0);
    
    // 2. Somar Pagamentos
    const paymentRows: any[] = await prisma.$queryRaw`SELECT SUM(valor) as total_pago FROM caixa_entrada WHERE id_pedido = ${orderId}`;
    const totalPaid = paymentRows[0].total_pago ? parseFloat(paymentRows[0].total_pago.toString()) : 0;

    // 3. Pegar Desconto Atual
    const orderRows: any[] = await prisma.$queryRaw`SELECT desconto FROM pedidos WHERE id_pedido = ${orderId}`;
    if (orderRows.length > 0) {
      const discount = orderRows[0].desconto ? parseFloat(orderRows[0].desconto.toString()) : 0;
      
      const newTotal = newSubtotal - discount;
      const newBalance = newTotal - totalPaid;

      await prisma.$executeRaw`
        UPDATE pedidos 
        SET subtotal = ${newSubtotal}, total = ${newTotal}, valor_pago = ${totalPaid}, saldo = ${newBalance}
        WHERE id_pedido = ${orderId}
      `;
    }
  }

  // POST /api/pedidos/calcular
  static async calculate(req: Request, res: Response) {
    try {
      const { produto_id, altura, largura, comprimento, quantidade, variacao_ids } = req.body;
      
      const prodRows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM produtos WHERE id = ${Number(produto_id)}`);
      const produto = prodRows.length > 0 ? prodRows[0] : null;
      
      if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

      let basePrice = parseFloat(produto.preco_venda.toString());
      let unitValue = basePrice;

      const um = produto.unidade_medida.toUpperCase();
      const h = parseFloat(altura) || 0;
      const w = parseFloat(largura) || 0;
      const l = parseFloat(comprimento) || 0;
      const qty = parseFloat(quantidade) || 1;

      // Base Area/Volume Calculation
      let baseFactor = 1;
      if (um === 'M2') baseFactor = h * w;
      else if (um === 'M3') baseFactor = h * (w + l);

      let finalUnitValue = basePrice * baseFactor;

      // Aplicar Variações
      const rawVids = variacao_ids ? (Array.isArray(variacao_ids) ? variacao_ids : [variacao_ids]) : [];
      if (rawVids.length > 0) {
        const vars: any[] = await prisma.produtoVariacao.findMany({
          where: { id: { in: rawVids.map((id: any) => Number(id)) } }
        });

        vars.forEach(v => {
          const valor = parseFloat(v.valor_acrescimo.toString());
          if (v.tipo_acrescimo === 'PERCENTUAL') {
            finalUnitValue += (basePrice * baseFactor) * (valor / 100);
          } else {
            // Assume FIXO ou VALOR
            finalUnitValue += valor;
          }
        });
      }

      const totalValue = finalUnitValue * qty;

      res.json({
        valor_unitario: finalUnitValue.toFixed(2),
        valor_total: totalValue.toFixed(2),
        unidade_medida: um
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/pedidos
  static async create(req: Request, res: Response) {
    try {
      const { id_cliente, titulo, data_pedido, status, observacoes } = req.body;
      const data = data_pedido ? new Date(data_pedido) : new Date();
      
      await prisma.$executeRaw`
        INSERT INTO pedidos (id_cliente, titulo, data_pedido, status, observacoes, subtotal, total, saldo)
        VALUES (${id_cliente}, ${titulo}, ${data}, ${status || 1}, ${observacoes || ''}, 0, 0, 0)
      `;
      
      const result: any[] = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
      const newId = result[0].id.toString();

      res.status(201).json({ id_pedido: newId, message: 'Pedido criado com sucesso' });
    } catch (error: any) {
      console.error('ERROR CREATING ORDER:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/pedidos/tracking/:id
  static async getTrackingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderId = Number(id);
      console.log(`Getting public tracking details for order: ${orderId}`);
      
      // Busca dados básicos do pedido, cliente e entrega
      const orderRows: any[] = await prisma.$queryRaw`
        SELECT 
          p.id_pedido, p.data_pedido, p.titulo, p.status, 
          p.subtotal, p.total, p.desconto, p.valor_pago, p.saldo, 
          p.prazo, p.parcelamento, p.descontopix, p.observacoes,
          c.nome as cliente_nome, c.endereco as cliente_endereco, c.bairro as cliente_bairro, c.telefone as cliente_telefone,
          e.entrega as entrega_nome
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
        LEFT JOIN orc_entrega e ON p.entrega = e.id_entrega
        WHERE p.id_pedido = ${orderId}
      `;
      
      if (!orderRows || orderRows.length === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      
      const pedido = orderRows[0];
      
      // Mapeia cliente omitindo dados desnecessários
      pedido.cliente = {
        nome: pedido.cliente_nome,
        endereco: pedido.cliente_endereco,
        bairro: pedido.cliente_bairro,
        telefone: pedido.cliente_telefone
      };
      
      delete pedido.cliente_nome;
      delete pedido.cliente_endereco;
      delete pedido.cliente_bairro;
      delete pedido.cliente_telefone;

      // Busca itens associados
      const itemRows: any[] = await prisma.$queryRaw`
        SELECT 
          i.id_item, i.produto_id, i.altura, i.largura, i.comprimento, i.quantidade, i.valor_total, i.observacoes, i.variacoes, i.produto_sc,
          p.nome as produto_nome,
          (SELECT url FROM produto_imagens WHERE produto_id = i.produto_id ORDER BY principal DESC, id ASC LIMIT 1) as produto_imagem,
          pd.produto AS legacy_produto_nome,
          ds.descricao AS legacy_descricao_nome,
          es.espessura AS legacy_espessura_nome,
          ac.acabamento AS legacy_acabamento_nome,
          cat.categoria AS legacy_categoria_nome
        FROM itens i
        LEFT JOIN produtos p ON i.produto_id = p.id
        LEFT JOIN item_produto pd ON i.produto = pd.id_produto
        LEFT JOIN item_descricao ds ON i.descricao = ds.id_descricao
        LEFT JOIN item_espessura es ON i.espessura = es.id_espessura
        LEFT JOIN item_acabamento ac ON i.acabamento = ac.id_acabamento
        LEFT JOIN item_categoria cat ON i.categoria = cat.id_categoria
        WHERE i.id_pedido = ${orderId}
      `;

      // Formata nome para itens legados
      if (itemRows && itemRows.length > 0) {
        for (const item of itemRows) {
          if (!item.produto_id) {
            const nameParts: string[] = [];
            if (item.legacy_categoria_nome) nameParts.push(item.legacy_categoria_nome);
            if (item.produto_sc) {
              nameParts.push(item.produto_sc);
            } else if (item.legacy_produto_nome) {
              nameParts.push(item.legacy_produto_nome);
            }
            if (item.legacy_descricao_nome) nameParts.push(item.legacy_descricao_nome);
            if (item.legacy_espessura_nome) nameParts.push(item.legacy_espessura_nome);
            if (item.legacy_acabamento_nome) nameParts.push(item.legacy_acabamento_nome);
            if (item.acabamento2) nameParts.push(item.acabamento2);

            item.produto_nome = nameParts.length > 0 ? nameParts.join(' - ') : 'Produto Custom';
          }
        }
      }
      pedido.itens = itemRows || [];

      // Busca pagamentos
      const caixaRows: any[] = await prisma.$queryRaw`
        SELECT c.id_caixa_entrada, c.data, c.valor, p.pagamento as forma_nome 
        FROM caixa_entrada c
        LEFT JOIN orc_pagamento p ON c.forma_pagamento = p.id_pagamento
        WHERE c.id_pedido = ${orderId} 
        ORDER BY c.data DESC
      `;
      pedido.pagamentos = caixaRows || [];

      // Busca agendamentos básicos
      const agendamentoRows: any[] = await prisma.$queryRaw`
        SELECT 
          a.id_agendamento,
          a.data_agendamento,
          ah.hora AS hora_agendamento_nome,
          ao.ordem AS ordem_nome,
          a.status_agendamento
        FROM agendamento a
        LEFT JOIN agendamento_hora ah ON a.hora_agendamento = ah.id_aghora
        LEFT JOIN agendamento_ordem ao ON a.ordem = ao.id_ordem
        WHERE a.id_pedido = ${orderId}
        ORDER BY a.data_agendamento DESC, ah.hora ASC
      `;
      pedido.agendamentos = agendamentoRows || [];

      // Serialização segura contra BigInt e Decimal
      const data = JSON.parse(JSON.stringify(pedido, (key, value) => {
        if (typeof value === 'bigint') return value.toString();
        if (['subtotal', 'total', 'saldo', 'desconto', 'valor_pago', 'valor_unitario', 'valor_total', 'valor'].includes(key)) {
          return parseFloat(value || 0);
        }
        return value;
      }));

      res.json(data);
    } catch (error: any) {
      console.error('ERRO NO RASTREAMENTO PÚBLICO:', error);
      res.status(500).json({ error: 'Erro interno ao carregar o acompanhamento do pedido.' });
    }
  }
}
