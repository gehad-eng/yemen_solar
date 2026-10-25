// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // الـ middleware يمرر كل الطلبات بدون تدخل
  // الحماية تتم داخل كل صفحة (client-side) لأن الجلسة محفوظة في localStorage
  return NextResponse.next();
}

export const config = {
  matcher: [],
};