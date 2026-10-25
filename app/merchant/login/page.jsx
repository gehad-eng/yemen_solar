'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function MerchantLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // التحقق من اسم المتجر
        if (!shopName.trim() || shopName.trim().length < 2) {
          setMessage({ type: 'error', text: 'اسم المتجر مطلوب (حرفين على الأقل)' });
          setLoading(false); // ← مهم جداً
          return;
        }

        console.log('1. بدء التسجيل...');

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: shopName.trim() },
          },
        });

        console.log('2. نتيجة التسجيل:', { data, error });

        if (error) throw error;

        // محاولة الدخول مباشرة بعد التسجيل
        console.log('3. محاولة تسجيل الدخول بعد التسجيل...');

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        console.log('4. نتيجة تسجيل الدخول:', { loginData, loginError });

        if (loginData?.session) {
          console.log('5. ✅ جلسة موجودة! جاري التحويل...');
          setMessage({ type: 'success', text: '✅ تم التسجيل والدخول بنجاح! جاري التحويل...' });
          setLoading(false);
          window.location.href = '/merchant/dashboard';
          return;
        }

        if (loginError) {
          console.log('5. ❌ فشل الدخول:', loginError.message);
          // التسجيل نجح لكن الدخول فشل
          setMessage({ type: 'success', text: '✅ تم إنشاء الحساب! اضغط "سجل دخول" وأدخل بياناتك.' });
          setIsSignUp(false);
        }

      } else {
        // --- تسجيل دخول عادي ---
        console.log('1. بدء تسجيل الدخول...');

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        console.log('2. نتيجة الدخول:', { data, error });

        if (error) throw error;

        if (data?.session) {
          console.log('3. ✅ جلسة موجودة! جاري التحويل...');
          setMessage({ type: 'success', text: '✅ تم الدخول بنجاح! جاري التحويل...' });
          setLoading(false);
          window.location.href = '/merchant/dashboard';
          return;
        }

        setMessage({ type: 'error', text: 'لم يتم إنشاء جلسة. حاول مرة أخرى.' });
      }
    } catch (err) {
      console.error('❌ خطأ:', err);
      
      // ترجمة رسائل الخطأ الشائعة
      let msg = err?.message || 'حدث خطأ غير متوقع';
      if (msg.includes('Invalid login credentials')) msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      if (msg.includes('User already registered')) msg = 'هذا البريد مسجل بالفعل. جرب تسجيل الدخول.';
      if (msg.includes('Password should be')) msg = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      if (msg.includes('Database error')) msg = 'خطأ في قاعدة البيانات. يرجى المحاولة لاحقاً أو التواصل مع الإدارة.';
      
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isSignUp ? 'إنشاء حساب تاجر' : 'دخول التجار'}
          </h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم المتجر</label>
              <input
                type="text"
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="مثال: معرض النور للطاقة"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 text-white ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> جاري المعالجة...</>
            ) : (
              isSignUp ? 'إنشاء حساب' : 'دخول'
            )}
          </button>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignUp ? 'لديك حساب بالفعل؟ سجل دخول' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm text-center flex items-center justify-center gap-2 
              ${message.type === 'error' 
                ? 'bg-red-50 text-red-600 border border-red-100' 
                : 'bg-green-50 text-green-600 border border-green-100'}`}
            >
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              {message.text}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}