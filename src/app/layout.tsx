import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'GroupFund AI — Manage Money Together. Fund Innovation Together.',
  description:
    'Unified financial collaboration platform for group expense splitting with AI receipt scanning, optimal settlement calculator, and student innovation crowdfunding with PayPal Sandbox checkout.',
  keywords: [
    'Group Expenses',
    'Split Bills',
    'Robotics Crowdfunding',
    'Student Innovation',
    'AI Receipt Scanner',
    'Gemini AI',
    'PayPal Sandbox',
    'Settlement Calculator',
  ],
  authors: [{ name: 'GroupFund AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-blue-600 selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
