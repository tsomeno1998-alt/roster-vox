'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/compressImage';

interface Props {
  name?: string;
  initialUrl?: string | null;
  userId: string;
  label: string;
  hint: string;
}

type Status = 'idle' | 'uploading' | 'done' | 'error';

export default function PhotoPicker({ name = 'photo_url', initialUrl, userId, label, hint }: Props) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [status, setStatus] = useState<Status>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setStatus('uploading');

    try {
      const compressed = await compressImage(file, { maxPx: 1200, quality: 0.82 });
      const path = `${userId}/${Date.now()}.jpg`;
      const supabase = createClient();

      const { error } = await supabase.storage
        .from('post-photos')
        .upload(path, compressed, { contentType: 'image/jpeg' });

      if (error) throw error;

      const { data } = supabase.storage.from('post-photos').getPublicUrl(path);
      setUrl(data.publicUrl);
      setStatus('done');
    } catch {
      setUrl(null);
      setStatus('error');
    } finally {
      URL.revokeObjectURL(localPreview);
    }
  };

  const remove = () => {
    setUrl(null);
    setPreview(null);
    setStatus('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input type="hidden" name={name} value={url ?? ''} />

      {preview ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-alt border border-bd">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="w-full h-full object-cover" />
          {status === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {status !== 'uploading' && (
            <button
              type="button"
              onClick={remove}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {status === 'error' && (
            <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-red-400">upload failed</p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-bd flex flex-col items-center justify-center gap-2 text-tx-muted hover:border-primary hover:text-primary transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs">{hint}</span>
        </button>
      )}

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
