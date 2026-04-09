import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { premiumEase } from '../lib/animations';

function ClubModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: premiumEase }}
          className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-deep/85 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.6, ease: premiumEase, delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-ivory max-w-[560px] w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-anthracite/30 hover:text-anthracite/60 transition-colors"
            >
              <X size={18} strokeWidth={1.2} />
            </button>

            {/* Content */}
            <div className="px-8 sm:px-12 py-14 sm:py-16">
              {/* Label */}
              <div className="text-center mb-10">
                <span className="text-[10px] tracking-[0.4em] uppercase text-brass-muted font-light">
                  Accesso riservato
                </span>
                <div className="w-8 h-[1px] bg-brass mx-auto mt-4 mb-8" />
                <h3 className="font-serif text-[30px] md:text-[36px] font-light text-charcoal leading-[1.08] tracking-wide">
                  Club Luxosa
                </h3>
              </div>

              {/* Intro */}
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light text-center mb-4">
                Un accesso riservato a una selezione di clienti già parte del mondo Luxosa.
              </p>
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light text-center mb-10">
                Il Club nasce per offrire un'esperienza ancora più esclusiva, fatta di priorità, attenzioni dedicate e occasioni selezionate.
              </p>

              {/* Separator */}
              <div className="w-6 h-[1px] bg-sand mx-auto mb-10" />

              {/* Benefits */}
              <p className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light mb-5 text-center">
                Benefici riservati alle membri
              </p>
              <ul className="space-y-3.5 mb-10 max-w-[380px] mx-auto">
                {[
                  'Priorità sull\'agenda',
                  'Accesso a giornate riservate',
                  'Attenzioni e proposte personalizzate',
                  'Priorità su novità ed esperienze dedicate',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-brass mt-2.5 shrink-0" />
                    <span className="text-[16px] md:text-[17px] leading-[1.8] text-anthracite/60 font-light">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Separator */}
              <div className="w-6 h-[1px] bg-sand mx-auto mb-10" />

              {/* Access restriction */}
              <div className="text-center mb-2">
                <p className="text-[16px] md:text-[17px] leading-[1.85] text-anthracite/55 font-light mb-1.5">
                  L'accesso non è aperto al pubblico.
                </p>
                <p className="text-[16px] md:text-[17px] leading-[1.85] text-anthracite/55 font-light">
                  È consentito esclusivamente alle clienti già attive del salone, solo su invito diretto di Luxosa o su proposta approvata internamente.
                </p>
              </div>
            </div>

            {/* Bottom brass accent */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-brass/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Footer() {
  const [clubOpen, setClubOpen] = useState(false);

  return (
    <>
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
              <p className="mt-5 text-[16px] leading-[1.8] font-light text-ivory/40">
                Maison di cura e bellezza<br />per cute e capelli.
              </p>
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
                    className="text-[16px] font-light text-ivory/45 hover:text-ivory/80 transition-colors duration-400 tracking-wide"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 — Club Luxosa */}
            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/50 font-light mb-6">Club Luxosa</h4>
              <p className="text-[16px] font-light text-ivory/40 leading-[1.8] mb-6">
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
              <button
                onClick={() => setClubOpen(true)}
                className="text-[11px] tracking-[0.2em] uppercase font-light text-ivory/40 hover:text-ivory/70 transition-colors duration-400 inline-flex items-center gap-2"
              >
                Scopri il Club →
              </button>
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

      <ClubModal open={clubOpen} onClose={() => setClubOpen(false)} />
    </>
  );
}
