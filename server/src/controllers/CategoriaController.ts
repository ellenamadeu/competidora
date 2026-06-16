import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class CategoriaController {
  // GET /api/categorias
  static async list(req: Request, res: Response) {
    try {
      const categorias = await prisma.categoria.findMany({
        include: { 
          _count: {
            select: { produtos: true }
          }
        }
      });
      res.json(categorias);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/categorias/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await prisma.categoria.findUnique({
        where: { id: Number(id) },
        include: { subcategorias: true }
      });
      if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
      res.json(categoria);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/categorias
  static async create(req: Request, res: Response) {
    try {
      const { nome, slug, categoria_pai_id } = req.body;
      const categoria = await prisma.categoria.create({
        data: {
          nome,
          slug: slug || nome.toLowerCase().replace(/ /g, '-'),
          categoria_pai_id: categoria_pai_id || null
        }
      });
      res.status(201).json(categoria);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/categorias/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, slug, categoria_pai_id } = req.body;
      const categoria = await prisma.categoria.update({
        where: { id: Number(id) },
        data: {
          nome,
          slug,
          categoria_pai_id
        }
      });
      res.json(categoria);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/categorias/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.categoria.delete({
        where: { id: Number(id) }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
