'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative h-16 w-48 mx-auto">
              <Image
                src="/images/math-station-logo.png"
                alt="The Math Station"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          <h2 className="font-dbhelvetica-bd text-2xl mt-4">เข้าสู่ระบบแอดมิน</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-dbhelvetica-med mb-1">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block font-dbhelvetica-med mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-dbhelvetica-med py-3 rounded-md hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">
              กลับไปหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}