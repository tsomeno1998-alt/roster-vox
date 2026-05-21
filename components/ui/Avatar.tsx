import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeMap = {
  xs: { px: 24, cls: 'w-6 h-6 text-xs' },
  sm: { px: 32, cls: 'w-8 h-8 text-sm' },
  md: { px: 40, cls: 'w-10 h-10 text-base' },
  lg: { px: 64, cls: 'w-16 h-16 text-xl' },
};

export default function Avatar({ src, alt, username, size = 'md' }: AvatarProps) {
  const { px, cls } = sizeMap[size];
  const fallback = username ? username[0].toUpperCase() : '?';

  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? username ?? 'avatar'}
        width={px}
        height={px}
        className={`${cls} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${cls} rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold flex-shrink-0`}
    >
      {fallback}
    </div>
  );
}
