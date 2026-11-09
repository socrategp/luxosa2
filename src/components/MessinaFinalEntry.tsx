import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { t } from '../i18n/t';
import { getPrimaVoltaUrl } from '../lib/primaVoltaLink';

const WHATSAPP_URL = 'https://wa.me/390902403220?text=Salve%2C%20vorrei%20avere%20informazioni%20su%20Luxosa%20Messina%20Cavour.';
const PHONE_HREF = 'tel:+390902403220';
const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

const INCLUDED_KEYS = ['consult', 'finish', 'summary'] as const;

const tf = (key: string) => t(`messina-cavour:messina.cavour.final.${key}`);

export default function MessinaFinalEntry() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { openQuiz } = useQuiz();
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 25 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.2, ease: premiumEase, delay },
  });

  const slideIn = (fromX: number, delay: number) => ({
    initial: { opacity: 0, x: fromX },
    animate: inView ? { opacity: 1, x: 0 } : {},
    transition: { duration: 1.4, ease: premiumEase, delay },
  });

  return (
    <section id="mc-ingresso" className="py-28 md:py-40 lg:py-48 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <motion.div {...slideIn(-40, 0.1)} className="bg-ivory-warm border border-sand/60 p-7 md:p-12 h-full flex flex-col overflow-hidden">
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">{tf('test.eyebrow')}</span>
            <div className="w-8 h-[1px] bg-brass mt-4 mb-6" />
            <h3 className="font-serif text-[24px] md:text-[28px] font-light text-charcoal mb-4">{tf('test.title')}</h3>
            <p className="text-[16px] md:text-[18px] leading-[1.8] text-anthracite/80 font-light">{tf('test.lead')}</p>
            <p className="mt-4 mb-8 text-[15px] leading-[1.7] text-anthracite/60 font-light italic">{tf('test.note')}</p>
            <div aria-hidden="true" className="mb-8 aspect-[1440/346] overflow-hidden border border-sand bg-ivory">
              <img src="/images/luxosa-test-snapshot.webp" alt="" loading="lazy" className="h-full w-full object-cover object-bottom" />
            </div>
            <button
              type="button"
              onClick={() => openQuiz('new')}
              className="group mt-auto flex w-full items-center justify-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.16em] md:tracking-[0.2em] uppercase font-light px-5 md:px-8 py-4 hover:bg-deep transition-colors duration-500"
            >
              {tf('test.cta')}
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div {...slideIn(40, 0.25)} className="bg-charcoal text-ivory p-7 md:p-12 h-full flex flex-col">
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light">{tf('prima.eyebrow')}</span>
            <div className="w-8 h-[1px] bg-brass-light/30 mt-4 mb-6" />
            <h3 className="font-serif text-[24px] md:text-[28px] font-light text-ivory mb-4">{tf('prima.title')}</h3>
            <p className="mb-8 text-[16px] md:text-[18px] leading-[1.8] text-ivory/70 font-light">{tf('prima.lead')}</p>
            <ul className="mb-8 space-y-5">
              {INCLUDED_KEYS.map((key) => (
                <li key={key} className="flex items-start gap-3 text-[16px] md:text-[18px] leading-[1.6] text-ivory/85 font-light">
                  <span aria-hidden="true" className="mt-[0.7em] h-[5px] w-[5px] shrink-0 rounded-full bg-brass-light" />
                  {tf(`prima.included.${key}`)}
                </li>
              ))}
            </ul>
            <a
              href={getPrimaVoltaUrl('blocco-finale')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tf('prima.ctaAria')}
              className="group mt-auto flex w-full items-center justify-center gap-3 bg-ivory text-charcoal text-[12px] tracking-[0.16em] md:tracking-[0.2em] uppercase font-light px-5 md:px-8 py-4 hover:bg-brass-light transition-colors duration-500"
            >
              {tf('prima.cta')}
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        <motion.p {...reveal(0.4)} className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[15px] text-anthracite/70 font-light">
          {tf('help.lead')}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="py-[10px] -my-[10px] text-charcoal underline underline-offset-4 decoration-brass/50 hover:decoration-brass transition-colors">{tf('help.whatsapp')}</a>
          <span aria-hidden="true">·</span>
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 py-[10px] -my-[10px] text-charcoal underline underline-offset-4 decoration-brass/50 hover:decoration-brass transition-colors">
            <Phone size={14} strokeWidth={1.5} />{tf('help.phone')}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
