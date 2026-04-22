import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function FurnitureCustomization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inSituRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Wood', 'Object', 'Fabric'];

  const products = [
    { id: 1, title: 'Lumina Chair', category: 'Wood', price: '$1,200', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', badge: 'Made to Order', colors: ['#D2B48C', '#8B4513'] },
    { id: 2, title: 'Aura Table', category: 'Wood', price: '$2,800', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800', badge: '', colors: ['#5C4033', '#000000'] },
    { id: 3, title: 'Velvet Sofa', category: 'Fabric', price: '$4,500', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800', badge: 'Made to Order', colors: ['#800020', '#2F4F4F', '#708090'] },
    { id: 4, title: 'Nova Lamp', category: 'Object', price: '$850', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', badge: '', colors: ['#FFD700', '#C0C0C0'] },
    { id: 5, title: 'Oasis Bench', category: 'Fabric', price: '$1,100', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800', badge: 'Made to Order', colors: ['#F5F5DC', '#A9A9A9'] },
    { id: 6, title: 'Zenithi Console', category: 'Wood', price: '$1,900', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800', badge: '', colors: ['#3e2723', '#4e342e'] },
    { id: 7, title: 'Ethereal Vase', category: 'Object', price: '$350', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800', badge: '', colors: ['#ffffff', '#000000'] },
    { id: 8, title: 'Serene Lounge', category: 'Fabric', price: '$3,200', image: 'https://images.unsplash.com/photo-1496150244675-5a1e8c950275?auto=format&fit=crop&q=80&w=800', badge: 'Made to Order', colors: ['#4b5320', '#c2b280'] },
  ];

  const filteredProducts = activeFilter === 'All' ? products : products.filter(p => p.category === activeFilter);

  useGSAP(() => {
    // Reveal headers
    gsap.fromTo('.fc-reveal', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }
    );

    // Initial grid animation
    gsap.fromTo('.fc-card', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power2.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  // GSAP for hotspots
  useGSAP(() => {
    gsap.utils.toArray('.hotspot').forEach((el: any) => {
      // Create a pulsing animation for the rings
      gsap.to(el.querySelector('.ring'), {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "none"
      });
    });
  }, { scope: inSituRef });

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Restart animation for cards
    gsap.fromTo('.fc-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }
    );
  };

  return (
    <div ref={containerRef} className="pt-32 pb-24 min-h-screen bg-transparent relative items-center flex flex-col justify-center">
      {/* 
        TOP SECTION: Product Grid
      */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-[5vw]">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-6">
          <div>
            <h1 className="fc-reveal font-serif text-4xl md:text-6xl text-mj-text mb-2 uppercase tracking-wide">Bespoke Collection</h1>
            <p className="fc-reveal text-mj-muted font-light tracking-wider uppercase text-sm">Curated items tailored to your aesthetic</p>
          </div>
          
          <div className="fc-reveal flex flex-wrap gap-4 md:gap-8">
            {filters.map(filter => (
              <label key={filter} className="cursor-pointer group flex items-center gap-2">
                <input 
                  type="radio" 
                  name="productFilter" 
                  checked={activeFilter === filter}
                  onChange={() => handleFilterChange(filter)}
                  className="hidden"
                />
                <span className={`w-3 h-3 rounded-full border border-mj-accent transition-colors ${activeFilter === filter ? 'bg-mj-accent' : 'bg-transparent group-hover:bg-white/10'}`}></span>
                <span className={`uppercase text-xs tracking-widest ${activeFilter === filter ? 'text-mj-text' : 'text-mj-muted group-hover:text-mj-text'} transition-colors`}>{filter}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="fc-card group cursor-pointer">
              {/* Image Container */}
              <div className="aspect-[3/4] bg-mj-bg/50 overflow-hidden relative mb-4">
                {product.badge && (
                  <div className="absolute top-4 right-4 z-10 bg-mj-base/80 backdrop-blur-sm text-mj-text text-xs uppercase tracking-widest px-3 py-1 border border-white/10">
                    {product.badge}
                  </div>
                )}
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Product Info */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-serif text-mj-text text-lg tracking-wide group-hover:text-mj-accent transition-colors">{product.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-mj-muted text-xs uppercase tracking-widest">{product.category}</span>
                    <span className="text-mj-muted text-xs">•</span>
                    <span className="text-mj-text text-xs tracking-wider">{product.price}</span>
                  </div>
                </div>
              </div>
              {/* Interactive Color Dots */}
              <div className="flex gap-2 mt-3">
                {product.colors.map((color, i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm cursor-crosshair hover:scale-125 transition-transform"
                    style={{ backgroundColor: color }}
                    title="Select color"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        BOTTOM SECTION: In Situ Interactive Image 
      */}
      <div className="w-full mt-32 bg-mj-bg text-center pb-24" ref={inSituRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-[5vw] pt-24">
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-5xl text-mj-text mb-4 uppercase tracking-wide">MJ Casa In Situ</h2>
            <p className="text-mj-muted font-light uppercase tracking-widest text-sm max-w-2xl mx-auto">
              Explore our curation in its natural habitat. Hover over the markers to discover detailed pieces.
            </p>
          </div>
          
          <div className="relative aspect-video max-w-6xl mx-auto overflow-hidden shadow-2xl">
            {/* The main styled interior image */}
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
              alt="Interior in situ"
              className="w-full h-full object-cover filter brightness-[0.8] contrast-125"
            />
            
            {/* Hotspot 1: Sofa */}
            <div className="hotspot absolute group top-[60%] left-[45%] translate-x-[-50%] translate-y-[-50%] z-20">
              {/* Hotspot Marker */}
              <div className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
                <div className="absolute w-full h-full rounded-full bg-mj-accent/50 filter blur-[2px]"></div>
                <div className="ring absolute w-full h-full rounded-full border border-mj-accent"></div>
                <div className="inner w-2 h-2 rounded-full bg-mj-accent z-10 group-hover:scale-150 transition-transform"></div>
              </div>
              
              {/* Popover Card */}
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-mj-base border border-white/10 shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:z-50 pointer-events-none group-hover:pointer-events-auto">
                <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400" alt="Sofa" className="w-full h-24 object-cover mb-3" />
                <h4 className="font-serif text-mj-text text-sm uppercase tracking-wider mb-1">Velvet Sofa</h4>
                <p className="text-mj-muted text-xs mb-3">From $4,500</p>
                <a href="#" className="inline-block border-b border-mj-accent text-mj-accent text-xs uppercase tracking-widest hover:text-mj-text hover:border-mj-text transition-colors pb-1">See More</a>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/10"></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-mj-base mt-[-1px]"></div>
              </div>
            </div>

            {/* Hotspot 2: Lamp */}
            <div className="hotspot absolute group top-[35%] left-[25%] translate-x-[-50%] translate-y-[-50%] z-20">
              {/* Hotspot Marker */}
              <div className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
                <div className="absolute w-full h-full rounded-full bg-mj-accent/50 filter blur-[2px]"></div>
                <div className="ring absolute w-full h-full rounded-full border border-mj-accent"></div>
                <div className="inner w-2 h-2 rounded-full bg-mj-accent z-10 group-hover:scale-150 transition-transform"></div>
              </div>
              
              {/* Popover Card */}
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-mj-base border border-white/10 shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:z-50 pointer-events-none group-hover:pointer-events-auto">
                <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400" alt="Lamp" className="w-full h-24 object-cover mb-3" />
                <h4 className="font-serif text-mj-text text-sm uppercase tracking-wider mb-1">Nova Lamp</h4>
                <p className="text-mj-muted text-xs mb-3">From $850</p>
                <a href="#" className="inline-block border-b border-mj-accent text-mj-accent text-xs uppercase tracking-widest hover:text-mj-text hover:border-mj-text transition-colors pb-1">See More</a>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/10"></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-mj-base mt-[-1px]"></div>
              </div>
            </div>

            {/* Hotspot 3: Table / Accessory */}
            <div className="hotspot absolute group top-[55%] left-[75%] translate-x-[-50%] translate-y-[-50%] z-20">
              {/* Hotspot Marker */}
              <div className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
                <div className="absolute w-full h-full rounded-full bg-mj-accent/50 filter blur-[2px]"></div>
                <div className="ring absolute w-full h-full rounded-full border border-mj-accent"></div>
                <div className="inner w-2 h-2 rounded-full bg-mj-accent z-10 group-hover:scale-150 transition-transform"></div>
              </div>
              
              {/* Popover Card */}
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-mj-base border border-white/10 shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:z-50 pointer-events-none group-hover:pointer-events-auto">
                <img src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=400" alt="Vase" className="w-full h-24 object-cover mb-3" />
                <h4 className="font-serif text-mj-text text-sm uppercase tracking-wider mb-1">Ethereal Vase</h4>
                <p className="text-mj-muted text-xs mb-3">From $350</p>
                <a href="#" className="inline-block border-b border-mj-accent text-mj-accent text-xs uppercase tracking-widest hover:text-mj-text hover:border-mj-text transition-colors pb-1">See More</a>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/10"></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-mj-base mt-[-1px]"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
