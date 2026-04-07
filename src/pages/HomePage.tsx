import Hero from '../components/Hero';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Authority from '../components/Authority';
import LuxosaValuesRing from '../components/LuxosaValuesRing';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];

function HomeIdentity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="lg:pr-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">La Maison</span>
              <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.15, ease: premiumEase }} className="font-serif text-[34px] md:text-[44px] lg:text-[50px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
              Non un salone.<br />Una maison.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }} className="mt-8 space-y-5">
              <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/80 font-light">Esistono luoghi in cui ci si accomoda. E luoghi in cui ci si sente comprese. Luxosa nasce per questo secondo tipo di esperienza.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/80 font-light">Qui la bellezza non viene trattata come una prestazione rapida o standardizzata. Parte dall'ascolto, dalla comprensione della persona e da una lettura attenta di ciò che il capello racconta.</p>
              <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/80 font-light">Non improvvisiamo. Non replichiamo la stessa risposta su donne diverse. Costruiamo percorsi che rispettano identità, desideri e tempi reali di trasformazione.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.45, ease: premiumEase }} className="mt-12">
              <Link to="/il-metodo" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-brass-muted font-light hover:text-brass transition-colors duration-500">
                Scopri la nostra visione <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.5, delay: 0.2 }} className="relative group">
            <motion.div initial={{ scale: 1.15 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 1.8, ease: premiumEase }} className="aspect-[3/4] overflow-hidden">
              <img src="/images/woman-portrait-new.jpg" alt="La visione Luxosa" className="w-full h-full object-cover transition-transform duration-[15000ms] group-hover:scale-[1.04] ease-out" />
            </motion.div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l border-b border-brass/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PerChiE() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ecru/40" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase }}
            className="h-[1px] bg-brass mx-auto mb-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
            className="font-serif text-[22px] md:text-[28px] lg:text-[32px] font-light leading-[1.6] text-charcoal tracking-[0.01em]"
          >
            Per la donna che non cerca semplicemente un appuntamento, ma un luogo in cui sentirsi presa sul serio.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-8 text-[15px] md:text-[16px] leading-[1.85] text-anthracite/65 font-light"
          >
            Per chi sa riconoscere la differenza tra attenzione autentica e routine, tra gesto tecnico e visione, tra un risultato estemporaneo e una bellezza costruita nel tempo.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.55 }}
            className="mt-5 text-[15px] md:text-[16px] leading-[1.85] text-anthracite/65 font-light"
          >
            Per chi desidera qualità, presenza, continuità e un'esperienza capace di riflettersi nel modo in cui si guarda, si sente e si presenta ogni giorno.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function Appartenenza() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-charcoal" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light"
          >
            Appartenenza
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }}
            className="h-[1px] bg-brass-light/40 mt-4 mb-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.25 }}
            className="font-serif text-[26px] md:text-[32px] lg:text-[38px] font-light leading-[1.4] text-ivory/80 tracking-[0.01em]"
          >
            Ci sono luoghi che frequenti. E luoghi a cui senti di appartenere.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: premiumEase, delay: 0.4 }}
            className="mt-8 space-y-5"
          >
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-ivory/50 font-light">
              Entrare in Luxosa significa scegliere un modo diverso di prendersi cura di sé. Non più tentativi, non più risposte uguali per tutte, non più la sensazione di dover ricominciare ogni volta da capo.
            </p>
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-ivory/50 font-light">
              Qui ogni donna viene accolta con la sua storia, i suoi desideri, il suo tempo, la sua identità. È da lì che nasce il percorso. Ed è da lì che nasce anche la fiducia.
            </p>
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-ivory/50 font-light">
              Chi sceglie Luxosa non cambia soltanto luogo. Cambia standard.
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: premiumEase, delay: 0.7 }}
            className="mt-12 font-serif text-[28px] md:text-[34px] font-light text-brass-light italic"
          >
            Io sono Luxosa.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function CinematicPayoff() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  const payoff = [
    {
      word: 'Ama',
      text: 'Prenditi cura di te con la stessa dedizione che riservi a ciò che ami. La cura di sé non è vanità. È un atto di rispetto.',
    },
    {
      word: 'Splendi',
      text: "Lascia emergere la tua versione più autentica. Non la più costruita: la più vera, la più armoniosa, la più tua.",
    },
    {
      word: 'Osa',
      text: `Scegli il cambiamento che senti giusto, anche quando è diverso dall'abitudine. La trasformazione comincia da una scelta.`,
    },
  ];

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[520px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/consultation-new.jpg"
          alt=""
          className="w-full h-[120%] -top-[10%] absolute object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-deep/50 to-deep/80" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: premiumEase }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light mb-8"
          >
            La triade del femminile
          </motion.p>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {payoff.map((item, i) => (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.1, ease: premiumEase, delay: 0.2 + i * 0.15 }}
              >
                <h3 className="font-serif text-[40px] md:text-[48px] lg:text-[56px] font-light text-ivory leading-none mb-5">
                  {item.word}.
                </h3>
                <div className="h-[1px] w-8 bg-brass-light/40 mb-5" />
                <p className="text-[14px] leading-[1.85] text-ivory/55 font-light">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CioCheDiventa() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const items = [
    { title: 'Sentirti davvero ascoltata e compresa', text: 'Ogni scelta parte da una comprensione reale di chi sei e di ciò che desideri.' },
    { title: 'Avere una direzione chiara', text: 'Il percorso prende forma con metodo, visione e continuità.' },
    { title: 'Ritrovare ordine e fiducia', text: 'Quando la cura è costruita bene, anche il modo in cui ti senti cambia.' },
    { title: 'Vedere risultati che restano', text: 'La bellezza non viene inseguita per un giorno, ma consolidata nel tempo.' },
    { title: 'Affidarti con serenità', text: 'Non devi capire tutto da sola: sei guidata con competenza e misura.' },
    { title: 'Vivere il lusso come qualità', text: "Il valore si percepisce nell'esperienza, nell'attenzione e nella differenza." },
  ];

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl mb-20 md:mb-28">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">
            Ciò che diventa possibile
          </motion.span>
          <motion.div initial={{ width: 0 }} animate={inView ? { width: 40 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.15 }} className="h-[1px] bg-brass mt-4 mb-8" />
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
            Ciò che diventa possibile<br />scegliendo Luxosa.
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 lg:gap-y-14">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: premiumEase, delay: 0.2 + i * 0.08 }}
              className="border-t border-sand/60 pt-7"
            >
              <h3 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-3 leading-snug tracking-wide">{item.title}</h3>
              <p className="text-[14px] md:text-[15px] leading-[1.8] text-anthracite/60 font-light">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 md:py-48 lg:py-64 bg-ivory-warm relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-anthracite) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 text-center relative z-10" ref={ref}>
        <motion.div initial={{ width: 0 }} animate={inView ? { width: 60 } : {}} transition={{ duration: 1.2, delay: 0.1, ease: premiumEase }} className="h-[1px] bg-brass mx-auto mb-12" />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: premiumEase, delay: 0.2 }} className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-8">
          Il prossimo passo
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: premiumEase }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal tracking-[0.01em]">
          Dopo aver conosciuto Luxosa,<br />il passo successivo è entrare nel metodo.
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.5, ease: premiumEase }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/il-metodo" className="group relative overflow-hidden inline-flex items-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5 transition-shadow duration-500 hover:shadow-xl hover:shadow-deep/10">
            <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 flex items-center gap-3">
              Scopri il Metodo <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </span>
          </Link>
          <Link to="/i-percorsi" className="group relative overflow-hidden inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-anthracite/70 font-light border border-anthracite/20 px-10 py-5 bg-transparent transition-colors duration-300">
            <span className="absolute inset-0 bg-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 group-hover:text-ivory transition-colors duration-300">Esplora i Percorsi</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeIdentity />
      <PerChiE />
      <Appartenenza />
      <LuxosaValuesRing />
      <CinematicPayoff />
      <CioCheDiventa />
      <Authority />
      <HomeCTA />
    </>
  );
}
