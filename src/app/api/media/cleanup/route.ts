import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.mediaSetting.findUnique({
      where: { id: 'global' },
    });

    if (settings && settings.data) {
      const newData = { ...(settings.data as any) };
      delete newData.heroVideoUrl;
      delete newData.heroVideoEnabled;

      await prisma.mediaSetting.update({
        where: { id: 'global' },
        data: { data: newData },
      });
      
      return NextResponse.json({ message: 'Cleaned up successfully' });
    }
    return NextResponse.json({ message: 'No data found' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
