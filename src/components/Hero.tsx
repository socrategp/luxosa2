import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] max-h-[1100px] overflow-hidden bg-deep">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-woman-front.jpg"
          alt="Luxosa"
          className="w-full h-full object-cover object-[center_20%]"
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep/30 via-transparent to-deep/55 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/50 via-deep/10 to-transparent z-10" />
      <div
        className="absolute inset-0 opacity-25 z-10"
        style={{
          background:
            'radial-gradient(ellipse at 55% 40%, transparent 35%, rgba(28,26,23,0.6) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-24 md:pb-32 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
            className="h-[1px] bg-brass-light mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-brass-light font-light mb-6"
          >
            Maison di cura evoluta per cute e capelli
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0, 1] }}
            className="font-serif text-[40px] md:text-[56px] lg:text-[68px] xl:text-[76px] text-white font-light leading-[1.08] tracking-[0.02em] max-w-3xl"
          >
            Dove la cura<br />
            diventa metodo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6 md:mt-8 text-white/70 text-[15px] md:text-[17px] font-light leading-relaxed max-w-xl tracking-wide"
          >
            Ogni percorso nasce dall'ascolto, dall'analisi e dalla comprensione
            profonda della persona. Perché la vera bellezza si rivela con
            intelligenza e sensibilità.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/contatti"
              className="inline-flex items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-deep bg-ivory hover:bg-white px-8 py-4 transition-all duration-500"
            >
              Prenota una consulenza
            </Link>
            <Link
              to="/il-metodo"
              className="inline-flex items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-white/80 border border-white/25 hover:border-white/50 hover:text-white px-8 py-4 transition-all duration-500"
            >
              Scopri il metodo
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-light">
          Scopri
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
