import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Database error in posts GET:', error);
    // Return empty array instead of 500 for development stability
    return NextResponse.json([]);
  }
}

// POST create post
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Auto-generate slug from title if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
      .slice(0, 50);

    const post = await prisma.post.create({
      data: {
        ...data,
        slug,
        tags: data.tags || [],
      },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
