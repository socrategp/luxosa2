import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [onDark, setOnDark] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springX = useSpring(trailX, { damping: 28, stiffness: 180, mass: 0.5 });
  const springY = useSpring(trailY, { damping: 28, stiffness: 180, mass: 0.5 });

  const isTouchDevice = useRef(false);
  const lastCheck = useRef(0);

  const detectBackground = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastCheck.current < 80) return;
    lastCheck.current = now;

    // Temporarily hide cursor elements to get the real element underneath
    const el = document.elementFromPoint(x, y);
    if (!el) return;

    // Skip header — treat as whatever is behind it
    const header = (el as HTMLElement).closest?.('header');
    if (header) {
      // If in the top area, check if we're over a hero (dark) or content (light)
      setOnDark(y < window.innerHeight * 0.7 && document.querySelector('section.bg-deep, section[class*="overflow-hidden"]') !== null);
      return;
    }

    let target: Element | null = el;
    while (target && target !== document.documentElement) {
      const bg = getComputedStyle(target).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const match = bg.match(/\d+/g);
        if (match) {
          const [r, g, b] = match.map(Number);
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setOnDark(lum < 0.45);
        }
        return;
      }
      target = target.parentElement;
    }
    setOnDark(false);
  }, []);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      detectBackground(e.clientX, e.clientY);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);
    const onDown = () => setIsPressed(true);
    const onUp = () => setIsPressed(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    const observer = new MutationObserver(() => updateHoverListeners());
    observer.observe(document.body, { childList: true, subtree: true });
    updateHoverListeners();

    function updateHoverListeners() {
      const hoverables = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    }

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      observer.disconnect();
    };
  }, [cursorX, cursorY, trailX, trailY, isVisible, detectBackground]);

  if (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  ) {
    return null;
  }

  // Adaptive colors — no mix-blend-difference, clean rendering
  const dotColor = onDark ? '#ffffff' : '#1C1A17';
  const ringColor = isHovering
    ? 'rgba(196,174,140,0.75)'
    : onDark
      ? 'rgba(196,174,140,0.55)'
      : 'rgba(28,26,23,0.3)';

  return (
    <>
      {/* Inner dot — adaptive color, no mix-blend */}
      <motion.div
        className="fixed top-0 left-0 z-[10001] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isPressed ? 0.6 : isHovering ? 0.4 : 1,
            opacity: isVisible ? 1 : 0,
            backgroundColor: dotColor,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-[6px] h-[6px] rounded-full"
        />
      </motion.div>

      {/* Outer ring — gold/dark adaptive */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : isPressed ? 20 : 32,
            height: isHovering ? 48 : isPressed ? 20 : 32,
            opacity: isVisible ? (isHovering ? 0.85 : 0.6) : 0,
            borderColor: ringColor,
          }}
          transition={{
            width: { type: 'spring', damping: 20, stiffness: 250 },
            height: { type: 'spring', damping: 20, stiffness: 250 },
            opacity: { duration: 0.25 },
            borderColor: { duration: 0.3, ease: 'easeOut' },
          }}
          className="rounded-full"
          style={{ borderStyle: 'solid', borderWidth: 1.2 }}
        />
      </motion.div>
    </>
  );
}

