'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[var(--surface)] group-[.toaster]:text-[var(--text)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4',
          description: 'group-[.toast]:text-[var(--text-secondary)] group-[.toast]:text-xs',
          actionButton:
            'group-[.toast]:bg-[#7657E8] group-[.toast]:text-white group-[.toast]:font-semibold group-[.toast]:text-xs group-[.toast]:rounded-xl group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:hover:bg-[#6545D5] cursor-pointer',
          cancelButton:
            'group-[.toast]:bg-[var(--surface-secondary)] group-[.toast]:text-[var(--text)] group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:px-2.5 cursor-pointer',
        },
      }}
      {...props}
    />
  );
}
