import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import bcryptjs from 'bcryptjs';

export class FuncionarioController {
  // GET /api/funcionarios
  static async list(req: Request, res: Response) {
    try {
      const { q, status } = req.query;
      
      let sql = `
        SELECT id_funcionario as id, status, acesso, login, nome, sobrenome, 
               telefone1, telefone2, telefone3, endereco, bairro, data_nascimento, 
               filhos, rg, cpf, cat, pis, data_entrada, data_saida, 
               salario_beneficios, salario, funcao, observacoes
        FROM orc_funcionarios
        WHERE 1=1
      `;
      
      const params: any[] = [];

      if (q) {
        const searchTerm = `%${q}%`;
        sql += ` AND (nome LIKE ? OR sobrenome LIKE ? OR funcao LIKE ?)`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (status !== undefined && status !== 'all') {
        sql += ` AND status = ?`;
        params.push(Number(status));
      } else if (status === undefined) {
        // Por padrão, listar apenas ativos
        sql += ` AND status = 1`;
      }

      sql += ` ORDER BY nome ASC LIMIT 100`;

      const rows: any[] = await prisma.$queryRawUnsafe(sql, ...params);
      
      // Formatar floats
      const formatted = rows.map(r => ({
        ...r,
        salario: parseFloat(r.salario || 0),
        salario_beneficios: parseFloat(r.salario_beneficios || 0)
      }));

      res.json(formatted);
    } catch (error: any) {
      console.error('Erro ao listar funcionários:', error);
      res.status(500).json({ error: error.message || 'Erro ao listar funcionários' });
    }
  }

  // GET /api/funcionarios/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rows: any[] = await prisma.$queryRaw`
        SELECT id_funcionario as id, status, acesso, login, nome, sobrenome, 
               telefone1, telefone2, telefone3, endereco, bairro, data_nascimento, 
               filhos, rg, cpf, cat, pis, data_entrada, data_saida, 
               salario_beneficios, salario, funcao, observacoes
        FROM orc_funcionarios
        WHERE id_funcionario = ${Number(id)}
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      const r = rows[0];
      res.json({
        ...r,
        salario: parseFloat(r.salario || 0),
        salario_beneficios: parseFloat(r.salario_beneficios || 0)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/funcionarios
  static async create(req: Request, res: Response) {
    try {
      const { 
        nome, sobrenome, status, acesso, login, senha, telefone1, telefone2, telefone3,
        endereco, bairro, data_nascimento, filhos, rg, cpf, cat, pis, data_entrada,
        salario_beneficios, salario, funcao, observacoes 
      } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'O nome do funcionário é obrigatório.' });
      }

      const hashedSenha = senha ? bcryptjs.hashSync(String(senha).trim(), 10) : null;

      await prisma.$executeRaw`
        INSERT INTO orc_funcionarios (
          nome, sobrenome, status, acesso, login, senha, telefone1, telefone2, telefone3,
          endereco, bairro, data_nascimento, filhos, rg, cpf, cat, pis, data_entrada,
          salario_beneficios, salario, funcao, observacoes
        ) VALUES (
          ${nome}, ${sobrenome || null}, ${status !== undefined ? Number(status) : 1}, 
          ${acesso !== undefined ? Number(acesso) : 1}, ${login || null}, ${hashedSenha},
          ${telefone1 || null}, ${telefone2 || null}, ${telefone3 || null},
          ${endereco || null}, ${bairro || null}, ${data_nascimento || null}, 
          ${filhos ? Number(filhos) : 0}, ${rg || null}, ${cpf || null}, ${cat || null}, 
          ${pis || null}, ${data_entrada || null}, 
          ${salario_beneficios ? parseFloat(salario_beneficios) : 0}, 
          ${salario ? parseFloat(salario) : 0}, ${funcao || null}, ${observacoes || null}
        )
      `;

      const result: any[] = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
      const newId = result[0].id.toString();

      res.status(201).json({ id: newId, message: 'Funcionário cadastrado com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/funcionarios/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        nome, sobrenome, status, acesso, login, senha, telefone1, telefone2, telefone3,
        endereco, bairro, data_nascimento, filhos, rg, cpf, cat, pis, data_entrada, data_saida,
        salario_beneficios, salario, funcao, observacoes 
      } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'O nome do funcionário é obrigatório.' });
      }

      // Senha opcional
      if (senha) {
        const hashedSenha = bcryptjs.hashSync(String(senha).trim(), 10);
        await prisma.$executeRaw`
          UPDATE orc_funcionarios SET
            nome = ${nome}, sobrenome = ${sobrenome || null}, status = ${Number(status)}, 
            acesso = ${Number(acesso)}, login = ${login || null}, senha = ${hashedSenha},
            telefone1 = ${telefone1 || null}, telefone2 = ${telefone2 || null}, telefone3 = ${telefone3 || null},
            endereco = ${endereco || null}, bairro = ${bairro || null}, data_nascimento = ${data_nascimento || null}, 
            filhos = ${Number(filhos)}, rg = ${rg || null}, cpf = ${cpf || null}, cat = ${cat || null}, 
            pis = ${pis || null}, data_entrada = ${data_entrada || null}, data_saida = ${data_saida || null},
            salario_beneficios = ${parseFloat(salario_beneficios)}, salario = ${parseFloat(salario)}, 
            funcao = ${funcao || null}, observacoes = ${observacoes || null}
          WHERE id_funcionario = ${Number(id)}
        `;
      } else {
        await prisma.$executeRaw`
          UPDATE orc_funcionarios SET
            nome = ${nome}, sobrenome = ${sobrenome || null}, status = ${Number(status)}, 
            acesso = ${Number(acesso)}, login = ${login || null},
            telefone1 = ${telefone1 || null}, telefone2 = ${telefone2 || null}, telefone3 = ${telefone3 || null},
            endereco = ${endereco || null}, bairro = ${bairro || null}, data_nascimento = ${data_nascimento || null}, 
            filhos = ${Number(filhos)}, rg = ${rg || null}, cpf = ${cpf || null}, cat = ${cat || null}, 
            pis = ${pis || null}, data_entrada = ${data_entrada || null}, data_saida = ${data_saida || null},
            salario_beneficios = ${parseFloat(salario_beneficios)}, salario = ${parseFloat(salario)}, 
            funcao = ${funcao || null}, observacoes = ${observacoes || null}
          WHERE id_funcionario = ${Number(id)}
        `;
      }

