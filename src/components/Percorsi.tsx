import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { premiumEase } from '../lib/animations';
import { t } from '../i18n/t';

const percorsi = [
  {
    num:t('percorsi:percorsi.001'),
    name:t('percorsi:percorsi.002'),
    focus:t('percorsi:percorsi.003'),
    intro: [t('percorsi:percorsi.004'),t('percorsi:percorsi.005'),
    ],
    desc:t('percorsi:percorsi.006'),
    image: '/images/BenEssere.webp',
  },
  {
    num:t('percorsi:percorsi.007'),
    name:t('percorsi:percorsi.008'),
    focus:t('percorsi:percorsi.009'),
    intro: [t('percorsi:percorsi.010'),t('percorsi:percorsi.011'),
    ],
    desc:t('percorsi:percorsi.012'),
    image: '/images/colorlux.webp',
  },
  {
    num:t('percorsi:percorsi.013'),
    name:t('percorsi:percorsi.014'),
    focus:t('percorsi:percorsi.015'),
    intro: [t('percorsi:percorsi.016'),t('percorsi:percorsi.017'),
    ],
    desc:t('percorsi:percorsi.018'),
    image: '/images/rituale_luxosa.webp',
  },
];

function PercorsoRow({ percorso, index }: { percorso: typeof percorsi[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const imageLeft = index % 2 === 0;

  return (
    <div ref={ref}>
      {/* Separator between rows */}
      {index > 0 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: premiumEase }}
          style={{ transformOrigin: 'left' }}
          className="h-px bg-sand/50 my-20 md:my-28 lg:my-32"
        />
      )}

      <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!imageLeft ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>

        {/* Image — portrait contained, never touches neighbours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.3, ease: premiumEase, delay: 0.1 }}
          className="relative overflow-hidden aspect-[4/5] w-full"
        >
          <img
            src={percorso.image}
            alt={percorso.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04] ease-out"
          />
          <div className="absolute inset-0 bg-deep/5" />
        </motion.div>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: premiumEase, delay: 0.25 }}
          className="w-full"
        >
          <div>
            {/* Code */}
            <span className="text-[10px] tracking-[0.2em] text-brass-muted/60 font-light">
              {percorso.num}
            </span>

            {/* Name */}
            <h3 className="font-serif text-[30px] md:text-[36px] lg:text-[42px] font-light text-charcoal leading-[1.08] tracking-[0.01em] mt-3">
              {percorso.name}
            </h3>

            {/* Accent line */}
            <div className="h-px w-8 bg-brass/40 my-6" />

            {/* Focus */}
            <p className="text-[11px] tracking-[0.2em] uppercase text-brass-muted font-light mb-8">
              {percorso.focus}
            </p>

            {/* Intro paragraphs */}
            <div className="space-y-4">
              {percorso.intro.map((p, i) => (
                <p key={i} className="text-[17px] md:text-[18px] leading-[1.9] text-anthracite/95 font-light">
                  {p}
                </p>
              ))}
            </div>

            {/* Desc */}
            <p className="text-[16px] leading-[1.85] text-anthracite/75 font-light mt-6 italic">
              {percorso.desc}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default function Percorsi() {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {percorsi.map((p, i) => (
          <PercorsoRow key={p.num} percorso={p} index={i} />
        ))}
      </div>
    </section>
  );
}
