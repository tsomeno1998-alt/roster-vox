'use client';

import { useRef, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { addComment } from '@/app/actions/comments';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface CommentFormProps {
  postId: string;
  avatarUrl?: string | null;
  username?: string;
}

export default function CommentForm({ postId, avatarUrl, username }: CommentFormProps) {
  const t = useTranslations('post');
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addComment(postId, formData);
      formRef.current?.reset();
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 items-start">
      <input type="hidden" name="type" value="comment" />
      <Avatar src={avatarUrl} username={username} size="sm" />
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          name="body"
          rows={1}
          placeholder={t('commentPlaceholder')}
          required
          onInput={autoResize}
          className="w-full px-3 py-2 rounded-xl border border-bd bg-surface-alt text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary resize-none overflow-hidden leading-relaxed"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? t('commentPosting') : t('commentSubmit')}
          </Button>
        </div>
      </div>
    </form>
  );
}