      res.json({ message: 'Funcionário atualizado com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/funcionarios/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.$executeRaw`
        DELETE FROM orc_funcionarios WHERE id_funcionario = ${Number(id)}
      `;
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/funcionarios/:id/salarios
  static async listSalaries(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const salarios: any[] = await prisma.$queryRaw`
        SELECT id_salario as id, mes, ano, salario_base, salario_pago 
        FROM salarios 
        WHERE id_funcionario = ${Number(id)} 
        ORDER BY ano DESC, mes DESC
      `;

      const formatted = [];
      for (const s of salarios) {
        const itens: any[] = await prisma.$queryRaw`
          SELECT id_item as id, data, tipo, descricao, desconto, adicional 
          FROM salarios_itens 
          WHERE id_salario = ${Number(s.id)}
          ORDER BY data ASC
        `;
        
        formatted.push({
          id: s.id,
          mes: s.mes,
          ano: s.ano,
          salario_base: parseFloat(s.salario_base || 0),
          salario_pago: parseFloat(s.salario_pago || 0),
          itens: itens.map(i => ({
            id: i.id,
            data: i.data,
            tipo: i.tipo,
            descricao: i.descricao,
            desconto: parseFloat(i.desconto || 0),
            adicional: parseFloat(i.adicional || 0)
          }))
        });
      }

      res.json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/funcionarios/:id/salarios
  static async createSalaryRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { mes, ano, salario_base } = req.body;

      if (!mes || !ano || salario_base === undefined) {
        return res.status(400).json({ error: 'Campos mes, ano e salario_base são obrigatórios.' });
      }

      // Evitar duplicados no mesmo mês/ano
      const existing: any[] = await prisma.$queryRaw`
        SELECT id_salario FROM salarios 
        WHERE id_funcionario = ${Number(id)} AND mes = ${String(mes)} AND ano = ${String(ano)}
      `;

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Folha de pagamento já existente para este mês e ano.' });
      }

      await prisma.$executeRaw`
        INSERT INTO salarios (id_funcionario, mes, ano, salario_base, salario_pago)
        VALUES (${Number(id)}, ${String(mes)}, ${String(ano)}, ${parseFloat(salario_base)}, ${parseFloat(salario_base)})
      `;

      const result: any[] = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
      const newId = result[0].id.toString();

      res.status(201).json({ id: newId, message: 'Folha mensal de salário iniciada com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /api/funcionarios/salarios/:idSalario/itens
  static async addSalaryItem(req: Request, res: Response) {
    try {
      const { idSalario } = req.params;
      const { data, tipo, descricao, desconto, adicional } = req.body;

      if (desconto === undefined && adicional === undefined) {
        return res.status(400).json({ error: 'Deve-se informar um desconto ou adicional.' });
      }

      const dtStr = data || new Date().toISOString().split('T')[0];

      await prisma.$executeRaw`
        INSERT INTO salarios_itens (id_salario, data, tipo, descricao, desconto, adicional)
        VALUES (${Number(idSalario)}, ${dtStr}, ${tipo ? Number(tipo) : 1}, ${descricao || ''}, 
                ${desconto ? parseFloat(desconto) : 0}, ${adicional ? parseFloat(adicional) : 0})
      `;

      // Atualizar o salario_pago total na tabela salarios
      await FuncionarioController.recalculateSalaryTotal(Number(idSalario));

      res.status(201).json({ message: 'Lançamento salarial inserido com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/funcionarios/salarios-itens/:itemId
  static async deleteSalaryItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;

      const itemRows: any[] = await prisma.$queryRaw`
        SELECT id_salario FROM salarios_itens WHERE id_item = ${Number(itemId)}
      `;

      if (itemRows.length === 0) {
        return res.status(404).json({ error: 'Lançamento não encontrado.' });
      }

      const idSalario = itemRows[0].id_salario;

      await prisma.$executeRaw`
        DELETE FROM salarios_itens WHERE id_item = ${Number(itemId)}
      `;

      await FuncionarioController.recalculateSalaryTotal(idSalario);

      res.json({ message: 'Lançamento salarial removido com sucesso!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private static async recalculateSalaryTotal(idSalario: number) {
    // Pegar salario_base
    const salRows: any[] = await prisma.$queryRaw`
      SELECT salario_base FROM salarios WHERE id_salario = ${idSalario}
    `;
    if (salRows.length === 0) return;

    const base = parseFloat(salRows[0].salario_base || 0);

    // Somar adicionais e descontos
    const items: any[] = await prisma.$queryRaw`
      SELECT desconto, adicional FROM salarios_itens WHERE id_salario = ${idSalario}
    `;

    const totalAdicionais = items.reduce((acc, curr) => acc + parseFloat(curr.adicional || 0), 0);
    const totalDescontos = items.reduce((acc, curr) => acc + parseFloat(curr.desconto || 0), 0);

    const novoPago = base + totalAdicionais - totalDescontos;

    await prisma.$executeRaw`
      UPDATE salarios SET salario_pago = ${novoPago} WHERE id_salario = ${idSalario}
    `;
  }
}
