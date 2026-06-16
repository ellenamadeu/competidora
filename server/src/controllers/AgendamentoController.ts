import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class AgendamentoController {
  static async listarPorData(req: Request, res: Response) {
    const { date, show_all, responsavel, os, status } = req.query;

    try {
      let query = `
        SELECT 
            a.id_agendamento,
            a.data_agendamento,
            ah.hora AS hora_agendamento_nome,
            ao.ordem AS ordem_nome,
            f.nome AS responsavel_nome, 
            a.responsavel AS id_responsavel,
            a.instrucao,
            a.status_agendamento,
            p.id_pedido,
            p.titulo AS pedido_titulo,
            c.nome AS cliente_nome_pedido,
            c.bairro
        FROM 
            agendamento a
        LEFT JOIN
            agendamento_hora ah ON a.hora_agendamento = ah.id_aghora
        LEFT JOIN
            agendamento_ordem ao ON a.ordem = ao.id_ordem
        LEFT JOIN
            orc_funcionarios AS f ON a.responsavel = f.id_funcionario 
        LEFT JOIN
            pedidos p ON a.id_pedido = p.id_pedido
        LEFT JOIN
            clientes c ON p.id_cliente = c.id_cliente
        WHERE 1=1
      `;

      const params: any[] = [];

      if (show_all !== 'true') {
        const targetDate = date ? String(date) : new Date().toISOString().split('T')[0];
        query += ` AND a.data_agendamento = ?`;
        params.push(targetDate);
      }

      if (responsavel) {
        query += ` AND a.responsavel = ?`;
        params.push(Number(responsavel));
      }

      if (os) {
        query += ` AND a.ordem = ?`;
        params.push(Number(os));
      }

      if (status !== undefined && status !== '') {
        query += ` AND a.status_agendamento = ?`;
        params.push(Number(status));
      }

      query += ` ORDER BY f.nome ASC, a.data_agendamento DESC, ah.hora ASC`;

      const agendamentos = await prisma.$queryRawUnsafe(query, ...params);
      res.json(agendamentos);
    } catch (error: any) {
      console.error('Erro ao listar agendamentos:', error);
      res.status(500).json({ error: 'Erro interno ao listar agendamentos', details: error.message });
    }
  }

  static async criar(req: Request, res: Response) {
    const { id_pedido, data_agendamento, hora_agendamento, ordem, responsavel, instrucao, status_agendamento } = req.body;

    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO agendamento (id_pedido, data_agendamento, hora_agendamento, ordem, responsavel, instrucao, status_agendamento)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        Number(id_pedido),
        data_agendamento ? new Date(data_agendamento) : null,
        Number(hora_agendamento),
        Number(ordem),
        Number(responsavel),
        instrucao,
        Number(status_agendamento || 0)
      );

      res.status(201).json({ success: true, message: 'Agendamento criado com sucesso' });
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({ success: false, error: 'Erro ao criar agendamento', details: error.message });
    }
  }

  static async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { data_agendamento, hora_agendamento, ordem, responsavel, instrucao, status_agendamento } = req.body;

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE agendamento SET
          data_agendamento = ?,
          hora_agendamento = ?,
          ordem = ?,
          responsavel = ?,
          instrucao = ?,
          status_agendamento = ?
         WHERE id_agendamento = ?`,
        data_agendamento ? new Date(data_agendamento) : null,
        Number(hora_agendamento),
        Number(ordem),
        Number(responsavel),
        instrucao,
        Number(status_agendamento),
        Number(id)
      );

      res.json({ success: true, message: 'Agendamento atualizado com sucesso' });
    } catch (error: any) {
      console.error('Erro ao atualizar agendamento:', error);
      res.status(500).json({ success: false, error: 'Erro ao atualizar agendamento', details: error.message });
    }
  }

  static async excluir(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.$executeRawUnsafe('DELETE FROM agendamento WHERE id_agendamento = ?', Number(id));

      res.json({ success: true, message: 'Agendamento excluído com sucesso' });
    } catch (error: any) {
      console.error('Erro ao excluir agendamento:', error);
      res.status(500).json({ success: false, error: 'Erro ao excluir agendamento', details: error.message });
    }
  }

  static async alternarStatus(req: Request, res: Response) {
    const { id_agendamento, status } = req.body;

    try {
      await prisma.$executeRawUnsafe('UPDATE agendamento SET status_agendamento = ? WHERE id_agendamento = ?', Number(status), Number(id_agendamento));

      res.json({ success: true, message: 'Status atualizado com sucesso' });
    } catch (error: any) {
      console.error('Erro ao alternar status do agendamento:', error);
      res.status(500).json({ success: false, error: 'Erro ao alternar status', details: error.message });
    }
  }

  static async buscarOpcoes(req: Request, res: Response) {
    try {
      const [horas, ordens, funcionarios] = await Promise.all([
        prisma.$queryRawUnsafe('SELECT id_aghora AS id, hora FROM agendamento_hora ORDER BY id_aghora ASC'),
        prisma.$queryRawUnsafe('SELECT id_ordem AS id, ordem FROM agendamento_ordem ORDER BY id_ordem ASC'),
        prisma.$queryRawUnsafe('SELECT id_funcionario, nome FROM orc_funcionarios WHERE status = 1 ORDER BY nome ASC')
      ]);

      res.json({
        horas,
        ordens,
        funcionarios
      });
    } catch (error: any) {
      console.error('Erro ao buscar opções de agendamento:', error);
      // Retornar listas vazias se orc_funcionarios falhar por não existir
      res.status(500).json({ error: 'Erro ao buscar opções', details: error.message });
    }
  }

  static async listarPorPedido(req: Request, res: Response) {
    const { id_pedido } = req.params;

    try {
      const query = `
        SELECT 
            a.id_agendamento,
            a.data_agendamento,
            ah.hora AS hora_agendamento_nome,
            ao.ordem AS ordem_nome,
            f.nome AS responsavel_nome, 
            a.responsavel AS id_responsavel,
            a.instrucao,
            a.status_agendamento,
            a.hora_agendamento as hora_id,
            a.ordem as ordem_id
        FROM 
            agendamento a
        LEFT JOIN
            agendamento_hora ah ON a.hora_agendamento = ah.id_aghora
        LEFT JOIN
            agendamento_ordem ao ON a.ordem = ao.id_ordem
        LEFT JOIN
            orc_funcionarios AS f ON a.responsavel = f.id_funcionario 
        WHERE 
            a.id_pedido = ?
        ORDER BY 
            a.data_agendamento DESC, ah.hora ASC
      `;

      const agendamentos = await prisma.$queryRawUnsafe(query, Number(id_pedido));
      res.json(agendamentos);
    } catch (error: any) {
      console.error('Erro ao listar agendamentos do pedido:', error);
      res.status(500).json({ error: 'Erro interno ao listar agendamentos', details: error.message });
    }
  }
}
