import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });
    return NextResponse.json(settings?.data || {});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const settings = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: { data },
      create: { id: 'global', data },
    });

    // Manually purge cache so changes appear instantly on Vercel across all pages
    revalidatePath('/', 'layout');
    
    return NextResponse.json(settings.data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
