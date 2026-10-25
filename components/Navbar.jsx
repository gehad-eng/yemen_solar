'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Menu, X, ShieldCheck, LayoutDashboard, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: admin } = await supabase.from('admins').select('id').eq('id', user.id).single();
        if (admin) setIsAdmin(true);
      }
    };
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
       setUser(session?.user ?? null);
       if (session?.user) {
         const { data: admin } = await supabase.from('admins').select('id').eq('id', session.user.id).single();
         setIsAdmin(!!admin);
       } else {
         setIsAdmin(false);
       }
    });
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { href: '/', label: 'الرئيسية' },
    { href: '/calculator', label: 'حاسبة الأحمال' },
    { href: '/map', label: 'خريطة التجار' },
    { href: '/market', label: 'الأسعار' },
    { href: '/store', label: 'المتجر' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* الشعار */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <Sun className="text-yellow-500" />
            <span>Solar Hub</span>
          </Link>

          {/* روابط الكمبيوتر */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition hover:text-yellow-500 ${
                  pathname === link.href ? 'text-yellow-500 font-bold' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-red-600 font-bold flex items-center gap-1 hover:text-red-700 transition">
                <ShieldCheck size={18} />
                <span>الإدارة</span>
              </Link>
            )}

            {user ? (
              <Link href="/merchant/dashboard" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span>لوحة التاجر</span>
              </Link>
            ) : (
              <Link href="/merchant/login" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2">
                <LogIn size={18} />
                <span>دخول التجار</span>
              </Link>
            )}
          </div>

          {/* زر القائمة للجوال */}
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال المنسدلة */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-lg absolute w-full">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block p-3 rounded-lg ${
                pathname === link.href ? 'bg-yellow-50 text-yellow-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-red-50 text-red-600 p-3 rounded-lg font-bold mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              لوحة الإدارة
            </Link>
          )}

          {user ? (
            <Link 
              href="/merchant/dashboard" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-slate-900 text-white p-3 rounded-lg font-bold mt-2 flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={18} />
              لوحة التحكم
            </Link>
          ) : (
             <Link 
              href="/merchant/login" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-slate-900 text-white p-3 rounded-lg font-bold mt-4 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              دخول التجار
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}