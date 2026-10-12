import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { premiumEase } from '../lib/animations';
import { useLandingTestCta } from '../components/luxosaTestLanding/useLandingTestCta';
import {
  LANDING_DISCLAIMER,
  LandingFooter,
  LandingLogo,
  LandingShell,
  Reveal,
  StartTestButton,
} from '../components/luxosaTestLanding/LandingChrome';

/**
 * Luxosa Test landing — Variante A (emozionale / editoriale).
 * Temporary comparison route: /luxosa-test-a
 */

const OBSERVED = [
  { numeral: 'I', title: 'La cute', text: 'Dove tutto comincia: equilibrio, sensibilità, comfort.' },
  { numeral: 'II', title: 'La fibra', text: 'Forza, elasticità e la memoria di ciò che ha vissuto.' },
  { numeral: 'III', title: 'I gesti quotidiani', text: 'Abitudini, tempi, il rapporto con la propria routine.' },
  { numeral: 'IV', title: 'Il desiderio', text: 'Ciò che vorrebbe vedere, e sentire, davanti allo specchio.' },
];

function HeroA({ onStart }: { onStart: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] max-h-[1100px] overflow-hidden bg-deep" data-cursor-dark>
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <img
          src="/images/hero_ipercorsi.webp"
          alt=""
          className="absolute w-full h-[120%] -top-[10%] object-cover object-[38%_center] md:object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/40 via-deep/30 to-deep/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/60 via-deep/20 to-transparent z-10" />

      <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-8 md:pt-10">
        <LandingLogo onDark className="h-6 md:h-8 opacity-90" />
      </div>

      <div className="relative z-20 h-full flex flex-col justify-end pb-20 md:pb-28 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 50 }}
            transition={{ duration: 1, delay: 0.2, ease: premiumEase }}
            className="h-[1px] bg-brass-light mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.4 }}
            className="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-brass-light font-light mb-5 drop-shadow-md"
          >
            Luxosa Test
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.6 }}
            className="font-serif text-[40px] md:text-[56px] lg:text-[68px] xl:text-[76px] text-ivory font-normal leading-[1.08] tracking-[0.01em] max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            I suoi capelli raccontano molto più di quanto sembra.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.9 }}
            className="mt-6 md:mt-8 text-ivory/85 text-[16px] md:text-[19px] font-light leading-[1.75] max-w-xl tracking-wide"
          >
            Pochi minuti per ascoltarli. Un primo orientamento pensato su di Lei, prima ancora di entrare in Maison.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: premiumEase, delay: 1.15 }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
          >
            <StartTestButton onClick={onStart} position="hero" tone="light" className="w-full sm:w-auto" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-ivory/60 font-light">Pochi minuti · Su di Lei</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ManifestoA() {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal y={15}>
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Non un semplice quiz</span>
            <div className="h-[1px] w-10 bg-brass mx-auto mt-4 mb-10" />
          </Reveal>
          <Reveal delay={0.15}>
            <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal">
              Un primo ascolto,<br />prima di ogni gesto.
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-10 text-[16px] md:text-[18px] leading-[1.85] text-anthracite/80 font-light">
              Il Luxosa Test osserva insieme la cute, la fibra, le abitudini e il risultato che desidera. Non per offrire risposte affrettate, ma per cominciare a comprendere ciò di cui i suoi capelli hanno bisogno oggi.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ObservedA() {
  return (
    <section className="pb-32 md:pb-48 lg:pb-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <Reveal className="lg:col-span-7">
            <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] group">
              <img
                src="/images/esperienze-puzzle.webp"
                alt="Ritratto Luxosa"
                loading="lazy"
                className="w-full h-full object-cover object-[center_25%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-5">
            <Reveal y={15}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Ciò che il Test ascolta</span>
              <div className="h-[1px] w-10 bg-brass mt-4 mb-12" />
            </Reveal>
            <ol className="space-y-10 md:space-y-12">
              {OBSERVED.map((item, i) => (
                <Reveal key={item.title} delay={0.1 + i * 0.1}>
                  <li className="flex gap-6 md:gap-8">
                    <span className="font-serif italic text-[22px] md:text-[24px] text-brass-muted w-10 shrink-0 leading-none pt-1">{item.numeral}</span>
                    <div>
                      <h3 className="font-serif text-[24px] md:text-[26px] font-light tracking-wide text-charcoal leading-[1.2]">{item.title}</h3>
                      <p className="mt-2 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light">{item.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function CinematicA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[480px] overflow-hidden bg-deep" data-cursor-dark>
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src="/images/diventa_possibile.webp" alt="" loading="lazy" className="absolute w-full h-[124%] -top-[12%] object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-deep/55" />
      <div className="relative z-10 h-full flex items-center justify-center px-6 md:px-10">
        <Reveal className="text-center max-w-4xl">
          <p className="font-serif italic text-[32px] md:text-[48px] lg:text-[60px] font-light leading-[1.15] text-ivory drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            Ogni percorso Luxosa comincia da un ascolto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DossierA({ onStart }: { onStart: () => void }) {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal y={15}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Al termine</span>
              <div className="h-[1px] w-10 bg-brass mt-4 mb-8" />
            </Reveal>
            <Reveal delay={0.15}>
              <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal">
                Il suo Dossier Luxosa personale.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-14">
            <Reveal delay={0.25}>
              <p className="text-[17px] md:text-[19px] leading-[1.85] text-anthracite/85 font-light">
                Un primo ritratto dei suoi capelli: ciò che emerge dalle sue risposte e l'esperienza Luxosa più coerente con il momento che sta vivendo.
              </p>
              <p className="mt-6 text-[15px] md:text-[16px] leading-[1.85] text-anthracite/60 font-light italic">
                Un punto di partenza da approfondire, se lo desidera, insieme a noi in Maison.
              </p>
            </Reveal>
            <Reveal delay={0.4} className="mt-12">
              <StartTestButton onClick={onStart} position="dossier" tone="outline-dark" className="w-full sm:w-auto" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingA({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden bg-deep py-32 md:py-48 lg:py-56" data-cursor-dark>
      <img src="/images/colorlux.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep via-deep/70 to-deep" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <Reveal y={15}>
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-light font-light">Luxosa Test</span>
          <div className="h-[1px] w-10 bg-brass-light/60 mx-auto mt-4 mb-10" />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-ivory max-w-2xl mx-auto">
            Scopra cosa raccontano i suoi capelli.
          </h2>
        </Reveal>
        <Reveal delay={0.3} className="mt-12">
          <StartTestButton onClick={onStart} position="closing" tone="light" className="w-full sm:w-auto" />
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-14 max-w-xl mx-auto text-[13px] md:text-[14px] leading-[1.8] text-ivory/50 font-light italic">{LANDING_DISCLAIMER}</p>
        </Reveal>
      </div>
    </section>
  );
}

export default function LuxosaTestLandingA() {
  const startTest = useLandingTestCta();
  return (
    <LandingShell>
      <main>
        <HeroA onStart={startTest} />
        <ManifestoA />
        <ObservedA />
        <CinematicA />
        <DossierA onStart={startTest} />
        <ClosingA onStart={startTest} />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
