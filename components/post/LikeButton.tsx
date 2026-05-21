'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toggleLike } from '@/app/actions/likes';

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
}

export default function LikeButton({ postId, initialCount, initialLiked }: LikeButtonProps) {
  const t = useTranslations('post');
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const next = !liked;
    setLiked(next);
    setCount(next ? count + 1 : count - 1);
    startTransition(async () => { await toggleLike(postId); });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex flex-col items-center gap-1 text-xs transition-colors ${
        liked ? 'text-red-500' : 'text-tx-muted hover:text-red-400'
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{t('likeCount', { count })}</span>
    </button>
  );
}
