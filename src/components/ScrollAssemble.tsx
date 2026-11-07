'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  UseScrollOptions,
} from 'framer-motion';

export interface ScrollAssembleProps {
  from?: 'left' | 'right' | 'bottom';
  distance?: number;
  rotate?: number;
  scaleFrom?: number;
  blurFrom?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offset?: any;
  delay?: number; // Shifts the offset start/end by this amount (e.g., 0.05)
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function ScrollAssemble({
  from = 'left',
  distance = 220,
  rotate = 0,
  scaleFrom = 0.92,
  blurFrom = 6,
  offset = ['start 95%', 'start 55%'],
  delay = 0,
  className = '',
  style = {},
  children,
}: ScrollAssembleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Screen size check for mobile responsive scaling
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute responsive values (mobile: smaller distance, zero rotate/blur)
  const effectiveDistance = isMobile ? Math.min(distance, 70) : distance;
  const effectiveRotate = isMobile ? 0 : rotate;
  const effectiveBlur = isMobile ? 0 : blurFrom;

  // Track scroll progress of the target element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Apply smooth spring physics so scrubbing feels fluid without jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  // Calculate start X/Y offsets based on direction
  const startX = from === 'left' ? -effectiveDistance : from === 'right' ? effectiveDistance : 0;
  const startY = from === 'bottom' ? effectiveDistance : 0;

  // Clamp transform mappings exactly from [0, 1] to identity [0, 0] so there is zero leftover shift at settle
  // Delay shifts the range slightly if specified
  const rangeStart = Math.min(0.4, Math.max(0, delay));
  const rangeEnd = 1;

  const x = useTransform(smoothProgress, [rangeStart, rangeEnd], [startX, 0], { clamp: true });
  const y = useTransform(smoothProgress, [rangeStart, rangeEnd], [startY, 0], { clamp: true });
  const rotateVal = useTransform(smoothProgress, [rangeStart, rangeEnd], [effectiveRotate, 0], { clamp: true });
  const scale = useTransform(smoothProgress, [rangeStart, rangeEnd], [scaleFrom, 1], { clamp: true });
  // Opacity finishes early (around 65% of scroll) so the content is fully crisp and readable
  const opacity = useTransform(smoothProgress, [rangeStart, rangeStart + (rangeEnd - rangeStart) * 0.65], [0, 1], { clamp: true });
  // Filter blur resolves to 0px
  const blurVal = useTransform(
    smoothProgress,
    [rangeStart, rangeStart + (rangeEnd - rangeStart) * 0.8],
    [`blur(${effectiveBlur}px)`, 'blur(0px)'],
    { clamp: true }
  );

  // If user prefers reduced motion, render immediately settled
  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x,
        y,
        rotate: rotateVal,
        scale,
        opacity,
        filter: effectiveBlur > 0 ? blurVal : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollAssemble;
