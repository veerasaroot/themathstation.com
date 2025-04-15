'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

export default function AdminHeader() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Link href="/admin" className="flex items-center">
          <div className="relative h-10 w-28">
            <Image
              src="/images/math-station-logo.png"
              alt="The Math Station"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span className="ml-3 font-dbhelvetica-bd text-lg">ระบบจัดการ</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <div className="relative">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            ดูเว็บไซต์
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}