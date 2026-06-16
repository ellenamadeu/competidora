import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'competidora-jwt-secret-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    login: string;
    nome: string;
    acesso: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Ignora autenticação para rotas públicas específicas
  const publicPaths = [
    '/api/auth/login',
    '/auth/login',
    '/api/google/callback',
    '/google/callback',
  ];

  // Regex para aceitar /api/pedidos/tracking/:id ou /pedidos/tracking/:id de forma pública
  const isPublic = publicPaths.includes(req.path) || 
                   /^\/api\/pedidos\/tracking\/[^/]+$/.test(req.path) || 
                   /^\/pedidos\/tracking\/[^/]+$/.test(req.path);

  if (isPublic) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Erro no token: formato inválido.' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: Number(decoded.id),
      login: decoded.login,
      nome: decoded.nome,
      acesso: String(decoded.acesso),
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token de autenticação inválido ou expirado.' });
  }
}

export function requireLevel(minLevel: number) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }
    const userLevel = Number(req.user.acesso || 0);
    if (userLevel < minLevel) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
}
