'use client';

import { useState } from 'react';
import { Plus, Trash2, Zap, Battery, Sun, ArrowRight, Settings } from 'lucide-react';
import Link from 'next/link';
import { validateWatts, validateHours } from '../../lib/validation';

export default function Calculator() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', watts: '', hours: '', count: 1 });
  
  // إعدادات النظام المتقدمة
  const [systemVoltage, setSystemVoltage] = useState(12); // 12, 24, 48
  const [panelSize, setPanelSize] = useState(550); // حجم اللوح بالوات
  const [batterySize, setBatterySize] = useState(200); // حجم البطارية بالأمبير

  // إضافة جهاز جديد للقائمة
  const addItem = () => {
    // التحقق من البيانات
    const wattsValidation = validateWatts(newItem.watts);
    if (!wattsValidation.valid) {
      alert(wattsValidation.error);
      return;
    }

    const hoursValidation = validateHours(newItem.hours);
    if (!hoursValidation.valid) {
      alert(hoursValidation.error);
      return;
    }

    if (!newItem.name || newItem.name.trim() === '') {
      alert('اسم الجهاز مطلوب');
      return;
    }

    setItems([...items, { 
      ...newItem, 
      id: Date.now(),
      watts: wattsValidation.cleaned,
      hours: hoursValidation.cleaned
    }]);
    
    setNewItem({ name: '', watts: '', hours: '', count: 1 });
  };

  // حذف جهاز
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // --- المحرك الرياضي للحاسبة (Solar Engine) ---
  
  // 1. إجمالي الوات (لحساب حجم الانفرتر)
  const totalWatts = items.reduce((acc, item) => acc + (Number(item.watts) * Number(item.count)), 0);
  
  // 2. إجمالي الاستهلاك اليومي (وات/ساعة)
  const totalDailyWh = items.reduce((acc, item) => acc + (Number(item.watts) * Number(item.hours) * Number(item.count)), 0);

  // 3. حجم الانفرتر المطلوب (مع هامش أمان 25%)
  const inverterSize = Math.ceil(totalWatts * 1.25);

  // 4. سعة البطاريات المطلوبة (أمبير)
  // المعادلة: (الاستهلاك اليومي × أيام الغيوم 1.2) / (فولتية النظام × عمق التفريغ 0.7)
  const requiredBatteryCapacity = Math.ceil((totalDailyWh * 1.2) / (systemVoltage * 0.7));
  
  // عدد البطاريات المطلوبة (بناءً على حجم البطارية المختار)
  const batteriesCount = Math.ceil(requiredBatteryCapacity / batterySize);

  // 5. عدد الألواح المطلوبة
  // المعادلة: (الاستهلاك اليومي × تعويض الفاقد 1.4) / (ساعات الشمس 5 × حجم اللوح)
  const panelsCount = Math.ceil((totalDailyWh * 1.4) / (5 * panelSize));

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="p-2 bg-white rounded-full hover:bg-slate-100 transition">
            <ArrowRight className="text-slate-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">حاسبة المنظومة الشمسية <span className="text-yellow-500 text-sm font-normal">(احترافية)</span></h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* العمود الأيمن: الإدخال والإعدادات */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* إعدادات النظام */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
                <Settings size={16} /> إعدادات النظام
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">فولتية النظام</label>
                  <select 
                    className="w-full p-2 border rounded-lg text-sm font-bold"
                    value={systemVoltage}
                    onChange={(e) => setSystemVoltage(Number(e.target.value))}
                  >
                    <option value={12}>12 فولت (صغير)</option>
                    <option value={24}>24 فولت (متوسط)</option>
                    <option value={48}>48 فولت (كبير)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">حجم اللوح (وات)</label>
                  <select 
                    className="w-full p-2 border rounded-lg text-sm font-bold"
                    value={panelSize}
                    onChange={(e) => setPanelSize(Number(e.target.value))}
                  >
                    <option value={300}>300 وات</option>
                    <option value={450}>450 وات</option>
                    <option value={550}>550 وات</option>
                    <option value={585}>585 وات</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">حجم البطارية (Ah)</label>
                  <select 
                    className="w-full p-2 border rounded-lg text-sm font-bold"
                    value={batterySize}
                    onChange={(e) => setBatterySize(Number(e.target.value))}
                  >
                    <option value={100}>100 أمبير</option>
                    <option value={150}>150 أمبير</option>
                    <option value={200}>200 أمبير</option>
                  </select>
                </div>
              </div>
            </div>

            {/* إضافة الأجهزة */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 text-slate-700">أضف أجهزتك</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="الجهاز (مثلاً: ثلاجة)"
                  className="col-span-2 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="الوات (W)"
                  min="1"
                  max="50000"
                  step="1"
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  value={newItem.watts}
                  onChange={e => setNewItem({...newItem, watts: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="ساعات العمل"
                  min="0.1"
                  max="24"
                  step="0.5"
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  value={newItem.hours}
                  onChange={e => setNewItem({...newItem, hours: e.target.value})}
                />
              </div>
              <button 
                onClick={addItem}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition font-bold"
              >
                <Plus size={20} /> إضافة للقائمة
              </button>
            </div>

            {/* القائمة */}
            {items.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold mb-3 text-slate-700">الأجهزة المضافة ({items.length})</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <div className="text-xs text-slate-500 mt-1">
                          {item.watts} وات × {item.hours} ساعات
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* العمود الأيسر: النتائج */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg sticky top-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-yellow-400" /> النتيجة النهائية
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-slate-400 text-xs mb-1">الاستهلاك اليومي المتوقع</p>
                  <p className="text-2xl font-bold text-yellow-400">{totalDailyWh} <span className="text-sm text-white">وات/ساعة</span></p>
                </div>

                <div className="space-y-4">
                  {/* الألواح */}
                  <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                    <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg"><Sun size={24} /></div>
                    <div>
                      <p className="text-xs text-slate-400">عدد الألواح ({panelSize}W)</p>
                      <p className="font-bold text-xl">{panelsCount} <span className="text-sm font-normal">ألواح</span></p>
                    </div>
                  </div>

                  {/* البطاريات */}
                  <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                    <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><Battery size={24} /></div>
                    <div>
                      <p className="text-xs text-slate-400">عدد البطاريات ({batterySize}Ah)</p>
                      <p className="font-bold text-xl">{batteriesCount} <span className="text-sm font-normal">بطاريات</span></p>
                      <p className="text-[10px] text-slate-500">نظام {systemVoltage} فولت</p>
                    </div>
                  </div>

                  {/* الانفرتر */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Zap size={24} /></div>
                    <div>
                      <p className="text-xs text-slate-400">حجم الانفرتر المقترح</p>
                      <p className="font-bold text-xl">{inverterSize} <span className="text-sm font-normal">وات</span></p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                  <Link href="/store" className="block w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-3 rounded-lg font-bold transition">
                    شراء هذه المنظومة الآن
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}