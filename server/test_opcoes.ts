import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing /api/agendamentos/opcoes logic...');
    
    console.log('Fetching horas...');
    const horas = await prisma.agendamentoHora.findMany({ orderBy: { id: 'asc' } });
    console.log('Horas count:', horas.length);

    console.log('Fetching ordens...');
    const ordens = await prisma.agendamentoOrdem.findMany({ orderBy: { id: 'asc' } });
    console.log('Ordens count:', ordens.length);

    console.log('Fetching funcionarios...');
    const funcionarios = await prisma.$queryRawUnsafe('SELECT id_funcionario, nome FROM orc_funcionarios WHERE status = 1 ORDER BY nome ASC');
    console.log('Funcionarios count:', (funcionarios as any[]).length);

    console.log('All queries passed!');
  } catch (err: any) {
    console.error('TEST FAILED:', err.message);
    if (err.code) console.error('Error Code:', err.code);
  } finally {
    await prisma.$disconnect();
  }
}

test();
