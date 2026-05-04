import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[700px] max-h-[1100px] overflow-hidden bg-deep">
      {/* Background video */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero_lamaison_poster.webp"
          onCanPlay={(e) => { (e.currentTarget as HTMLVideoElement).style.opacity = '1'; }}
          style={{ opacity: 0, transition: 'opacity 1s ease' }}
          className="w-full h-[120%] -top-[10%] object-cover object-[center_20%] absolute"
        >
          <source src="/videos/Hero_video_lamaison_opt.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep/30 via-deep/20 to-deep/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/60 via-deep/20 to-transparent z-10" />
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
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
            className="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-brass-light font-light mb-6 drop-shadow-md"
          >
            La Maison
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0, 1] }}
            className="font-serif text-[40px] md:text-[56px] lg:text-[68px] xl:text-[76px] text-white font-normal leading-[1.08] tracking-[0.02em] max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            Un luogo in cui<br />riconoscersi.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 1 }}
            className="mt-6 md:mt-8 text-white/70 text-[18px] md:text-[20px] font-light leading-relaxed max-w-xl tracking-wide"
          >
            Luxosa è la maison dedicata alla cura evoluta di cute e capelli, dove bellezza, metodo e ascolto si incontrano per accompagnare ogni donna in un percorso personale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 1.3 }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/il-metodo"
              className="inline-flex w-full sm:w-auto items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-deep bg-ivory hover:bg-ecru px-8 py-4 transition-all duration-500"
            >
              Scopri il Metodo
            </Link>
            <Link
              to="/i-percorsi"
              className="inline-flex w-full sm:w-auto items-center justify-center text-[12px] tracking-[0.2em] uppercase font-light text-white/80 border border-white/25 hover:border-white/50 hover:text-white px-8 py-4 transition-all duration-500"
            >
              Esplora i Percorsi
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
