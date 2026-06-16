import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class DespesaController {
  // GET /api/despesas
  static async list(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      
      let sql = `
        SELECT 
            d.id,
            d.id_fornecedor,
            d.descricao,
            d.valor,
            d.data_pagamento,
            f.nome AS nome_fornecedor,
            c.categoria AS nome_categoria
        FROM 
            financeiro_despesas d
        JOIN 
            fornecedores f ON d.id_fornecedor = f.id_fornecedor
        LEFT JOIN 
            fornecedor_categoria c ON f.categoria = c.id_categorias
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      if (start_date && end_date) {
        sql += ` AND d.data_pagamento BETWEEN ? AND ?`;
        params.push(String(start_date));
        params.push(String(end_date));
      }
      
      sql += ` ORDER BY d.data_pagamento DESC, d.id DESC LIMIT 200`;

      const despesas: any[] = await prisma.$queryRawUnsafe(sql, ...params);
      
      // Ajustar decimais e datas para JSON
      const formatted = despesas.map(d => ({
        id: d.id,
        id_fornecedor: d.id_fornecedor,
        descricao: d.descricao,
        valor: parseFloat(d.valor || 0),
        data_pagamento: d.data_pagamento instanceof Date ? d.data_pagamento.toISOString().split('T')[0] : String(d.data_pagamento),
        nome_fornecedor: d.nome_fornecedor,
        nome_categoria: d.nome_categoria || 'Sem Categoria'
      }));

      res.json(formatted);
    } catch (error: any) {
      console.error('Erro ao listar despesas:', error);
      res.status(500).json({ error: error.message || 'Erro ao listar despesas' });
    }
  }

  // GET /api/despesas/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const rows: any[] = await prisma.$queryRaw`
        SELECT * FROM financeiro_despesas WHERE id = ${Number(id)}
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }

      const d = rows[0];
      res.json({
        id: d.id,
        id_fornecedor: d.id_fornecedor,
        descricao: d.descricao,
        valor: parseFloat(d.valor || 0),
        data_pagamento: d.data_pagamento instanceof Date ? d.data_pagamento.toISOString().split('T')[0] : String(d.data_pagamento)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/despesas
  static async create(req: Request, res: Response) {
    try {
      const { id_fornecedor, descricao, valor, data_pagamento } = req.body;

      if (!id_fornecedor || !descricao || valor === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes: id_fornecedor, descricao, valor' });
      }

      const dataPagto = data_pagamento ? new Date(data_pagamento) : new Date();

      await prisma.$executeRaw`
        INSERT INTO financeiro_despesas (id_fornecedor, descricao, valor, data_pagamento)
        VALUES (${Number(id_fornecedor)}, ${descricao}, ${parseFloat(valor)}, ${dataPagto})
      `;

      const result: any[] = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
      const newId = result[0].id.toString();

      res.status(201).json({ id: newId, message: 'Despesa registrada com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/despesas/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { id_fornecedor, descricao, valor, data_pagamento } = req.body;

      if (!id_fornecedor || !descricao || valor === undefined || !data_pagamento) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes para atualização' });
      }

      const dataPagto = new Date(data_pagamento);

      await prisma.$executeRaw`
        UPDATE financeiro_despesas 
        SET id_fornecedor = ${Number(id_fornecedor)}, 
            descricao = ${descricao}, 
            valor = ${parseFloat(valor)}, 
            data_pagamento = ${dataPagto} 
        WHERE id = ${Number(id)}
      `;

      res.json({ message: 'Despesa atualizada com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/despesas/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.$executeRaw`
        DELETE FROM financeiro_despesas WHERE id = ${Number(id)}
      `;
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/despesas/categorias
  static async listCategories(req: Request, res: Response) {
    try {
      const categories: any[] = await prisma.$queryRaw`
        SELECT id_categorias as id, categoria as name 
        FROM fornecedor_categoria 
        ORDER BY categoria ASC
      `;
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
