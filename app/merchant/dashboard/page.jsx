'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Store, MapPin, Save, LogOut, Plus, Trash2, Package, Upload, Loader2, UserCog, Image as ImageIcon, Facebook, Instagram, Globe, Send, Video, X, GripHorizontal } from 'lucide-react';
import { compressImage, validateImageFile, compressMultipleImages } from '../../../lib/imageCompression';
import OptimizedImage from '../../../components/OptimizedImage';
import { SHOP_PLACEHOLDER, PRODUCT_PLACEHOLDER } from '../../../lib/constants';
import { validateMerchantData } from '../../../lib/validation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // بيانات الحساب
  const [shopData, setShopData] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    lat: '', 
    lng: '',
    type: 'merchant',
    shop_image: null,
    facebook_url: '',
    instagram_url: '',
    telegram_url: '',
    website_url: '',
    tiktok_url: '',
    open_time: '08:00',
    close_time: '21:00',
  });
  
  const [shopImageFile, setShopImageFile] = useState(null);
  const [savingShop, setSavingShop] = useState(false);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'panels', description: '' });
  
  // تعديل: دعم صور متعددة
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [uploadingProduct, setUploadingProduct] = useState(false);
  
  // حالة لتتبع العنصر المسحوب
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/merchant/login');
      } else {
        setUser(user);
        const { data: merchant } = await supabase.from('merchants').select('*').eq('id', user.id).single();
        if (merchant) setShopData(merchant);
        fetchProducts(user.id);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const fetchProducts = async (userId) => {
    const { data } = await supabase.from('products').select('*').eq('merchant_id', userId).order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleSaveShop = async () => {
    if (!user) return;
    
    // ✅ التحقق من البيانات
    const validation = validateMerchantData(shopData);
    
    if (!validation.valid) {
      alert('يرجى تصحيح الأخطاء التالية:\n' + 
            Object.values(validation.errors).join('\n'));
      return;
    }

    setSavingShop(true);

    try {
      let imageUrl = shopData.shop_image;

      if (shopImageFile) {
        // ضغط الصورة قبل الرفع
        const compressedImage = await compressImage(shopImageFile, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.9,
          maxSizeMB: 0.5
        });

        const fileExt = 'jpg'; // دائماً استخدم jpg بعد الضغط
        const fileName = `shop_${user.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products') 
          .upload(fileName, compressedImage);

        if (uploadError) throw new Error("فشل رفع الصورة: " + uploadError.message);

        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const updates = {
        id: user.id,
        name: shopData.name,
        phone: shopData.phone,
        address: shopData.address,
        latitude: shopData.lat ? parseFloat(shopData.lat) : null,
        longitude: shopData.lng ? parseFloat(shopData.lng) : null,
        type: shopData.type,
        shop_image: imageUrl,
        facebook_url: shopData.facebook_url,
        instagram_url: shopData.instagram_url,
        telegram_url: shopData.telegram_url,
        website_url: shopData.website_url,
        tiktok_url: shopData.tiktok_url,
        open_time: shopData.open_time,
        close_time: shopData.close_time,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('merchants').upsert(updates);
      
      if (error) throw error;

      setShopData({...shopData, shop_image: imageUrl});
      setShopImageFile(null);
      alert('تم حفظ بيانات المتجر بنجاح!');

    } catch (error) {
      console.error('خطأ:', error);
      alert('حدث خطأ: ' + error.message);
    } finally {
      setSavingShop(false);
    }
  };

  // دالة إضافة المنتج الجديدة (تدعم صور متعددة)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) return;

    // التحقق من حالة التاجر ومنعه من الإضافة إذا لم يكن مقبولاً
    if (shopData.status !== 'approved') {
        alert('عذراً، لا يمكنك إضافة منتجات حالياً. حسابك قيد المراجعة من قبل الإدارة.');
        return;
    }

    if (productImageFiles.length === 0) {
      alert("يرجى اختيار صورة واحدة على الأقل للمنتج");
      return;
    }

    setUploadingProduct(true);
    const uploadedUrls = [];

    try {
      // 1. رفع جميع الصور
      for (const file of productImageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        }
      }

      if (uploadedUrls.length === 0) throw new Error("فشل رفع الصور");

      // 2. إنشاء المنتج (الصورة الأولى هي الرئيسية)
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([{ 
          ...newProduct, 
          merchant_id: user.id, 
          image_url: uploadedUrls[0] // الصورة الرئيسية (الأولى في القائمة)
        }])
        .select()
        .single();

      if (productError) throw productError;

      // 3. إضافة الصور إلى جدول المعرض (product_gallery)
      if (productData) {
        const galleryInserts = uploadedUrls.map(url => ({
          product_id: productData.id,
          image_url: url
        }));

        const { error: galleryError } = await supabase.from('product_gallery').insert(galleryInserts);
        if (galleryError) console.error("Gallery Error:", galleryError);

        setProducts([productData, ...products]);
        setNewProduct({ name: '', price: '', category: 'panels', description: '' });
        setProductImageFiles([]);
      }

    } catch (error) {
      console.error('خطأ في معالجة الصور:', error);
      alert('حدث خطأ أثناء معالجة الصور. حاول مرة أخرى.');
    } finally {
      setUploadingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts(products.filter(p => p.id !== id));
  };

  // دالة لحذف صورة من القائمة المختارة قبل الرفع
  const removeImage = (index) => {
    setProductImageFiles(productImageFiles.filter((_, i) => i !== index));
  };

  // معالجة اختيار الملفات (تراكمي)
  const handleFileSelect = async (e) => {
    let newFiles = Array.from(e.target.files);
    const totalFiles = productImageFiles.length + newFiles.length;

    // التحقق من العدد
    if (totalFiles > 5) {
      alert("يمكنك إضافة 5 صور كحد أقصى للمنتج الواحد.");
      const remainingSlots = 5 - productImageFiles.length;
      if (remainingSlots <= 0) return;
      newFiles = newFiles.slice(0, remainingSlots);
    }

    // التحقق من نوع وحجم الملفات
    const validFiles = [];
    for (const file of newFiles) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error + ': ' + file.name);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // ضغط الصور
    try {
      const compressedFiles = await compressMultipleImages(validFiles, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        maxSizeMB: 1
      });
      
      setProductImageFiles([...productImageFiles, ...compressedFiles]);
    } catch (error) {
      console.error('خطأ في معالجة الصور:', error);
      alert('حدث خطأ أثناء معالجة الصور. حاول مرة أخرى.');
    }

    e.target.value = "";
  };

  // دوال السحب والإفلات (Drag and Drop)
  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // ضروري للسماح بالإفلات
  };

  const handleDrop = (targetIndex) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const updatedFiles = [...productImageFiles];
    const [draggedItem] = updatedFiles.splice(draggedItemIndex, 1);
    updatedFiles.splice(targetIndex, 0, draggedItem);

    setProductImageFiles(updatedFiles);
    setDraggedItemIndex(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* الهيدر */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="text-yellow-500" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{user?.email}</span>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1 transition">
              <LogOut size={16} /> خروج
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-8">

        {/* تنبيه حالة الحساب */}
        {shopData.status !== 'approved' && (
            <div className={`col-span-1 lg:col-span-3 p-4 rounded-xl border flex items-center gap-3 ${shopData.status === 'banned' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                {shopData.status === 'banned' ? <X size={24} /> : <Loader2 size={24} className={shopData.status === 'pending' ? 'animate-spin' : ''} />}
                <div>
                    <h3 className="font-bold">
                        {shopData.status === 'banned' ? 'تم حظر حسابك' : 'حسابك قيد المراجعة'}
                    </h3>
                    <p className="text-sm opacity-90">
                        {shopData.status === 'banned' 
                            ? 'يرجى التواصل مع الإدارة لمعرفة الأسباب.' 
                            : 'لا يمكنك نشر المنتجات حتى يتم التحقق من بياناتك وتوثيق حسابك من قبل الإدارة.'}
                    </p>
                </div>
            </div>
        )}
        
        {/* القسم 1: إعدادات المتجر */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <UserCog size={20} className="text-blue-500" /> بيانات المتجر
            </h2>
            
            <div className="space-y-4">
              
              {/* صورة المتجر */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                  {shopImageFile ? (
                    <OptimizedImage 
      src={URL.createObjectURL(shopImageFile)} 
      alt="معاينة"
      fill
      fallback={SHOP_PLACEHOLDER}
    />
  ) : shopData.shop_image ? (
    <OptimizedImage 
      src={shopData.shop_image} 
      alt={shopData.name}
      fill
      fallback={SHOP_PLACEHOLDER}
    />
  ) : (
    <ImageIcon className="text-slate-400" size={32} />
  )}
                  
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-bold">
                    تغيير
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setShopImageFile(e.target.files[0])} />
                  </label>
                </div>
                <span className="text-xs text-slate-500">شعار المتجر</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المتجر</label>
                <input type="text" value={shopData.name} onChange={(e) => setShopData({...shopData, name: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="اسم المحل التجاري" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف (واتساب)</label>
                <input type="text" value={shopData.phone} onChange={(e) => setShopData({...shopData, phone: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="77xxxxxxx" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                <input type="text" value={shopData.address} onChange={(e) => setShopData({...shopData, address: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="صنعاء - شارع تعز" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">خط العرض (Lat)</label>
                  <input type="text" value={shopData.lat} onChange={(e) => setShopData({...shopData, lat: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">خط الطول (Lng)</label>
                  <input type="text" value={shopData.lng} onChange={(e) => setShopData({...shopData, lng: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">وقت الفتح</label>
                  <input type="time" value={shopData.open_time || '08:00'} onChange={(e) => setShopData({...shopData, open_time: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">وقت الإغلاق</label>
                  <input type="time" value={shopData.close_time || '21:00'} onChange={(e) => setShopData({...shopData, close_time: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
              </div>

              {/* روابط التواصل الاجتماعي */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-600 mb-3">روابط التواصل الاجتماعي</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Facebook size={18} className="text-blue-600" />
                    <input type="text" value={shopData.facebook_url || ''} onChange={(e) => setShopData({...shopData, facebook_url: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="رابط فيسبوك" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram size={18} className="text-pink-600" />
                    <input type="text" value={shopData.instagram_url || ''} onChange={(e) => setShopData({...shopData, instagram_url: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="رابط انستجرام" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Send size={18} className="text-blue-400" />
                    <input type="text" value={shopData.telegram_url || ''} onChange={(e) => setShopData({...shopData, telegram_url: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="رابط تليجرام" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-slate-500" />
                    <input type="text" value={shopData.website_url || ''} onChange={(e) => setShopData({...shopData, website_url: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="الموقع الإلكتروني" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-black" />
                    <input type="text" value={shopData.tiktok_url || ''} onChange={(e) => setShopData({...shopData, tiktok_url: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="رابط تيك توك" />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSaveShop} 
                disabled={savingShop}
                className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-700 transition flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {savingShop ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {savingShop ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>

        {/* القسم 2: إدارة المنتجات */}
        <div className="lg:col-span-2 space-y-6">
          {/* نموذج إضافة منتج */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Package size={20} className="text-blue-500" /> إضافة منتج جديد
            </h2>

            {/* تغطية النموذج في حالة عدم القبول لتعطيله بصرياً */}
            <div className={`space-y-4 ${shopData.status !== 'approved' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المنتج</label>
                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="مثال: لوح لونجي 550 وات" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">السعر ($)</label>
                <input type="text" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="مثال: 199.99" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الفئة</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 border rounded-lg bg-white">
                  <option value="panels">ألوح شمسية</option>
                  <option value="batteries">بطاريات</option>
                  <option value="inverters">انفرترات</option>
                  <option value="accessories">ملحقات</option>
                </select>
              </div>

              {/* منطقة رفع الصور المحسنة مع السحب والإفلات */}
              <div className="md:col-span-2 space-y-3">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileSelect} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    disabled={productImageFiles.length >= 5}
                  />
                  <div className={`p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition ${productImageFiles.length >= 5 ? 'bg-slate-100 border-slate-300 cursor-not-allowed' : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-blue-50'}`}>
                    <Upload size={24} className={productImageFiles.length >= 5 ? "text-slate-400" : "text-blue-500"} /> 
                    <span className="text-sm text-slate-600 font-medium">
                      {productImageFiles.length >= 5 ? 'تم الوصول للحد الأقصى (5 صور)' : 'اضغط لاختيار الصور'}
                    </span>
                    <span className="text-xs text-slate-400">يمكنك إضافة صور متعددة (المتبقي: {5 - productImageFiles.length})</span>
                  </div>
                </div>

                {/* معاينة الصور المختارة مع إمكانية السحب */}
                {productImageFiles.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {productImageFiles.map((file, index) => (
                      <div 
                        key={index} 
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group cursor-move transition-all ${draggedItemIndex === index ? 'opacity-50 scale-95 border-blue-500' : 'hover:border-blue-300'}`}
                        title="اسحب لإعادة الترتيب"
                      >
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover pointer-events-none" />
                        
                        {/* زر الحذف */}
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition transform hover:scale-110 shadow-sm z-20"
                          title="حذف الصورة"
                        >
                          <X size={12} />
                        </button>

                        {/* أيقونة السحب */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                          <GripHorizontal className="text-white drop-shadow-md" />
                        </div>

                        {index === 0 && (
                          <span className="absolute bottom-0 right-0 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md font-bold z-10">
                            الرئيسية
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {productImageFiles.length > 1 && (
                  <p className="text-xs text-slate-400 text-center">يمكنك سحب الصور لإعادة ترتيبها (الصورة الأولى هي الرئيسية)</p>
                )}
              </div>

              <div className="md:col-span-2">
                <textarea 
                  placeholder="وصف المنتج (اختياري)" 
                  value={newProduct.description} 
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                  className="w-full p-2 border rounded-lg h-20"
                ></textarea>
              </div>

              <button type="submit" disabled={uploadingProduct} className="md:col-span-2 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 flex justify-center items-center gap-2">
                {uploadingProduct && <Loader2 className="animate-spin" size={18} />}
                {uploadingProduct ? 'جاري الرفع والإضافة...' : 'إضافة المنتج'}
              </button>
            </div>
          </div>

          {/* قائمة المنتجات */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Package size={20} className="text-yellow-500" /> منتجاتي ({products.length})
            </h2>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-md border flex items-center justify-center overflow-hidden relative">
                      {product.image_url ? (
                        <OptimizedImage 
                          src={product.image_url} 
                          alt={product.name}
                          fill
                          objectFit="cover"
                          fallback={PRODUCT_PLACEHOLDER}
                        />
                      ) : (
                        <Package size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{product.name}</h3>
                      <p className="text-sm text-green-600 font-bold">{product.price} $</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {products.length === 0 && <p className="text-center text-slate-400 py-4">لم تقم بإضافة أي منتجات بعد</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}