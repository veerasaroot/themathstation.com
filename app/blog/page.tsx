// app/blog/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase-server';
import { BlogPost, Category } from '@/utils/supabase';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
  };
}

async function getBlogPosts(page = 1, categoryId?: string): Promise<{ posts: BlogPost[]; total: number }> {
  const supabase = await createServerSupabaseClient();
  const pageSize = 9;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(start, end);
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, count, error } = await query;
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], total: 0 };
  }
  
  return { posts: data || [], total: count || 0 };
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  return data || [];
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const categoryId = searchParams.category;
  
  const [postsData, categories] = await Promise.all([
    getBlogPosts(page, categoryId),
    getCategories(),
  ]);
  
  const { posts, total } = postsData;
  const pageSize = 9;
  const totalPages = Math.ceil(total / pageSize);
  
  const selectedCategory = categoryId
    ? categories.find((cat) => cat.id === categoryId)
    : undefined;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-dbhelvetica-bd text-4xl mb-3">บทความคณิตศาสตร์</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          รวมบทความเกี่ยวกับคณิตศาสตร์และการเขียนโค้ด ที่จะช่วยให้คุณเข้าใจและประยุกต์ใช้ได้อย่างมีประสิทธิภาพ
        </p>
      </div>
      
      {/* Categories Filter */}
      <CategoryFilter 
        categories={categories} 
        selectedCategoryId={categoryId} 
      />
      
      {/* Selected Category Title */}
      {selectedCategory && (
        <div className="mb-8">
          <h2 className="font-dbhelvetica-bd text-2xl mb-2">
            หมวดหมู่: {selectedCategory.name}
          </h2>
          {selectedCategory.description && (
            <p className="text-gray-600 dark:text-gray-300">
              {selectedCategory.description}
            </p>
          )}
        </div>
      )}
      
      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="font-dbhelvetica-med text-xl mb-2">
            ไม่พบบทความในหมวดหมู่นี้
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            กรุณาเลือกหมวดหมู่อื่น หรือดูบทความทั้งหมด
          </p>
          <Link href="/blog" className="btn btn-primary">
            ดูบทความทั้งหมด
          </Link>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/blog${categoryId ? `?category=${categoryId}&` : '?'}`}
          />
        </div>
      )}
    </div>
  );
}
