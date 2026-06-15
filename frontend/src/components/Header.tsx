'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/#buscar', label: 'Historial' },
    { href: '/login', label: 'Acceso Cliente' },
    { href: '/admin', label: 'Staff', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-diesel-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo size="sm" />

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                  pathname === link.href
                    ? 'text-diesel-blue-light'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.icon && <link.icon size={14} />}
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
