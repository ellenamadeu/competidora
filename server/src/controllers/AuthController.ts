import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'competidora-jwt-secret-key-2026';

export class AuthController {
  // POST /api/auth/login
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Por favor, preencha usuário e senha.' 
        });
      }

      const trimmedUsername = String(username).trim();
      const trimmedPassword = String(password).trim();

      // Busca funcionário pelo login
      const rows: any[] = await prisma.$queryRawUnsafe(
        'SELECT id_funcionario, login, senha, acesso, nome, sobrenome, status FROM orc_funcionarios WHERE login = ? LIMIT 1',
        trimmedUsername
      );

      if (rows.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuário ou senha incorretos.' 
        });
      }

      const user = rows[0];

      // Verifica se o usuário está ativo (status = 1)
      if (Number(user.status) !== 1) {
        return res.status(403).json({ 
          success: false, 
          message: 'Acesso negado. Usuário inativo.' 
        });
      }

      // Verifica a senha bcrypt
      if (!user.senha) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuário ou senha incorretos.' 
        });
      }

      // Suporta tanto hashes bcrypt quanto texto plano (caso inserido diretamente no banco)
      const isBcrypt = user.senha.startsWith('$');
      let passwordMatch = false;

      if (isBcrypt) {
        // Corrige compatibilidade: bcryptjs não suporta o prefixo $2y$ (comum no PHP).
        // Substituímos por $2a$ que é funcionalmente idêntico e suportado pelo bcryptjs.
        const hashToCompare = user.senha.replace(/^\$2y\$/, '$2a$');
        passwordMatch = bcryptjs.compareSync(trimmedPassword, hashToCompare);
      } else {
        passwordMatch = (trimmedPassword === user.senha);
      }

      if (!passwordMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuário ou senha incorretos.' 
        });
      }

      // Login sucesso - Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id_funcionario, 
          login: user.login, 
          nome: user.nome, 
          acesso: String(user.acesso) 
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login realizado com sucesso! Redirecionando...',
        token,
        user: {
          id: user.id_funcionario,
          login: user.login,
          nome: user.nome,
          sobrenome: user.sobrenome,
          acesso: String(user.acesso)
        }
      });

    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor.' 
      });
    }
  }

  // GET /api/auth/me
  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado.' });
      }

      // Busca dados frescos do usuário
      const rows: any[] = await prisma.$queryRawUnsafe(
        'SELECT id_funcionario, login, acesso, nome, sobrenome, status FROM orc_funcionarios WHERE id_funcionario = ? LIMIT 1',
        req.user.id
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const user = rows[0];

      if (Number(user.status) !== 1) {
        return res.status(403).json({ error: 'Usuário inativo.' });
      }

      return res.json({
        id: user.id_funcionario,
        login: user.login,
        nome: user.nome,
        sobrenome: user.sobrenome,
        acesso: String(user.acesso)
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}
