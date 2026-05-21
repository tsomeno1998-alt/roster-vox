'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toggleFollow } from '@/app/actions/follows';
import Button from '@/components/ui/Button';

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
}

export default function FollowButton({ targetUserId, initialFollowing }: FollowButtonProps) {
  const t = useTranslations('profile');
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setFollowing(!following);
    startTransition(async () => { await toggleFollow(targetUserId); });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={following ? 'secondary' : 'primary'}
      fullWidth
    >
      {following ? t('unfollow') : t('follow')}
    </Button>
  );
}
