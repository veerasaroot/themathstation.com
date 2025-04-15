import { createServerSupabaseClient } from '@/utils/supabase-server';
import Link from 'next/link';

async function getStats() {
  const supabase = await createServerSupabaseClient();
  
  // Get post count
  const { count: postCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });
  
  // Get published post count
  const { count: publishedPostCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);
  
  // Get category count
  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });
  
  // Get author count
  const { count: authorCount } = await supabase
    .from('authors')
    .select('*', { count: 'exact', head: true });
  
  // Get total views
  const { data: viewsData } = await supabase
    .from('posts')
    .select('view_count');
  
  const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
  
  return {
    postCount: postCount || 0,
    publishedPostCount: publishedPostCount || 0,
    categoryCount: categoryCount || 0,
    authorCount: authorCount || 0,
    totalViews,
  };
}

async function getRecentPosts(limit = 5) {
  const supabase = await createServerSupabaseClient();
  
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, published, view_count')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return posts || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentPosts = await getRecentPosts();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-dbhelvetica-bd text-2xl">แดชบอร์ด</h1>
        <p className="text-gray-600 dark:text-gray-300">
          ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์ The Math Station
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">บทความทั้งหมด</h3>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-dbhelvetica-bd">{stats.postCount}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.publishedPostCount} บทความเผยแพร่แล้ว
              </div>
            </div>
            <Link
              href="/admin/posts"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">หมวดหมู่</h3>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-600 dark:text-green-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-dbhelvetica-bd">{stats.categoryCount}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                หมวดหมู่ทั้งหมด
              </div>
            </div>
            <Link
              href="/admin/categories"
              className="text-green-600 dark:text-green-400 text-sm hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">ผู้เขียน</h3>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-dbhelvetica-bd">{stats.authorCount}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ผู้เขียนทั้งหมด
              </div>
            </div>
            <Link
              href="/admin/authors"
              className="text-purple-600 dark:text-purple-400 text-sm hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">จำนวนการเข้าชม</h3>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-orange-600 dark:text-orange-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-dbhelvetica-bd">{stats.totalViews.toLocaleString()}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ครั้ง
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-dbhelvetica-bd text-lg">บทความล่าสุด</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="py-3 px-6 text-left">ชื่อบทความ</th>
                <th className="py-3 px-6 text-left">วันที่สร้าง</th>
                <th className="py-3 px-6 text-left">สถานะ</th>
                <th className="py-3 px-6 text-left">การเข้าชม</th>
                <th className="py-3 px-6 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
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
                    {new Date(post.created_at).toLocaleDateString('th-TH')}
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
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
          <Link
            href="/admin/posts"
            className="text-primary hover:underline font-dbhelvetica-med"
          >
            ดูบทความทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}