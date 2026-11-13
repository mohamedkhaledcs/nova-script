import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/game/CustomCursor/CustomCursor';

export const metadata: Metadata = {
  title: 'NovaScript | Space Mission Design & Operations Simulator',
  description:
    'An interactive educational space mission design and flight operations game. Design, launch, and operate deep-space robotic probes to the Moon and Mars.',
  icons: {
    icon: '/assets/characters/player.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-space-950 text-slate-100 min-h-screen">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
