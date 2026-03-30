import PageHero from '../components/PageHero';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

interface Sede {
  slug: string;
  name: string;
  city: string;
  address: string;
  image: string;
  description: string;
  status: 'active' | 'coming-soon';
}

const sedi: Sede[] = [
  {
    slug: 'messina-cavour',
    name: 'Luxosa Messina Cavour',
    city: 'Messina',
    address: 'Via Cavour, 98122 Messina (ME)',
    image: '/images/messina-city.jpg',
    description: 'La prima sede Luxosa. Un luogo dove la cura evoluta di cute e capelli incontra l\'eleganza e la tradizione della Sicilia orientale. Uno spazio raffinato nel cuore di Messina.',
    status: 'active',
  },
];

function SediGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-32 md:py-48 lg:py-56 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16" ref={ref}>
        {/* Intro */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}>
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light">Le Nostre Sedi</span>
            <div className="w-10 h-[1px] bg-brass mt-4 mb-8" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.15 }} className="font-serif text-[30px] md:text-[38px] lg:text-[44px] font-light leading-[1.12] text-charcoal">
            Ogni sede, un'esperienza<br />unica e coerente.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.3 }} className="mt-6 text-[15px] md:text-[16px] leading-[1.8] text-anthracite/70 font-light">
            Ogni sede Luxosa è progettata per offrire la stessa qualità di cura, lo stesso metodo e la stessa attenzione alla persona. Ogni spazio è un'estensione della nostra visione.
          </motion.p>
        </div>

        {/* Sedi Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sedi.map((sede, i) => (
            <motion.div
              key={sede.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.2 + i * 0.1 }}
              className="group"
            >
              {sede.status === 'active' ? (
                <Link to={`/sedi/${sede.slug}`} className="block">
                  <SedeCard sede={sede} />
                </Link>
              ) : (
                <div className="opacity-60">
                  <SedeCard sede={sede} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Future expansion note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
          className="mt-20 md:mt-28 text-center"
        >
          <div className="inline-block border-t border-b border-sand/60 py-6 px-8 md:px-16">
            <p className="font-serif text-[18px] md:text-[21px] italic text-charcoal/55 font-light leading-relaxed">
              La visione Luxosa cresce. Nuove sedi saranno presto annunciate.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SedeCard({ sede }: { sede: Sede }) {
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden mb-6">
        <img
          src={sede.image}
          alt={sede.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {sede.status === 'coming-soon' && (
          <div className="absolute inset-0 bg-deep/40 flex items-center justify-center">
            <span className="text-[11px] tracking-[0.3em] uppercase text-ivory/90 font-light border border-ivory/40 px-5 py-2">Prossimamente</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep/50 to-transparent h-24" />
        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <MapPin size={14} strokeWidth={1.3} className="text-ivory/80" />
          <span className="text-[12px] tracking-[0.15em] uppercase text-ivory/80 font-light">{sede.city}</span>
        </div>
      </div>
      <h3 className="font-serif text-[22px] md:text-[24px] font-light text-charcoal tracking-wide mb-2 group-hover:text-brass-muted transition-colors duration-500">
        {sede.name}
      </h3>
      <p className="text-[13px] leading-[1.7] text-anthracite/55 font-light mb-1">{sede.address}</p>
      <p className="text-[14px] leading-[1.75] text-anthracite/60 font-light mt-3 mb-4">{sede.description}</p>
      {sede.status === 'active' && (
        <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-brass-muted font-light group-hover:text-brass transition-colors duration-500">
          Entra nella sede <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      )}
    </div>
  );
}

export default function SediPage() {
  return (
    <>
      <PageHero
        label="Sedi"
        title="I luoghi della trasformazione."
        subtitle="Ogni sede Luxosa è un'estensione del metodo: ordine, armonia, luce e comfort al servizio della persona."
        image="/images/space-new.jpg"
      />
      <SediGrid />
    </>
  );
}
