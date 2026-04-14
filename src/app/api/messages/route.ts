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
        status: 'unread',
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
