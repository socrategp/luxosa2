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
  const rafRef = useRef<number>(0);
  const lastCheck = useRef(0);

  // Detect if cursor is over a dark or light area
  const detectBackground = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastCheck.current < 100) return; // throttle to 10fps
    lastCheck.current = now;

    const el = document.elementFromPoint(x, y);
    if (!el) return;

    let target: Element | null = el;
    while (target && target !== document.documentElement) {
      const bg = getComputedStyle(target).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const match = bg.match(/\d+/g);
        if (match) {
          const [r, g, b] = match.map(Number);
          // Perceived luminance
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setOnDark(lum < 0.45);
        }
        return;
      }
      target = target.parentElement;
    }
    // Default to light (ivory body)
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
      const hoverables = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
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
      cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY, trailX, trailY, isVisible, detectBackground]);

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  // Color scheme based on background
  const dotColor = onDark ? '#ffffff' : '#1C1A17';
  const ringColor = isHovering
    ? 'rgba(196,174,140,0.75)' // gold on hover, always
    : onDark
      ? 'rgba(196,174,140,0.6)'  // gold on dark
      : 'rgba(28,26,23,0.35)';    // dark on light

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
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

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
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
            borderColor: { duration: 0.35, ease: 'easeOut' },
          }}
          className="rounded-full"
          style={{ borderStyle: 'solid', borderWidth: 1.2 }}
        />
      </motion.div>
    </>
  );
}
