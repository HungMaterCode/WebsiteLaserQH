import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { 
  findCloudinaryUrls, 
  findR2VideoUrls, 
  deleteCloudinaryImage, 
  deleteR2Video,
  cleanupProjectMedia
} from '@/lib/mediaCleanup';

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

    // 1. Lấy dữ liệu cũ để so sánh dọn dẹp media
    const oldProject = await prisma.project.findUnique({
      where: { id },
      select: {
        fullDescription: true,
        heroImage: true,
        thumbnailImage: true,
        overviewVideoUrl: true,
      }
    });

    // 2. Thực hiện cập nhật database
    const project = await prisma.project.update({
      where: { id },
      data,
    });

    // 3. Dọn dẹp media (chạy ngầm sau khi update thành công)
    if (oldProject) {
      const cleanupRemovedMedia = async () => {
        const deletePromises: Promise<void>[] = [];

        // So sánh Hero Image
        if (oldProject.heroImage && data.heroImage && oldProject.heroImage !== data.heroImage) {
          deletePromises.push(deleteCloudinaryImage(oldProject.heroImage));
        }

        // So sánh Thumbnail
        if (oldProject.thumbnailImage && data.thumbnailImage && oldProject.thumbnailImage !== data.thumbnailImage) {
          deletePromises.push(deleteCloudinaryImage(oldProject.thumbnailImage));
        }

        // So sánh Video tổng quan
        if (oldProject.overviewVideoUrl && data.overviewVideoUrl && oldProject.overviewVideoUrl !== data.overviewVideoUrl) {
          deletePromises.push(deleteR2Video(oldProject.overviewVideoUrl));
        }

        // So sánh Nội dung Rich Text (fullDescription)
        if (oldProject.fullDescription && data.fullDescription && oldProject.fullDescription !== data.fullDescription) {
          const oldCloudinary = findCloudinaryUrls(oldProject.fullDescription);
          const newCloudinary = findCloudinaryUrls(data.fullDescription);
          const removedCloudinary = oldCloudinary.filter(url => !newCloudinary.includes(url));
          
          for (const url of removedCloudinary) {
            deletePromises.push(deleteCloudinaryImage(url));
          }

          const oldR2 = findR2VideoUrls(oldProject.fullDescription);
          const newR2 = findR2VideoUrls(data.fullDescription);
          const removedR2 = oldR2.filter(url => !newR2.includes(url));

          for (const url of removedR2) {
            deletePromises.push(deleteR2Video(url));
          }
        }

        if (deletePromises.length > 0) {
          console.log(`[Project Update] Đang dọn dẹp ${deletePromises.length} media bị gỡ bỏ...`);
          await Promise.allSettled(deletePromises);
        }
      };

      cleanupRemovedMedia().catch(e => console.error('[Cleanup Update] Lỗi:', e.message));
    }

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
    // Lấy thông tin project trước khi xóa để biết media cần dọn
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        thumbnailImage: true,
        heroImage: true,
        fullDescription: true,
        overviewVideoUrl: true,
      },
    });

    // Xóa project khỏi database
    await prisma.project.delete({
      where: { id },
    });

    // Dọn dẹp media trên Cloudinary & R2 (chạy ngầm, không chặn response)
    if (project) {
      cleanupProjectMedia(project).catch((e) => {
        console.error('[Cleanup] Lỗi khi dọn media:', e.message);
      });
    }

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
