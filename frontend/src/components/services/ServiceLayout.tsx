// src/components/services/ServiceLayout.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ServiceLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  bullets: string[];
}

export default function ServiceLayout({ title, subtitle, icon: Icon, description, bullets }: ServiceLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-diesel-blue/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative animate-fade-in">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-diesel-blue-light mb-12 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-diesel-blue/10 border border-diesel-blue/30 animate-pulse-glow shrink-0">
            <Icon size={48} className="text-diesel-blue-light" />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white mb-2">
              {title}
            </h1>
            <p className="font-script text-2xl md:text-3xl text-diesel-blue-light glow-text">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="card-glass p-8 md:p-10 mb-12">
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {description}
          </p>
          
          <h3 className="font-display text-2xl uppercase tracking-wide text-white mb-6">
            Detalles del Servicio
          </h3>
          <ul className="grid sm:grid-cols-2 gap-4">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-400">
                <CheckCircle2 className="w-6 h-6 text-diesel-blue-light shrink-0" />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}