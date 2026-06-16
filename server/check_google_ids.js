const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const clientsWithGoogleId = await prisma.cliente.findMany({
      where: {
        google_id: { not: null }
      },
      select: {
        id: true,
        nome: true,
        google_id: true
      }
    });

    console.log('Clients with Google ID:', JSON.stringify(clientsWithGoogleId, null, 2));
    
    const count = await prisma.cliente.count();
    console.log('Total clients:', count);

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
