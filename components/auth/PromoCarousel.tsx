'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const SLIDES = [
  { img: '/promo/01_timeline.jpg', captionKey: 'promoSlide1Caption' },
  { img: '/promo/02_detail.jpg',   captionKey: 'promoSlide2Caption' },
  { img: '/promo/03_qr.jpg',       captionKey: 'promoSlide3Caption' },
  { img: '/promo/04_qa.jpg',       captionKey: 'promoSlide4Caption' },
] as const;

export default function PromoCarousel() {
  const t = useTranslations('auth');
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      setCurrent(Math.round(el.scrollLeft / el.offsetWidth));
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  function goTo(idx: number) {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
  }

  return (
    <div className="w-full max-w-xs mt-8 mb-6">
      {/* slides */}
      <div
        ref={containerRef}
        className="flex overflow-x-scroll snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {SLIDES.map(({ img, captionKey }, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full snap-center flex flex-col items-center px-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt=""
              className="mx-auto w-[200px] rounded-2xl shadow-sm"
            />
            <p className="text-xs text-tx-muted text-center mt-3 leading-relaxed">
              {t(captionKey)}
            </p>
          </div>
        ))}
      </div>

      {/* dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-200 ${
              i === current ? 'w-4 h-2 bg-primary' : 'w-2 h-2 bg-bd'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
