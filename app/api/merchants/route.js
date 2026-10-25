// app/api/merchants/route.js
import { createClient } from '../../../lib/supabaseServer';
import { NextResponse } from 'next/server';
import { validateMerchantData } from '../../../lib/validation';

// GET: جلب بيانات التاجر الحالي
export async function GET() {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(merchant);
}

// PUT: تحديث بيانات التاجر
export async function PUT(request) {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const updates = await request.json();
  
  // ✅ التحقق من البيانات
  const validation = validateMerchantData(updates);
  
  if (!validation.valid) {
    return NextResponse.json({ 
      error: 'بيانات غير صحيحة', 
      errors: validation.errors 
    }, { status: 400 });
  }

  // منع تعديل حقول حساسة
  delete updates.id;
  delete updates.status; // فقط الأدمن يمكنه تغيير الحالة
  delete updates.created_at;

  const { data, error } = await supabase
    .from('merchants')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}