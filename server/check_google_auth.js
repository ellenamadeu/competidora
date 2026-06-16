const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const authRecord = await prisma.googleAuth.findUnique({
      where: { id: 1 }
    });
    console.log('GoogleAuth record:', JSON.stringify(authRecord, null, 2));
    
    // Check if googleAuth is a known model correctly
    console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_')));

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
