// app/api/products/[id]/route.js
import { createClient } from '../../../../lib/supabaseServer';
import { NextResponse } from 'next/server';

// DELETE: حذف منتج
export async function DELETE(request, { params }) {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  // التحقق من أن المنتج يخص المستخدم
  const { data: product } = await supabase
    .from('products')
    .select('merchant_id')
    .eq('id', params.id)
    .single();

  if (!product || product.merchant_id !== user.id) {
    return NextResponse.json({ error: 'غير مصرح بحذف هذا المنتج' }, { status: 403 });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', params.id)
    .eq('merchant_id', user.id); // Double check

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'تم الحذف بنجاح' });
}

// PUT: تحديث منتج
export async function PUT(request, { params }) {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const updates = await request.json();
  delete updates.id;
  delete updates.merchant_id; // منع تغيير المالك

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', params.id)
    .eq('merchant_id', user.id) // فقط منتجات المستخدم
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}