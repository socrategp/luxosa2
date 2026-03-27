import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-deep text-ivory/70 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-ivory/8">
          <div className="lg:col-span-1">
            <Link to="/">
              <span className="font-serif text-[24px] tracking-[0.3em] font-light text-ivory">LUXOSA</span>
            </Link>
            <p className="mt-4 text-[13px] leading-[1.8] font-light text-ivory/40">
              Maison di cura evoluta<br />per cute e capelli.
            </p>
            <div className="mt-6 w-8 h-[1px] bg-brass/40" />
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Navigazione</h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Brand', href: '/' },
                { label: 'La Maison', href: '/la-maison' },
                { label: 'Il Metodo', href: '/il-metodo' },
                { label: 'I Percorsi', href: '/i-percorsi' },
                { label: 'L\'Esperienza', href: '/esperienza' },
                { label: 'La Tua Soluzione', href: '/la-tua-soluzione' },
                { label: 'Sedi', href: '/sedi' },
                { label: 'Contatti', href: '/contatti' },
              ].map((item) => (
                <Link key={item.label} to={item.href} className="text-[13px] font-light text-ivory/45 hover:text-ivory/80 transition-colors duration-400 tracking-wide">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Contatti</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+390000000000" className="flex items-center gap-3 text-[13px] font-light text-ivory/45 hover:text-ivory/80 transition-colors">
                <Phone size={14} strokeWidth={1.3} className="text-brass/50" />+39 090 240 3220
              </a>
              <a href="mailto:info@luxosa.it" className="flex items-center gap-3 text-[13px] font-light text-ivory/45 hover:text-ivory/80 transition-colors">
                <Mail size={14} strokeWidth={1.3} className="text-brass/50" />messinacavour@luxosa.it
              </a>
              <div className="flex items-start gap-3 text-[13px] font-light text-ivory/45">
                <MapPin size={14} strokeWidth={1.3} className="text-brass/50 flex-shrink-0 mt-0.5" />
                <span>Via Cavour, 1<br />Messina, Italia</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Orari</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[13px] font-light text-ivory/45">
                <Clock size={14} strokeWidth={1.3} className="text-brass/50" />
                <div><p>Martedì — Venerdì</p><p>09:00 — 18:30</p></div>
                <div><p>Sabato</p><p>09:00 — 19:00</p></div>
              </div>
              <p className="text-[12px] font-light text-ivory/30 mt-2">Domenica e Lunedì chiuso<br />Su appuntamento</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] tracking-[0.15em] text-ivory/25 font-light">© 2025 Luxosa. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[11px] tracking-[0.1em] text-ivory/25 hover:text-ivory/50 font-light transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] tracking-[0.1em] text-ivory/25 hover:text-ivory/50 font-light transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
