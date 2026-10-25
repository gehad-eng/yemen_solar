'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Battery, Sun, Zap, TrendingUp, TrendingDown, Minus, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('updated_at', { ascending: false });

      if (data) setPrices(data);
      setLoading(false);
    };

    fetchPrices();
  }, []);

  const filteredPrices = activeTab === 'all' 
    ? prices 
    : prices.filter(p => p.category === activeTab);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* الرأس */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-white rounded-full hover:bg-slate-100 transition shadow-sm">
              <ArrowRight className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">أسعار السوق اليومية</h1>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                <Calendar size={14} /> آخر تحديث: {new Date().toLocaleDateString('ar-YE')}
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-bold border border-yellow-200">
            متوسط الأسعار في صنعاء
          </div>
        </div>

        {/* الفلاتر */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${activeTab === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setActiveTab('panels')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'panels' ? 'bg-yellow-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <Sun size={16} /> الألواح الشمسية
          </button>
          <button 
            onClick={() => setActiveTab('batteries')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'batteries' ? 'bg-green-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <Battery size={16} /> البطاريات
          </button>
          <button 
            onClick={() => setActiveTab('inverters')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'inverters' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <Zap size={16} /> الانفرترات
          </button>
        </div>

        {/* قائمة الأسعار */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPrices.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-yellow-400 transition group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    item.category === 'panels' ? 'bg-yellow-50 text-yellow-600' : 
                    item.category === 'batteries' ? 'bg-green-50 text-green-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {item.category === 'panels' ? <Sun size={24} /> : 
                     item.category === 'batteries' ? <Battery size={24} /> : 
                     <Zap size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                    <p className="text-slate-500 text-sm">{item.brand}</p>
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-bold text-xl text-slate-900">{item.price}</div>
                  <div className="flex items-center justify-end gap-1 text-xs font-medium mt-1">
                    {item.status === 'up' && <span className="text-red-500 flex items-center">ارتفاع <TrendingUp size={12} /></span>}
                    {item.status === 'down' && <span className="text-green-500 flex items-center">انخفاض <TrendingDown size={12} /></span>}
                    {item.status === 'stable' && <span className="text-slate-400 flex items-center">مستقر <Minus size={12} /></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}