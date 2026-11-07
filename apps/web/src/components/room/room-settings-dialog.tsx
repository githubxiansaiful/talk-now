'use client';

import { useState, useEffect } from 'react';
import { X, LogOut, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoomSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isCreator: boolean;
  onLeaveRoom: () => void;
  onCloseRoom: () => void;
}

export function RoomSettingsDialog({
  isOpen,
  onClose,
  isCreator,
  onLeaveRoom,
  onCloseRoom,
}: RoomSettingsDialogProps) {
  const [confirmAction, setConfirmAction] = useState<'close' | 'leave' | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setConfirmAction(null);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmAction) {
          setConfirmAction(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirmAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Confirmation Alert Dialog for End Room */}
        {confirmAction === 'close' ? (
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#DC4C4C] flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1.5">End Room Permanently?</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Are you sure you want to end this room? All participants will be disconnected immediately and all messages will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setConfirmAction(null);
                  onClose();
                  onCloseRoom();
                }}
              >
                Yes, End Room
              </Button>
            </div>
          </div>
        ) : confirmAction === 'leave' ? (
          /* Confirmation Alert Dialog for Leave Room */
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1.5">Leave Conversation?</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Are you sure you want to leave this room? You can only rejoin if the room is still active and you have the invite link.
            </p>
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setConfirmAction(null);
                  onClose();
                  onLeaveRoom();
                }}
              >
                Yes, Leave Room
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Room Controls Panel */
          <>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1">Room Controls</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-5">
              {isCreator ? 'Manage or terminate this conversation room' : 'Conversation options'}
            </p>

            <div className="space-y-3">
              {isCreator && (
                <div className="p-3.5 rounded-xl border border-[var(--danger-light)] bg-[var(--danger-light)]/40 dark:bg-rose-950/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#DC4C4C] mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Close Room For Everyone
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-3">
                    Immediately closes this room and disconnects all members. This cannot be undone.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setConfirmAction('close')}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    End Room Permanently
                  </Button>
                </div>
              )}

              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)] mb-1">
                  <LogOut className="w-4 h-4 text-[var(--text-secondary)]" />
                  Leave Conversation
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Exit this room. You can rejoin using the invite link as long as the room is active.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setConfirmAction('leave')}
                >
                  Leave Room
                </Button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#16A36A]" />
                Encrypted in transit
              </span>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
