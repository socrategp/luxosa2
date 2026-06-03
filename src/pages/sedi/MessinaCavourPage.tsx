import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, ArrowLeft, Ear, Search, Fingerprint, Shield, Sparkles, Facebook, Instagram } from 'lucide-react';
import TestimonialsCarousel from '../../components/TestimonialsCarousel';
import type { TestimonialItem } from '../../components/TestimonialsCarousel';
import { t } from '../../i18n/t';

/* ============================================================
   LUXOSA MESSINA CAVOUR — Mini-sito onepage
   ============================================================ */

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.2a3.8 3.8 0 1 1-3.8-3.8" />
      <path d="M14 4c.6 2.9 2.4 4.7 5 5" />
    </svg>
  );
}

// --- Hero ---
function MCHero() {
  return (
    <section className="relative h-[75vh] min-h-[550px] max-h-[850px] overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/messina-new.webp" alt={t('messina-cavour:messina.cavour.page.001')} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/55 via-deep/30 to-deep/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/30 to-transparent" />
      </div>
      <div className="relative h-full flex flex-col justify-end pb-20 md:pb-28 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: 50 }} transition={{ duration: 1, delay: 0.2 }} className="h-[1px] bg-brass-light mb-6" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="flex items-center gap-2 mb-4">
            <MapPin size={14} strokeWidth={1.3} className="text-brass-light" />
            <span className="text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-brass-light font-light">{t('messina-cavour:messina.cavour.page.002')}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0, 1] }} className="font-serif text-[36px] md:text-[50px] lg:text-[60px] text-white font-normal leading-[1.08] tracking-[0.02em] max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">{t('messina-cavour:messina.cavour.page.003')}<br />{t('messina-cavour:messina.cavour.page.004')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.75 }} className="mt-5 text-white/75 text-[18px] md:text-[20px] font-light leading-relaxed max-w-xl tracking-wide">{t('messina-cavour:messina.cavour.page.005')}</motion.p>
        </div>
      </div>
    </section>
  );
}

// --- Back link ---
function MCBackLink() {
  return (
    <div className="bg-ivory border-b border-sand/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-4">
        <Link to="/sedi" className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-stone hover:text-brass-muted font-light transition-colors">
          <ArrowLeft size={14} strokeWidth={1.5} />{t('messina-cavour:messina.cavour.page.006')}</Link>
      </div>
    </div>
  );
}

// --- About ---
function MCAbout() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-about" className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.007')}</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal">{t('messina-cavour:messina.cavour.page.008')}<br />{t('messina-cavour:messina.cavour.page.009')}</motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-8 space-y-5">
              <p className="text-[18px] md:text-[20px] leading-[1.8] text-anthracite/95 font-light">{t('messina-cavour:messina.cavour.page.010')}</p>
              <p className="text-[18px] md:text-[20px] leading-[1.8] text-anthracite/95 font-light">{t('messina-cavour:messina.cavour.page.011')}</p>
              <p className="text-[18px] md:text-[20px] leading-[1.8] text-anthracite/95 font-light">{t('messina-cavour:messina.cavour.page.012')}</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/reception.webp" alt={t('messina-cavour:messina.cavour.page.013')} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Lo Spazio ---
