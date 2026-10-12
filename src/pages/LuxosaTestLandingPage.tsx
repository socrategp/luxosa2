import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Clock, FileText, Plus } from 'lucide-react';
import { premiumEase } from '../lib/animations';
import { useQuiz } from '../context/QuizContext';
import { useLandingTestCta } from '../components/luxosaTestLanding/useLandingTestCta';
import DossierPreview from '../components/luxosaTestLanding/DossierPreview';
import {
  LANDING_CTA_LABEL,
  LANDING_DISCLAIMER,
  LandingFooter,
  LandingLogo,
  LandingShell,
  Reveal,
  StartTestButton,
} from '../components/luxosaTestLanding/LandingChrome';

/**
 * Luxosa Test lead-magnet landing for external traffic (ads, email, WhatsApp, QR).
 * Route: /luxosa-test — not linked from the site navigation. The site's own
 * Luxosa Test CTAs keep opening the popup directly.
 */

type StartProps = { onStart: () => void };

const PROMISES = [
  { icon: Clock, label: 'Pochi minuti' },
  { icon: FileText, label: 'Dossier personale' },
  { icon: Check, label: 'Senza impegno' },
];

const BENEFITS = [
  { title: 'Un orientamento su di Lei', text: 'Non consigli generici: una prima lettura costruita sulle sue risposte, sulla sua cute e sulla sua fibra.' },
  { title: 'Il suo Dossier Luxosa', text: 'Profilo di partenza, segnali rilevati e priorità, raccolti in una sintesi personale.' },
  { title: "L'esperienza più coerente", text: 'Il percorso Luxosa e le Esperienze Signature che emergono come più vicine al suo momento.' },
  { title: 'Un passo successivo chiaro', text: 'Se lo desidera, il Dossier diventa il punto di partenza della sua consulenza in Maison.' },
];

const STEPS = [
  { title: 'Risponde', text: 'Alcune domande guidate su cute, fibra, abitudini e desideri. Pochi minuti, al suo ritmo.' },
  { title: 'Riceve il suo Dossier', text: "Al termine, un primo orientamento personale con l'esperienza Luxosa emersa dal Test." },
  { title: 'Ne parliamo in Maison', text: "Se lo desidera, la consulenza conferma e affina il percorso, dopo l'osservazione diretta." },
];

const OBSERVED = [
  { title: 'Cute', text: 'Equilibrio, sensibilità, comfort: il punto da cui tutto parte.' },
  { title: 'Fibra', text: 'Forza, elasticità, i segni lasciati da colore e calore.' },
  { title: 'Abitudini', text: 'Gesti quotidiani, tempi, la sua routine di cura.' },
  { title: 'Risultato desiderato', text: 'Ciò che vorrebbe ottenere, oggi.' },
];

const DOSSIER_CONTENTS = [
  { title: 'Profilo di partenza', text: 'La condizione attuale di cute e fibra, letta dalle sue risposte.' },
  { title: 'Segnali rilevati', text: 'Gli aspetti che meritano attenzione, anche quelli meno evidenti.' },
  { title: 'Percorso emerso', text: 'BenEssere, ColorLux o Rituale Luxosa: la direzione più coerente.' },
  { title: 'Esperienze Signature suggerite', text: 'Fino a tre Esperienze, scelte sul suo profilo.' },
  { title: 'Cosa approfondire in consulenza', text: 'I punti da osservare insieme, in Maison.' },
];

const FAQ = [
  { q: 'Quanto tempo richiede?', a: 'Pochi minuti. Le domande sono guidate e si adattano alle sue risposte, così da soffermarsi solo su ciò che la riguarda.' },
  { q: 'Si tratta di una diagnosi?', a: LANDING_DISCLAIMER },
  { q: 'Cosa succede dopo?', a: 'Sarà Lei a decidere. Se lo desidera, potrà richiedere una consulenza in Maison per approfondire il suo Dossier insieme a noi.' },
  { q: 'Come vengono gestiti i miei dati?', a: 'Prima di iniziare le verrà chiesto il consenso, secondo la nostra Privacy Policy.', privacyLink: true },
];

function SectionLabel({ children, onDark = false }: { children: string; onDark?: boolean }) {
  return (
    <>
      <span className={`text-[11px] tracking-[0.35em] uppercase font-light ${onDark ? 'text-brass-light' : 'text-brass-muted'}`}>{children}</span>
      <div className={`h-[1px] w-10 mt-4 mb-8 ${onDark ? 'bg-brass-light/60' : 'bg-brass'}`} />
    </>
  );
}

