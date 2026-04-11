import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all stats in parallel
    // Fetch all accurate counts and recent items in parallel
    const [
      totalProjects,
      totalMessages,
      unreadMessagesCount,
      totalPosts,
      publishedPostsCount,
      draftPostsCount,
      megaCount,
      mediumCount,
      vipCount,
      recentProjects,
      recentMessages,
      recentPosts,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.message.count(),
      prisma.message.count({ where: { status: 'unread' } }),
      prisma.posts.count(),
      prisma.posts.count({ where: { status: 'published' } }),
      prisma.posts.count({ where: { status: 'draft' } }),
      prisma.project.count({ where: { category: 'mega' } }),
      prisma.project.count({ where: { category: 'medium' } }),
      prisma.project.count({ where: { category: 'vip' } }),
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          categoryLabel: true,
          location: true,
          year: true,
          thumbnailImage: true,
          color: true,
        },
      }),
      prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.posts.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          author: true,
          coverImage: true,
          excerpt: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalProjects,
        categories: {
          mega: megaCount,
          medium: mediumCount,
          vip: vipCount,
        },
        totalMessages,
        unreadMessages: unreadMessagesCount,
        totalPosts,
        publishedPosts: publishedPostsCount,
        draftPosts: draftPostsCount,
      },
      recentProjects,
      recentMessages,
      recentPosts,
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
