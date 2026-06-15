import { MapPin, Phone, Wrench, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="section-divider mb-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a href="https://maps.app.goo.gl/WBkJKqowQqAm7nWF7" target="_blank" rel="noopener noreferrer">
            <div className="card-glass p-5 flex items-start gap-4">
              <MapPin className="text-diesel-blue-light shrink-0 mt-0.5" size={22} />
              <div>
                <p className="text-sm text-gray-400 mb-1">Dirección</p>
                <p className="text-white text-sm leading-relaxed">
                San Luis de Macúl 6138, Peñalolén, Región Metropolitana
                </p>
              </div>
            </div>
            </a>
          <a
            href="https://wa.me/56983669909"
            target="_blank"
            rel="noopener noreferrer"
            className="card-glass p-5 flex items-start gap-4 hover:border-green-500/30 transition-colors group"
          >
            <Phone className="text-green-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={22} />
            <div>
              <p className="text-sm text-gray-400 mb-1">WhatsApp</p>
              <p className="text-white font-semibold">+56 9 8366 9909</p>
            </div>
          </a>

          <div className="card-glass p-5 flex items-start gap-4 border-diesel-blue/20">
            <ShieldCheck className="text-diesel-blue-light shrink-0 mt-0.5" size={22} />
            <div>
              <p className="text-sm text-diesel-blue-light font-semibold uppercase tracking-wide">
                Especialistas en
              </p>
              <p className="text-white text-sm mt-1">
                Diagnóstico Electrónico Kia & Hyundai
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-diesel-blue/20 border-t border-diesel-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center gap-3">
          <Wrench className="text-diesel-blue-light" size={18} />
          <p className="text-sm text-gray-300 tracking-wide uppercase">
            Tu vehículo en las mejores manos, hoy y siempre.
          </p>
        </div>
      </div>
    </footer>
  );
}
