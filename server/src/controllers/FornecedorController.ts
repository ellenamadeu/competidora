import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class FornecedorController {
  // GET /api/fornecedores
  static async list(req: Request, res: Response) {
    try {
      const { q, category } = req.query;
      
      let sql = `
        SELECT f.id_fornecedor as id, f.categoria as categoria_id, f.nome, f.contato, 
               f.ddd, f.telefone1, f.telefone2, f.telefone3, f.endereco, 
               f.bairro, f.referencia, f.cep, f.email, f.cnpj, f.ie, f.observacoes,
               c.categoria as nome_categoria 
        FROM fornecedores f
        LEFT JOIN fornecedor_categoria c ON f.categoria = c.id_categorias
        WHERE 1=1
      `;
      
      const params: any[] = [];

      if (q) {
        const searchTerm = `%${q}%`;
        sql += ` AND (f.nome LIKE ? OR f.cnpj LIKE ? OR f.email LIKE ? OR f.telefone1 LIKE ?)`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (category && Number(category) > 0) {
        sql += ` AND f.categoria = ?`;
        params.push(Number(category));
      }

      sql += q ? ` ORDER BY f.nome ASC` : ` ORDER BY f.id_fornecedor DESC LIMIT 100`;

      const rows: any[] = await prisma.$queryRawUnsafe(sql, ...params);
      res.json(rows);
    } catch (error: any) {
      console.error('Erro ao listar fornecedores:', error);
      res.status(500).json({ error: error.message || 'Erro ao listar fornecedores' });
    }
  }

  // GET /api/fornecedores/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rows: any[] = await prisma.$queryRaw`
        SELECT f.id_fornecedor as id, f.categoria as categoria_id, f.nome, f.contato, 
               f.ddd, f.telefone1, f.telefone2, f.telefone3, f.endereco, 
               f.bairro, f.referencia, f.cep, f.email, f.cnpj, f.ie, f.observacoes,
               c.categoria as nome_categoria 
        FROM fornecedores f
        LEFT JOIN fornecedor_categoria c ON f.categoria = c.id_categorias
        WHERE f.id_fornecedor = ${Number(id)}
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      res.json(rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/fornecedores
  static async create(req: Request, res: Response) {
    try {
      const { 
        nome, categoria_id, contato, ddd, telefone1, telefone2, telefone3,
        endereco, bairro, referencia, cep, email, cnpj, ie, observacoes 
      } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'O nome do fornecedor é obrigatório.' });
      }

      await prisma.$executeRaw`
        INSERT INTO fornecedores (
          nome, categoria, contato, ddd, telefone1, telefone2, telefone3,
          endereco, bairro, referencia, cep, email, cnpj, ie, observacoes
        ) VALUES (
          ${nome}, ${categoria_id ? Number(categoria_id) : null}, ${contato || null}, 
          ${ddd ? Number(ddd) : null}, ${telefone1 || null}, ${telefone2 || null}, ${telefone3 || null},
          ${endereco || null}, ${bairro || null}, ${referencia || null}, ${cep || null}, 
          ${email || null}, ${cnpj || null}, ${ie || null}, ${observacoes || null}
        )
      `;

      const result: any[] = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
      const newId = result[0].id.toString();

      res.status(201).json({ id: newId, message: 'Fornecedor cadastrado com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/fornecedores/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        nome, categoria_id, contato, ddd, telefone1, telefone2, telefone3,
        endereco, bairro, referencia, cep, email, cnpj, ie, observacoes 
      } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'O nome do fornecedor é obrigatório.' });
      }

      await prisma.$executeRaw`
        UPDATE fornecedores SET
          nome = ${nome},
          categoria = ${categoria_id ? Number(categoria_id) : null},
          contato = ${contato || null},
          ddd = ${ddd ? Number(ddd) : null},
          telefone1 = ${telefone1 || null},
          telefone2 = ${telefone2 || null},
          telefone3 = ${telefone3 || null},
          endereco = ${endereco || null},
          bairro = ${bairro || null},
          referencia = ${referencia || null},
          cep = ${cep || null},
          email = ${email || null},
          cnpj = ${cnpj || null},
          ie = ${ie || null},
          observacoes = ${observacoes || null}
        WHERE id_fornecedor = ${Number(id)}
      `;

      res.json({ message: 'Fornecedor atualizado com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/fornecedores/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.$executeRaw`
        DELETE FROM fornecedores WHERE id_fornecedor = ${Number(id)}
      `;
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/fornecedores/categorias
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

  // POST /api/fornecedores/categorias
  static async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });

      await prisma.$executeRaw`
        INSERT INTO fornecedor_categoria (categoria) VALUES (${name})
      `;

      const result: any[] = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
      const newId = result[0].id.toString();

      res.status(201).json({ id: newId, name });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
