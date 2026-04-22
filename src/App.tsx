/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import FurnitureCustomization from './pages/FurnitureCustomization';
import IntroLoader from './components/IntroLoader';
import PageTransition from './components/PageTransition';
import BackgroundCanvas from './components/BackgroundCanvas';

gsap.registerPlugin(ScrollTrigger);
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const cursorImageContainerRef = useRef<HTMLDivElement>(null);
  const cursorImageRef = useRef<HTMLImageElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuImages = {
    'History': '/Image/Hero small image/12.jpeg',
    'Expertise': '/Image/Hero small image/19.jpeg',
    'Works': '/Image/Hero small image/21.2.jpeg',
    'Custom Furniture': '/Image/Hero small image/6.jpeg',
    'Contact': '/Image/Hero silde Image/39.jpeg'
  };

  const toggleMenu = () => {
    if (isMenuAnimating) return;
    setIsMenuAnimating(true);

    if (!isMenuOpen) {
      // Expanding
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMenuOpen(true);
          setIsMenuAnimating(false);
        }
      });

      document.body.style.overflow = 'hidden';

      tl.to(menuRef.current, {
        top: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        duration: 0.8,
        ease: 'expo.inOut'
      }, 0);

      tl.to(triggerRef.current, {
        top: '32px',
        right: '32px',
        duration: 0.8,
        ease: 'expo.inOut'
      }, 0);

      tl.to(contentRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.1
      }, 0.4);

      tl.to('.menu-item', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }, 0.4);

    } else {
      // Collapsing
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMenuOpen(false);
          setIsMenuAnimating(false);
          document.body.style.overflow = '';
        }
      });



      tl.to('.menu-item', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in'
      }, 0);

      tl.to(contentRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.2
      }, 0.2);

      tl.to(menuRef.current, {
        top: '32px',
        right: '32px',
        width: '60px',
        height: '60px',
        borderRadius: '30px',
        duration: 0.8,
        ease: 'expo.inOut'
      }, 0.4);

      tl.to(triggerRef.current, {
        top: '0px',
        right: '0px',
        duration: 0.8,
        ease: 'expo.inOut'
      }, 0.4);
    }
  };

  useGSAP(() => {
    // --- Smooth Scrolling (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- Custom Cursor ---
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorImgContainer = cursorImageContainerRef.current;
    const cursorImg = cursorImageRef.current;
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let imgPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const setDotX = gsap.quickSetter(cursorDot, "x", "px");
    const setDotY = gsap.quickSetter(cursorDot, "y", "px");
    const setOutlineX = gsap.quickSetter(cursorOutline, "x", "px");
    const setOutlineY = gsap.quickSetter(cursorOutline, "y", "px");
    const setImgContX = gsap.quickSetter(cursorImgContainer, "x", "px");
    const setImgContY = gsap.quickSetter(cursorImgContainer, "y", "px");

    gsap.ticker.add(() => {
        setDotX(mouse.x);
        setDotY(mouse.y);
        
        outlinePos.x += (mouse.x - outlinePos.x) * 0.15;
        outlinePos.y += (mouse.y - outlinePos.y) * 0.15;
        setOutlineX(outlinePos.x);
        setOutlineY(outlinePos.y);

        imgPos.x += (mouse.x - imgPos.x) * 0.1;
        imgPos.y += (mouse.y - imgPos.y) * 0.1;
        setImgContX(imgPos.x - 150);
        setImgContY(imgPos.y - 200);
    });

    // --- GSAP Animations setup done ---
    // Make sure we update Lenis when a new page might need ScrollTrigger refresh
    // Route changes are outside this local effect though.

    return () => {
        document.removeEventListener('mousemove', onMouseMove);
        lenis.destroy();
    };
  }, { scope: containerRef });

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
    // Refresh ScrollTrigger after loader is removed
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {/* Intro Loader */}
      {isLoading && <IntroLoader onComplete={handleLoaderComplete} />}
      <PageTransition />
      <div ref={containerRef}>
      {/* Global Elements */}
      <BackgroundCanvas />
      <div className="bg-noise"></div>


      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot"></div>
      <div ref={cursorOutlineRef} className="cursor-outline"></div>

      {/* Service Hover Image Cursor */}
      <div 
        ref={cursorImageContainerRef} 
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 scale-75 overflow-hidden rounded-mj w-[300px] h-[400px] shadow-2xl"
      >
          <img ref={cursorImageRef} src={undefined} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Logo */}
      <Link to="/" id="nav-logo" className="fixed top-8 left-8 md:left-10 z-[90] font-serif text-xl md:text-2xl tracking-widest text-white hover-target cursor-pointer mix-blend-difference opacity-100 pointer-events-auto transition-opacity duration-500">
          MJ CASA
      </Link>

      {/* Header CTA */}
      <div className="fixed top-[32px] right-[100px] z-[90] hidden md:flex">
          <Link to="/#contact" className="flex items-center justify-center px-6 h-[60px] border border-white/20 rounded-full text-xs tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-colors hover-target mix-blend-difference">
              Start Project
          </Link>
      </div>

      {/* Morphing Navigation Menu */}
      <div 
        ref={menuRef} 
        className="fixed z-[100] bg-mj-surface2 overflow-hidden"
        style={{
          top: '32px',
          right: '32px',
          width: '60px',
          height: '60px',
          borderRadius: '30px'
        }}
      >
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          onClick={toggleMenu}
          className="absolute w-[60px] h-[60px] flex items-center justify-center z-20 hover-target"
          style={{ top: '0px', right: '0px' }}
        >
          {/* Hamburger Icon */}
          <div className="relative w-[17px] h-[14px] flex flex-col justify-between items-center">
            <span className="block w-full h-[1px] bg-mj-text transition-transform duration-500 origin-center" style={{ transform: isMenuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
            <span className="block w-full h-[1px] bg-mj-text transition-opacity duration-500" style={{ opacity: isMenuOpen ? 0 : 1 }} />
            <span className="block w-full h-[1px] bg-mj-text transition-transform duration-500 origin-center" style={{ transform: isMenuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
          </div>
        </button>

        {/* Menu Content */}
        <div ref={contentRef} className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-[2]">
          <ul className="w-full max-w-5xl px-8 flex flex-col items-center">
            {['History', 'Expertise', 'Works', 'Custom Furniture', 'Contact'].map((item) => {
              let toPath = "/";
              let anchor = item.toLowerCase() === 'works' ? 'projects' : item.toLowerCase() === 'history' ? 'trust' : item.toLowerCase();
              if (item === 'Custom Furniture') {
                  toPath = '/custom-furniture';
                  anchor = '';
              }
              const url = toPath + (anchor ? `#${anchor}` : '');
              const imgSrc = menuImages[item as keyof typeof menuImages];
              
              return (
                <li key={item} className="menu-item opacity-0 translate-y-8 w-full">
                  <Link 
                    to={url}
                    onClick={toggleMenu}
                    className="group relative flex items-center justify-center py-4 border-b border-white/5 hover:border-mj-accent/30 transition-colors duration-500 overflow-hidden"
                  >
                    <div className="flex items-center gap-8 md:gap-12 relative">
                        <span className="font-serif text-3xl md:text-6xl text-mj-text group-hover:text-mj-accent transition-all duration-500 tracking-widest uppercase block whitespace-nowrap">
                            {item}
                        </span>
                        
                        {/* Image Frame: 16:9 ratio, matched to font height */}
                        <div className="relative w-0 group-hover:w-32 md:group-hover:w-48 aspect-video overflow-hidden rounded-sm transition-all duration-700 ease-expo scale-x-0 group-hover:scale-x-100 origin-left">
                            <img 
                                src={imgSrc} 
                                alt={item} 
                                className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000"
                            />
                        </div>
                    </div>

                    {/* Subtle numbering - decorative */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 transition-opacity font-serif italic text-2xl hidden md:block">
                        {item === 'History' ? '01' : item === 'Expertise' ? '02' : item === 'Works' ? '03' : item === 'Custom Furniture' ? '04' : '05'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custom-furniture" element={<FurnitureCustomization />} />
        </Routes>
      </main>
    </div>
    </Router>
  );
}
