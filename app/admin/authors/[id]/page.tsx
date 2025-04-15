import { createServerSupabaseClient } from '@/utils/supabase-server';
import { Author } from '@/utils/supabase';
import AuthorForm from '@/components/admin/AuthorForm';
import { notFound } from 'next/navigation';

interface EditAuthorPageProps {
  params: {
    id: string;
  };
}

async function getAuthor(id: string): Promise<Author | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();
  
  return data;
}

export default async function EditAuthorPage({ params }: EditAuthorPageProps) {
  const author = await getAuthor(params.id);
  
  if (!author) {
    notFound();
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">แก้ไขผู้เขียน</h1>
        <p className="text-gray-600 dark:text-gray-300">
          แก้ไขข้อมูลของผู้เขียน: {author.name}
        </p>
      </div>
      
      <AuthorForm initialData={author} />
    </div>
  );
}