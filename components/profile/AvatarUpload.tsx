'use client';

import { useRef, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/compressImage';
import { updateAvatar } from '@/app/actions/profile';
import Avatar from '@/components/ui/Avatar';

interface Props {
  userId: string;
  initialUrl?: string | null;
  displayName: string;
}

export default function AvatarUpload({ userId, initialUrl, displayName }: Props) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxPx: 400, quality: 0.85 });
      const path = `${userId}/${Date.now()}.jpg`;
      const supabase = createClient();

      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const newUrl = data.publicUrl;
      setUrl(newUrl);

      startTransition(async () => {
        await updateAvatar(newUrl);
      });
    } catch (err) {
      console.error('avatar upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const busy = uploading || isPending;

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="relative group"
      >
        <Avatar src={url} username={displayName} size="lg" />
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          {busy ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2"
              className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </div>
      </button>
      <p className="text-xs text-tx-muted">タップして変更</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}
