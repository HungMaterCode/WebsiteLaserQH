const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
    console.log(JSON.stringify(s, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
