'use client';

import { useFormStatus } from 'react-dom';
import Button from './Button';
import type { ButtonHTMLAttributes } from 'react';

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  pendingLabel?: string;
  children: React.ReactNode;
}

export default function SubmitButton({
  children,
  pendingLabel,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !!disabled} {...props}>
      {pending ? (pendingLabel ?? '送信中...') : children}
    </Button>
  );
}
