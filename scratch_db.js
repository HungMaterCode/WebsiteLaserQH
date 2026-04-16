const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    const postCount = await prisma.posts.count();
    console.log(`\n--- POSTS TABLE ---`);
    console.log(`Total rows: ${postCount}`);

    if (postCount > 0) {
      const posts = await prisma.posts.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      console.log('Recent 5 entries:');
      console.log(JSON.stringify(posts, null, 2));
    }

    const projectCount = await prisma.project.count();
    console.log(`\n--- PROJECTS TABLE ---`);
    console.log(`Total rows: ${projectCount}`);

    if (projectCount > 0) {
      const projects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      console.log('Recent 5 entries:');
      console.log(JSON.stringify(projects, null, 2));
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
