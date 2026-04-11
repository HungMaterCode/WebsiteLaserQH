import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.posts.deleteMany({
    where: {
      id: ''
    }
  });
  console.log(`Successfully deleted ${result.count} posts with empty IDs.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
