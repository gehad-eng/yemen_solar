'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Store, ShieldCheck, Truck, Calendar } from 'lucide-react';

export default function ProductDetails({ params }) {
  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // جلب المنتج
      const { data: productData } = await supabase
        .from('products')
        .select(`*, merchants (name, phone, address)`)
        .eq('id', params.id)
        .single();

      if (productData) {
        setProduct(productData);
        setActiveImage(productData.image_url);

        // جلب صور المعرض
        const { data: galleryData } = await supabase
          .from('product_gallery')
          .select('*')
          .eq('product_id', params.id);
        
        if (galleryData) setGallery(galleryData);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">المنتج غير موجود</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* زر العودة */}
        <Link href="/store" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition">
          <ArrowRight size={20} /> العودة للمتجر
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden grid md:grid-cols-2">
          
          {/* معرض الصور */}
          <div className="bg-slate-100 p-8 flex flex-col gap-4">
            {/* الصورة الرئيسية */}
            <div className="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-9xl">📦</div>
              )}
            </div>

            {/* الصور المصغرة */}
            {gallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {gallery.map((img) => (
                  <button 
                    key={img.id} 
                    onClick={() => setActiveImage(img.image_url)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden ${activeImage === img.image_url ? 'border-yellow-500' : 'border-transparent'}`}
                  >
                    <img src={img.image_url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="p-8 flex flex-col">
            <div className="mb-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-xl whitespace-nowrap">
                  {product.price}$
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <span className="bg-slate-100 px-3 py-1 rounded-full">{product.category === 'panels' ? 'ألوح شمسية' : 'منتج طاقة'}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> أضيف بتاريخ {new Date(product.created_at).toLocaleDateString('ar-YE')}</span>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {product.description || 'لا يوجد وصف تفصيلي لهذا المنتج.'}
              </p>

              {/* مميزات إضافية */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm font-medium">
                  <ShieldCheck size={20} /> ضمان تشغيل
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm font-medium">
                  <Truck size={20} /> توصيل متاح
                </div>
              </div>
            </div>

            {/* معلومات التاجر وزر الشراء */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <Store size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">البائع</p>
                  <p className="font-bold text-slate-900">{product.merchants?.name}</p>
                  <p className="text-xs text-slate-400">{product.merchants?.address}</p>
                </div>
              </div>

              <a 
                href={`https://wa.me/${product.merchants?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً، أريد شراء المنتج "${product.name}"`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-200"
              >
                <MessageCircle size={24} /> تواصل مع البائع واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}