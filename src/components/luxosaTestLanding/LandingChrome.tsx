import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CustomCursor from '../CustomCursor';
import ScrollToTop from '../ScrollToTop';
import { premiumEase } from '../../lib/animations';
import { t } from '../../i18n/t';

export const LANDING_CTA_LABEL = 'Inizia il Luxosa Test';

export const LANDING_DISCLAIMER =
  'Il Luxosa Test offre un orientamento preliminare. La personalizzazione definitiva nasce dalla consulenza e dalla valutazione professionale in Maison.';

const PAGE_TITLE = 'Luxosa Test — Luxosa';

/**
 * Standalone frame for the Luxosa Test landings: lives outside MainLayout so
 * the ordinary navigation does not compete with the CTA. CustomCursor is
 * mounted here because the global CSS hides the native cursor on desktop.
 */
export function LandingShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-ivory overflow-x-clip">
      <ScrollToTop />
      <CustomCursor />
      {children}
    </div>
  );
}

type CtaTone = 'dark' | 'light' | 'outline-light' | 'outline-dark';

const CTA_TONES: Record<CtaTone, { base: string; fill: string }> = {
  dark: { base: 'bg-charcoal text-ivory', fill: 'bg-deep' },
  light: { base: 'bg-ivory text-charcoal', fill: 'bg-ivory-warm' },
  'outline-light': { base: 'border border-ivory/45 text-ivory', fill: 'bg-ivory/10' },
  'outline-dark': { base: 'border border-charcoal/40 text-charcoal', fill: 'bg-charcoal/[0.06]' },
};

interface StartTestButtonProps {
  onClick: () => void;
  position: string;
  tone?: CtaTone;
  className?: string;
  label?: string;
}

/** `position` is exposed as data-cta-position for future campaign analytics. */
export function StartTestButton({ onClick, position, tone = 'dark', className = '', label = LANDING_CTA_LABEL }: StartTestButtonProps) {
  const { base, fill } = CTA_TONES[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      data-cta-position={position}
      className={`group relative overflow-hidden inline-flex items-center justify-center gap-3 text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5 ${base} ${className}`}
    >
      <span className={`absolute inset-0 ${fill} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]`} />
      <span className="relative z-10 flex items-center gap-3">
        {label}
        <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
      </span>
    </button>
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 25, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: premiumEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingLogo({ onDark, className = '' }: { onDark: boolean; className?: string }) {
  return (
    <img
      src="/images/luxosa-logo-orizzontale-bianco-tras.png"
      alt="Luxosa"
      width="200"
      height="36"
      className={`w-auto object-contain ${onDark ? 'brightness-0 invert' : 'brightness-0'} ${className}`}
    />
  );
}

/** Minimal legal footer: payoff, copyright, policies (opened in a new tab to keep the landing). */
export function LandingFooter() {
  return (
    <footer className="bg-deep text-ivory/60 py-14 md:py-16" data-cursor-dark>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <LandingLogo onDark className="h-7 md:h-8 opacity-90" />
          <p className="mt-5 text-[15px] leading-[1.8] font-light text-ivory/60">
            {t('common:footer.013')} {t('common:footer.014')}
          </p>
          <p className="mt-4 text-[10px] tracking-[0.35em] uppercase text-brass-light/50 font-light">{t('common:footer.015')}</p>
        </div>
        <div className="flex flex-col md:items-end gap-3">
          <div className="flex gap-6">
            <Link to="/privacy-policy" target="_blank" rel="noopener" className="text-[11px] tracking-[0.1em] text-ivory/50 hover:text-ivory/80 font-light transition-colors duration-500">
              {t('common:footer.033')}
            </Link>
            <Link to="/cookie-policy" target="_blank" rel="noopener" className="text-[11px] tracking-[0.1em] text-ivory/50 hover:text-ivory/80 font-light transition-colors duration-500">
              {t('common:footer.034')}
            </Link>
          </div>
          <p className="text-[11px] tracking-[0.15em] text-ivory/35 font-light">{t('common:footer.032')}</p>
        </div>
      </div>
    </footer>
  );
}
