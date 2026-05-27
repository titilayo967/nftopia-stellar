"use client";

import React, { useEffect, useRef } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useImageLoadingState } from '@/lib/hooks/useImageLoadingState';
import { IMAGE_DEFAULTS } from '@/lib/constants/imageDefaults';
import ImageSkeleton from './ImageSkeleton';

export interface OptimizedImageProps extends Omit<NextImageProps, 'alt' | 'src'> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  blurPlaceholder?: string;
  skeleton?: boolean;
  skeletonClassName?: string;
  containerClassName?: string;
  imageClassName?: string;
  retryDelay?: number;
  maxRetries?: number;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  blurPlaceholder,
  skeleton = true,
  skeletonClassName,
  containerClassName,
  imageClassName,
  sizes,
  priority = false,
  quality,
  retryDelay,
  maxRetries,
  ...rest
}: OptimizedImageProps) {
  const resolvedFallback = fallbackSrc || IMAGE_DEFAULTS.fallback.nft;
  const { state, setError, retry, setSuccess } = useImageLoadingState(src, {
    fallbackSrc: resolvedFallback,
    maxRetries: maxRetries ?? 2,
    retryDelay: retryDelay ?? 3000,
  });

  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (state === 'success') {
      // smooth fade-in handled via CSS class
    }
  }, [state]);

  const handleError = (e?: any) => {
    console.error('Image failed to load', { src, error: e });
    setError(new Error('Image failed to load'));
  };

  const onLoadingComplete = () => {
    setSuccess();
  };

  const showSkeleton = skeleton && state === 'loading';

  return (
    <div
      ref={imgRef}
      className={containerClassName}
      aria-busy={state === 'loading'}
      aria-label={state === 'loading' ? `Loading ${alt}` : undefined}
    >
      {showSkeleton && <ImageSkeleton className={skeletonClassName} />}

      {state !== 'error' && src ? (
        <NextImage
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          quality={quality ?? IMAGE_DEFAULTS.quality.default}
          onError={handleError}
          onLoadingComplete={onLoadingComplete}
          className={`${imageClassName} ${state === 'success' ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}`}
          {...(rest as any)}
        />
      ) : (
        // fallback image
        <NextImage
          src={resolvedFallback}
          alt={`Fallback for ${alt}`}
          sizes={sizes}
          quality={IMAGE_DEFAULTS.quality.avatar}
          className={`${imageClassName} opacity-100`}
          {...(rest as any)}
        />
      )}

      {state === 'error' && (
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => retry()}
            className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
