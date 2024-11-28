'use client';
import Image from 'next/image';
import { useState } from 'react';

export function FallbackImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Image
        src={error ? '/images/placeholder-1.png' : src}
        alt={alt}
        fill
        className={error ? 'object-contain rounded-lg bg-gray-100 p-4 blur-[3px] opacity-30' : 'object-cover rounded-lg'}
        onError={() => setError(true)}
        priority
      />
    </div>
  );
}