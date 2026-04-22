/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import OfficeLocations from '../components/OfficeLocations';
import ProcessSection from '../components/ProcessSection';
import ModelViewer from '../components/ModelViewer';

gsap.registerPlugin(ScrollTrigger);

const SENSORY_CATEGORIES = ['All Curation', 'Residential', 'Commercial', 'Art Installations', 'Bespoke Objects'];

const SENSORY_PROJECTS = [
    { id: 1, title: 'Urban Villa', category: 'Residential', image: '/Image/Hero small image/12.jpeg', desc: '喧囂中的庇護所，內斂的高級質感。' },
    { id: 2, title: 'The Noir Lounge', category: 'Commercial', image: '/Image/Hero small image/1679401452959.jpg', desc: '極致暗黑氛圍，社交場域的展演。' },
    { id: 3, title: 'Artisan Gallery', category: 'Art Installations', image: '/Image/Hero small image/19.jpeg', desc: '色彩與空間的雕塑前衛展演。' },
    { id: 4, title: 'Zenith HQ', category: 'Commercial', image: '/Image/Hero small image/21.2.jpeg', desc: '重塑企業形象的藝術品味。' },
    { id: 5, title: 'Timber & Stone', category: 'Residential', image: '/Image/Hero small image/6.jpeg', desc: '溫潤木作與冷冽石材的交響曲。' },
    { id: 6, title: 'Sculpted Space', category: 'Bespoke Objects', image: '/Image/Hero small image/SiTaQB7mt_qvxJX02iNtgEaHQrrbea8kOgT9rToE_a0.jpg', desc: '專為個人訂製的獨特生活物件與角落。' }
];

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [Autoplay({ delay: 8000, stopOnInteraction: false }), Fade()]);
  const [emblaRefSmall, emblaApiSmall] = useEmblaCarousel({ loop: true, duration: 40 }, [Autoplay({ delay: 8000, stopOnInteraction: false }), Fade()]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [activeSensoryCategory, setActiveSensoryCategory] = useState('All Curation');

  const [selectedIndexSmall, setSelectedIndexSmall] = useState(0);
  const [scrollSnapsSmall, setScrollSnapsSmall] = useState<number[]>([]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollToSmall = useCallback((index: number) => emblaApiSmall && emblaApiSmall.scrollTo(index), [emblaApiSmall]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onInitSmall = useCallback((emblaApi: any) => {
    setScrollSnapsSmall(emblaApi.scrollSnapList());
  }, []);

  const onSelectSmall = useCallback((emblaApi: any) => {
    setSelectedIndexSmall(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    if (!emblaApiSmall) return;
    onInitSmall(emblaApiSmall);
    onSelectSmall(emblaApiSmall);
    emblaApiSmall.on('reInit', onInitSmall).on('reInit', onSelectSmall).on('select', onSelectSmall);
  }, [emblaApiSmall, onInitSmall, onSelectSmall]);

  const heroImages = [
    "/Image/Hero silde Image/39.jpeg",
    "/Image/Hero silde Image/IMG_2841.JPG",
    "/Image/Hero silde Image/IMG_2843.JPG",
    "/Image/Hero silde Image/IMG_7064.JPG",
    "/Image/Hero silde Image/IMG_7066.JPG",
  ];

  const heroSmallImages = [
    "/Image/Hero small image/12.jpeg",
    "/Image/Hero small image/1679401452959.jpg",
    "/Image/Hero small image/19.jpeg",
    "/Image/Hero small image/21.2.jpeg",
    "/Image/Hero small image/6.jpeg",
    "/Image/Hero small image/SiTaQB7mt_qvxJX02iNtgEaHQrrbea8kOgT9rToE_a0.jpg",
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {


    // --- GSAP Animations ---

    // Hero Init
    const heroTl = gsap.timeline({ delay: 0.2 });
    
    heroTl.to('.hero-title-text', {
        y: "0%",
        duration: 1.5,
        stagger: 0.15,
        ease: "expo.out"
    });

    heroTl.to('.hero-fade', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=1.2");

    heroTl.to('#hero-bg', {
        scale: 1,
        duration: 4,
        ease: "power1.out"
    }, "-=1.5");

    // General Fade/Slide up reveals
    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Image Parallax slightly
    const imageElements = document.querySelectorAll('.gs-image img');
    imageElements.forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Craft Image Container Blur/Opacity Effect
    const craftContainers = document.querySelectorAll('.craft-image-container');
    craftContainers.forEach(container => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 85%",
                end: "bottom 15%",
                scrub: true,
            }
        });
        
        tl.fromTo(container, 
            { filter: 'blur(8px)', opacity: 0.2 }, 
            { filter: 'blur(0px)', opacity: 1, duration: 1, ease: "power1.out" }
        )
        .to(container, { filter: 'blur(0px)', opacity: 1, duration: 1.5 })
        .to(container, { filter: 'blur(8px)', opacity: 0.2, duration: 1, ease: "power1.in" });
    });

    // Large Background Parallax
    const parallaxBgs = document.querySelectorAll('.gs-parallax');
    parallaxBgs.forEach(bg => {
        const speed = parseFloat((bg as HTMLElement).dataset.speed || "0.5");
        gsap.to(bg, {
            y: () => `${window.innerHeight * speed}px`,
            ease: "none",
            scrollTrigger: {
                trigger: bg.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Staggered Grid Scroll
    if(window.innerWidth > 768) {
        const staggerCols = document.querySelectorAll('.stagger-col');
        staggerCols.forEach((col) => {
            const speed = parseFloat((col as HTMLElement).dataset.speed || "1");
            const yMove = (1 - speed) * 300; 
            
            gsap.to(col, {
                y: yMove,
                ease: "none",
                scrollTrigger: {
                    trigger: '#staggered-grid',
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full relative">


      <main>
          {/* HERO SECTION */}
          <section id="hero" className="relative min-h-screen md:h-screen w-full flex flex-col md:flex-row px-6 md:px-[5vw] pt-32 pb-12 overflow-hidden bg-transparent">
              {/* Left Column */}
              <div className="w-full md:w-[55%] h-full flex flex-col justify-between relative z-10 pr-4 md:pr-12">
                  <div className="flex justify-between items-start w-full">
                      {/* Small Image Slider */}
                      <div className="w-32 md:w-48 aspect-[4/5] overflow-hidden rounded-mj opacity-0 hero-fade transform translate-y-8 embla relative" ref={emblaRefSmall}>
                          <div className="embla__container h-full flex">
                              {heroSmallImages.map((src, index) => (
                                  <div className="embla__slide h-full flex-none w-full relative" key={index}>
                                      <img src={src} alt={`Space Detail ${index + 1}`} className="w-full h-full object-cover" />
                                  </div>
                              ))}
                          </div>
                          {/* Embla Dot Indicators (Small Slider) */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 scale-75">
                              {scrollSnapsSmall.map((_, index) => (
                                  <button
                                      key={index}
                                      onClick={() => scrollToSmall(index)}
                                      className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${index === selectedIndexSmall ? 'bg-mj-accent w-4' : 'bg-white/20 hover:bg-white/50'}`}
                                      aria-label={`Go to small slide ${index + 1}`}
                                  />
                              ))}
                          </div>
                      </div>
                      
                      {/* Book Now Link */}
                      <div className="mt-24 md:mt-48 opacity-0 hero-fade transform translate-y-8">
                          <a href="#contact" className="text-mj-accent tracking-widest text-xs md:text-sm uppercase hover:opacity-70 transition-opacity font-sans italic">
                              (BOOK NOW)
                          </a>
                      </div>
                  </div>

                  {/* Typography & Location */}
                  <div className="mt-16 md:mt-auto pb-4">
                      <h1 className="font-serif text-[16vw] md:text-[10vw] leading-[0.9] tracking-tight text-mj-text uppercase flex flex-col">
                          <div className="overflow-hidden pb-4 md:pb-6">
                              <span className="block hero-title-text transform translate-y-[120%]">MJ</span>
                          </div>
                          <div className="overflow-hidden pb-4 md:pb-6">
                              <span className="block hero-title-text transform translate-y-[120%]">CASA</span>
                          </div>
                      </h1>
                      <div className="mt-8 text-mj-muted text-xs md:text-xs tracking-widest uppercase leading-relaxed opacity-0 hero-fade transform translate-y-8 space-y-4">
                          <p className="text-mj-accent font-medium tracking-[0.2em]">訂製傢俱 / 軟裝配置 / 藝術策展</p>
                          <div>
                              <p>TAICHUNG CITY, XITUN DIST,</p>
                              <p>TAIWAN BOULEVARD SEC. 3, NO. 266</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-[45%] h-[50vh] md:h-full mt-12 md:mt-0 relative z-10 opacity-0 hero-fade transform translate-y-12">
                  <div className="w-full h-full overflow-hidden rounded-mj embla relative" ref={emblaRef}>
                      <div className="embla__container h-full flex">
                          {heroImages.map((src, index) => (
                              <div className="embla__slide h-full flex-none w-full relative" key={index}>
                                  <img 
                                      id={index === 0 ? "hero-bg" : undefined} 
                                      src={src} 
                                      alt={`MJ CASA Space ${index + 1}`} 
                                      className="w-full h-full object-cover scale-105" 
                                  />
                              </div>
                          ))}
                      </div>
                      
                      {/* Embla Dot Indicators */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                          {scrollSnaps.map((_, index) => (
                              <button
                                  key={index}
                                  onClick={() => scrollTo(index)}
                                  className={`w-2 h-2 rounded-full transition-all duration-500 ${index === selectedIndex ? 'bg-mj-accent w-6' : 'bg-white/20 hover:bg-white/50'}`}
                                  aria-label={`Go to slide ${index + 1}`}
                              />
                          ))}
                      </div>
                  </div>
              </div>
          </section>
          
          {/* MANIFESTO SECTION */}
          <section id="manifesto" className="relative pt-48 pb-32 px-6 md:px-[5vw] z-content bg-transparent overflow-hidden border-b border-white/5">
              <div className="max-w-7xl mx-auto">
                  {/* Top Header Layer */}
                  <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-32">
                      <div className="w-full md:w-1/4">
                          <div className="flex items-center gap-3 mb-8 gs-reveal text-mj-accent">
                              <span className="h-[1px] w-6 bg-mj-accent"></span>
                              <p className="tracking-[0.3em] uppercase text-xs font-bold italic">Manifesto</p>
                          </div>
                          <div className="w-32 aspect-[3/4] overflow-hidden rounded-mj gs-reveal">
                              <img 
                                src="/Image/Hero silde Image/IMG_2841.JPG" 
                                alt="Curation Mindset" 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                              />
                          </div>
                      </div>
                      
                      <div className="w-full md:w-3/4">
                          <h2 className="font-serif text-4xl md:text-6xl leading-tight text-mj-text tracking-tight gs-reveal uppercase">
                              The <span className="italic text-mj-muted">Curation</span><br/>
                              of <span className="italic text-mj-accent underline underline-offset-8 decoration-1 decoration-mj-accent/30">Extraordinary</span> Life.
                          </h2>
                          <div className="mt-12 md:max-w-xl gs-reveal">
                              <p className="text-mj-muted font-light text-lg md:text-xl leading-relaxed italic">
                                  We are your design-obsessed, logistics-savvy creative partner for elevated interiors and bespoke furniture – built for those who seek to be remembered.
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Secondary Statement */}
                  <div className="text-center mb-24">
                      <p className="font-serif text-2xl md:text-4xl text-mj-muted italic gs-reveal max-w-3xl mx-auto leading-relaxed">
                          ...But let's be honest: that's not the whole story.
                      </p>
                  </div>

                  {/* Main Feature Image */}
                  <div className="relative w-full aspect-video md:aspect-[21/9] rounded-mj overflow-hidden mb-24 gs-reveal group">
                      <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1500&auto=format&fit=crop" 
                        alt="The Creative Process" 
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-expo"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
                  </div>

                  {/* Bottom Text Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                      <div className="gs-reveal">
                          <p className="text-mj-muted font-light leading-relaxed text-lg">
                              We are not craftsmen. We are not "going with the flow" unless the flow is color-matched, precisely calculated, and shipped with signature verification.
                          </p>
                          <p className="text-mj-text mt-6 font-serif italic text-xl">
                              We are Rare Assembly. Founded on precision, ambition, and an unrelenting intolerance for mediocre aesthetics.
                          </p>
                      </div>
                      <div className="gs-reveal">
                          <p className="text-mj-muted font-light leading-relaxed text-lg">
                              Where others see a furniture item, we see a high-stakes opportunity to emotionally resonate with taste. We are the last line of defense between your space and a sad, generic environment that fades when you blink.
                          </p>
                          <div className="mt-10">
                              <button className="hover-target px-8 py-3 border border-mj-accent text-mj-accent text-xs tracking-widest uppercase hover:bg-mj-accent hover:text-mj-base transition-all duration-300">
                                  Explore Our Philosophy
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* BRAND STORY / TRUST */}
          <section id="trust" className="relative py-32 px-6 md:px-[5vw] z-content bg-transparent">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
                  <div className="md:w-5/12 flex flex-col justify-start">
                      <div className="sticky top-32">
                          <div className="flex items-center gap-4 mb-8 text-mj-accent">
                              <span className="font-serif text-xl">01</span>
                              <div className="h-[1px] w-12 bg-mj-accent/50"></div>
                              <span className="tracking-[0.2em] text-sm uppercase">History</span>
                          </div>
                          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
                              <span className="block text-mj-text gs-reveal">Craft &</span>
                              <span className="block text-mj-muted gs-reveal">Precision</span>
                          </h2>
                          <div className="space-y-6 text-mj-muted font-light leading-relaxed text-lg gs-reveal">
                              <p>覓境的源起，來自家族與木材相守的歲月。</p>
                              <p>從厚實的大料，到精準的 CNC 雕琢，在一道道工序裡，傳承著對品質的執念。我們不販售家具，我們設計與策劃生活體驗。</p>
                              <p className="text-mj-accent">設計與製作，不再分離，而是一條緊密的生命線。</p>
                          </div>
                      </div>
                  </div>

                  <div className="md:w-7/12 flex flex-col gap-16 md:gap-32 pt-10 md:pt-32 pb-32">
                      <div className="craft-image-container relative rounded-mj overflow-hidden aspect-[4/3] group gs-image">
                          <img src="/Image/Hero silde Image/39.jpeg" alt="Wood Crafting" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-500 group-hover:bg-black/30"></div>
                          <div className="absolute bottom-6 left-6 z-10 text-white/90 font-serif text-base tracking-wide">Material Essence</div>
                      </div>
                      <div className="craft-image-container relative rounded-mj overflow-hidden aspect-square md:w-4/5 ml-auto group gs-image">
                          <img src="/Image/Hero silde Image/IMG_2841.JPG" alt="Precision Integration" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-500 group-hover:bg-black/30"></div>
                          <div className="absolute bottom-6 left-6 z-10 text-white/90 font-serif text-base tracking-wide">Design Integration</div>
                      </div>
                      <div className="craft-image-container relative rounded-mj overflow-hidden aspect-[4/3] md:w-5/6 group gs-image">
                          <img src="/Image/Hero silde Image/IMG_2843.JPG" alt="Artisan Details" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-500 group-hover:bg-black/30"></div>
                          <div className="absolute bottom-6 left-6 z-10 text-white/90 font-serif text-base tracking-wide">Artisan Details</div>
                      </div>
                      <div className="craft-image-container relative rounded-mj overflow-hidden aspect-[3/4] md:w-3/4 ml-auto group gs-image">
                          <img src="/Image/Hero silde Image/IMG_7064.JPG" alt="Spatial Harmony" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-500 group-hover:bg-black/30"></div>
                          <div className="absolute bottom-6 left-6 z-10 text-white/90 font-serif text-base tracking-wide">Spatial Harmony</div>
                      </div>
                      <div className="craft-image-container relative rounded-mj overflow-hidden aspect-[16/9] group gs-image">
                          <img src="/Image/Hero silde Image/IMG_7066.JPG" alt="Timeless Aesthetics" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-500 group-hover:bg-black/30"></div>
                          <div className="absolute bottom-6 left-6 z-10 text-white/90 font-serif text-base tracking-wide">Timeless Aesthetics</div>
                      </div>
                  </div>
              </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="relative py-32 px-6 md:px-[5vw] z-content bg-transparent">
              <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gs-reveal">
                      <div>
                          <div className="flex items-center gap-4 mb-6 text-mj-accent">
                              <span className="font-serif text-xl">02</span>
                              <div className="h-[1px] w-12 bg-mj-accent/50"></div>
                              <span className="tracking-[0.2em] text-sm uppercase">Expertise</span>
                          </div>
                          <h2 className="font-serif text-4xl md:text-6xl text-mj-text">Bespoke<br/><span className="text-mj-muted">Services</span></h2>
                      </div>
                      <p className="max-w-xs text-mj-muted mt-6 md:mt-0 font-light">全方位的空間整合服務，美學與品質是我們的核心價值。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* SERVICE I */}
                      <div className="service-card group relative bg-mj-base rounded-mj overflow-hidden border border-white/5 gs-reveal hover:border-mj-accent/30 transition-colors duration-500 flex flex-col">
                          <div className="relative aspect-[4/5] overflow-hidden">
                              <img src="/Image/Hero small image/12.jpeg" alt="Custom Furniture" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-mj-base/40 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700"></div>
                              <div className="absolute top-6 left-6 font-serif text-5xl text-white/5 italic">I.</div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                              <div className="mb-4">
                                  <span className="inline-block px-3 py-1 bg-mj-accent/10 rounded-mj text-xs tracking-widest text-mj-accent uppercase font-bold mb-3">客製家具</span>
                                  <h3 className="text-2xl font-serif text-mj-text group-hover:text-mj-accent transition-colors">Custom Furniture</h3>
                              </div>
                              <p className="text-mj-muted font-light text-sm leading-relaxed mb-8 flex-1">精準定義尺寸與材質，突破量產限制，為您打造完美契合生活習慣與空間尺度的專屬物件，成就無可取代的專屬美學。</p>
                              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                  <span className="text-xs tracking-widest uppercase text-mj-muted group-hover:text-mj-accent transition-colors">Learn More</span>
                                  <iconify-icon icon="lucide:arrow-right" width="16" className="text-mj-accent transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"></iconify-icon>
                              </div>
                          </div>
                      </div>

                      {/* SERVICE II */}
                      <div className="service-card group relative bg-mj-base rounded-mj overflow-hidden border border-white/5 gs-reveal hover:border-mj-accent/30 transition-colors duration-500 flex flex-col" style={{ transitionDelay: '100ms' }}>
                          <div className="relative aspect-[4/5] overflow-hidden">
                              <img src="/Image/Hero small image/19.jpeg" alt="Spatial Styling" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-mj-base/40 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700"></div>
                              <div className="absolute top-6 left-6 font-serif text-5xl text-white/5 italic">II.</div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                              <div className="mb-4">
                                  <span className="inline-block px-3 py-1 bg-mj-accent/10 rounded-mj text-xs tracking-widest text-mj-accent uppercase font-bold mb-3">空間風格設計</span>
                                  <h3 className="text-2xl font-serif text-mj-text group-hover:text-mj-accent transition-colors">Spatial Styling</h3>
                              </div>
                              <p className="text-mj-muted font-light text-sm leading-relaxed mb-8 flex-1">整合材質、光影與高級軟裝配置，從住宅到商空，為每一個案場進行獨立策展，淬鍊出具備高度品牌識別或個人品味的空間氛圍。</p>
                              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                  <span className="text-xs tracking-widest uppercase text-mj-muted group-hover:text-mj-accent transition-colors">Learn More</span>
                                  <iconify-icon icon="lucide:arrow-right" width="16" className="text-mj-accent transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"></iconify-icon>
                              </div>
                          </div>
                      </div>

                      {/* SERVICE III */}
                      <div className="service-card group relative bg-mj-base rounded-mj overflow-hidden border border-white/5 gs-reveal hover:border-mj-accent/30 transition-colors duration-500 flex flex-col" style={{ transitionDelay: '200ms' }}>
                          <div className="relative aspect-[4/5] overflow-hidden">
                              <img src="/Image/Hero small image/21.2.jpeg" alt="Art Curation" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-mj-base/40 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700"></div>
                              <div className="absolute top-6 left-6 font-serif text-5xl text-white/5 italic">III.</div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                              <div className="mb-4">
                                  <span className="inline-block px-3 py-1 bg-mj-accent/10 rounded-mj text-xs tracking-widest text-mj-accent uppercase font-bold mb-3">藝術策展</span>
                                  <h3 className="text-2xl font-serif text-mj-text group-hover:text-mj-accent transition-colors">Art Curation</h3>
                              </div>
                              <p className="text-mj-muted font-light text-sm leading-relaxed mb-8 flex-1">將美學轉化為完整而深刻的體驗。透過藝術品、器物與活動企劃的介入，注入文化底蘊，讓空間昇華為具備呼吸感的藝術載體。</p>
                              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                  <span className="text-xs tracking-widest uppercase text-mj-muted group-hover:text-mj-accent transition-colors">Learn More</span>
                                  <iconify-icon icon="lucide:arrow-right" width="16" className="text-mj-accent transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"></iconify-icon>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* PROJECTS / CUSTOM FURNITURE */}
          <section id="projects" className="relative py-32 px-6 md:px-[5vw] z-content bg-transparent overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col items-center">
                  <div className="text-center mb-16 gs-reveal w-full">
                      <div className="flex items-center justify-center gap-4 mb-6 text-mj-accent">
                          <div className="h-[1px] w-8 bg-mj-accent/50"></div>
                          <span className="font-serif text-xl">03</span>
                          <span className="tracking-[0.2em] text-sm uppercase">Bespoke Objects</span>
                          <div className="h-[1px] w-8 bg-mj-accent/50"></div>
                      </div>
                      <h2 className="font-serif text-4xl md:text-6xl text-mj-text mb-4">Customize Your Furniture</h2>
                      <p className="text-mj-muted font-light max-w-xl mx-auto text-sm leading-relaxed">
                          Interact with our signature pieces. Drag to rotate and examine the craftsmanship from every angle. Each object is fully tailored to your specifications.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                      {/* Model 1 */}
                      <div className="gs-reveal flex flex-col h-[500px]">
                          <div className="w-full h-full flex-1 rounded-t-mj relative overflow-hidden bg-mj-surface border-x border-t border-white/5">
                              <ModelViewer url="https://modelviewer.dev/shared-assets/models/Chair.glb" />
                          </div>
                          <div className="bg-mj-surface/50 border border-white/5 p-6 rounded-b-mj">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-serif text-xl text-mj-text tracking-wide">Lumina Chair</h3>
                                  <span className="text-mj-accent font-sans text-xs tracking-widest uppercase">Base</span>
                              </div>
                              <p className="text-mj-muted text-xs font-light mb-4">Oak wood structure with premium fabric upholstery.</p>
                              <a href="/custom-furniture" className="text-xs uppercase tracking-widest text-mj-text border-b border-mj-accent hover:text-mj-accent transition-colors pb-1">
                                  Customize Now
                              </a>
                          </div>
                      </div>

                      {/* Model 2 (Placeholder) */}
                      <div className="gs-reveal flex flex-col h-[500px]" style={{ transitionDelay: '100ms' }}>
                          <div className="w-full h-full flex-1 rounded-t-mj relative overflow-hidden bg-mj-surface border-x border-t border-white/5">
                              {/* Fallback to same model until we have another */}
                              <ModelViewer url="https://modelviewer.dev/shared-assets/models/Chair.glb" />
                          </div>
                          <div className="bg-mj-surface/50 border border-white/5 p-6 rounded-b-mj">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-serif text-xl text-mj-text tracking-wide">Aura Table</h3>
                                  <span className="text-mj-accent font-sans text-xs tracking-widest uppercase">Variant</span>
                              </div>
                              <p className="text-mj-muted text-xs font-light mb-4">Hand-finished mahogany with brass detailing.</p>
                              <a href="/custom-furniture" className="text-xs uppercase tracking-widest text-mj-text border-b border-mj-accent hover:text-mj-accent transition-colors pb-1">
                                  Customize Now
                              </a>
                          </div>
                      </div>

                      {/* Model 3 (Placeholder) */}
                      <div className="gs-reveal flex flex-col h-[500px]" style={{ transitionDelay: '200ms' }}>
                          <div className="w-full h-full flex-1 rounded-t-mj relative overflow-hidden bg-mj-surface border-x border-t border-white/5">
                              {/* Fallback to same model until we have another */}
                              <ModelViewer url="https://modelviewer.dev/shared-assets/models/Chair.glb" />
                          </div>
                          <div className="bg-mj-surface/50 border border-white/5 p-6 rounded-b-mj">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-serif text-xl text-mj-text tracking-wide">Velvet Sofa</h3>
                                  <span className="text-mj-accent font-sans text-xs tracking-widest uppercase">Classic</span>
                              </div>
                              <p className="text-mj-muted text-xs font-light mb-4">Deep seating with Italian velvet covering.</p>
                              <a href="/custom-furniture" className="text-xs uppercase tracking-widest text-mj-text border-b border-mj-accent hover:text-mj-accent transition-colors pb-1">
                                  Customize Now
                              </a>
                          </div>
                      </div>
                  </div>

                  <div className="text-center mt-16 relative z-20 gs-reveal">
                       <a href="/custom-furniture" className="hover-target inline-block px-10 py-4 border border-mj-accent text-mj-accent rounded-mj hover:bg-mj-accent hover:text-mj-base transition-colors tracking-widest uppercase text-sm">
                          View Full Gallery
                      </a>
                  </div>
              </div>
          </section>

          {/* EXPERIENCE: SENSORY DESIGN */}
          <section id="experience" className="relative py-32 md:py-48 px-6 md:px-[5vw] z-content bg-transparent border-t border-white/5">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8">
                  
                  {/* Left Column: Navigation & Title */}
                  <div className="w-full md:w-1/4 flex flex-col md:sticky md:top-32 h-fit">
                      <div className="mb-16 gs-reveal">
                          <h2 className="font-serif text-5xl text-mj-text mb-4">Sensory<br/>Design</h2>
                          <div className="h-[1px] w-12 bg-mj-accent"></div>
                      </div>
                      
                      <nav className="gs-reveal">
                          <ul className="flex flex-col gap-6 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold">
                              {SENSORY_CATEGORIES.map((cat) => (
                                  <li key={cat}>
                                      <button 
                                          onClick={() => setActiveSensoryCategory(cat)}
                                          className={`transition-all duration-300 flex items-center gap-4 group ${activeSensoryCategory === cat ? 'text-mj-accent' : 'text-mj-muted hover:text-mj-text'}`}
                                      >
                                          <div className={`h-[1px] bg-mj-accent transition-all duration-500 ${activeSensoryCategory === cat ? 'w-8' : 'w-0 group-hover:w-4'}`}></div>
                                          {cat}
                                      </button>
                                  </li>
                              ))}
                          </ul>
                      </nav>
                  </div>

                  {/* Right Column: CMS Grid */}
                  <div className="w-full md:w-3/4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                          {SENSORY_PROJECTS
                              .filter(p => activeSensoryCategory === 'All Curation' || p.category === activeSensoryCategory)
                              .slice(0, 6)
                              .map((project, index) => (
                              <div key={project.id} className="group gs-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                  <div className="relative aspect-[4/5] overflow-hidden rounded-mj mb-8 bg-mj-surface border border-white/5">
                                      <img 
                                          src={project.image} 
                                          alt={project.title}
                                          className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                                      />
                                      <div className="absolute inset-0 bg-mj-base/20 group-hover:bg-transparent transition-colors duration-700"></div>
                                  </div>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-baseline">
                                          <h4 className="font-serif text-2xl lg:text-3xl text-mj-text group-hover:text-mj-accent transition-colors duration-300 font-light">
                                              {project.title}
                                          </h4>
                                          <span className="text-[10px] uppercase tracking-widest text-mj-accent/50 group-hover:text-mj-accent transition-colors">
                                              /{project.category}
                                          </span>
                                      </div>
                                      <p className="text-mj-muted font-light text-sm leading-relaxed max-w-md opacity-80 group-hover:opacity-100 transition-opacity">
                                          {project.desc}
                                      </p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Read More button */}
                      <div className="flex justify-center md:justify-end gs-reveal">
                          <a href="#" className="flex items-center gap-4 px-8 py-4 border border-mj-accent text-mj-accent rounded-full text-xs tracking-[0.2em] uppercase hover:bg-mj-accent hover:text-mj-base transition-colors hover-target whitespace-nowrap">
                              Read More
                              <iconify-icon icon="lucide:arrow-up-right" width="16"></iconify-icon>
                          </a>
                      </div>
                  </div>

              </div>
          </section>

          {/* THE PROCESS */}
          <ProcessSection />

          {/* BLOG SECTION */}
          <BlogSection />

          {/* OFFICE LOCATIONS */}
          <OfficeLocations />

          {/* CONTACT US SECTION */}
          <ContactSection />

          {/* CTA SECTION */}
          <section id="cta" className="relative min-h-[90vh] py-24 flex items-center mb-0 overflow-hidden z-content border-t border-white/5">
              <div className="absolute inset-0 z-0">
                  <img 
                      src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2500&auto=format&fit=crop" 
                      alt="Interior Background" 
                      className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-[5vw] flex">
                  <div className="w-full md:w-[45%] max-w-lg bg-white/95 backdrop-blur-md text-mj-base p-10 md:p-14 gs-reveal shadow-2xl ml-0">
                      <div className="mb-2"></div>
                      <h2 className="font-serif text-4xl md:text-5xl mb-8 text-black tracking-tight" style={{textTransform: 'uppercase', lineHeight: 1.1}}>
                          Initiate Your<br/>
                          <span className="text-mj-accent">Vision</span>
                      </h2>
                      
                      <p className="text-mj-accent tracking-widest uppercase text-sm mb-4 font-semibold">Appointment Only 預約制</p>
                      
                      <p className="text-gray-700 font-light mb-12 text-sm leading-relaxed font-sans">
                          為確保最高品質的空間設計與客製體驗，我們採取嚴格預約制，專注於每一組貴賓的深度對話。啟程您的專屬空間，請與我們聯繫。
                      </p>
                      
                      <div className="flex flex-col gap-4 mt-auto">
                          <button className="w-full hover-target group relative py-4 bg-mj-accent text-white overflow-hidden transition-transform hover:scale-[1.02]">
                              <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
                              <span className="relative z-10 font-bold tracking-[0.2em] uppercase text-xs">預約鑑賞</span>
                          </button>
                          
                          <button className="w-full hover-target group relative py-4 border border-mj-accent text-mj-accent bg-transparent overflow-hidden transition-transform hover:scale-[1.02]">
                              <div className="absolute inset-0 bg-mj-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
                              <span className="relative z-10 font-bold tracking-[0.2em] uppercase text-xs group-hover:text-white transition-colors duration-500">訂製家具</span>
                          </button>
                      </div>
                  </div>
              </div>
          </section>

          {/* FOOTER */}
          <footer id="footer" className="relative bg-transparent pt-24 pb-12 px-6 md:px-[5vw] z-content border-t border-white/5">
              <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                      
                      {/* Column 1: Brand & Contact */}
                      <div className="lg:col-span-4 flex flex-col items-start text-left">
                          <h3 className="font-serif text-3xl md:text-4xl text-mj-text mb-6 italic tracking-tight uppercase">MJ CASA</h3>
                          <p className="font-serif text-lg md:text-xl text-mj-text uppercase tracking-tight mb-10 leading-tight">
                              Welcome to the<br/>
                              world of comfort
                          </p>
                          
                          <div className="space-y-2 text-mj-muted text-sm font-light mb-10">
                              <p>T / Line: 0988-795-925</p>
                              <p>yuzu@mjcasa.com</p>
                              <p>8:00am - 8:30pm (預約制)</p>
                          </div>
                          
                          <a href="#contact" className="hover-target inline-block px-8 py-3 bg-white text-mj-base text-xs tracking-widest uppercase font-bold hover:bg-mj-accent hover:text-white transition-all duration-300 mb-12">
                              Contact Us
                          </a>
                          
                          <div className="mt-auto">
                              <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] mb-6 max-w-[280px] leading-relaxed">
                                  MJ CASA is a trademark belonging to the MJ Group, dedicated to excellence in interiors.
                              </p>
                              <div className="flex gap-5 text-mj-muted">
                                  <a href="#" className="hover:text-mj-accent transition-colors"><iconify-icon icon="lucide:facebook" width="18"></iconify-icon></a>
                                  <a href="#" className="hover:text-mj-accent transition-colors"><iconify-icon icon="lucide:instagram" width="18"></iconify-icon></a>
                                  <a href="#" className="hover:text-mj-accent transition-colors"><iconify-icon icon="lucide:linkedin" width="18"></iconify-icon></a>
                                  <a href="#" className="hover:text-mj-accent transition-colors"><iconify-icon icon="lucide:twitter" width="18"></iconify-icon></a>
                              </div>
                          </div>
                      </div>

                      {/* Column 2: Catalogue */}
                      <div className="lg:col-span-2 flex flex-col">
                          <h4 className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-bold mb-10">Catalogue</h4>
                          <ul className="space-y-4 text-mj-text text-sm font-light">
                              <li><a href="#services" className="hover:text-mj-accent transition-colors">Custom Furniture</a></li>
                              <li><a href="#services" className="hover:text-mj-accent transition-colors">Spatial Styling</a></li>
                              <li><a href="#services" className="hover:text-mj-accent transition-colors">Art Curation</a></li>
                              <li><a href="#projects" className="hover:text-mj-accent transition-colors">Residential</a></li>
                              <li><a href="#projects" className="hover:text-mj-accent transition-colors">Commercial</a></li>
                          </ul>
                      </div>

                      {/* Column 3: To Customers */}
                      <div className="lg:col-span-2 flex flex-col">
                          <h4 className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-bold mb-10">To Customers</h4>
                          <ul className="space-y-4 text-mj-text text-sm font-light">
                              <li><a href="#process" className="hover:text-mj-accent transition-colors">Our Process</a></li>
                              <li><a href="#footer" className="hover:text-mj-accent transition-colors">Locations</a></li>
                              <li><a href="#blog" className="hover:text-mj-accent transition-colors">Design Ideas</a></li>
                              <li><a href="#trust" className="hover:text-mj-accent transition-colors">Our History</a></li>
                              <li><a href="#contact" className="hover:text-mj-accent transition-colors">Help & FAQ</a></li>
                          </ul>
                      </div>

                      {/* Column 4: Visual */}
                      <div className="lg:col-span-4 aspect-square rounded-mj overflow-hidden gs-reveal">
                          <img 
                              src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1500&auto=format&fit=crop" 
                              alt="Signature Interior" 
                              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                          />
                      </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="w-full border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/40 tracking-[0.2em] uppercase font-medium">
                      <p className="mb-4 md:mb-0">All Rights Reserved &copy; 2026 MJ CASA</p>
                      <div className="flex gap-8">
                          <a href="#" className="hover:text-mj-text transition-colors">Legal Terms</a>
                          <a href="#" className="hover:text-mj-text transition-colors">Privacy Policy</a>
                      </div>
                  </div>
              </div>
          </footer>
      </main>
    </div>
  );
}
