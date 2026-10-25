// lib/validation.js

/**
 * التحقق من البريد الإلكتروني
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'البريد الإلكتروني مطلوب' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'البريد الإلكتروني غير صحيح' };
  }

  if (email.length > 255) {
    return { valid: false, error: 'البريد الإلكتروني طويل جداً' };
  }

  return { valid: true };
}

/**
 * التحقق من كلمة المرور
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'كلمة المرور مطلوبة' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }

  if (password.length > 100) {
    return { valid: false, error: 'كلمة المرور طويلة جداً' };
  }

  return { valid: true };
}

/**
 * التحقق من رقم الهاتف اليمني
 */
export function validateYemenPhone(phone) {
  if (!phone) {
    return { valid: false, error: 'رقم الهاتف مطلوب' };
  }

  // إزالة المسافات والرموز
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // أرقام يمنية: تبدأ بـ 7 وطولها 9 أرقام، أو تبدأ بـ +967
  const yemenPhoneRegex = /^(7[0-9]{8}|(\+?967)?7[0-9]{8})$/;

  if (!yemenPhoneRegex.test(cleanPhone)) {
    return { 
      valid: false, 
      error: 'رقم هاتف يمني غير صحيح. يجب أن يبدأ بـ 7 (مثال: 777123456)' 
    };
  }

  return { valid: true, cleaned: cleanPhone };
}

/**
 * التحقق من اسم المتجر
 */
export function validateShopName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'اسم المتجر مطلوب' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return { valid: false, error: 'اسم المتجر يجب أن يكون 3 أحرف على الأقل' };
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: 'اسم المتجر طويل جداً (حد أقصى 100 حرف)' };
  }

  return { valid: true, cleaned: trimmedName };
}

/**
 * التحقق من السعر
 */
export function validatePrice(price) {
  if (price === null || price === undefined || price === '') {
    return { valid: false, error: 'السعر مطلوب' };
  }

  const numPrice = Number(price);

  if (isNaN(numPrice)) {
    return { valid: false, error: 'السعر يجب أن يكون رقماً' };
  }

  if (numPrice < 0) {
    return { valid: false, error: 'السعر لا يمكن أن يكون سالباً' };
  }

  if (numPrice > 1000000) {
    return { valid: false, error: 'السعر كبير جداً' };
  }

  return { valid: true, cleaned: numPrice };
}

/**
 * التحقق من استهلاك الكهرباء (وات)
 */
export function validateWatts(watts) {
  if (watts === null || watts === undefined || watts === '') {
    return { valid: false, error: 'الاستهلاك بالوات مطلوب' };
  }

  const numWatts = Number(watts);

  if (isNaN(numWatts)) {
    return { valid: false, error: 'الاستهلاك يجب أن يكون رقماً' };
  }

  if (numWatts <= 0) {
    return { valid: false, error: 'الاستهلاك يجب أن يكون أكبر من صفر' };
  }

  if (numWatts > 50000) {
    return { valid: false, error: 'الاستهلاك كبير جداً (حد أقصى 50000 وات)' };
  }

  return { valid: true, cleaned: numWatts };
}

/**
 * التحقق من ساعات التشغيل
 */
export function validateHours(hours) {
  if (hours === null || hours === undefined || hours === '') {
    return { valid: false, error: 'ساعات التشغيل مطلوبة' };
  }

  const numHours = Number(hours);

  if (isNaN(numHours)) {
    return { valid: false, error: 'ساعات التشغيل يجب أن تكون رقماً' };
  }

  if (numHours <= 0) {
    return { valid: false, error: 'ساعات التشغيل يجب أن تكون أكبر من صفر' };
  }

  if (numHours > 24) {
    return { valid: false, error: 'ساعات التشغيل لا يمكن أن تتجاوز 24 ساعة' };
  }

  return { valid: true, cleaned: numHours };
}

/**
 * التحقق من الإحداثيات (Latitude/Longitude)
 */
