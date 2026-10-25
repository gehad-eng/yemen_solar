'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  Users, DollarSign, Check, X, Ban, Trash2, 
  MapPin, Phone, Loader2, LogOut, ShieldAlert 
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('merchants'); // merchants | prices
  const router = useRouter();

  // التحقق من الصلاحية
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/merchant/login');
        return;
      }

      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('admins check error:', error);
        router.push('/');
        return;
      }

      if (data?.id) {
        setIsAdmin(true);
      } else {
        router.push('/');
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* الشريط العلوي */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            <h1 className="text-xl font-bold">لوحة المشرف العام</h1>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm">
            <LogOut size={16} /> خروج
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* التبويبات */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
          <button 
            onClick={() => setActiveTab('merchants')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition ${activeTab === 'merchants' ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <Users size={20} /> إدارة التجار
          </button>
          <button 
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition ${activeTab === 'prices' ? 'bg-white text-green-600 border-b-2 border-green-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <DollarSign size={20} /> أسعار السوق
          </button>
        </div>

        {/* المحتوى */}
        <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[500px]">
          {activeTab === 'merchants' ? <MerchantsManager /> : <MarketPricesManager />}
        </div>
      </div>
    </div>
  );
}

// --- مكون إدارة التجار ---
function MerchantsManager() {
  const [merchants, setMerchants] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    const { data } = await supabase.from('merchants').select('*').order('created_at', { ascending: false });
    if (data) setMerchants(data);
    setIsLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    if(!confirm(`هل أنت متأكد من تغيير حالة التاجر إلى ${newStatus}؟`)) return;
    
    const { error } = await supabase.from('merchants').update({ status: newStatus }).eq('id', id);
    
    if (!error) {
      setMerchants(merchants.map(m => m.id === id ? { ...m, status: newStatus } : m));
    } else {
      alert("حدث خطأ أثناء التحديث: " + error.message);
    }
  };

  const filteredMerchants = merchants.filter(m => filter === 'all' ? true : m.status === filter);

  if (isLoading) return <div className="text-center py-10"><Loader2 className="animate-spin inline" /> جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">قائمة التجار ({filteredMerchants.length})</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['all', 'pending', 'approved', 'banned'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === f ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              {f === 'all' && 'الكل'}
              {f === 'pending' && 'قيد الانتظار'}
              {f === 'approved' && 'نشط'}
              {f === 'banned' && 'محظور'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm">
              <th className="p-4 rounded-r-lg">التاجر</th>
              <th className="p-4">معلومات الاتصال</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 rounded-l-lg text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMerchants.map((merchant) => (
              <tr key={merchant.id} className="hover:bg-slate-50 transition group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                      {merchant.shop_image ? <img src={merchant.shop_image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xs">IMG</div>}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{merchant.name}</p>
                      <p className="text-xs text-slate-400">{new Date(merchant.created_at).toLocaleDateString('ar-YE')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm flex items-center gap-1 text-slate-600"><Phone size={14} /> {merchant.phone}</p>
                  <p className="text-xs flex items-center gap-1 text-slate-400 mt-1"><MapPin size={12} /> {merchant.address}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold 
                    ${merchant.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      merchant.status === 'banned' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {merchant.status === 'approved' ? 'مقبول' : merchant.status === 'banned' ? 'محظور' : 'قيد الانتظار'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition">
                    {merchant.status !== 'approved' && (
                      <button onClick={() => updateStatus(merchant.id, 'approved')} className="bg-green-50 text-green-600 p-2 rounded hover:bg-green-100" title="قبول">
                        <Check size={18} />
                      </button>
                    )}
                    {merchant.status !== 'banned' && (
                      <button onClick={() => updateStatus(merchant.id, 'banned')} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100" title="حظر">
                        <Ban size={18} />
                      </button>
                    )}
                    <button onClick={() => updateStatus(merchant.id, 'rejected')} className="bg-slate-100 text-slate-500 p-2 rounded hover:bg-slate-200" title="رفض">
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMerchants.length === 0 && <div className="text-center py-10 text-slate-400">لا يوجد بيانات لعرضها</div>}
      </div>
    </div>
  );
}

// --- مكون إدارة الأسعار (من الكود القديم) ---
function MarketPricesManager() {
  const [prices, setPrices] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ category: 'panels', name: '', brand: '', price: '', status: 'stable' });

  useEffect(() => { fetchPrices(); }, []);

  const fetchPrices = async () => {
    const { data } = await supabase.from('market_prices').select('*').order('updated_at', { ascending: false });
    if (data) setPrices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await supabase.from('market_prices').update({ ...formData, updated_at: new Date() }).eq('id', isEditing);
    } else {
      await supabase.from('market_prices').insert([formData]);
    }
    setFormData({ category: 'panels', name: '', brand: '', price: '', status: 'stable' });
    setIsEditing(null);
    fetchPrices();
  };

  const handleDelete = async (id) => {
    if(confirm('حذف السعر؟')) {
      await supabase.from('market_prices').delete().eq('id', id);
      fetchPrices();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-slate-800">تحديث نشرة الأسعار</h2>
      
      {/* النموذج */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-2 rounded border">
            <option value="panels">ألوح</option>
            <option value="batteries">بطاريات</option>
            <option value="inverters">انفرترات</option>
          </select>
          <input type="text" placeholder="اسم المنتج/الموديل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 rounded border" required />
          <input type="text" placeholder="الماركة" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="p-2 rounded border" />
          <input type="text" placeholder="السعر" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-2 rounded border" required />
          <button type="submit" className="bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition">
            {isEditing ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>

      {/* الجدول */}
      <div className="space-y-2">
        {prices.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm">
            <div className="flex gap-4">
              <span className="font-bold text-slate-800">{p.name}</span>
              <span className="text-blue-600 font-bold">{p.price}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setIsEditing(p.id); setFormData(p); }} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Users size={16} /></button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}