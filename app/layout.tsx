import type { Metadata } from 'next';
import { Orbitron, Rajdhani, Outfit, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-disp' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-head' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-body' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'KIRIJO - Wish Journal',
  description: 'A beautiful, smooth-animated wish journal.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${outfit.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="font-body antialiased bg-bg text-text selection:bg-accent/30 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
