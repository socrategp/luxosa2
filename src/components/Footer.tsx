import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep text-ivory/70 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-ivory/10">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <Link to="/">
              <img
                src="/images/luxosa-logo-orizzontale-bianco-tras.png"
                alt="Luxosa"
                className="h-8 md:h-9 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="mt-5 text-[13px] leading-[1.8] font-light text-ivory/40">
              Maison di cura evoluta<br />per cute e capelli.
            </p>
            <p className="mt-1 text-[12px] font-light text-ivory/25 tracking-wide">Messina</p>
            <div className="mt-6 w-8 h-[1px] bg-brass/40" />
            <p className="mt-5 text-[10px] tracking-[0.35em] uppercase text-brass-light/50 font-light">
              Ama. Splendi. Osa.
            </p>
          </div>

          {/* Col 2 — Navigazione */}
          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Navigazione</h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'La Maison', href: '/' },
                { label: 'Il Metodo', href: '/il-metodo' },
                { label: 'I Percorsi', href: '/i-percorsi' },
                { label: "L'Esperienza", href: '/esperienza' },
                { label: 'Sedi', href: '/sedi' },
                { label: 'Contatti', href: '/contatti' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-[13px] font-light text-ivory/45 hover:text-ivory/80 transition-colors duration-400 tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Club Luxosa */}
          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Club Luxosa</h4>
            <p className="text-[13px] font-light text-ivory/40 leading-[1.8] mb-6">
              Un accesso riservato. Un riconoscimento che si guadagna nel tempo.
            </p>
            <div className="flex gap-2 mb-7">
              {['AMA', 'SPLENDI', 'OSA'].map((badge) => (
                <span
                  key={badge}
                  className="text-[9px] tracking-[0.22em] uppercase font-light text-brass-light/70 border border-brass-light/30 px-2.5 py-1"
                >
                  {badge}
                </span>
              ))}
            </div>
            <Link
              to="/contatti"
              className="text-[11px] tracking-[0.2em] uppercase font-light text-ivory/40 hover:text-ivory/70 transition-colors duration-400 inline-flex items-center gap-2"
            >
              Scopri il Club →
            </Link>
          </div>

          {/* Col 4 — Legal placeholder / empty */}
          <div className="hidden lg:block" />
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] tracking-[0.15em] text-ivory/25 font-light">© 2026 Luxosa. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-[11px] tracking-[0.1em] text-ivory/25 hover:text-ivory/50 font-light transition-colors">Privacy Policy</Link>
            <Link to="/cookie-policy" className="text-[11px] tracking-[0.1em] text-ivory/25 hover:text-ivory/50 font-light transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
