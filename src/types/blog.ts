export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: string;
  status: 'draft' | 'published';
  tags?: string[];
}