export function validateCoordinates(lat, lng) {
  const errors = {};

  const numLat = Number(lat);
  const numLng = Number(lng);

  if (lat && (isNaN(numLat) || numLat < -90 || numLat > 90)) {
    errors.lat = 'خط العرض يجب أن يكون بين -90 و 90';
  }

  if (lng && (isNaN(numLng) || numLng < -180 || numLng > 180)) {
    errors.lng = 'خط الطول يجب أن يكون بين -180 و 180';
  }

  // التحقق من أن الإحداثيات في نطاق اليمن تقريباً
  if (numLat && numLng) {
    // اليمن: خط عرض 12-19، خط طول 42-54
    if (numLat < 12 || numLat > 19 || numLng < 42 || numLng > 54) {
      errors.general = 'الإحداثيات خارج نطاق اليمن. تأكد من الإحداثيات الصحيحة.';
    }
  }

  const valid = Object.keys(errors).length === 0;

  return { 
    valid, 
    errors: valid ? null : errors,
    cleaned: valid ? { lat: numLat, lng: numLng } : null
  };
}

/**
 * التحقق من عنوان URL
 */
export function validateURL(url, optional = true) {
  if (!url || url.trim() === '') {
    if (optional) {
      return { valid: true };
    }
    return { valid: false, error: 'الرابط مطلوب' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'الرابط يجب أن يبدأ بـ http:// أو https://' };
    }
    return { valid: true, cleaned: url.trim() };
  } catch {
    return { valid: false, error: 'رابط غير صحيح' };
  }
}

/**
 * التحقق من وصف المنتج
 */
export function validateDescription(description, maxLength = 500) {
  if (!description || description.trim() === '') {
    return { valid: true }; // اختياري
  }

  if (description.length > maxLength) {
    return { 
      valid: false, 
      error: `الوصف طويل جداً (حد أقصى ${maxLength} حرف)` 
    };
  }

  return { valid: true, cleaned: description.trim() };
}

/**
 * التحقق من فئة المنتج
 */
export function validateCategory(category) {
  const validCategories = ['panels', 'batteries', 'inverters', 'accessories'];
  
  if (!category) {
    return { valid: false, error: 'الفئة مطلوبة' };
  }

  if (!validCategories.includes(category)) {
    return { valid: false, error: 'فئة غير صحيحة' };
  }

  return { valid: true };
}

/**
 * التحقق من بيانات المنتج كاملة
 */
export function validateProductData(data) {
  const errors = {};

  const nameValidation = validateShopName(data.name);
  if (!nameValidation.valid) errors.name = nameValidation.error;

  const priceValidation = validatePrice(data.price);
  if (!priceValidation.valid) errors.price = priceValidation.error;

  const categoryValidation = validateCategory(data.category);
  if (!categoryValidation.valid) errors.category = categoryValidation.error;

  if (data.description) {
    const descValidation = validateDescription(data.description);
    if (!descValidation.valid) errors.description = descValidation.error;
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors: valid ? null : errors,
    cleaned: valid ? {
      name: nameValidation.cleaned || data.name,
      price: priceValidation.cleaned,
      category: data.category,
      description: data.description?.trim() || ''
    } : null
  };
}

/**
 * التحقق من بيانات التاجر كاملة
 */
export function validateMerchantData(data) {
  const errors = {};

  const nameValidation = validateShopName(data.name);
  if (!nameValidation.valid) errors.name = nameValidation.error;

  const phoneValidation = validateYemenPhone(data.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error;

  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'العنوان يجب أن يكون 5 أحرف على الأقل';
  }

  if (data.lat || data.lng) {
    const coordValidation = validateCoordinates(data.lat, data.lng);
    if (!coordValidation.valid) {
      Object.assign(errors, coordValidation.errors);
    }
  }

  // التحقق من روابط السوشيال ميديا (اختيارية)
  if (data.facebook_url) {
    const fbValidation = validateURL(data.facebook_url);
    if (!fbValidation.valid) errors.facebook_url = fbValidation.error;
  }

  if (data.instagram_url) {
    const igValidation = validateURL(data.instagram_url);
    if (!igValidation.valid) errors.instagram_url = igValidation.error;
  }

  if (data.website_url) {
    const webValidation = validateURL(data.website_url);
    if (!webValidation.valid) errors.website_url = webValidation.error;
  }

  const valid = Object.keys(errors).length === 0;

  return { valid, errors: valid ? null : errors };
}