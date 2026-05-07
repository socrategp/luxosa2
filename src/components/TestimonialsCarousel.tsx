import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const premiumEase: [number, number, number, number] = [0.25, 0.1, 0, 1];
const CARD_RATIO = 0.72;
const CARD_GAP = 28;

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  percorso: string;
  valore: string;
}

export default function TestimonialsCarousel({
  testimonials,
  label,
  sectionClassName = 'py-32 md:py-48 lg:py-56 bg-charcoal overflow-hidden',
}: {
  testimonials: TestimonialItem[];
  label: string;
  sectionClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const total = testimonials.length;

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive((a) => (a + 1) % total), 8000);
  }, [total]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  const cardWidth = containerWidth * CARD_RATIO;
  const trackX = containerWidth * (1 - CARD_RATIO) / 2 - active * (cardWidth + CARD_GAP);

  const goTo = (i: number) => { setActive(i); resetInterval(); };
  const prev = () => goTo((active - 1 + total) % total);
  const next = () => goTo((active + 1) % total);

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: premiumEase }}
          className="mb-20 md:mb-24 flex items-end justify-between"
        >
          <div>
            <span className="text-[11px] tracking-[0.35em] uppercase text-brass-light/60 font-light">{label}</span>
            <div className="h-[1px] w-10 bg-brass-light/30 mt-4" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={prev} aria-label="Precedente" className="w-11 h-11 border border-ivory/15 flex items-center justify-center text-ivory/55 hover:text-ivory/95 hover:border-ivory/30 transition-colors duration-400">
              <ChevronLeft size={16} strokeWidth={1.2} />
            </button>
            <button onClick={next} aria-label="Successiva" className="w-11 h-11 border border-ivory/15 flex items-center justify-center text-ivory/55 hover:text-ivory/95 hover:border-ivory/30 transition-colors duration-400">
              <ChevronRight size={16} strokeWidth={1.2} />
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
      >
        <div ref={containerRef} className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ gap: CARD_GAP }}
              animate={{ x: containerWidth > 0 ? trackX : 0 }}
              transition={{ duration: 0.8, ease: premiumEase }}
            >
              {testimonials.map((t, i) => {
                const isActive = i === active;
                const dist = Math.min(Math.abs(i - active), total - Math.abs(i - active));
                const opacity = dist === 0 ? 1 : dist === 1 ? 0.35 : 0.12;
                const scale = dist === 0 ? 1 : dist === 1 ? 0.97 : 0.94;
                return (
                  <motion.div
                    key={t.name}
                    style={{ width: containerWidth > 0 ? cardWidth : `${CARD_RATIO * 100}%`, flexShrink: 0 }}
                    animate={{ opacity, scale }}
                    transition={{ duration: 0.7, ease: premiumEase }}
                    className="py-12 md:py-16 px-8 md:px-12 border border-ivory/10 cursor-pointer select-none"
                    onClick={() => !isActive && goTo(i)}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-[9px] tracking-[0.35em] uppercase text-brass-light/50 font-light">{t.percorso}</span>
                      <div className="h-[1px] flex-1 bg-ivory/10" />
                      <span className="text-[9px] tracking-[0.25em] uppercase text-ivory/35 font-light">{t.valore}</span>
                    </div>
                    <p className="font-serif text-[18px] md:text-[20px] lg:text-[21px] italic font-light leading-[1.8] text-ivory/85 mb-10">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] w-6 bg-brass-light/30 flex-shrink-0" />
                      <div>
                        <p className="text-[12px] tracking-[0.18em] uppercase text-ivory/85 font-light">{t.name}</p>
                        <p className="text-[11px] text-ivory/65 font-light mt-0.5 tracking-wide">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: premiumEase, delay: 0.5 }}
        className="flex items-center justify-center gap-2.5 mt-12"
      >
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Testimonianza ${i + 1}`} className="relative w-6 h-[1px] bg-ivory/15 transition-all duration-500">
            <motion.span
              className="absolute inset-0 bg-brass-light/70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i === active ? 1 : 0 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: i === active ? 8 : 0.4, ease: i === active ? 'linear' : premiumEase }}
            />
          </button>
        ))}
      </motion.div>
    </section>
  );
}
