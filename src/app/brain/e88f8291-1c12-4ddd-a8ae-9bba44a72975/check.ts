import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const s = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
  console.log('Site Settings in DB:', JSON.stringify(s?.data, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
