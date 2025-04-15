import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // If not logged in, redirect to sign-in page
  if (!session && !(
    // Don't redirect if we're already on the sign-in page
    // This check is a bit hacky but works for this simple case
    typeof window !== 'undefined' &&
    window.location.pathname === '/admin/sign-in'
  )) {
    redirect('/sign-in');
  }
  
  // If we're on the sign-in page and already logged in, redirect to admin dashboard
  if (session && typeof window !== 'undefined' && window.location.pathname === '/admin/sign-in') {
    redirect('/admin');
  }

  // If this is the sign-in page, don't apply the admin layout
  if (typeof window !== 'undefined' && window.location.pathname === '/admin/sign-in') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">{children}</main>
      </div>
    </div>
  );
}