function TopBarB({ onStart }: StartProps) {
  return (
    <header className="bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 h-20 md:h-24 flex items-center justify-between gap-6">
        <LandingLogo onDark={false} className="h-6 md:h-7" />
        <button
          type="button"
          onClick={onStart}
          data-cta-position="topbar"
          className="group hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-charcoal font-light border-b border-charcoal/30 hover:border-charcoal pb-1 transition-colors duration-500"
        >
          {LANDING_CTA_LABEL}
          <ArrowRight size={13} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
    </header>
  );
}

function HeroB({ onStart, sectionRef }: StartProps & { sectionRef: RefObject<HTMLElement | null> }) {
  return (
    <section ref={sectionRef} className="bg-ivory-warm pt-8 md:pt-12 lg:pt-14 pb-24 md:pb-32 lg:pb-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-start">
          <div className="lg:col-span-6 lg:pt-10">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
              className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light"
            >
              Luxosa Test · Dossier personale
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.3 }}
              className="h-[1px] bg-brass mt-4 mb-8"
            />
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
              className="font-serif text-[36px] md:text-[50px] lg:text-[56px] font-light leading-[1.08] text-charcoal"
            >
              Scopra cosa raccontano i suoi capelli.<br />
              <span className="italic text-brass-muted">E da dove cominciare.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.6 }}
              className="mt-8 text-[16px] md:text-[18px] leading-[1.8] text-anthracite/80 font-light max-w-xl"
            >
              Risponda ad alcune domande su cute, fibra, abitudini e desideri: al termine riceverà il suo Dossier Luxosa personale, con l'esperienza più coerente emersa dal Test.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: premiumEase, delay: 0.8 }}
              className="mt-10"
            >
              <StartTestButton onClick={onStart} position="hero" className="w-full sm:w-auto" />
              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                {PROMISES.map(({ icon: Icon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-anthracite/60 font-light">
                    <Icon size={14} strokeWidth={1.3} className="text-brass-muted" />
                    {label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: premiumEase, delay: 0.7 }}
            className="lg:col-span-5 lg:col-start-8 px-2 sm:px-0"
          >
            <DossierPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BenefitsB() {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <Reveal y={15}><SectionLabel>Perché dedicarle pochi minuti</SectionLabel></Reveal>
          <Reveal delay={0.15}>
            <h2 className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
              Ciò che il Test le restituisce.
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 border-t border-sand/70">
          {BENEFITS.map((item, i) => (
            <Reveal
              key={item.title}
              delay={0.1 + i * 0.1}
              className={`py-10 md:py-12 border-b border-sand/70 ${i % 2 === 0 ? 'md:pr-14 md:border-r' : 'md:pl-14'}`}
            >
              <span className="font-serif text-[15px] text-brass-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-serif text-[24px] md:text-[26px] font-light tracking-wide text-charcoal">{item.title}</h3>
              <p className="mt-3 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light max-w-md">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsB({ onStart }: StartProps) {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <Reveal y={15}><SectionLabel>Come funziona</SectionLabel></Reveal>
          <Reveal delay={0.15}>
            <h2 className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
              Tre momenti, un solo filo.
            </h2>
          </Reveal>
        </div>
        <ol className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={0.1 + i * 0.12}>
              <li>
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full border border-brass/50 flex items-center justify-center font-serif text-[18px] text-brass-muted">{i + 1}</span>
                  <span className="flex-1 h-[1px] bg-brass/25" />
                </div>
                <h3 className="mt-7 font-serif text-[24px] font-light tracking-wide text-charcoal">{step.title}</h3>
                <p className="mt-3 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.3} className="mt-16 md:mt-20">
          <StartTestButton onClick={onStart} position="steps" className="w-full sm:w-auto" />
        </Reveal>
      </div>
    </section>
  );
}

function ObservedB() {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <Reveal y={15}><SectionLabel>Cosa osserva il Test</SectionLabel></Reveal>
            <Reveal delay={0.15}>
              <h2 className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
                Quattro aspetti, letti insieme.
              </h2>
            </Reveal>
            <dl className="mt-12 space-y-7">
              {OBSERVED.map((item, i) => (
                <Reveal key={item.title} delay={0.2 + i * 0.08} className="border-l border-brass/40 pl-6">
                  <dt className="font-serif text-[22px] md:text-[24px] font-light tracking-wide text-charcoal">{item.title}</dt>
                  <dd className="mt-1 text-[15px] leading-[1.8] text-anthracite/70 font-light">{item.text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-7 grid grid-cols-12 gap-4 md:gap-6 items-start">
            <Reveal className="col-span-7">
              <div className="overflow-hidden aspect-[3/4] group">
                <img src="/images/BenEssere.webp" alt="Osservazione della cute" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} className="col-span-5 mt-20 md:mt-32">
              <div className="overflow-hidden aspect-[3/4] group">
                <img src="/images/zona-consulenza.webp" alt="Analisi della fibra in Maison" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function DossierContentsB({ onStart }: StartProps) {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-charcoal text-ivory" data-cursor-dark>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal y={15}><SectionLabel onDark>Il suo Dossier Luxosa</SectionLabel></Reveal>
            <Reveal delay={0.15}>
              <h2 className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-ivory">
                Nel suo Dossier troverà.
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-12 overflow-hidden aspect-[4/3] hidden lg:block">
                <img src="/images/nosalone_unamaison.webp" alt="" loading="lazy" className="w-full h-full object-cover opacity-85" />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ol className="border-t border-ivory/15">
              {DOSSIER_CONTENTS.map((item, i) => (
                <Reveal key={item.title} delay={0.1 + i * 0.08}>
                  <li className="flex gap-6 md:gap-8 py-7 md:py-8 border-b border-ivory/15">
                    <span className="font-serif text-[15px] text-brass-light pt-1 w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-serif text-[22px] md:text-[24px] font-light tracking-wide text-ivory">{item.title}</h3>
                      <p className="mt-2 text-[15px] leading-[1.8] text-ivory/60 font-light">{item.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.3} className="mt-14">
              <StartTestButton onClick={onStart} position="dossier" tone="light" className="w-full sm:w-auto" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqB() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <Reveal y={15}><SectionLabel>Domande frequenti</SectionLabel></Reveal>
            <Reveal delay={0.15}>
              <h2 className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">Prima di iniziare.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-sand/70">
              {FAQ.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={item.q} className="border-b border-sand/70">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-6 py-7 text-left"
                    >
                      <span className="font-serif text-[21px] md:text-[23px] font-light text-charcoal">{item.q}</span>
                      <Plus size={18} strokeWidth={1.3} className={`shrink-0 text-brass-muted transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: premiumEase }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 pr-10 text-[15px] md:text-[16px] leading-[1.85] text-anthracite/70 font-light">
                            {item.a}
                            {item.privacyLink && (
                              <>
                                {' '}
                                <Link to="/privacy-policy" target="_blank" rel="noopener" className="text-brass-muted underline underline-offset-4 decoration-brass/40 hover:text-brass">
                                  Legga la Privacy Policy
                                </Link>
                              </>
                            )}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCtaB({ onStart }: StartProps) {
  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory-warm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <Reveal y={15}>
          <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Luxosa Test</span>
          <div className="h-[1px] w-10 bg-brass mx-auto mt-4 mb-10" />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal max-w-2xl mx-auto">
            Pochi minuti per conoscere meglio i suoi capelli.
          </h2>
        </Reveal>
        <Reveal delay={0.3} className="mt-12">
          <StartTestButton onClick={onStart} position="closing" className="w-full sm:w-auto" />
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-14 max-w-xl mx-auto text-[13px] md:text-[14px] leading-[1.8] text-anthracite/55 font-light italic">{LANDING_DISCLAIMER}</p>
        </Reveal>
      </div>
    </section>
  );
}

function MobileStickyCta({ visible, onStart }: StartProps & { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.5, ease: premiumEase }}
          className="fixed inset-x-0 bottom-0 z-[60] md:hidden bg-ivory/95 backdrop-blur-md border-t border-sand/60 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
        >
          <StartTestButton onClick={onStart} position="sticky-mobile" className="w-full !py-4" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LuxosaTestLandingPage() {
  const startTest = useLandingTestCta();
  const { quizOpen } = useQuiz();
  const heroRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef);
  const endInView = useInView(endRef);

  return (
    <LandingShell>
      <TopBarB onStart={startTest} />
      <main>
        <HeroB onStart={startTest} sectionRef={heroRef} />
        <BenefitsB />
        <StepsB onStart={startTest} />
        <ObservedB />
        <DossierContentsB onStart={startTest} />
        <FaqB />
      </main>
      <div ref={endRef}>
        <FinalCtaB onStart={startTest} />
        <LandingFooter />
      </div>
      <MobileStickyCta visible={!heroInView && !endInView && !quizOpen} onStart={startTest} />
    </LandingShell>
  );
}
