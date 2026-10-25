// lib/imageCompression.js
/**
 * ضغط الصورة قبل الرفع
 * @param {File} file - ملف الصورة الأصلي
 * @param {Object} options - خيارات الضغط
 * @returns {Promise<File>} - ملف الصورة المضغوطة
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    maxSizeMB = 1
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // تحويل Canvas إلى Blob بجودة محددة
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('فشل ضغط الصورة'));
              return;
            }

            // التحقق من حجم الملف
            const fileSizeMB = blob.size / 1024 / 1024;
            
            if (fileSizeMB > maxSizeMB && quality > 0.5) {
              // إعادة المحاولة بجودة أقل
              const newQuality = quality - 0.1;
              compressImage(file, { ...options, quality: newQuality })
                .then(resolve)
                .catch(reject);
              return;
            }

            // تحويل Blob إلى File
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            console.log(`✅ ضغط الصورة: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('فشل تحميل الصورة'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    reader.readAsDataURL(file);
  });
}

/**
 * ضغط مجموعة من الصور
 */
export async function compressMultipleImages(files, options = {}) {
  const compressed = [];
  
  for (const file of files) {
    try {
      const compressedFile = await compressImage(file, options);
      compressed.push(compressedFile);
    } catch (error) {
      console.error('خطأ في ضغط الصورة:', error);
      compressed.push(file); // استخدام الصورة الأصلية في حالة الفشل
    }
  }
  
  return compressed;
}

/**
 * التحقق من نوع الملف
 */
export function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'نوع الملف غير مدعوم. استخدم JPG, PNG, أو WebP' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'حجم الملف أكبر من 10MB' };
  }

  return { valid: true };
}