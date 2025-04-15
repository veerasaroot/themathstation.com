import { createServerSupabaseClient } from '@/utils/supabase-server';
import { Category } from '@/utils/supabase';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  return data;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategory(params.id);
  
  if (!category) {
    notFound();
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">แก้ไขหมวดหมู่</h1>
        <p className="text-gray-600 dark:text-gray-300">
          แก้ไขข้อมูลของหมวดหมู่: {category.name}
        </p>
      </div>
      
      <CategoryForm initialData={category} />
    </div>
  );
}