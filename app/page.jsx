import Link from 'next/link';
import { Sun, Battery, MapPin, ShoppingCart, ArrowRight, CheckCircle2, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans" dir="rtl">
      
      {/* 1. Hero Section (الواجهة الرئيسية) */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* خلفية زخرفية */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold mb-6 border border-yellow-500/30">
            ☀️ المنصة الأولى للطاقة في اليمن
          </span>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            طاقة شمسية ذكية <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">لمستقبل مشرق</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            احسب احتياج منزلك بدقة، قارن أسعار السوق، واعثر على أفضل التجار والمهندسين في منطقتك بضغطة زر.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/calculator" className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
              <Zap size={20} /> احسب منظومتك الآن
            </Link>
            <Link href="/store" className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 border border-slate-700">
              <ShoppingCart size={20} /> تصفح المتجر
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Features Grid (الخدمات) */}
      <div className="max-w-6xl mx-auto px-6 py-20 -mt-20 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          
          <Link href="/calculator" className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition duration-300 group">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-6 group-hover:bg-yellow-500 group-hover:text-white transition">
              <Sun size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">حاسبة الأحمال الذكية</h3>
            <p className="text-slate-500 leading-relaxed">
              خوارزمية دقيقة تحسب لك عدد الألواح والبطاريات المناسبة لأجهزتك المنزلية لتجنب الهدر.
            </p>
          </Link>

          <Link href="/map" className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition duration-300 group">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-500 group-hover:text-white transition">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">خريطة التجار والمهندسين</h3>
            <p className="text-slate-500 leading-relaxed">
              دليل شامل يوصلك لأقرب محلات الطاقة الموثوقة في صنعاء وعدن وكل المحافظات.
            </p>
          </Link>

          <Link href="/market" className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition duration-300 group">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-500 group-hover:text-white transition">
              <Battery size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">دليل الأسعار اليومي</h3>
            <p className="text-slate-500 leading-relaxed">
              تابع أسعار الألواح والبطاريات لحظة بلحظة لتعرف تكلفة منظومتك الحقيقية قبل الشراء.
            </p>
          </Link>

        </div>
      </div>

      {/* 3. Why Us (لماذا نحن) */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              لماذا يختار اليمنيون <br />
              <span className="text-yellow-500">Solar Hub Yemen؟</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              لأننا نفهم معاناة الكهرباء، صممنا منصة تحل المشكلة من جذورها. نوفر عليك عناء البحث في الأسواق وحسابات المهندسين المعقدة.
            </p>
            
            <ul className="space-y-4">
              {[
                'بيانات دقيقة ومحدثة يومياً',
                'تواصل مباشر مع التجار عبر واتساب',
                'دعم فني ومجتمع نشط',
                'مجاني بالكامل للمستخدمين'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-green-500" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* صورة توضيحية (أو إحصائيات) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <Users className="mx-auto text-blue-500 mb-2" size={32} />
              <h4 className="text-3xl font-bold text-slate-900">500+</h4>
              <p className="text-slate-500 text-sm">تاجر ومهندس</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center mt-8">
              <ShoppingCart className="mx-auto text-yellow-500 mb-2" size={32} />
              <h4 className="text-3xl font-bold text-slate-900">1200+</h4>
              <p className="text-slate-500 text-sm">منتج متوفر</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <Zap className="mx-auto text-orange-500 mb-2" size={32} />
              <h4 className="text-3xl font-bold text-slate-900">50k</h4>
              <p className="text-slate-500 text-sm">عملية حساب</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center mt-8">
              <MapPin className="mx-auto text-red-500 mb-2" size={32} />
              <h4 className="text-3xl font-bold text-slate-900">18</h4>
              <p className="text-slate-500 text-sm">محافظة مغطاة</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CTA (دعوة للعمل) */}
      <div className="bg-yellow-500 py-16 text-center px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">هل أنت تاجر طاقة شمسية؟</h2>
        <p className="text-slate-800 mb-8 max-w-xl mx-auto">
          انضم لأكبر تجمع لتجار الطاقة في اليمن واعرض منتجاتك لآلاف الزبائن الباحثين عن حلول الطاقة.
        </p>
        <Link href="/merchant/login" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
          انضم الآن
        </Link>
      </div>
    </main>
  )
}



