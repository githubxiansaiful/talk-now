import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error trying to process your request.',
  onRetry,
  showHomeLink = true,
}: ErrorStateProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-[var(--danger-light)] text-[#DC4C4C] flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
      <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
        {message}
      </p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
        )}
        {showHomeLink && (
          <Link href="/">
            <Button size="sm">Return Home</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
