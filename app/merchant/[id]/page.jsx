'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { MapPin, Phone, ShoppingCart, Star, ArrowRight, Loader2, Facebook, Instagram, Globe, Send, MessageCircle, Video, Clock } from 'lucide-react';
import Link from 'next/link';
import OptimizedImage from '../../../components/OptimizedImage'; // أضف هذا
import { PRODUCT_PLACEHOLDER, SHOP_PLACEHOLDER } from '../../../lib/constants'; // أضف هذا

export default function MerchantProfile({ params }) {
  const [merchant, setMerchant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', params.id)
        .single();

      if (merchantData) {
        setMerchant(merchantData);
        
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('merchant_id', params.id);
          
        if (productsData) setProducts(productsData);
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  // دالة للتحقق من حالة المتجر
  const isOpen = () => {
    if (!merchant.open_time || !merchant.close_time) return true; // افتراضياً مفتوح
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [openH, openM] = merchant.open_time.split(':');
    const openMinutes = parseInt(openH) * 60 + parseInt(openM);
    
    const [closeH, closeM] = merchant.close_time.split(':');
    const closeMinutes = parseInt(closeH) * 60 + parseInt(closeM);
    
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>;
  if (!merchant) return <div className="text-center py-20">عذراً، هذا المتجر غير موجود.</div>;

  return (
    <main className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      
      {/* غلاف المتجر */}
      <div className="bg-slate-900 text-white pb-24 pt-10 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/solar-pattern.png')]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/map" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
            <ArrowRight size={18} /> العودة للخريطة
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900 shadow-lg border-4 border-slate-800 overflow-hidden">
              {merchant.shop_image ? (
                <OptimizedImage 
                  src={merchant.shop_image} 
                  alt={merchant.name} 
                  fill
                  objectFit="cover"
                  fallback={SHOP_PLACEHOLDER}
                  priority
                />
              ) : (
                merchant.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{merchant.name}</h1>
              <div className="flex flex-wrap gap-4 text-slate-300 text-sm mb-4">
                <span className="flex items-center gap-1"><MapPin size={16} className="text-yellow-500" /> {merchant.address}</span>
                <span className="flex items-center gap-1"><Phone size={16} className="text-green-500" /> {merchant.phone}</span>
                <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /> تاجر معتمد</span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${isOpen() ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <Clock size={14} /> {isOpen() ? 'مفتوح الآن' : 'مغلق الآن'}
                </span>
              </div>
              
              {/* روابط التواصل الاجتماعي */}
              <div className="flex gap-3">
                {merchant.facebook_url && (
                  <a href={merchant.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition text-white">
                    <Facebook size={18} />
                  </a>
                )}
                {merchant.instagram_url && (
                  <a href={merchant.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition text-white">
                    <Instagram size={18} />
                  </a>
                )}
                {merchant.telegram_url && (
                  <a href={merchant.telegram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 transition text-white">
                    <Send size={18} />
                  </a>
                )}
                {merchant.website_url && (
                  <a href={merchant.website_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-slate-600 transition text-white">
                    <Globe size={18} />
                  </a>
                )}
                {merchant.tiktok_url && (
                  <a href={merchant.tiktok_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-black transition text-white">
                    <Video size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* زر واتساب العائم */}
            <a 
              href={`https://wa.me/${merchant.phone.replace('+', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition transform hover:scale-105"
            >
              <MessageCircle size={24} /> تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShoppingCart className="text-yellow-500" /> منتجات المعرض ({products.length})
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link href={`/store/${product.id}`} key={product.id} className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition hover:border-yellow-400">
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    {product.image_url ? (
                      <OptimizedImage 
                        src={product.image_url} 
                        alt={product.name}
                        fill
                        objectFit="cover"
                        fallback={PRODUCT_PLACEHOLDER}
                        className="group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingCart size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 mb-1 truncate">{product.name}</h3>
                    <p className="text-yellow-600 font-bold text-lg">{product.price} $</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              لا توجد منتجات معروضة حالياً لهذا التاجر.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}