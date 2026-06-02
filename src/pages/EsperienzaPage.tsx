import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import Experience from '../components/Experience';
import { useQuiz } from '../context/QuizContext';

import { premiumEase } from '../lib/animations';
import { t } from '../i18n/t';

function EsperienzaIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >{t('esperienze:esperienza.page.001')}</motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mx-auto mt-4 mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.25 }}
            className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/90 font-light"
          >{t('esperienze:esperienza.page.002')}</motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-5 text-[18px] md:text-[20px] leading-[1.85] text-anthracite/90 font-light"
          >{t('esperienze:esperienza.page.003')}</motion.p>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q:t('esperienze:esperienza.page.004'),
    a:t('esperienze:esperienza.page.005'),
  },
  {
    q:t('esperienze:esperienza.page.006'),
    a:t('esperienze:esperienza.page.007'),
  },
  {
    q:t('esperienze:esperienza.page.008'),
    a:t('esperienze:esperienza.page.009'),
  },
];

function EsperienzeFAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >{t('esperienze:esperienza.page.010')}</motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-10"
          />

          <div>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, ease: premiumEase, delay: 0.2 + i * 0.1 }}
                  className="border-b border-sand/50"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="font-serif text-[17px] md:text-[18px] font-light text-charcoal leading-snug pr-8 group-hover:text-anthracite transition-colors duration-300">
                      {faq.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-5 h-5 relative"
                      aria-hidden
                    >
                      <span className="absolute top-1/2 left-0 right-0 h-[1px] bg-brass-muted -translate-y-1/2 transition-opacity duration-300" />
                      <span
                        className={`absolute top-0 bottom-0 left-1/2 w-[1px] bg-brass-muted -translate-x-1/2 transition-all duration-300 ${isOpen ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'}`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: premiumEase }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[16px] md:text-[17px] leading-[1.85] text-anthracite/75 font-light">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingNote() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-12 md:py-16 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="text-[17px] md:text-[18px] font-light italic text-anthracite/60 text-center max-w-2xl mx-auto leading-[1.8] border-t border-sand/50 pt-10"
        >{t('esperienze:esperienza.page.013')}</motion.p>
      </div>
    </section>
  );
}

function EsperienzaCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { openQuiz } = useQuiz();

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory-warm" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
          >{t('esperienze:esperienza.page.014')}</motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass mt-4 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal"
          >{t('esperienze:esperienza.page.015')}</motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.35 }}
            className="mt-8 space-y-4"
          >
            <p className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/85 font-light">{t('esperienze:esperienza.page.016')}</p>
            <p className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/85 font-light">{t('esperienze:esperienza.page.017')}</p>
            <p className="text-[17px] leading-[1.8] text-anthracite/60 font-light italic">{t('esperienze:esperienza.page.018')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase, delay: 0.55 }}
            className="mt-12"
          >
            <button
              onClick={openQuiz}
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
            >
              <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 flex items-center gap-3">{t('esperienze:esperienza.page.019')}<ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function EsperienzaPage() {
  return (
    <>
      <PageHero
        label="Le Esperienze"
        title={t('esperienze:esperienza.page.020')}
        subtitle="Le Esperienze Luxosa sono gesti di cura distinti, pensati per avvicinare al metodo e valorizzare ciò che il capello chiede davvero."
        image="/images/hero_esperienze.webp"
      />
      <EsperienzaIntro />
      <Experience />
      <PricingNote />
      <EsperienzeFAQ />
      <EsperienzaCTA />
    </>
  );
}
