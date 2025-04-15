// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // เก็บเส้นทางปัจจุบันไว้ใน header
  res.headers.set('x-pathname', req.nextUrl.pathname);

  // ถ้าอยู่ในหน้า admin และยังไม่ได้ล็อกอิน ให้ redirect ไปหน้า sign-in
  if (req.nextUrl.pathname.startsWith('/admin') && 
      !req.nextUrl.pathname.includes('/sign-in') && 
      !session) {
    return NextResponse.redirect(new URL('/admin/sign-in', req.url));
  }

  // ถ้าอยู่ในหน้า sign-in และล็อกอินแล้ว ให้ redirect ไปหน้า admin dashboard
  if (req.nextUrl.pathname.includes('/admin/sign-in') && session) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

// เลือกเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  matcher: ['/admin/:path*'],
};