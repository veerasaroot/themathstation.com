import { createServerSupabaseClient } from '@/utils/supabase-server';
import { Category, Author, BlogPost } from '@/utils/supabase';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

async function getPost(id: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  
  return data;
}

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

export default async function EditPostPage({ params }: EditPostPageProps) {
  const [post, categories, authors] = await Promise.all([
    getPost(params.id),
    getCategories(),
    getAuthors(),
  ]);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">แก้ไขบทความ</h1>
        <p className="text-gray-600 dark:text-gray-300">
          แก้ไขรายละเอียดของบทความ
        </p>
      </div>
      
      <PostForm 
        categories={categories} 
        authors={authors} 
        initialData={post} 
      />
    </div>
  );
}