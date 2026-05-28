'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const SLIDES = [
  { img: '/promo/01_timeline.jpg', captionKey: 'promoSlide1Caption' },
  { img: '/promo/02_detail.jpg',   captionKey: 'promoSlide2Caption' },
  { img: '/promo/03_share.jpg',    captionKey: 'promoSlide3Caption' },
  { img: '/promo/04_qa.jpg',       captionKey: 'promoSlide4Caption' },
] as const;

const AUTOPLAY_MS = 3000;

export default function PromoCarousel() {
  const t = useTranslations('auth');
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const interactedRef = useRef(false);

  // sync dot to scroll position
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setCurrent(idx);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      if (interactedRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const next = (current + 1) % SLIDES.length;
      el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [current]);

  function goTo(idx: number) {
    interactedRef.current = true;
    containerRef.current?.scrollTo({ left: idx * containerRef.current.offsetWidth, behavior: 'smooth' });
  }

  return (
    <div className="w-full max-w-xs mt-8 mb-4">
      <div
        ref={containerRef}
        onTouchStart={() => { interactedRef.current = true; }}
        className="flex overflow-x-scroll snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {SLIDES.map(({ img, captionKey }, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full snap-center flex flex-col items-center px-6"
          >
            {/* phone frame */}
            <div className="border-[10px] border-[#1a1a1a] rounded-[28px] overflow-hidden shadow-lg w-[148px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className="w-full object-cover object-top"
                style={{ height: '300px' }}
              />
            </div>
            <p className="text-xs text-tx-muted text-center mt-3 leading-relaxed px-2">
              {t(captionKey)}
            </p>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="flex justify-center gap-2 mt-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === current ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-bd'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
