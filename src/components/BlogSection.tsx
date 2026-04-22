import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const ARTICLES = [
  {
    id: 1,
    image: "/Image/Hero small image/12.jpeg",
    type: "small", 
    title: "Material Essence",
    className: "w-[250px] md:w-[350px] aspect-[4/3]"
  },
  {
    id: 2,
    image: "/Image/Hero silde Image/39.jpeg",
    type: "large-landscape", 
    title: "The Zenith HQ",
    className: "w-[350px] md:w-[650px] aspect-[16/9] md:aspect-[3/2]"
  },
  {
    id: 3,
    image: "/Image/Hero small image/19.jpeg",
    type: "medium-vertical", 
    title: "Artisan Details",
    className: "w-[280px] md:w-[450px] aspect-[3/4]"
  },
  {
    id: 4,
    image: "/Image/Hero silde Image/IMG_7064.JPG",
    type: "large-landscape", 
    title: "Spatial Harmony",
    className: "w-[320px] md:w-[550px] aspect-[4/3] md:aspect-[5/4]"
  },
  {
    id: 5,
    image: "/Image/Hero small image/6.jpeg",
    type: "small-square", 
    title: "Lighting Design",
    className: "w-[280px] md:w-[400px] aspect-square"
  }
];

export default function BlogSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, dragFree: true }
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section id="blog" className="relative py-24 md:py-32 z-content bg-transparent overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-[5vw] mb-16 md:mb-24 gs-reveal">
        {/* Top Text Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Title */}
          <div className="lg:col-span-3 flex items-start gap-3 text-mj-accent pt-2">
            <span className="text-xs uppercase tracking-widest font-bold mt-0.5">Blog</span>
          </div>
          
          {/* Middle: Main Statement */}
          <div className="lg:col-span-6">
            <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-mj-text">
              Delve into <span className="text-mj-accent">curated insights</span> on design trends, spatial aesthetics, and <span className="text-mj-accent">artisan craftsmanship</span>, shaping the future of living.
            </h3>
          </div>
          
          {/* Right: Description & CTA */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end text-left lg:text-right gap-8 pt-2">
            <p className="font-light text-sm text-mj-muted leading-relaxed max-w-sm">
              Each of our articles blends aesthetic inspiration with practical design philosophy to elevate your everyday spaces.
            </p>
            <button className="flex items-center justify-center px-8 h-[50px] border border-mj-accent text-mj-accent rounded-full text-xs tracking-[0.2em] uppercase hover:bg-mj-accent hover:text-mj-base transition-colors hover-target whitespace-nowrap">
              View Articles
            </button>
          </div>
          
        </div>
      </div>
      
      {/* Embla Gallery: Bottom & Right Bleeding */}
      <div className="ml-6 md:ml-[5vw] gs-reveal relative">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex items-end gap-6 md:gap-10 pr-[5vw]">
            {ARTICLES.map((article) => (
              <div key={article.id} className="flex-none group">
                <div className={`overflow-hidden rounded-mj relative ${article.className}`}>
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90" 
                  />
                  {/* Optional Overlay Title on Hover */}
                  <div className="absolute inset-0 bg-mj-base/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <h4 className="font-serif text-xl md:text-2xl text-mj-text">{article.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-end gap-4 mt-12 pr-6 md:pr-[5vw]">
            <button 
                onClick={scrollPrev}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-mj-muted hover:border-mj-accent hover:text-mj-accent transition-colors hover-target"
                aria-label="Previous slide"
            >
                <iconify-icon icon="lucide:arrow-left" width="20"></iconify-icon>
            </button>
            <button 
                onClick={scrollNext}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-mj-muted hover:border-mj-accent hover:text-mj-accent transition-colors hover-target"
                aria-label="Next slide"
            >
                <iconify-icon icon="lucide:arrow-right" width="20"></iconify-icon>
            </button>
        </div>
      </div>
    </section>
  );
}
