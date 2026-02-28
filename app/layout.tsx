import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Touch Memories — Фотокартки та Фотокниги',
  description: 'Зберігайте найкращі моменти життя з Touch Memories. Друк фотокарток, фотокниг та магнітів.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full antialiased font-sans">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <Header />
        <main className="flex-grow flex flex-col pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
