import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  containerClassName?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackLabel,
  className = '',
  containerClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EDE3] via-[#EBE2D5] to-[#E2D6C5] text-[#5A463F] p-6 text-center select-none ${containerClassName || className}`}
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-8 h-8 text-[#6E2632]/70 mb-2 stroke-[1.25]" />
        <span className="font-serif-display text-base italic text-[#231815]">
          {fallbackLabel || alt}
        </span>
        <span className="text-xs text-[#846F67] mt-1">Chéri Café · Osmanpura</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
