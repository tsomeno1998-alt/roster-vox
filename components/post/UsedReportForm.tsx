'use client';

import { useRef, useState, useTransition } from 'react';
import { addComment } from '@/app/actions/comments';
import Button from '@/components/ui/Button';

interface UsedReportFormProps {
  postId: string;
  factions: { id: string; name: string; group: string }[];
}

export default function UsedReportForm({ postId, factions }: UsedReportFormProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addComment(postId, formData);
      formRef.current?.reset();
      setOpen(false);
    });
  };

  if (!open) {
    return (
      <Button variant="secondary" fullWidth onClick={() => setOpen(true)}>
        使ってみた報告を投稿
      </Button>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-surface-alt rounded-2xl p-4 space-y-3">
      <input type="hidden" name="type" value="used" />
      <h4 className="font-semibold text-tx text-sm">使ってみた報告</h4>

      {/* Result */}
      <div>
        <label className="block text-xs text-tx-muted mb-1.5">対戦結果（任意）</label>
        <div className="flex gap-2">
          {[
            { value: 'win', label: '勝ち' },
            { value: 'loss', label: '負け' },
            { value: 'draw', label: '引き分け' },
          ].map(({ value, label }) => (
            <label key={value} className="cursor-pointer flex-1">
              <input type="radio" name="result" value={value} className="sr-only peer" />
              <span className="block text-center py-1.5 rounded-lg border border-bd text-xs text-tx-muted peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Opponent faction */}
      <div>
        <label className="block text-xs text-tx-muted mb-1">相手アーミー（任意）</label>
        <select
          name="opponent_faction_id"
          className="w-full px-3 py-2 rounded-xl border border-bd bg-surface text-sm text-tx focus:outline-none focus:border-primary"
        >
          <option value="">選択しない</option>
          {factions.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs text-tx-muted mb-1">感想（任意）</label>
        <textarea
          name="body"
          rows={3}
          placeholder="使ってみた感想を書いてください"
          className="w-full px-3 py-2 rounded-xl border border-bd bg-surface text-sm text-tx placeholder:text-tx-light focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? '投稿中...' : '報告を投稿'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
