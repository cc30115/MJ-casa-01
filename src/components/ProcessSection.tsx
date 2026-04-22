import React from 'react';

const steps = [
    {
        id: '01',
        title: 'Inquiry',
        phase: 'THE DISCOVERY',
        description: 'Every masterpiece begins with a conversation about your lifestyle.',
        image: '/Image/Hero small image/21.2.jpeg'
    },
    {
        id: '02',
        title: 'Curation',
        phase: 'THE STRATEGY',
        description: 'Translating concepts into tangible material palettes.',
        image: '/Image/Hero silde Image/39.jpeg'
    },
    {
        id: '03',
        title: 'Masterwork',
        phase: 'THE EXECUTION',
        description: 'Our artisans and engineering partners bring the vision to life.',
        image: '/Image/Hero small image/19.jpeg'
    },
    {
        id: '04',
        title: 'Legacy',
        phase: 'THE REVEAL',
        description: 'The final orchestration of beauty for your environment.',
        image: '/Image/Hero silde Image/IMG_7064.JPG'
    }
];

export default function ProcessSection() {
    return (
        <section id="process" className="relative py-24 md:py-32 px-6 md:px-[5vw] z-content bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8 gs-reveal">
                    <div>
                        <div className="flex items-center gap-4 mb-4 text-mj-accent">
                            <span className="font-serif text-lg">04</span>
                            <div className="h-[1px] w-8 bg-mj-accent/30"></div>
                            <span className="tracking-[0.2em] text-[10px] uppercase font-bold">The Process</span>
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl text-mj-text tracking-tight">
                            Bespoke <span className="text-mj-muted italic">Creation</span> Workflow
                        </h2>
                    </div>
                    <p className="max-w-xs text-mj-muted font-light text-sm leading-relaxed">
                        A disciplined, four-stage creative evolution from architectural intent to domestic reality.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {steps.map((step) => (
                        <div key={step.id} className="group flex flex-col gs-reveal">
                            <div className="relative aspect-[3/4] rounded-mj overflow-hidden bg-mj-surface border border-white/5 mb-6">
                                <img 
                                    src={step.image} 
                                    alt={step.title} 
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-mj-base/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                <div className="absolute top-4 left-4 font-serif text-3xl text-mj-accent transition-transform duration-500 group-hover:-translate-y-1">
                                    {step.id}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <span className="block text-mj-accent text-[10px] tracking-[0.2em] font-bold uppercase opacity-60">
                                    {step.phase}
                                </span>
                                <h3 className="font-serif text-2xl text-mj-text group-hover:text-mj-accent transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-mj-muted font-light text-xs leading-relaxed line-clamp-2 md:line-clamp-none">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
