import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class CaixaController {
  // GET /api/caixa/stats
  static async getStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      
      const now = new Date();
      // Padrão: início do mês atual até fim do mês atual
      const start = start_date ? String(start_date) : new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const end = end_date ? String(end_date) : new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // 1. Total de Entradas
      const totalEntradasResult: any[] = await prisma.$queryRaw`
        SELECT SUM(valor) as total 
        FROM caixa_entrada 
        WHERE DATE(data) BETWEEN ${start} AND ${end}
      `;
      const totalEntradas = parseFloat(totalEntradasResult[0]?.total || 0);

      // 2. Total de Saídas (Despesas)
      const totalSaidasResult: any[] = await prisma.$queryRaw`
        SELECT SUM(valor) as total 
        FROM financeiro_despesas 
        WHERE data_pagamento BETWEEN ${start} AND ${end}
      `;
      const totalSaidas = parseFloat(totalSaidasResult[0]?.total || 0);

      // 3. Entradas por dia para gráfico
      const chartEntradas: any[] = await prisma.$queryRaw`
        SELECT DATE(data) as dia, SUM(valor) as total 
        FROM caixa_entrada 
        WHERE DATE(data) BETWEEN ${start} AND ${end} 
        GROUP BY DATE(data) 
        ORDER BY dia ASC
      `;

      // 4. Saídas por dia para gráfico
      const chartSaidas: any[] = await prisma.$queryRaw`
        SELECT data_pagamento as dia, SUM(valor) as total 
        FROM financeiro_despesas 
        WHERE data_pagamento BETWEEN ${start} AND ${end} 
        GROUP BY data_pagamento 
        ORDER BY dia ASC
      `;

      // 5. Extrato Recente (Logs Combinados)
      const logsEntradas: any[] = await prisma.$queryRaw`
        SELECT id_caixa_entrada as id, 'entrada' as tipo, data, valor, 
               (SELECT titulo FROM pedidos WHERE id_pedido = ce.id_pedido) as descricao
        FROM caixa_entrada ce
        WHERE DATE(data) BETWEEN ${start} AND ${end}
        ORDER BY data DESC LIMIT 50
      `;

      const logsSaidas: any[] = await prisma.$queryRaw`
        SELECT id, 'saida' as tipo, data_pagamento as data, valor, descricao
        FROM financeiro_despesas
        WHERE data_pagamento BETWEEN ${start} AND ${end}
        ORDER BY data_pagamento DESC LIMIT 50
      `;

      // Mesclar e ordenar logs por data decrescente
      const allLogs = [
        ...logsEntradas.map(e => ({
          id: e.id.toString(),
          tipo: 'entrada',
          data: e.data,
          valor: parseFloat(e.valor || 0),
          descricao: e.descricao || 'Receita de Pedido'
        })),
        ...logsSaidas.map(s => ({
          id: s.id.toString(),
          tipo: 'saida',
          data: s.data,
          valor: parseFloat(s.valor || 0),
          descricao: s.descricao || 'Despesa Geral'
        }))
      ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      // 6. Despesas por Categoria
      const despesasCategoria: any[] = await prisma.$queryRaw`
        SELECT 
            COALESCE(fc.categoria, 'Sem Categoria') as categoria,
            SUM(fd.valor) as total
        FROM financeiro_despesas fd
        JOIN fornecedores f ON fd.id_fornecedor = f.id_fornecedor
        LEFT JOIN fornecedor_categoria fc ON f.categoria = fc.id_categorias
        WHERE fd.data_pagamento BETWEEN ${start} AND ${end}
        GROUP BY fc.categoria
        ORDER BY total DESC
      `;

      // 7. Evolução Mensal (Últimos 12 meses)
      const yearlyEvolution = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const monthRef = `${year}-${month}`; // Formato YYYY-MM

        // Receitas do mês
        const recResult: any[] = await prisma.$queryRawUnsafe(
          "SELECT SUM(valor) as total FROM caixa_entrada WHERE DATE_FORMAT(data, '%Y-%m') = ?", 
          monthRef
        );
        const recVal = parseFloat(recResult[0]?.total || 0);

        // Despesas do mês
        const despResult: any[] = await prisma.$queryRawUnsafe(
          "SELECT SUM(valor) as total FROM financeiro_despesas WHERE DATE_FORMAT(data_pagamento, '%Y-%m') = ?", 
          monthRef
        );
        const despVal = parseFloat(despResult[0]?.total || 0);

        // Nome formatado para exibição (ex: Jun/26)
        const monthLabel = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

        yearlyEvolution.push({
          mes: monthLabel,
          receita: recVal,
          despesa: despVal
        });
      }

      res.json({
        summary: {
          entradas: totalEntradas,
          saidas: totalSaidas,
          saldo: totalEntradas - totalSaidas
        },
        chart: {
          entradas: chartEntradas.map(e => ({
            dia: e.dia instanceof Date ? e.dia.toISOString().split('T')[0] : String(e.dia),
            total: parseFloat(e.total || 0)
          })),
          saidas: chartSaidas.map(s => ({
            dia: s.dia instanceof Date ? s.dia.toISOString().split('T')[0] : String(s.dia),
            total: parseFloat(s.total || 0)
          }))
        },
        recent_transactions: allLogs.slice(0, 100),
        by_category: despesasCategoria.map(c => ({
          categoria: c.categoria,
          total: parseFloat(c.total || 0)
        })),
        yearly_evolution: yearlyEvolution
      });

    } catch (error: any) {
      console.error('Erro no CaixaController:', error);
      res.status(500).json({ error: error.message || 'Erro interno ao processar dados de caixa' });
    }
  }
}
