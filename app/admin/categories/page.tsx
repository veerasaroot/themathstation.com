import { createServerSupabaseClient } from '@/utils/supabase-server';
import Link from 'next/link';
import CategoryList from '@/components/admin/CategoryList';

async function getCategories() {
  const supabase = await createServerSupabaseClient();
  
  // Get categories with post counts
  const { data } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      posts:posts(count)
    `)
    .order('name');
  
  // Transform the data to include post count
  return data?.map((category) => ({
    ...category,
    post_count: Array.isArray(category.posts) ? category.posts.length : 0,
  })) || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-dbhelvetica-bd text-2xl">หมวดหมู่</h1>
          <p className="text-gray-600 dark:text-gray-300">
            จัดการหมวดหมู่บทความ
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-primary text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
        >
          เพิ่มหมวดหมู่ใหม่
        </Link>
      </div>
      
      <CategoryList initialCategories={categories} />
    </div>
  );
}