import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const titleCharsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      // Character-by-character reveal for the main title
      tl.fromTo(titleCharsRef.current, {
        y: '100%',
        opacity: 0,
        rotateX: -90
      }, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: 'expo.out'
      }, 0.2);

      // Fade in the top bar and subtitle
      tl.fromTo([topBarRef.current, subtitleRef.current], {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, 0.6);

      // Add a gentle scale-down effect to frame the cinematic shot
      tl.fromTo(titleContainerRef.current, {
        scale: 1.05
      }, {
        scale: 1,
        duration: 2,
        ease: 'power2.out'
      }, 0);

      // Hold the intro
      tl.to({}, { duration: 0.1 });

      // Exit Animation: Slide the entire loader up off-screen seamlessly
      tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut'
      });

    });

    return () => ctx.revert();
  }, [onComplete]);

  // Keep strings static to avoid re-renders matching GSAP arrays
  const titleText = "MJ CASA";
  
  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 z-[99999] bg-[#0a0a0a] text-[#b39369] flex flex-col justify-between p-6 md:p-10 min-h-[100dvh]"
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      {/* Top Bar Navigation Area (Informational) */}
      <div ref={topBarRef} className="flex justify-between items-start w-full text-[10px] md:text-xs uppercase tracking-widest font-sans font-medium">
        <div className="text-left w-1/3 opacity-70">
          yuzu@mjcasa.com <span className="mx-2">/</span> 0988-795-925
        </div>
        <div className="text-center w-1/3 opacity-0 md:opacity-100 uppercase tracking-[0.2em]">
          CURATING EXTRAORDINARY SPACES
        </div>
        <div className="text-right w-1/3 flex justify-end gap-2 md:gap-4 opacity-70">
          <span>Bespoke</span>
          <span className="opacity-50">/</span>
          <span>Styling</span>
          <span className="opacity-50">/</span>
          <span>Art</span>
        </div>
      </div>

      {/* Main Content (Large Display Text) */}
      <div ref={titleContainerRef} className="flex-1 flex flex-col items-center justify-center">
        <div ref={subtitleRef} className="md:hidden text-center text-[10px] uppercase tracking-widest font-sans font-medium mb-12 text-[#b39369]/80">
          CURATING EXTRAORDINARY SPACES
        </div>

        {/* Dynamic 3D Letter Reveal */}
        <div className="overflow-hidden px-[8vw] -mx-[8vw]" style={{ perspective: '1000px' }}>
          <h1 className="text-[22vw] md:text-[20vw] leading-[1.3] tracking-tighter m-0 flex">
            {titleText.split('').map((char, index) => (
              <span 
                key={index}
                ref={el => {
                  if (el && !titleCharsRef.current.includes(el)) {
                    titleCharsRef.current[index] = el;
                  }
                }}
                className="inline-block transform origin-bottom"
                style={{ 
                  fontFamily: 'var(--font-serif)',
                  textTransform: 'uppercase',
                  whiteSpace: 'pre'
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Bottom Legal/Date Decoration */}
      <div className="w-full flex justify-between items-end text-[10px] uppercase tracking-widest font-sans font-medium opacity-50">
        <span>TAIWAN HQ</span>
        <span>2026 EDITION</span>
      </div>
    </div>
  );
}
