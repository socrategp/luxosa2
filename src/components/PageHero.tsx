import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
}

export default function PageHero({ label, title, subtitle, image, video }: PageHeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="relative h-[85vh] min-h-[620px] max-h-[900px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: video ? undefined : backgroundY }}>
        {video ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <img src={image} alt={title} fetchPriority="high" decoding="sync" className="w-full h-[120%] -top-[10%] object-cover absolute" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-deep/40 via-deep/30 to-deep/90" />
      </motion.div>
      <div className="relative h-full flex flex-col justify-end pb-24 md:pb-32 lg:pb-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 50 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
            className="h-[1px] bg-brass-light mb-6 shadow-md"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.3 }}
            className="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-brass-light font-medium mb-4 drop-shadow-md"
          >
            {label}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.25, 0.1, 0, 1] }}
            className="font-serif text-[36px] md:text-[50px] lg:text-[60px] text-white font-normal leading-[1.08] tracking-[0.02em] max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.65 }}
              className="mt-5 text-white/60 text-[18px] md:text-[20px] font-light leading-relaxed max-w-xl tracking-wide"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
