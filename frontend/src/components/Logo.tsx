import Link from 'next/link';
import { Cog, Fuel } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 20, servi: 'text-lg', diesel: 'text-lg', tag: 'text-[10px]' },
    md: { icon: 28, servi: 'text-2xl', diesel: 'text-2xl', tag: 'text-xs' },
    lg: { icon: 36, servi: 'text-4xl', diesel: 'text-4xl', tag: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative flex items-center">
        <Cog
          size={s.icon}
          className="text-diesel-blue-light animate-[spin_20s_linear_infinite] opacity-80"
        />
        <Fuel
          size={s.icon * 0.55}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </div>
      <div>
        <div className="flex items-baseline leading-none">
          <span className={`${s.servi} font-display italic font-bold tracking-tight text-white`}>
            SERVI
          </span>
          <span className={`${s.diesel} font-display italic font-bold tracking-tight text-diesel-blue-light glow-text`}>
            DIESEL
          </span>
        </div>
        <p className={`${s.tag} text-diesel-blue-light/80 tracking-widest uppercase mt-0.5`}>
          Especialistas en Kia & Hyundai
        </p>
      </div>
    </Link>
  );
}
