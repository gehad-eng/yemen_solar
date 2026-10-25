'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '../../components/OptimizedImage';
import { PRODUCT_PLACEHOLDER } from '../../lib/constants';

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // استخدام الـ API Route بدلاً من Supabase مباشرة
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('فشل جلب المنتجات');
        }

        const data = await response.json();
        setProducts(data);

      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-slate-50 font-sans" dir="rtl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 bg-white rounded-full hover:bg-slate-100 transition shadow-sm">
            <ArrowRight className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold">متجر الطاقة</h1>
        </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-slate-500">جاري تحميل المنتجات...</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
          <AlertCircle className="mx-auto mb-2" size={32} />
          <h3 className="font-bold text-lg mb-2">حدث خطأ</h3>
          <p className="font-mono text-sm bg-white p-2 rounded border border-red-100 inline-block">{errorMsg}</p>
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-slate-500">
              لا توجد منتجات متاحة حالياً
            </div>
          ) : (
            products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded shadow border hover:shadow-lg transition">
                <div className="aspect-square mb-3 relative">
                  <OptimizedImage
                    src={p.image_url}
                    alt={p.name}
                    fill
                    objectFit="cover"
                    fallback={PRODUCT_PLACEHOLDER}
                  />
                </div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-green-600 text-xl font-bold">${p.price}</p>
                <div className="text-xs text-gray-500 mt-2">
                  التاجر: {p.merchants?.name || 'غير معروف'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}