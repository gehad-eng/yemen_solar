'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // استيراد العميل

export default function MapPage() {
  // استيراد الخريطة بشكل ديناميكي
  const Map = useMemo(() => dynamic(
    () => import('../../components/Map'),
    { 
      loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100">جاري تحميل الخريطة...</div>,
      ssr: false
    }
  ), []);

  const [merchants, setMerchants] = useState([]);

  // جلب البيانات من قاعدة البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchMerchants = async () => {
      // تعديل الاستعلام لجلب التجار المعتمدين فقط
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('status', 'approved'); // فلترة التجار المقبولين فقط

      if (data) {
        // تنسيق البيانات لتناسب الخريطة
        const formattedData = data.map(m => ({
          id: m.id,
          name: m.name,
          type: 'متجر معتمد', // يمكننا إضافة حقل للنوع في قاعدة البيانات لاحقاً
          position: [m.latitude || 15.3694, m.longitude || 44.1910], // استخدام إحداثيات افتراضية إذا كانت فارغة
          address: m.address,
          phone: m.phone
        }));
        setMerchants(formattedData);
      }
    };

    fetchMerchants();
  }, []);

  return (
    <main className="h-screen flex flex-col bg-slate-50">
       {/* الشريط العلوي */}
       <div className="p-4 bg-white shadow-sm z-10 flex flex-col md:flex-row items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                <ArrowRight className="text-slate-600" />
            </Link>
            <div>
                <h1 className="text-xl font-bold text-slate-800">خريطة تجار الطاقة</h1>
                <p className="text-xs text-slate-500">دليلك لأقرب المحلات الموثوقة</p>
            </div>
          </div>
          
          {/* زر إضافة محل جديد */}
          <Link href="/merchant/login" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
            + أضف محلك مجاناً
          </Link>
       </div>

       {/* حاوية الخريطة */}
       <div className="flex-1 relative z-0">
         <Map merchants={merchants} />
       </div>
    </main>
  );
}