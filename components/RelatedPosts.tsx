import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/utils/supabase';
import { formatDate } from '@/utils/date';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group block card overflow-hidden h-full"
        >
          <div className="relative aspect-[3/2]">
            <Image
              src={post.featured_image || '/images/post-placeholder.jpg'}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {formatDate(post.created_at)}
            </div>
            <h3 className="font-dbhelvetica-med text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}