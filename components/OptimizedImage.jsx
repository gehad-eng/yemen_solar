// components/OptimizedImage.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '../lib/constants'; // أضف هذا السطر

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  width,
  height,
  priority = false,
  fill = false,
  objectFit = 'cover',
  fallback = PLACEHOLDER_IMAGE, // غيّر القيمة الافتراضية
  onError,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallback);
    if (onError) onError();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      
      {fill ? (
        <Image
          src={imgSrc || fallback}
          alt={alt}
          fill
          style={{ objectFit }}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={handleError}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          {...props}
        />
      ) : (
        <Image
          src={imgSrc || fallback}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={handleError}
          priority={priority}
          {...props}
        />
      )}
    </div>
  );
}