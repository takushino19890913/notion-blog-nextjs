import React, { useEffect } from 'react';
import Image from 'next/image';
import { useImageLoadingContext } from '../context/image-loading-context';

interface LoadableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const LoadableImage: React.FC<LoadableImageProps> = ({ src, alt, width, height }) => {
  const { setLoadingImages } = useImageLoadingContext();

  useEffect(() => {
    setLoadingImages((prev) => prev + 1);
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setLoadingImages((prev) => prev - 1);
    };
    // The next line is to fix the error "Only a void function can be called with the 'new' keyword."
    return () => {};
  }, [src, setLoadingImages]);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={true}
    />
  );
};

export default LoadableImage;
