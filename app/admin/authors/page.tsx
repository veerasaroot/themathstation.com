import { createServerSupabaseClient } from '@/utils/supabase-server';
import Link from 'next/link';
import AuthorList from '@/components/admin/AuthorList';

async function getAuthors() {
  const supabase = await createServerSupabaseClient();
  
  // Get authors with post counts
  const { data } = await supabase
    .from('authors')
    .select(`
      id,
      name,
      email,
      avatar_url,
      bio,
      posts:posts(count)
    `)
    .order('name');
  
  // Transform the data to include post count
  return data?.map((author) => ({
    ...author,
    post_count: Array.isArray(author.posts) ? author.posts.length : 0,
  })) || [];
}

export default async function AuthorsPage() {
  const authors = await getAuthors();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-dbhelvetica-bd text-2xl">ผู้เขียน</h1>
          <p className="text-gray-600 dark:text-gray-300">
            จัดการผู้เขียนบทความ
          </p>
        </div>
        <Link
          href="/admin/authors/new"
          className="bg-primary text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
        >
          เพิ่มผู้เขียนใหม่
        </Link>
      </div>
      
      <AuthorList initialAuthors={authors} />
    </div>
  );
}