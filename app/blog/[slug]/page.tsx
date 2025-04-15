// app/blog/[slug]/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase-server';
import { BlogPost, Author, Category } from '@/utils/supabase';
import { formatDate } from '@/utils/date';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';
import RelatedPosts from '@/components/RelatedPosts';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Function to increment view count
async function incrementViewCount(postId: string) {
  const supabase = await createServerSupabaseClient();
  await supabase.rpc('increment_post_view', { post_id: postId });
}

// Function to get a single blog post by slug
async function getBlogPost(slug: string): Promise<{
  post: BlogPost | null;
  author: Author | null;
  category: Category | null;
}> {
  const supabase = await createServerSupabaseClient();
  
  // Fetch the post
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (!post) {
    return { post: null, author: null, category: null };
  }
  
  // Increment view count
  await incrementViewCount(post.id);
  
  // Fetch the author
  const { data: author } = await supabase
    .from('authors')
    .select('*')
    .eq('id', post.author_id)
    .single();
  
  // Fetch the category if it exists
  let category = null;
  if (post.category_id) {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('id', post.category_id)
      .single();
    category = data;
  }
  
  return { post, author, category };
}

// Function to get related posts
async function getRelatedPosts(postId: string, categoryId: string | undefined, limit = 3): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .neq('id', postId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data } = await query;
  return data || [];
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // แก้ไขให้ await params ก่อนใช้งาน
  const slug = params.slug;
  const { post, author, category } = await getBlogPost(slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await getRelatedPosts(post.id, post.category_id);
  
  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Category and date */}
        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          {category && (
            <Link
              href={`/blog?category=${category.id}`}
              className="mr-2 bg-primary-50 dark:bg-primary-900/30 text-primary px-2 py-1 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
            >
              {category.name}
            </Link>
          )}
          <span>{formatDate(post.created_at)}</span>
        </div>
        
        {/* Title */}
        <h1 className="font-dbhelvetica-bd text-3xl md:text-4xl mb-6">{post.title}</h1>
        
        {/* Author */}
        {author && (
          <div className="flex items-center mb-8">
            <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-gray-700">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xl font-dbhelvetica-bd text-gray-500">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="font-dbhelvetica-med">{author.name}</div>
              {author.bio && (
                <div className="text-sm text-gray-600 dark:text-gray-300">{author.bio}</div>
              )}
            </div>
          </div>
        )}
        
        {/* Featured image */}
        {post.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              width={900}
              height={500}
              className="w-full h-auto"
            />
          </div>
        )}
        
        {/* Share buttons for desktop */}
        <div className="hidden md:block">
          <ShareButtons post={post} />
        </div>
        
        {/* Table of contents */}
        <TableOfContents content={post.content} />
        
        {/* Content */}
        <div className="mt-8">
          <MarkdownRenderer content={post.content} className="blog-content" />
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Share buttons for mobile */}
        <div className="mt-8 md:hidden">
          <ShareButtons post={post} />
        </div>
        
        {/* Author bio (larger version) */}
        {author && author.bio && (
          <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4 bg-gray-200 dark:bg-gray-700">
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-dbhelvetica-bd text-gray-500">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-dbhelvetica-bd text-xl">เกี่ยวกับผู้เขียน</h3>
                <div className="font-dbhelvetica-med">{author.name}</div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{author.bio}</p>
          </div>
        )}
        
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-dbhelvetica-bd text-2xl mb-6">บทความที่เกี่ยวข้อง</h2>
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </div>
    </article>
  );
}