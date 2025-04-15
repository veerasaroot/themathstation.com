import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/date';
import { BlogPost } from '@/utils/supabase';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const imageUrl = post.featured_image || '/images/post-placeholder.jpg';
  
  return (
    <article 
      className={`card group transition-all duration-300 h-full flex flex-col ${
        featured ? 'md:col-span-2 lg:col-span-3' : ''
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative">
        <div className={`relative ${featured ? 'aspect-[2/1]' : 'aspect-[3/2]'}`}>
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-white text-sm font-dbhelvetica-med px-3 py-1 rounded-full">
              บทความแนะนำ
            </span>
          </div>
        )}
      </Link>
      
      <div className="flex-1 p-5 flex flex-col">
        <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{formatDate(post.created_at)}</span>
          {post.category_id && (
            <>
              <span className="mx-2">•</span>
              <Link
                href={`/categories/${post.category_id}`}
                className="hover:text-primary transition-colors"
              >
                แคลคูลัส
              </Link>
            </>
          )}
        </div>
        
        <h3 className="font-dbhelvetica-bd text-xl mb-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {post.excerpt}
        </p>
        
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center font-dbhelvetica-med text-primary hover:text-primary-600 transition-colors"
        >
          อ่านเพิ่มเติม
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
