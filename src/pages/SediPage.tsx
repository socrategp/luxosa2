import PageHero from '../components/PageHero';
import Space from '../components/Space';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { premiumEase } from '../lib/animations';
import { t } from '../i18n/t';

function SediManifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: premiumEase, delay: 0.2 }}
          className="font-serif text-[24px] md:text-[32px] lg:text-[38px] font-light leading-[1.4] text-charcoal text-center max-w-4xl mx-auto"
        >{t('messina-cavour:sedi.page.001')}</motion.p>
      </div>
    </section>
  );
}

function SediPrincipi() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const principi = [
    { title:t('messina-cavour:sedi.page.002'), text:t('messina-cavour:sedi.page.003') },
    { title:t('messina-cavour:sedi.page.004'), text:t('messina-cavour:sedi.page.005') },
    { title:t('messina-cavour:sedi.page.006'), text:t('messina-cavour:sedi.page.007') },
    { title:t('messina-cavour:sedi.page.008'), text:t('messina-cavour:sedi.page.009') },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-ivory-warm" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="mb-12"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:sedi.page.010')}</span>
          <div className="h-[1px] w-10 bg-brass mt-4 mb-8" />
          <h2 className="font-serif text-[26px] md:text-[32px] font-light text-charcoal">{t('messina-cavour:sedi.page.011')}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {principi.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.15 + i * 0.1 }}
            >
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-3 tracking-wide">{p.title}</h3>
              <p className="text-[16px] md:text-[17px] leading-[1.8] text-anthracite/75 font-light">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


function SedeFlagship() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">
          {/* Left: content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase }}
            >
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('messina-cavour:sedi.page.012')}</span>
              <div className="h-[1px] w-10 bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
              className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal"
            >{t('messina-cavour:sedi.page.013')}</motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/85 font-light">{t('messina-cavour:sedi.page.014')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.5 }}
              className="mt-10"
            >
              <Link
                to="/sedi/messina-cavour"
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
              >
                <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
                <span className="relative z-10 flex items-center gap-3">{t('messina-cavour:sedi.page.015')}<ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right: photo sede */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="relative group overflow-hidden aspect-[4/3]"
          >
            <img
              src="/images/messina-new.webp"
              alt={t('messina-cavour:sedi.page.016')}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-left transition-transform duration-[15000ms] group-hover:scale-[1.04] ease-out"
            />
            <div className="absolute bottom-4 left-5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/65 font-light">{t('messina-cavour:sedi.page.017')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VisioneReplicabile() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-charcoal" ref={ref}>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: 40 } : {}}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="h-[1px] bg-brass-light/40 mx-auto mb-12"
        />
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light text-ivory/95 leading-[1.12]"
        >{t('messina-cavour:sedi.page.018')}<br />{t('messina-cavour:sedi.page.019')}</motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
          className="mt-8 text-[18px] leading-[1.85] text-ivory/60 font-light max-w-xl mx-auto"
        >{t('messina-cavour:sedi.page.020')}</motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase, delay: 0.6 }}
          className="mt-8 text-[11px] tracking-[0.35em] uppercase text-brass-light/30 font-light"
        >{t('messina-cavour:sedi.page.021')}</motion.p>
      </div>
    </section>
  );
}

export default function SediPage() {
  return (
    <>
      <PageHero
        label={t('messina-cavour:sedi.page.023')}
        title={t('messina-cavour:sedi.page.022')}
        subtitle={t('messina-cavour:sedi.page.024')}
        video="/videos/hero_sedi_opt.mp4"
      />
      <SediManifesto />
      <SediPrincipi />
      <Space />
      <SedeFlagship />
      <VisioneReplicabile />
    </>
  );
}
