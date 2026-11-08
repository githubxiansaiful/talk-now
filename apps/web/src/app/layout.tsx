import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'TalkNow — Instant Temporary Group Chat & Voice Rooms',
    template: '%s | TalkNow',
  },
  description:
    'Create a private, self-destructing group room, share one link, and collaborate over real-time text chat and live audio calls. Zero accounts, zero downloads, and no permanent logs.',
  keywords: [
    'temporary chat room',
    'private group chat',
    'ephemeral chat',
    'instant voice room',
    'no signup chat',
    'self-destructing chat room',
    'link-based group chat',
    'TalkNow',
  ],
  openGraph: {
    title: 'TalkNow — Instant Temporary Group Chat & Voice Rooms',
    description:
      'Create a private, self-destructing group room, share one link, and talk in real time. No accounts, no apps, no permanent logs.',
    type: 'website',
    siteName: 'TalkNow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkNow — Instant Temporary Group Chat & Voice Rooms',
    description:
      'Create a private, self-destructing group room, share one link, and talk in real time. No accounts, no apps, no permanent logs.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('talknow-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--text)] transition-colors duration-200">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
