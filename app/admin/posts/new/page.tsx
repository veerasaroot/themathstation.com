import { createServerSupabaseClient } from '@/utils/supabase-server';
import { Category, Author } from '@/utils/supabase';
import PostForm from '@/components/admin/PostForm';

async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  return data || [];
}

async function getAuthors(): Promise<Author[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('authors')
    .select('*')
    .order('name');
  
  return data || [];
}

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">สร้างบทความใหม่</h1>
        <p className="text-gray-600 dark:text-gray-300">
          เพิ่มบทความใหม่ลงในเว็บไซต์
        </p>
      </div>
      
      <PostForm 
        categories={categories} 
        authors={authors} 
        initialData={null} 
      />
    </div>
  );
}