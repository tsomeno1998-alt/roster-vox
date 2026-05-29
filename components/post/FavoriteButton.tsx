'use client';

import { useState, useTransition } from 'react';
import { toggleFavorite } from '@/app/actions/favorites';

interface FavoriteButtonProps {
  postId: string;
  initialFavorited: boolean;
  isLoggedIn?: boolean;
  size?: 'sm' | 'md';
}

export default function FavoriteButton({
  postId,
  initialFavorited,
  isLoggedIn = true,
  size = 'md',
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const dim = size === 'sm' ? 16 : 22;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || isPending) return;
    const next = !favorited;
    setFavorited(next);
    startTransition(async () => { await toggleFavorite(postId); });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending || !isLoggedIn}
      className={`transition-colors ${
        favorited ? 'text-amber-400' : 'text-tx-muted hover:text-amber-400'
      } ${size === 'md' ? 'flex flex-col items-center gap-1 text-xs' : ''}`}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}
