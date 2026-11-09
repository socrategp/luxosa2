import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { t } from '../i18n/t';
import { getPrimaVoltaUrl } from '../lib/primaVoltaLink';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];
const ITEM_KEYS = ['consult', 'finish', 'summary'] as const;

const tp = (key: string) => t(`messina-cavour:messina.cavour.prima.${key}`);

export default function MessinaPrimaVolta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 25 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.2, ease: premiumEase, delay },
  });

  return (
    <section id="mc-prima-volta" className="py-28 md:py-40 lg:py-48 bg-charcoal text-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-24 items-center">
          <div>
            <motion.span {...reveal(0)} className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light">{tp('eyebrow')}</motion.span>
            <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
            <motion.h2 {...reveal(0.2)} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-ivory">{tp('title')}</motion.h2>
            <motion.p {...reveal(0.3)} className="mt-8 max-w-xl text-[18px] md:text-[20px] leading-[1.8] text-ivory/80 font-light">{tp('lead')}</motion.p>
            <motion.p {...reveal(0.35)} className="mt-4 max-w-xl text-[18px] md:text-[20px] leading-[1.8] text-ivory font-light">{tp('outcome')}</motion.p>
            <motion.div {...reveal(0.4)} className="mt-10">
              <a
                href={getPrimaVoltaUrl('blocco-offerta')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tp('ctaAria')}
                className="group inline-flex items-center justify-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5 hover:bg-brass-light transition-colors duration-500"
              >
                {tp('cta')}
                <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
              <p className="mt-5 max-w-md text-[14px] leading-[1.7] text-ivory/60 font-light">{tp('ctaNote')}</p>
            </motion.div>
            <motion.figure {...reveal(0.5)} className="mt-10 max-w-md border-t border-ivory/15 pt-6">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ivory/60 font-light">
                <span className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} strokeWidth={1.3} className="fill-brass-light text-brass-light" />)}
                </span>
                {tp('proofSource')}
              </div>
              <blockquote className="mt-4 font-serif text-[20px] italic font-light leading-[1.5] text-ivory/85">“{tp('proofQuote')}”</blockquote>
              <figcaption className="mt-3 text-[11px] tracking-[0.2em] uppercase text-ivory/50 font-light">{tp('proofAuthor')}</figcaption>
            </motion.figure>
          </div>

          <motion.div {...reveal(0.3)} className="border border-brass/30 p-10 md:p-12">
            <div className="flex items-end justify-between gap-6 pb-8 border-b border-ivory/15">
              <div>
                <span className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light">{tp('cardLabel')}</span>
                <p className="mt-3 text-[14px] text-ivory/60 font-light">{tp('duration')}</p>
              </div>
              <p className="font-serif text-[44px] md:text-[48px] font-light leading-none text-brass-light">
                {tp('price')}
                <span className="block mt-2 text-right font-sans text-[11px] tracking-[0.25em] uppercase text-ivory/60">{tp('priceNote')}</span>
              </p>
            </div>
            <ul className="mt-8 space-y-7">
              {ITEM_KEYS.map((key) => (
                <li key={key}>
                  <h3 className="font-serif text-[22px] font-light tracking-wide text-ivory">{tp(`items.${key}.title`)}</h3>
                  <p className="mt-1 text-[16px] leading-[1.75] text-ivory/70 font-light">{tp(`items.${key}.text`)}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
