'use client';

import { useState } from 'react';
import { Copy, Check, X, Share2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RoomShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

export function RoomShareDialog({ isOpen, onClose, roomCode }: RoomShareDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const shareUrl = `${origin}/room/${roomCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7657E8]/10 text-[#7657E8] flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text)]">Invite to conversation</h3>
            <p className="text-xs text-[var(--text-secondary)]">Anyone with this link can join instantly</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
            Invitation Link
          </label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={shareUrl}
              className="text-xs sm:text-sm bg-[var(--surface-secondary)] select-all"
            />
            <Button
              type="button"
              variant={copied ? 'secondary' : 'primary'}
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#16A36A]" />
                  <span className="text-xs text-[#16A36A]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <ShieldAlert className="w-4 h-4 text-[#7657E8] shrink-0 mt-0.5" />
          <p>
            Share this link only with people you trust. When this room expires, this link will automatically become invalid and all messages will be wiped.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose} size="sm">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
