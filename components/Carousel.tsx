import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useWindowDimensions from '../hooks/Dimension';

// 画像の型定義
interface CarouselProps {
  images: { src: string, href: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  // 現在表示している画像のインデックス
  const [current, setCurrent] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // トランジション中かどうかのステート
  const [transitioning, setTransitioning] = useState(false);

  if (typeof window !== 'undefined') {
    let { h, w } = useWindowDimensions();
    useEffect(() => {
      setHeight(h);
      setWidth(w);
    }, [w, h]);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  // 現在、次、次の次、そして次の次の次の画像を取得するヘルパー関数
  const getImagesToShow = () => {
    const indices = Array.from({ length: 4 }, (_, i) => (current + i) % images.length);
    return indices.map(index => images[index]);
  };

  return (
    <div className="relative overflow-hidden">
      {/* 画像のトランジション */}
      <div
        className={`flex ${transitioning ? 'transition-transform duration-500 ease-in-out' : 'transition-none'}`}
        style={{ transform: transitioning ? `translateX(-${100 / 3}%)` : 'translateX(0)' }}
        onTransitionEnd={() => {
          if (transitioning) {
            setTransitioning(false);
            setCurrent(prev => (prev + 1) % images.length);
          }
        }}
      >
        {/* 画像の表示 */}
        {getImagesToShow().map((image, index) => (
          <Link className="flex-none w-1/3" key={index} href={image.href}>
            <Image src={image.src} alt={`Slide ${index}`} width={2388} height={2710} className="border-2 border-[#cccccc] h-full mr-auto" style={{ objectFit: 'cover', objectPosition:'top left', width:width * 6 / 25  }} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
