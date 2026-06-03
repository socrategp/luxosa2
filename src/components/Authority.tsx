import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SharedCarousel from './TestimonialsCarousel';
import type { TestimonialItem } from './TestimonialsCarousel';
import { t } from '../i18n/t';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

const pillars = [
  {
    num: '01',
    label:t('home:authority.001'),
    title:t('home:authority.002'),
    text:t('home:authority.003'),
  },
  {
    num: '02',
    label:t('home:authority.004'),
    title:t('home:authority.005'),
    text:t('home:authority.006'),
  },
  {
    num: '03',
    label:t('home:authority.007'),
    title:t('home:authority.008'),
    text:t('home:authority.009'),
  },
];

const testimonials: TestimonialItem[] = [
  {
    quote:t('home:authority.010'),
    name:t('home:authority.011'),
    role: '39 anni',
    percorso:t('home:authority.012'),
    valore: 'Competenza',
  },
  {
    quote:t('home:authority.013'),
    name:t('home:authority.014'),
    role: '46 anni',
    percorso:t('home:authority.015'),
    valore: 'Metodo',
  },
  {
    quote:t('home:authority.016'),
    name:t('home:authority.017'),
    role: '43 anni',
    percorso:t('home:authority.018'),
    valore: 'Ascolto',
  },
  {
    quote:t('home:authority.019'),
    name:t('home:authority.020'),
    role: '57 anni',
    percorso:t('home:authority.021'),
    valore: 'Presa in carico',
  },
  {
    quote:t('home:authority.022'),
    name:t('home:authority.023'),
    role: '59 anni',
    percorso:t('home:authority.024'),
    valore: 'Trasformazione',
  },
  {
    quote:t('home:authority.025'),
    name:t('home:authority.026'),
    role: '55 anni',
    percorso:t('home:authority.027'),
    valore: 'Percorso',
  },
  {
    quote:t('home:authority.028'),
    name:t('home:authority.029'),
    role: '48 anni',
    percorso:t('home:authority.030'),
    valore: 'Visione integrata',
  },
];

function PillarSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="mb-20 md:mb-28"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{t('home:authority.031')}</span>
          <div className="h-[1px] w-10 bg-brass mt-4" />
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-10 lg:gap-16 items-start">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.15 + i * 0.12 }}
              className="flex flex-col"
            >
              <div className="mb-7">
                <span className="text-[13px] tracking-[0.35em] uppercase text-brass-muted font-light block">
                  {p.label}
                </span>
              </div>
              <div className="h-[1px] w-full bg-sand mb-7" />
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-4 leading-snug tracking-wide">
                {p.title}
              </h3>
              <p className="text-[17px] md:text-[18px] leading-[1.8] text-anthracite/75 font-light">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsCarousel() {
  return <SharedCarousel testimonials={testimonials} label={t('home:authority.032')} />;
}

export { PillarSection };

export default function Authority() {
  return (
    <>
      <PillarSection />
      <TestimonialsCarousel />
    </>
  );
}