function MCSpace() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-spazio" className="py-28 md:py-40 lg:py-48 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.014')}</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.1] text-charcoal">{t('messina-cavour:messina.cavour.page.015')}<br />{t('messina-cavour:messina.cavour.page.016')}</motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.25 }} className="aspect-[3/4] md:aspect-auto md:row-span-2 overflow-hidden">
            <img src="/images/zona-consulenza.webp" alt={t('messina-cavour:messina.cavour.page.017')} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/zona-tecnica.webp" alt={t('messina-cavour:messina.cavour.page.018')} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.45 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/lavaggi.webp" alt={t('messina-cavour:messina.cavour.page.019')} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.55 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/zona-tecnica2.webp" alt={t('messina-cavour:messina.cavour.page.020')} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.65 }} className="aspect-[4/3] overflow-hidden">
            <img src="/images/lavaggio2.webp" alt={t('messina-cavour:messina.cavour.page.021')} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.7 }} className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {[t('messina-cavour:messina.cavour.page.022'),t('messina-cavour:messina.cavour.page.023'),t('messina-cavour:messina.cavour.page.024'),t('messina-cavour:messina.cavour.page.025')].map((q) => (
            <span key={q} className="text-[12px] tracking-[0.25em] uppercase text-stone font-light">{q}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- Il Metodo nella Sede ---
function MCMethod() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    { icon: Ear, title:t('messina-cavour:messina.cavour.page.026'), text:t('messina-cavour:messina.cavour.page.027') },
    { icon: Search, title:t('messina-cavour:messina.cavour.page.028'), text:t('messina-cavour:messina.cavour.page.029') },
    { icon: Fingerprint, title:t('messina-cavour:messina.cavour.page.030'), text:t('messina-cavour:messina.cavour.page.031') },
    { icon: Shield, title:t('messina-cavour:messina.cavour.page.032'), text:t('messina-cavour:messina.cavour.page.033') },
    { icon: Sparkles, title:t('messina-cavour:messina.cavour.page.034'), text:t('messina-cavour:messina.cavour.page.035') },
  ];

  return (
    <section id="mc-metodo" className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.036')}</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.1] text-charcoal">{t('messina-cavour:messina.cavour.page.037')}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="mt-6 text-[18px] md:text-[20px] leading-[1.8] text-anthracite/85 font-light lg:whitespace-nowrap">{t('messina-cavour:messina.cavour.page.038')}</motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.2 + i * 0.08 }} className="group">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-brass/25 flex items-center justify-center group-hover:border-brass/50 transition-colors duration-500">
                  <s.icon size={20} strokeWidth={1.2} className="text-brass-muted" />
                </div>
                <div>
                  <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-2 tracking-wide">{s.title}</h3>
                  <p className="text-[17px] leading-[1.75] text-anthracite/75 font-light">{s.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Master Responsabile ---
function MCTeam() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-master" className="py-28 md:py-40 lg:py-48 bg-charcoal text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light">{t('messina-cavour:messina.cavour.page.039')}</motion.span>
            <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.1] text-ivory">{t('messina-cavour:messina.cavour.page.040')}</motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="mt-8 space-y-5">
              <p className="text-[18px] md:text-[20px] leading-[1.8] text-ivory/80 font-light">{t('messina-cavour:messina.cavour.page.041')}</p>
              <p className="text-[18px] md:text-[20px] leading-[1.8] text-ivory/80 font-light">{t('messina-cavour:messina.cavour.page.042')}</p>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }} className="mt-10 font-serif text-[18px] md:text-[20px] italic text-brass-light/70 font-light leading-[1.7]">{t('messina-cavour:messina.cavour.page.043')}</motion.p>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3 }} className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/images/team-master.webp" alt={t('messina-cavour:messina.cavour.page.044')} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-brass/25" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-deep/80 backdrop-blur-sm px-4 py-3 rounded-sm border border-brass/25">
              <div className="w-8 h-8 rounded-full border border-brass flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] tracking-[0.1em] uppercase text-brass font-light">{t('messina-cavour:messina.cavour.page.045')}</span>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-brass-light font-light">{t('messina-cavour:messina.cavour.page.046')}</p>
                <p className="text-[10px] text-brass-light/60">{t('messina-cavour:messina.cavour.page.047')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


// --- Testimonials data ---
const mcTestimonials: TestimonialItem[] = [
  {
    quote:t('messina-cavour:messina.cavour.page.048'),
    name:t('messina-cavour:messina.cavour.page.049'),
    role: t('messina-cavour:messina.cavour.page.099'),
    percorso:t('messina-cavour:messina.cavour.page.050'),
    valore: t('messina-cavour:messina.cavour.page.100'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.051'),
    name:t('messina-cavour:messina.cavour.page.052'),
    role: t('messina-cavour:messina.cavour.page.101'),
    percorso:t('messina-cavour:messina.cavour.page.053'),
    valore: t('messina-cavour:messina.cavour.page.102'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.054'),
    name:t('messina-cavour:messina.cavour.page.055'),
    role: t('messina-cavour:messina.cavour.page.103'),
    percorso:t('messina-cavour:messina.cavour.page.056'),
    valore: t('messina-cavour:messina.cavour.page.104'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.057'),
    name:t('messina-cavour:messina.cavour.page.058'),
    role: t('messina-cavour:messina.cavour.page.105'),
    percorso:t('messina-cavour:messina.cavour.page.059'),
    valore: t('messina-cavour:messina.cavour.page.106'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.060'),
    name:t('messina-cavour:messina.cavour.page.061'),
    role: t('messina-cavour:messina.cavour.page.107'),
    percorso:t('messina-cavour:messina.cavour.page.062'),
    valore: t('messina-cavour:messina.cavour.page.108'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.063'),
    name:t('messina-cavour:messina.cavour.page.064'),
    role: t('messina-cavour:messina.cavour.page.109'),
    percorso:t('messina-cavour:messina.cavour.page.065'),
    valore: t('messina-cavour:messina.cavour.page.110'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.066'),
    name:t('messina-cavour:messina.cavour.page.067'),
    role: t('messina-cavour:messina.cavour.page.111'),
    percorso:t('messina-cavour:messina.cavour.page.068'),
    valore: t('messina-cavour:messina.cavour.page.112'),
  },
  {
    quote:t('messina-cavour:messina.cavour.page.069'),
    name:t('messina-cavour:messina.cavour.page.070'),
    role: t('messina-cavour:messina.cavour.page.113'),
    percorso:t('messina-cavour:messina.cavour.page.071'),
    valore: t('messina-cavour:messina.cavour.page.114'),
  },
];

// --- Reviews Google ---
function MCReviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-28 md:py-40 lg:py-48 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-xl mx-auto text-center">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.072')}</motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="h-[1px] bg-brass mx-auto mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] font-light leading-[1.12] text-charcoal mb-10">{t('messina-cavour:messina.cavour.page.073')}</motion.h2>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }} className="flex items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1.5L12.163 7.22L18.29 7.635L13.85 11.43L15.326 17.385L10 14.1L4.674 17.385L6.15 11.43L1.71 7.635L7.837 7.22L10 1.5Z" fill="#B09872" />
                </svg>
              ))}
            </div>
            <span className="font-serif text-[26px] font-light text-charcoal">5.0</span>
            <span className="text-[12px] tracking-[0.15em] uppercase text-stone font-light">{t('messina-cavour:messina.cavour.page.074')}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}>
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJna89CedPFBMRJT4F0y-pbRg"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
            >
              <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 flex items-center gap-3">{t('messina-cavour:messina.cavour.page.075')}<ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Contact & Mappa ---
function MCContact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mc-contatti" className="py-28 md:py-40 lg:py-48 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Dove Trovarci */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.076')}</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] font-light leading-[1.12] text-charcoal mb-8">{t('messina-cavour:messina.cavour.page.077')}</motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={18} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[18px] font-light text-charcoal">{t('messina-cavour:messina.cavour.page.078')}</p>
                  <p className="text-[17px] font-light text-anthracite/75">{t('messina-cavour:messina.cavour.page.079')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={18} strokeWidth={1.3} className="text-brass-muted" />
                <a href="tel:+390902403220" className="text-[18px] font-light text-charcoal hover:text-brass-muted transition-colors">+39 090 240 3220</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={18} strokeWidth={1.3} className="text-brass-muted" />
                <a href="mailto:messinacavour@luxosa.it" className="text-[18px] font-light text-charcoal hover:text-brass-muted transition-colors">{t('messina-cavour:messina.cavour.page.080')}</a>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={18} strokeWidth={1.3} className="text-brass-muted flex-shrink-0 mt-0.5" />
                <div className="text-[18px] font-light text-charcoal">
                  <p>{t('messina-cavour:messina.cavour.page.081')}</p>
                  <p>{t('messina-cavour:messina.cavour.page.082')}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-sand/50">
                <p className="text-[10px] tracking-[0.3em] uppercase text-anthracite/40 font-light mb-5">{t('messina-cavour:messina.cavour.page.083')}</p>
                <div className="flex items-center gap-3">
                  <span aria-label={t('messina-cavour:messina.cavour.page.084')} className="flex items-center justify-center w-12 h-12 border border-sand text-anthracite/50 hover:border-brass hover:text-brass-muted transition-all duration-400 cursor-default">
                    <TikTokIcon className="h-[20px] w-[20px]" />
                  </span>
                  <span aria-label={t('messina-cavour:messina.cavour.page.085')} className="flex items-center justify-center w-12 h-12 border border-sand text-anthracite/50 hover:border-brass hover:text-brass-muted transition-all duration-400 cursor-default">
                    <Facebook size={20} strokeWidth={1.3} />
                  </span>
                  <span aria-label={t('messina-cavour:messina.cavour.page.086')} className="flex items-center justify-center w-12 h-12 border border-sand text-anthracite/50 hover:border-brass hover:text-brass-muted transition-all duration-400 cursor-default">
                    <Instagram size={20} strokeWidth={1.3} />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Come Raggiungerci — mappa */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.087')}</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }} className="aspect-[4/3] overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=5HR2%2B7V+Messina&output=embed&zoom=17"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(20%) contrast(100%) sepia(10%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('messina-cavour:messina.cavour.page.088')}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- Booking & Info ---
function MCBooking() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="pb-28 md:pb-40 lg:pb-48 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="border-t border-sand/50 pt-16 md:pt-20 grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* Prima consulenza */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.1 }} className="bg-charcoal text-ivory p-10 md:p-12 h-full flex flex-col">
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light">{t('messina-cavour:messina.cavour.page.089')}</span>
            <div className="w-8 h-[1px] bg-brass-light/30 mt-4 mb-6" />
            <h3 className="font-serif text-[24px] md:text-[28px] font-light text-ivory mb-4">{t('messina-cavour:messina.cavour.page.090')}</h3>
            <p className="text-[17px] md:text-[18px] leading-[1.8] text-ivory/70 font-light mb-8">{t('messina-cavour:messina.cavour.page.091')}</p>
            <div className="space-y-4 mt-auto">
              <a href="https://wa.me/390902403220?text=Salve%2C%20vorrei%20prenotare%20una%20consulenza%20presso%20Luxosa%20Messina%20Cavour." target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.2em] uppercase font-light px-8 py-4 hover:bg-brass-light transition-all duration-500 w-full">{t('messina-cavour:messina.cavour.page.092')}<ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
              <a href="tel:+390902403220" className="flex items-center justify-center gap-3 text-[12px] tracking-[0.2em] uppercase text-ivory/85 font-light border border-ivory/20 px-8 py-4 hover:border-ivory/40 hover:text-ivory transition-all duration-500 w-full">
                <Phone size={14} strokeWidth={1.5} />{t('messina-cavour:messina.cavour.page.093')}</a>
            </div>
          </motion.div>

          {/* Informazioni utili */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.25 }} className="bg-ivory-warm border border-sand/60 p-10 md:p-12 h-full">
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:messina.cavour.page.094')}</span>
            <div className="w-8 h-[1px] bg-brass mt-4 mb-6" />
            <h3 className="font-serif text-[24px] md:text-[28px] font-light text-charcoal mb-6">{t('messina-cavour:messina.cavour.page.095')}</h3>
            <div className="space-y-5 text-[17px] font-light text-anthracite/80 leading-[1.8]">
              <p>{t('messina-cavour:messina.cavour.page.096')}</p>
              <p>{t('messina-cavour:messina.cavour.page.097')}</p>
              <p>{t('messina-cavour:messina.cavour.page.098')}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function MessinaCavourPage() {
  return (
    <>
      <MCHero />
      <MCBackLink />
      <MCAbout />
      <MCSpace />
      <MCMethod />
      <MCTeam />
      <MCReviews />
      <TestimonialsCarousel
        testimonials={mcTestimonials}
        label={t('messina-cavour:messina.cavour.page.115')}
        sectionClassName="py-28 md:py-40 lg:py-48 bg-charcoal overflow-hidden"
      />
      <MCContact />
      <MCBooking />
    </>
  );
}
