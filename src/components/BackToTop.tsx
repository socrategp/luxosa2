import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 group cursor-pointer"
          aria-label="Torna in cima"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Outer ring — organic shape */}
            <div className="absolute inset-0 rounded-full border border-anthracite/10 bg-ivory/60 backdrop-blur-xl group-hover:border-brass/30 group-hover:bg-ivory/80 transition-all duration-700" />
            
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ boxShadow: '0 0 20px rgba(176,152,114,0.12)' }}
            />

            {/* Arrow — elegant thin line */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="relative z-10 text-anthracite/40 group-hover:text-brass-muted transition-all duration-500 group-hover:-translate-y-[2px]"
            >
              <path
                d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Label */}
          <span className="block mt-2 text-[9px] tracking-[0.3em] uppercase text-anthracite/30 font-light text-center group-hover:text-anthracite/55 transition-colors duration-500">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
