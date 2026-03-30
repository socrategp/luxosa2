import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep text-ivory/70 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 pb-16 border-b border-ivory/10">
          <div>
            <Link to="/">
              <img
                src="/images/luxosa-logo-orizzontale-bianco-tras.png"
                alt="Luxosa"
                className="h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="mt-4 text-[13px] leading-[1.8] font-light text-ivory/40">
              Maison di cura evoluta<br />per cute e capelli.
            </p>
            <div className="mt-6 w-8 h-[1px] bg-brass/40" />
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Navigazione</h4>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { label: 'La Maison', href: '/' },
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
        </div>

        <div className="pt-20 lg:pt-24 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-ivory/10 pb-8">
          <p className="text-[11px] tracking-[0.15em] text-ivory/25 font-light">© 2025 Luxosa. Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-[11px] tracking-[0.1em] text-ivory/25 hover:text-ivory/50 font-light transition-colors">Privacy Policy</Link>
            <Link to="/cookie-policy" className="text-[11px] tracking-[0.1em] text-ivory/25 hover:text-ivory/50 font-light transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
