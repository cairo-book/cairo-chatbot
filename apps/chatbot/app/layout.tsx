import { Toaster } from 'react-hot-toast';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from "next";

import '../app/global.css';

import { cn } from '../lib/utils';
import { Header } from '../components/header';
import { Providers } from '../components/provider';

export const metadata: Metadata = {
  title: "Cairo chatbot",
  description: "Discuss and learn about Cairo with our AI-powered chatbot",
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}