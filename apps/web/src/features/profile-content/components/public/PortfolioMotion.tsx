'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import './portfolio-motion.css';

/** Progressive enhancement: server-rendered content stays visible without JS. */
export function PortfolioMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const hero = root.querySelector<HTMLElement>('[data-hero-stage]');
    const targets = root.querySelectorAll<HTMLElement>(
      '.portfolio-shell > *, #projects button.group, #skills .grid > *, #experience li',
    );
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const resetPointer = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      hero?.style.removeProperty('--spot-x');
      hero?.style.removeProperty('--spot-y');
    };
    const movePointer = (event: PointerEvent) => {
      if (!hero || motion.matches || !pointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        hero.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
        frame = 0;
      });
    };
    const configure = () => {
      observer?.disconnect();
      resetPointer();
      targets.forEach((target) => target.removeAttribute('data-reveal'));
      if (motion.matches || !('IntersectionObserver' in window)) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-reveal', 'visible');
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

      targets.forEach((target, index) => {
        // Don't hide content already visible, focused, or reached by an anchor.
        if (target.getBoundingClientRect().top < window.innerHeight) return;
        target.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
        target.setAttribute('data-reveal', 'pending');
        observer?.observe(target);
      });
    };

    configure();
    motion.addEventListener('change', configure);
    hero?.addEventListener('pointermove', movePointer, { passive: true });
    hero?.addEventListener('pointerleave', resetPointer);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', configure);
      hero?.removeEventListener('pointermove', movePointer);
      hero?.removeEventListener('pointerleave', resetPointer);
      targets.forEach((target) => {
        target.removeAttribute('data-reveal');
        target.style.removeProperty('--reveal-delay');
      });
      resetPointer();
    };
  }, []);

  return (
    <main ref={rootRef} id="main-content" className="portfolio portfolio-motion min-h-screen">
      {children}
    </main>
  );
}
