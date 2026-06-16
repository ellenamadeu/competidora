import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class ProdutoController {
  // GET /api/produtos
  static async list(req: Request, res: Response) {
    try {
      const { categoria_id, q } = req.query;
      
      const where: any = {};
      
      if (categoria_id) {
        const catId = Number(categoria_id);
        
        // Busca todas as categorias para montar a hierarquia em memória de forma eficiente
        const allCategories = await prisma.categoria.findMany({
          select: { id: true, categoria_pai_id: true }
        });

        const getDescendantIds = (parentId: number): number[] => {
          let ids: number[] = [];
          const children = allCategories.filter(c => c.categoria_pai_id === parentId);
          for (const child of children) {
            ids.push(child.id);
            ids = [...ids, ...getDescendantIds(child.id)];
          }
          return ids;
        };

        const subCategoryIds = getDescendantIds(catId);
        where.categoria_id = { in: [catId, ...subCategoryIds] };
      }

      if (q) {
        where.OR = [
          { nome: { contains: String(q) } },
          { sku: { contains: String(q) } }
        ];
      }
      
      const produtos = await prisma.produto.findMany({
        where,
        include: {
          categoria: true,
          acabamentos: true,
          imagens: true,
          variacoes: true
        },
        orderBy: {
          criado_em: 'desc'
        }
      });

      res.json(produtos);
    } catch (error: any) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/produtos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await prisma.produto.findUnique({
        where: { id: Number(id) },
        include: { 
          categoria: true, 
          acabamentos: true,
          imagens: true,
          variacoes: true
        }
      });
      if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json(produto);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/produtos
  static async create(req: Request, res: Response) {
    try {
      const { imagens, variacoes, ...data } = req.body;
      
      const produto = await prisma.produto.create({
        data: {
          nome: data.nome,
          categoria_id: data.categoria_id ? Number(data.categoria_id) : null,
          descricao: data.descricao,
          ncm: data.ncm,
          sku: data.sku,
          preco_venda: data.preco_venda,
          unidade_medida: data.unidade_medida,
          largura_maxima: data.largura_maxima,
          altura_maxima: data.altura_maxima,
          comprimento_maximo: data.comprimento_maximo,
          status: data.status,
          imagens: {
            create: imagens?.map((img: any) => ({
              url: img.url,
              principal: img.principal || false
            }))
          },
          variacoes: {
            create: variacoes?.map((varItem: any) => ({
              nome: varItem.nome,
              opcao: varItem.opcao,
              tipo_acrescimo: varItem.tipo_acrescimo || 'VALOR',
              valor_acrescimo: varItem.valor_acrescimo || 0
            }))
          }
        },
        include: {
          imagens: true,
          variacoes: true
        }
      });
      res.status(201).json(produto);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/produtos/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { imagens, variacoes, ...data } = req.body;

      // Usamos uma transação para garantir consistência ao limpar e recriar relações
      const produto = await prisma.$transaction(async (tx) => {
        // Se houver novas imagens, podemos optar por substituir ou adicionar. 
        // Para simplicidade inicial, vamos substituir se a lista for enviada.
        if (imagens) {
          await tx.produtoImagem.deleteMany({ where: { produto_id: Number(id) } });
        }
        
        if (variacoes) {
          await tx.produtoVariacao.deleteMany({ where: { produto_id: Number(id) } });
        }

        return tx.produto.update({
          where: { id: Number(id) },
          data: {
            nome: data.nome,
            categoria_id: data.categoria_id ? Number(data.categoria_id) : null,
            descricao: data.descricao,
            ncm: data.ncm,
            sku: data.sku,
            preco_venda: data.preco_venda,
            unidade_medida: data.unidade_medida,
            largura_maxima: data.largura_maxima,
            altura_maxima: data.altura_maxima,
            comprimento_maximo: data.comprimento_maximo,
            status: data.status,
            imagens: imagens ? {
              create: imagens.map((img: any) => ({
                url: img.url,
                principal: img.principal || false
              }))
            } : undefined,
            variacoes: variacoes ? {
              create: variacoes.map((varItem: any) => ({
                nome: varItem.nome,
                opcao: varItem.opcao,
                tipo_acrescimo: varItem.tipo_acrescimo || 'VALOR',
                valor_acrescimo: varItem.valor_acrescimo || 0
              }))
            } : undefined
          },
          include: {
            imagens: true,
            variacoes: true
          }
        });
      });

      res.json(produto);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/produtos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Cascade delete is handled by Prisma schema (onDelete: Cascade)
      await prisma.produto.delete({
        where: { id: Number(id) }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /api/produtos/upload
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }
      
      const url = `/uploads/produtos/${req.file.filename}`;
      res.json({ url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
