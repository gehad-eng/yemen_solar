import Link from 'next/link';
import { Sun, Heart, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
        
        {/* العمود الأول: عن الموقع */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-white">
            <Sun className="text-yellow-500" />
            <h3 className="text-xl font-bold">Solar Hub Yemen</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            المنصة الأولى في اليمن لخدمات الطاقة الشمسية. نساعدك في حساب احتياجك، معرفة الأسعار، والوصول لأفضل التجار والمهندسين.
          </p>
        </div>

        {/* العمود الثاني: روابط سريعة */}
        <div>
          <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/calculator" className="hover:text-yellow-400 transition">حاسبة الأحمال</Link></li>
            <li><Link href="/map" className="hover:text-yellow-400 transition">خريطة التجار</Link></li>
            <li><Link href="/market" className="hover:text-yellow-400 transition">أسعار السوق</Link></li>
            <li><Link href="/store" className="hover:text-yellow-400 transition">المتجر</Link></li>
          </ul>
        </div>

        {/* العمود الثالث: تواصل معنا */}
        <div>
          <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-yellow-500" />
              <span>6283891777774+</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-yellow-500" />
              <span>info@solar-yemen.com</span>
            </li>
            <li className="mt-4 text-xs text-slate-500">
              اب اليمن - جرافه 
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
        <span>صنع بكل</span> <Heart size={12} className="text-red-500 fill-red-500" /> <span>في اليمن &copy; 2024</span>
      </div>
    </footer>
  );
}