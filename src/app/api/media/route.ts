import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { defaultMediaSettings } from '@/lib/data';

export async function GET() {
  try {
    const settings = await prisma.mediaSetting.findUnique({
      where: { id: 'global' },
    });
    return NextResponse.json(settings?.data || defaultMediaSettings);
  } catch (error) {
    console.error('Database error in media GET:', error);
    return NextResponse.json(defaultMediaSettings || {});
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const settings = await prisma.mediaSetting.upsert({
      where: { id: 'global' },
      update: { data },
      create: { id: 'global', data },
    });
    return NextResponse.json(settings.data);
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
