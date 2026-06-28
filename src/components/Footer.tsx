import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { premiumEase } from '../lib/animations';
import { t } from '../i18n/t';

function PayBadge({
  children,
  label,
  className = 'bg-white',
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      title={label}
      className={`flex h-[28px] w-[44px] items-center justify-center rounded-[3px] border border-white/25 shadow-[0_1px_5px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

function VisaIcon() {
  return (
    <svg width="32" height="12" viewBox="0 0 64 24" fill="none">
      <text x="0" y="19" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="20" fill="white" letterSpacing="-1.2">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg width="28" height="18" viewBox="0 0 42 26">
      <circle cx="16" cy="13" r="10" fill="#EB001B" />
      <circle cx="26" cy="13" r="10" fill="#F79E1B" />
      <path d="M21 5.2a10 10 0 010 15.6 10 10 0 010-15.6z" fill="#FF5F00" />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg width="33" height="18" viewBox="0 0 52 28" fill="none">
      <rect width="52" height="28" rx="3" fill="#006FCF" />
      <text x="6" y="12" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="-0.5">AM</text>
      <text x="6" y="23" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="-0.5">EX</text>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg width="34" height="15" viewBox="0 0 58 24" fill="none">
      <text x="1" y="17" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="12" fill="#111111" letterSpacing="-0.6">Apple</text>
      <text x="34" y="17" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="12" fill="#111111" letterSpacing="-0.6">Pay</text>
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg width="33" height="13" viewBox="0 0 62 24" fill="none">
      <text x="0" y="18" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="#003087" letterSpacing="-0.5">Pay</text>
      <text x="29" y="18" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="#009CDE" letterSpacing="-0.5">Pal</text>
    </svg>
  );
}

function KlarnaIcon() {
  return (
    <svg width="34" height="13" viewBox="0 0 64 24" fill="none">
      <text x="2" y="17" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="15" fill="#111111" letterSpacing="-0.7">Klarna</text>
    </svg>
  );
}

function ScalapayIcon() {
  return (
    <svg width="36" height="13" viewBox="0 0 76 24" fill="none">
      <text x="0" y="17" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="#6D28D9" letterSpacing="-0.4">Scalapay</text>
    </svg>
  );
}

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

          <div className="pt-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <p className="text-[11px] tracking-[0.15em] text-ivory/35 font-light shrink-0">{t('common:footer.032')}</p>

              <div className="flex flex-col items-center gap-2 md:-translate-y-2">
                <p className="text-[8px] tracking-[0.3em] uppercase text-ivory/25 font-light">
                  Pagamenti accettati · Anche in comode rate
                </p>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <PayBadge label="Visa" className="bg-[#1434CB]"><VisaIcon /></PayBadge>
                  <PayBadge label="Mastercard" className="bg-[#1f1f1f]"><MastercardIcon /></PayBadge>
                  <PayBadge label="American Express" className="bg-[#006FCF]"><AmexIcon /></PayBadge>
                  <PayBadge label="Apple Pay"><ApplePayIcon /></PayBadge>
                  <PayBadge label="PayPal"><PayPalIcon /></PayBadge>
                  <PayBadge label="Klarna – Paga in 3 rate" className="bg-[#FFB3C7]"><KlarnaIcon /></PayBadge>
                  <PayBadge label="Scalapay – Paga in 3 rate" className="bg-[#F1EAFE]"><ScalapayIcon /></PayBadge>
                </div>
              </div>

              <div className="flex gap-6 shrink-0">
                <span className="text-[11px] tracking-[0.1em] text-ivory/35 font-light">{t('common:footer.033')}</span>
                <span className="text-[11px] tracking-[0.1em] text-ivory/35 font-light">{t('common:footer.034')}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ClubModal open={clubOpen} onClose={() => setClubOpen(false)} />
    </>
  );
}
