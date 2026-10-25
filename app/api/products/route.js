// app/api/products/route.js
import { createClient } from '../../../lib/supabaseServer';
import { NextResponse } from 'next/server';
import { validateProductData } from '../../../lib/validation';

// GET: جلب المنتجات المعتمدة فقط
export async function GET(request) {
  const supabase = createClient();
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const merchantId = searchParams.get('merchant_id');

  let query = supabase
    .from('products')
    .select(`
      *,
      merchants!inner(name, phone, address, status)
    `)
    .eq('merchants.status', 'approved');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (merchantId) {
    query = query.eq('merchant_id', merchantId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: إضافة منتج جديد
export async function POST(request) {
  const supabase = createClient();
  
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );
  
  if (authError || !user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const productData = await request.json();
  
  // ✅ التحقق من البيانات
  const validation = validateProductData(productData);
  
  if (!validation.valid) {
    return NextResponse.json({ 
      error: 'بيانات غير صحيحة', 
      errors: validation.errors 
    }, { status: 400 });
  }

  // استخدام البيانات المنظفة
  const cleanedData = {
    ...validation.cleaned,
    merchant_id: user.id
  };

  const { data, error } = await supabase
    .from('products')
    .insert(cleanedData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}