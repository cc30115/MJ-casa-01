import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const SLICE_COUNT = 5;

// Map routes to display labels
const routeLabels: Record<string, string> = {
  '/': 'MJ Casa',
  '/custom-furniture': 'Bespoke Collection'
};

export default function PageTransition() {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Skip the first route (initial page load — handled by IntroLoader)
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const slices = overlayRef.current?.querySelectorAll('.page-transition-overlay__slice');
    if (!slices) return;

    const label = routeLabels[location.pathname] || '';

    const tl = gsap.timeline();

    // Phase 1: Slices grow up (cover the page)
    tl.set(slices, { transformOrigin: 'bottom', scaleY: 0, backgroundColor: 'var(--color-mj-surface2)' });
    tl.set(overlayRef.current, { pointerEvents: 'all' });
    tl.to(slices, {
      scaleY: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'expo.inOut'
    });

    // Phase 2: Label appears
    if (label) {
      tl.to(labelRef.current, {
        opacity: 1,
        color: 'var(--color-mj-text)',
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.2');
    }

    // Phase 3: Hold briefly
    tl.to({}, { duration: 0.8 });

    // Phase 4: Slices retract downward
    tl.set(slices, { transformOrigin: 'top' });
    tl.to(labelRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    });
    tl.to(slices, {
      scaleY: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'expo.inOut'
    }, '-=0.1');

    tl.set(overlayRef.current, { pointerEvents: 'none' });

  }, [location.pathname]);

  return (
    <>
      <div ref={overlayRef} className="page-transition-overlay">
        {Array.from({ length: SLICE_COUNT }).map((_, i) => (
          <div key={i} className="page-transition-overlay__slice" style={{ backgroundColor: 'var(--color-mj-surface2)' }} />
        ))}
      </div>
      <div ref={labelRef} className="page-transition-label" style={{ color: 'var(--color-mj-text)' }}>
        {routeLabels[location.pathname] || ''}
      </div>
    </>
  );
}
