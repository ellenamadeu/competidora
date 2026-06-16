import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const data = {
      nome: 'Teste Frontend',
      email: '',
      endereco: 'Rua Teste 2',
      bairro: '',
      cep: '',
      documento: '',
      observacoes: '',
      ddd: 21,
      telefone: '(21) 98888-7777'
    };
    const cliente = await prisma.cliente.create({ data });
    console.log('Sucesso:', cliente);
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
