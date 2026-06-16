import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { GoogleContactsService } from '../services/GoogleContactsService';

export class ClienteController {
  // GET /api/clientes
  static async list(req: Request, res: Response) {
    try {
      const { q, page = '1', limit = '20' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const search = q ? String(q) : '';
      
      const where = search ? {
        OR: [
          { nome: { contains: search } },
          { telefone: { contains: search } },
          { telefone2: { contains: search } },
          { telefone3: { contains: search } },
          { endereco: { contains: search } },
          { bairro: { contains: search } },
        ]
      } : {};

      const [clientes, total] = await Promise.all([
        prisma.cliente.findMany({
          where,
          skip,
          take,
          orderBy: { id: 'desc' }
        }),
        prisma.cliente.count({ where })
      ]);

      res.json({
        data: clientes,
        meta: {
          total,
          page: Number(page),
          last_page: Math.ceil(total / take)
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/clientes/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clienteId = Number(id);

      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId }
      });

      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

      // Fetch pedidos manually to bypass Prisma generate issues with relations
      const pedidosResult = await prisma.$queryRaw`
        SELECT id_pedido as id, data_pedido, titulo, total, status, saldo 
        FROM pedidos 
        WHERE id_cliente = ${clienteId} 
        ORDER BY data_pedido DESC
      `;

      // BigInt serialization fix
      const pedidos = JSON.parse(JSON.stringify(pedidosResult, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));

      res.json({ 
        ...cliente, 
        pedidos 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/clientes
  static async create(req: Request, res: Response) {
    try {
      const { phones, ...data } = req.body;
      
      const phoneFields = ClienteController.mapPhonesToLegacy(phones);

      const cliente = await prisma.cliente.create({
        data: {
          ...data,
          ...phoneFields
        }
      });

      // Sincroniza com Google Contacts em segundo plano
      GoogleContactsService.syncContact(cliente).catch(console.error);

      res.status(201).json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message, details: error });
    }
  }

  // PUT /api/clientes/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { phones, ...data } = req.body;
      
      const phoneFields = ClienteController.mapPhonesToLegacy(phones);

      const cliente = await prisma.cliente.update({
        where: { id: Number(id) },
        data: {
          ...data,
          ...phoneFields
        }
      });

      // Sincroniza com Google Contacts em segundo plano
      GoogleContactsService.syncContact(cliente).catch(console.error);

      res.json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/clientes/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await prisma.cliente.findUnique({
        where: { id: Number(id) }
      });

      if (cliente?.google_id) {
        // Remove do Google Contacts em segundo plano
        GoogleContactsService.deleteContact(cliente.google_id).catch(console.error);
      }

      await prisma.cliente.delete({
        where: { id: Number(id) }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private static mapPhonesToLegacy(phones: string[]) {
    if (!phones || !Array.isArray(phones)) return {};
    
    const result: any = {
      telefone: phones[0] || null,
      telefone2: phones[1] || null,
      telefone3: phones[2] || null
    };

    // Tentar extrair DDD do primeiro telefone (formato: (XX) XXXX-XXXX)
    if (phones[0]) {
      const dddMatch = phones[0].match(/\((\d{2})\)/);
      if (dddMatch) {
        result.ddd = parseInt(dddMatch[1], 10);
      }
    }

    return result;
  }
}
