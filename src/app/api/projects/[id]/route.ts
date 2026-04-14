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

    // Purge cache for home and admin to ensure changes reflect immediately
    revalidatePath('/');
    revalidatePath('/admin');

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
    // Use delete instead of deleteMany for a direct single-record operation
    await prisma.project.delete({
      where: { id },
    });

    // Revalidate targeted paths so the frontend reflects the deletion
    revalidatePath('/', 'page');
    revalidatePath('/admin', 'page');

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting project:', error);

    // Handle Prisma "record not found" error specifically
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Không tìm thấy dự án để xóa (ID không tồn tại)' }, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Lỗi hệ thống khi xóa dự án',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
