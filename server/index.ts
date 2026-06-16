import express from 'express';
import cors from 'cors';
import path from 'path';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Fix para BigInt JSON serialization
// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() };

app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  console.log(log.trim());
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'API Competidora v2.1 Online e Operante!' });
});

import categoriaRoutes from './src/routes/categoriaRoutes';
import produtoRoutes from './src/routes/produtoRoutes';
import clienteRoutes from './src/routes/clienteRoutes';
import googleRoutes from './src/routes/googleRoutes';
import pedidoRoutes from './src/routes/pedidoRoutes';
import agendamentoRoutes from './src/routes/agendamentoRoutes';
import caixaRoutes from './src/routes/caixaRoutes';
import despesaRoutes from './src/routes/despesaRoutes';
import fornecedorRoutes from './src/routes/fornecedorRoutes';
import funcionarioRoutes from './src/routes/funcionarioRoutes';
import authRoutes from './src/routes/authRoutes';
import { authMiddleware, requireLevel } from './src/middlewares/auth';

// Rotas públicas de autenticação (não passam pelo middleware global)
app.use('/api/auth', authRoutes);

// Middleware de autenticação global para a API
app.use('/api', authMiddleware as any);

app.use('/api/pedidos', pedidoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/fornecedores', fornecedorRoutes);

// Rotas restritas para Administradores (Nível 2)
app.use('/api/caixa', requireLevel(2) as any, caixaRoutes);
app.use('/api/funcionarios', requireLevel(2) as any, funcionarioRoutes);

// Trigger restart: 3
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
