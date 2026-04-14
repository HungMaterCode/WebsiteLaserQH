import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    
    // Check rate limit: 5 messages per 24 hours per IP
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessagesCount = await prisma.message.count({
      where: {
        ip,
        createdAt: { gte: twentyFourHoursAgo }
      }
    });

    if (recentMessagesCount >= 5) {
      return NextResponse.json({ 
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Bạn đã đạt giới hạn gửi yêu cầu trong ngày. Vui lòng thử lại sau.' 
      }, { status: 429 });
    }

    // Basic validation
    if (!data.name || !data.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        eventType: data.eventType || null,
        size: data.size || null,
        budget: data.budget || null,
        date: data.date || null,
        notes: data.message || null, // Map frontend 'message' to DB 'notes'
        ip,
        status: 'unread',
        createdAt: new Date(),
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
