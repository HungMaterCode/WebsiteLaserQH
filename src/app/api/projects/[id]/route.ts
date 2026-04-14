import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// PATCH update project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const project = await prisma.project.update({
      where: { id },
      data,
    });

    // Purge cache for the entire site to ensure changes reflect globally
    revalidatePath('/', 'layout');

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await prisma.project.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Không tìm thấy dự án để xóa' }, { status: 404 });
    }

    // Purge cache for the entire site
    revalidatePath('/', 'layout');

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Lỗi hệ thống khi xóa dự án',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
