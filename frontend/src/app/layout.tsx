import type { Metadata } from 'next';
import { Anton, Dancing_Script, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ServiDiesel | Historial de Servicios',
  description:
    'Consulta el historial de servicios de tu vehículo Kia o Hyundai. Especialistas en diagnóstico electrónico diesel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${dancing.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
