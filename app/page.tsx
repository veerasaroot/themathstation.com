// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { createServerSupabaseClient } from '@/utils/supabase-server';
import { BlogPost } from '@/utils/supabase';

async function getFeaturedPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(4);
  
  return data || [];
}

export default async function HomePage() {
  const posts = await getFeaturedPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="font-dbhelvetica-bd text-4xl lg:text-5xl mb-4 text-gray-900 dark:text-white">
                สถานีความรู้คณิตศาสตร์
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-gray-700 dark:text-gray-200">
                แหล่งเรียนรู้คณิตศาสตร์และการเขียนโค้ด สำหรับนักเรียน นักศึกษา และผู้สนใจทั่วไป
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/blog" className="btn btn-primary text-lg px-6 py-3 font-dbhelvetica-med">
                  เริ่มการเรียนรู้
                </Link>
                <Link href="/about" className="btn bg-white text-primary border border-primary hover:bg-primary-50 text-lg px-6 py-3 font-dbhelvetica-med dark:bg-gray-800 dark:text-primary-300 dark:border-primary-300 dark:hover:bg-gray-700">
                  เกี่ยวกับเรา
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <Image
                src="/images/math-illustration.svg"
                alt="Math illustrations"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-dbhelvetica-bd text-3xl">บทความล่าสุด</h2>
            <Link
              href="/blog"
              className="font-dbhelvetica-med text-primary hover:text-primary-600 transition-colors flex items-center"
            >
              ดูทั้งหมด
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPost && (
              <BlogCard post={featuredPost} featured={true} />
            )}
            
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Math Topics */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="font-dbhelvetica-bd text-3xl mb-6 text-center">เนื้อหาคณิตศาสตร์</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-10 text-center max-w-3xl mx-auto">
            เรียนรู้คณิตศาสตร์หลากหลายแขนงผ่านบทความที่เข้าใจง่าย มีตัวอย่างประกอบ และสามารถนำไปประยุกต์ใช้ได้จริง
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calculus */}
            <Link href="/categories/calculus" className="card p-6 text-center hover:border-primary hover:border-2 transition-all">
              <div className="mb-4 mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
              </div>
              <h3 className="font-dbhelvetica-bd text-xl mb-2">แคลคูลัส</h3>
              <p className="text-gray-600 dark:text-gray-300">
                อนุพันธ์ ปริพันธ์ การประยุกต์ใช้ในปัญหาทางวิทยาศาสตร์และวิศวกรรม
              </p>
            </Link>
            
            {/* Algebra */}
            <Link href="/categories/algebra" className="card p-6 text-center hover:border-primary hover:border-2 transition-all">
              <div className="mb-4 mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                </svg>
              </div>
              <h3 className="font-dbhelvetica-bd text-xl mb-2">พีชคณิต</h3>
              <p className="text-gray-600 dark:text-gray-300">
                สมการ ฟังก์ชัน เมทริกซ์ พีชคณิตเชิงเส้น และทฤษฎีกรุป
              </p>
            </Link>
            
            {/* Geometry */}
            <Link href="/categories/geometry" className="card p-6 text-center hover:border-primary hover:border-2 transition-all">
              <div className="mb-4 mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <h3 className="font-dbhelvetica-bd text-xl mb-2">เรขาคณิต</h3>
              <p className="text-gray-600 dark:text-gray-300">
                เรขาคณิตระนาบ เรขาคณิตสามมิติ เรขาคณิตเชิงวิเคราะห์ และโทโพโลยี
              </p>
            </Link>
            
            {/* Probability */}
            <Link href="/categories/probability" className="card p-6 text-center hover:border-primary hover:border-2 transition-all">
              <div className="mb-4 mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
              <h3 className="font-dbhelvetica-bd text-xl mb-2">ความน่าจะเป็น</h3>
              <p className="text-gray-600 dark:text-gray-300">
                ทฤษฎีความน่าจะเป็น สถิติ การวิเคราะห์ข้อมูล และการสร้างแบบจำลอง
              </p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Subscription */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-primary-50 dark:bg-gray-700 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-dbhelvetica-bd text-3xl mb-4">ติดตามข่าวสารและบทความใหม่</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                ลงทะเบียนเพื่อรับข่าวสารและบทความใหม่ๆ เกี่ยวกับคณิตศาสตร์และการเขียนโค้ดทุกสัปดาห์
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  className="flex-grow px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button type="submit" className="btn btn-primary font-dbhelvetica-med">
                  ลงทะเบียน
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}