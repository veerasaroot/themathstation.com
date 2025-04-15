import { createServerSupabaseClient } from '@/utils/supabase-server';
import Link from 'next/link';
import { formatDate } from '@/utils/date';

interface PostsPageProps {
  searchParams?: {
    page?: string;
    status?: string;
    category?: string;
    search?: string;
  };
}

async function getPosts(params: PostsPageProps['searchParams'] = {}) {
  const supabase = await createServerSupabaseClient();
  const page = params.page ? parseInt(params.page) : 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  let query = supabase
    .from('posts')
    .select(`
      id, 
      title, 
      slug, 
      created_at, 
      updated_at, 
      published, 
      view_count,
      category_id,
      author_id,
      categories(name),
      authors(name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);
  
  // Apply filters
  if (params.status === 'published') {
    query = query.eq('published', true);
  } else if (params.status === 'draft') {
    query = query.eq('published', false);
  }
  
  if (params.category) {
    query = query.eq('category_id', params.category);
  }
  
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`);
  }
  
  const { data: posts, count, error } = await query;
  
  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], count: 0 };
  }
  
  return { posts: posts || [], count: count || 0 };
}

async function getCategories() {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');
  
  return data || [];
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { posts, count } = await getPosts(searchParams);
  const categories = await getCategories();
  
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-dbhelvetica-bd text-2xl">บทความทั้งหมด</h1>
          <p className="text-gray-600 dark:text-gray-300">
            จัดการบทความของเว็บไซต์
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-primary text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors"
        >
          สร้างบทความใหม่
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-dbhelvetica-med mb-1">
              ค้นหา
            </label>
            <input
              id="search"
              type="text"
              name="search"
              placeholder="ชื่อบทความ..."
              defaultValue={searchParams?.search || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-dbhelvetica-med mb-1">
              สถานะ
            </label>
            <select
              id="status"
              name="status"
              defaultValue={searchParams?.status || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            >
              <option value="">ทั้งหมด</option>
              <option value="published">เผยแพร่แล้ว</option>
              <option value="draft">ฉบับร่าง</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-dbhelvetica-med mb-1">
              หมวดหมู่
            </label>
            <select
              id="category"
              name="category"
              defaultValue={searchParams?.category || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            >
              <option value="">ทั้งหมด</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-blue-700 transition-colors w-full"
            >
              ค้นหา
            </button>
          </div>
        </form>
      </div>
      
      {/* Posts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {posts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="py-3 px-6 text-left">ชื่อบทความ</th>
                    <th className="py-3 px-6 text-left">หมวดหมู่</th>
                    <th className="py-3 px-6 text-left">ผู้เขียน</th>
                    <th className="py-3 px-6 text-left">สถานะ</th>
                    <th className="py-3 px-6 text-left">วันที่สร้าง</th>
                    <th className="py-3 px-6 text-left">การเข้าชม</th>
                    <th className="py-3 px-6 text-left">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-6">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="hover:text-primary transition-colors font-dbhelvetica-med"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {post.categories?.name || '-'}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {post.authors?.name || '-'}
                      </td>
                      <td className="py-3 px-6">
                        {post.published ? (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs py-1 px-2 rounded-full">
                            เผยแพร่แล้ว
                          </span>
                        ) : (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-1 px-2 rounded-full">
                            ฉบับร่าง
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {post.view_count || 0} ครั้ง
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            แก้ไข
                          </Link>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-green-600 dark:text-green-400 hover:underline text-sm"
                          >
                            ดู
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-center">
                <div className="flex space-x-1">
                  {page > 1 && (
                    <Link
                      href={{
                        pathname: '/admin/posts',
                        query: { ...searchParams, page: page - 1 },
                      }}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      &laquo; ก่อนหน้า
                    </Link>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={{
                        pathname: '/admin/posts',
                        query: { ...searchParams, page: p },
                      }}
                      className={`px-3 py-1 border rounded-md ${
                        p === page
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  
                  {page < totalPages && (
                    <Link
                      href={{
                        pathname: '/admin/posts',
                        query: { ...searchParams, page: page + 1 },
                      }}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ถัดไป &raquo;
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">ไม่พบบทความที่ตรงกับเงื่อนไขที่ค้นหา</p>
            <Link
              href="/admin/posts/new"
              className="bg-primary text-white px-4 py-2 rounded-md font-dbhelvetica-med hover:bg-primary-600 transition-colors inline-block"
            >
              สร้างบทความใหม่
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}