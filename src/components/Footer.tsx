import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { premiumEase } from '../lib/animations';
import { t } from '../i18n/t';

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
              className="absolute top-5 right-5 text-anthracite/45 hover:text-anthracite/75 transition-colors duration-300"
            >
              <X size={18} strokeWidth={1.2} />
            </button>

            {/* Content */}
            <div className="px-8 sm:px-12 py-14 sm:py-16">
              {/* Label */}
              <div className="text-center mb-10">
                <span className="text-[10px] tracking-[0.4em] uppercase text-brass-muted font-light">{t('common:footer.001')}</span>
                <div className="w-8 h-[1px] bg-brass mx-auto mt-4 mb-8" />
                <h3 className="font-serif text-[30px] md:text-[36px] font-light text-charcoal leading-[1.08] tracking-wide">{t('common:footer.002')}</h3>
              </div>

              {/* Intro */}
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/80 font-light text-center mb-4">{t('common:footer.003')}</p>
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/80 font-light text-center mb-10">{t('common:footer.004')}</p>

              {/* Separator */}
              <div className="w-6 h-[1px] bg-sand mx-auto mb-10" />

              {/* Benefits */}
              <p className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light mb-5 text-center">{t('common:footer.005')}</p>
              <ul className="space-y-3.5 mb-10 max-w-[380px] mx-auto">
                {[t('common:footer.006'),t('common:footer.007'),t('common:footer.008'),t('common:footer.009'),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-brass mt-2.5 shrink-0" />
                    <span className="text-[16px] md:text-[17px] leading-[1.8] text-anthracite/75 font-light">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Separator */}
              <div className="w-6 h-[1px] bg-sand mx-auto mb-10" />

              {/* Access restriction */}
              <div className="text-center mb-2">
                <p className="text-[16px] md:text-[17px] leading-[1.85] text-anthracite/70 font-light mb-1.5">{t('common:footer.010')}</p>
                <p className="text-[16px] md:text-[17px] leading-[1.85] text-anthracite/70 font-light">{t('common:footer.011')}</p>
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
      <footer className="bg-deep text-ivory/60 pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-ivory/10">

            {/* Col 1 — Brand */}
            <div className="lg:col-span-1">
              <Link to="/">
                <img
                  src="/images/luxosa-logo-orizzontale-bianco-tras.png"
                  alt={t('common:footer.012')}
                  width="200"
                  height="36"
                  className="h-8 md:h-9 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="mt-5 text-[16px] leading-[1.8] font-light text-ivory/60">{t('common:footer.013')}<br />{t('common:footer.014')}</p>
              <div className="mt-6 w-8 h-[1px] bg-brass/40" />
              <p className="mt-5 text-[10px] tracking-[0.35em] uppercase text-brass-light/50 font-light">{t('common:footer.015')}</p>
            </div>

            {/* Col 2 — Navigazione */}
            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 font-light mb-6">{t('common:footer.016')}</h4>
              <nav className="flex flex-col gap-3">
                {[
                  { label:t('common:footer.017'), href: '/' },
                  { label:t('common:footer.018'), href: '/il-metodo' },
                  { label:t('common:footer.019'), href: '/i-percorsi' },
                  { label:t('common:footer.020'), href: '/le-esperienze' },
                  { label:t('common:footer.021'), href: '/sedi' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-[16px] font-light text-ivory/55 hover:text-ivory/90 transition-colors duration-400 tracking-wide"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 — Club Luxosa */}
            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 font-light mb-6">{t('common:footer.022')}</h4>
              <p className="text-[16px] font-light text-ivory/60 leading-[1.8] mb-6">{t('common:footer.023')}</p>
              <div className="flex gap-2 mb-7">
                {[t('common:footer.024'),t('common:footer.025'),t('common:footer.026')].map((badge) => (
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
                className="text-[11px] tracking-[0.2em] uppercase font-light text-ivory/55 hover:text-ivory/85 transition-colors duration-400 inline-flex items-center gap-2"
              >{t('common:footer.027')}</button>
            </div>

            {/* Col 4 — Contatti Sede Generale */}
            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 font-light mb-6">{t('common:footer.028')}</h4>
              <nav className="flex flex-col gap-5">
                {[
                  { label:t('common:footer.029'), email: 'marketing@luxosa.it' },
                  { label:t('common:footer.030'), email: 'direzione@luxosa.it' },
                  { label:t('common:footer.031'), email: 'persone@luxosa.it' },
                ].map((item) => (
                  <a
                    key={item.email}
                    href={`mailto:${item.email}`}
                    className="group flex flex-col gap-1 transition-colors duration-400"
                  >
                    <span className="text-[10px] tracking-[0.22em] uppercase font-light text-brass-light/55 group-hover:text-brass-light/75 transition-colors duration-400">
                      {item.label}
                    </span>
                    <span className="text-[15px] font-light text-ivory/55 group-hover:text-ivory/90 transition-colors duration-400 tracking-wide">
                      {item.email}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] tracking-[0.15em] text-ivory/35 font-light">{t('common:footer.032')}</p>
            <div className="flex gap-6">
              <span className="text-[11px] tracking-[0.1em] text-ivory/35 font-light">{t('common:footer.033')}</span>
              <span className="text-[11px] tracking-[0.1em] text-ivory/35 font-light">{t('common:footer.034')}</span>
            </div>
          </div>
        </div>
      </footer>

      <ClubModal open={clubOpen} onClose={() => setClubOpen(false)} />
    </>
  );
}
