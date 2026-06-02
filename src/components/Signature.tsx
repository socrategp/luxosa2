import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { t } from '../i18n/t';

const signatures = [
  {
    title:t('esperienze:signature.001'),
    subtitle:t('esperienze:signature.002'),
    description:t('esperienze:signature.003'),
    duration: '120 minuti',
  },
  {
    title:t('esperienze:signature.004'),
    subtitle:t('esperienze:signature.005'),
    description:t('esperienze:signature.006'),
    duration: '60 minuti',
  },
  {
    title:t('esperienze:signature.007'),
    subtitle:t('esperienze:signature.008'),
    description:t('esperienze:signature.009'),
    duration: '150 minuti',
  },
];

export default function Signature() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru/40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >{t('esperienze:signature.010')}</motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.2 }}
            className="font-serif text-[32px] md:text-[40px] lg:text-[46px] font-light leading-[1.12] text-charcoal tracking-[0.01em]"
          >{t('esperienze:signature.011')}<br />{t('esperienze:signature.012')}</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.35 }}
            className="mt-6 text-[18px] md:text-[20px] leading-[1.8] text-anthracite/85 font-light"
          >{t('esperienze:signature.013')}</motion.p>
        </div>

        {/* Signature Items */}
        <div className="space-y-0">
          {signatures.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.25 + i * 0.12 }}
              className="group border-t border-sand/60 py-10 md:py-12 cursor-pointer"
            >
              <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="font-serif text-[28px] md:text-[32px] text-brass/40 font-light">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-brass-muted font-light mb-1">
                    {s.subtitle}
                  </p>
                  <h3 className="font-serif text-[22px] md:text-[26px] font-light text-charcoal tracking-wide group-hover:text-brass-muted transition-colors duration-500">
                    {s.title}
                  </h3>
                </div>
                <div className="md:col-span-5">
                  <p className="text-[17px] leading-[1.75] text-anthracite/75 font-light">
                    {s.description}
                  </p>
                </div>
                <div className="md:col-span-2 flex items-center justify-between md:flex-col md:items-end md:justify-start gap-2">
                  <span className="text-[12px] tracking-[0.1em] text-stone font-light">
                    {s.duration}
                  </span>
                  <ArrowRight size={16} strokeWidth={1.2} className="text-brass/40 group-hover:text-brass group-hover:translate-x-1 transition-all duration-500 mt-0 md:mt-4" />
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-sand/60" />
        </div>
      </div>
    </section>
  );
}
