import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    contactMethod: '',
    projectType: '',
    projectScope: [] as string[],
    budget: '',
    location: '',
    timeline: '',
    notes: ''
  });

  const handleScopeChange = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      projectScope: prev.projectScope.includes(scope)
        ? prev.projectScope.filter(s => s !== scope)
        : [...prev.projectScope, scope]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry. We will contact you shortly.');
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-[5vw] z-content bg-transparent text-mj-text border-t border-white/5">
      <div className="max-w-7xl mx-auto gs-reveal">
        
        {/* 1. Positioning Title */}
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6 text-mj-accent">
            <span className="font-serif text-xl">06</span>
            <div className="h-[1px] w-12 bg-mj-accent/50"></div>
            <span className="tracking-[0.2em] text-sm uppercase">Inquiry</span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight text-mj-text mb-6">By Appointment Only</h2>
          <p className="text-mj-muted font-light max-w-2xl text-sm md:text-base leading-relaxed">
            為確保最高品質的空間設計與客製體驗，我們採取嚴格預約制，專注於每一組貴賓的深度對話。名額有限，請填寫下方需求單，我們將由專人為您安排專屬諮詢。
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* 2. Project Inquiry Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs tracking-widest uppercase text-mj-muted">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-mj-text focus:outline-none focus:border-mj-accent transition-colors"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs tracking-widest uppercase text-mj-muted">Contact Method (Phone / LINE) *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-mj-text focus:outline-none focus:border-mj-accent transition-colors"
                    value={formData.contactMethod}
                    onChange={e => setFormData({...formData, contactMethod: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs tracking-widest uppercase text-mj-muted">Project Type *</label>
                <div className="flex flex-wrap gap-4">
                  {['Residential', 'Commercial', 'Hospitality'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.projectType === type ? 'border-mj-accent' : 'border-white/20 group-hover:border-white/50'}`}>
                        {formData.projectType === type && <div className="w-2 h-2 rounded-full bg-mj-accent" />}
                      </div>
                      <input 
                        type="radio" 
                        name="projectType" 
                        value={type} 
                        className="hidden"
                        onChange={e => setFormData({...formData, projectType: e.target.value})}
                        required
                      />
                      <span className="text-sm font-light text-mj-text">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs tracking-widest uppercase text-mj-muted">Project Scope (Multi-select)</label>
                <div className="flex flex-wrap gap-4">
                  {['Custom Furniture', 'Spatial Styling', 'Art Curation'].map(scope => (
                    <label key={scope} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${formData.projectScope.includes(scope) ? 'border-mj-accent bg-mj-accent/10' : 'border-white/20 group-hover:border-white/50'}`}>
                        {formData.projectScope.includes(scope) && <iconify-icon icon="lucide:check" width="12" className="text-mj-accent" />}
                      </div>
                      <input 
                        type="checkbox" 
                        value={scope} 
                        className="hidden"
                        onChange={() => handleScopeChange(scope)}
                      />
                      <span className="text-sm font-light text-mj-text">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs tracking-widest uppercase text-mj-muted">Estimated Budget *</label>
                  <select 
                    required
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-mj-text focus:outline-none focus:border-mj-accent transition-colors appearance-none cursor-pointer"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="" disabled className="bg-mj-surface text-mj-muted">Select Budget Tier</option>
                    <option value="Under 1M" className="bg-mj-surface text-mj-text">Under 1M NTD</option>
                    <option value="1M - 3M" className="bg-mj-surface text-mj-text">1M - 3M NTD</option>
                    <option value="3M - 5M" className="bg-mj-surface text-mj-text">3M - 5M NTD</option>
                    <option value="Above 5M" className="bg-mj-surface text-mj-text">Above 5M NTD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs tracking-widest uppercase text-mj-muted">Location</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b border-white/20 pb-2 text-mj-text focus:outline-none focus:border-mj-accent transition-colors"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs tracking-widest uppercase text-mj-muted">Timeline</label>
                <input 
                  type="text" 
                  placeholder="e.g., Q3 2024, ASAP"
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-mj-text focus:outline-none focus:border-mj-accent transition-colors"
                  value={formData.timeline}
                  onChange={e => setFormData({...formData, timeline: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs tracking-widest uppercase text-mj-muted">Additional Notes</label>
                <textarea 
                  rows={3}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-mj-text focus:outline-none focus:border-mj-accent transition-colors resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              {/* 5. Final CTA */}
              <div className="pt-8">
                <button type="submit" className="hover-target group relative px-10 py-5 bg-mj-accent text-mj-base rounded-mj overflow-hidden transition-transform hover:scale-105 w-full md:w-auto">
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
                  <span className="relative z-10 font-bold tracking-[0.2em] uppercase">Submit Project Inquiry</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-16">
            
            {/* 3. Expectation Setting */}
            <div className="bg-mj-surface p-8 rounded-mj border border-white/5">
              <h3 className="font-serif text-2xl text-mj-text mb-6">What to Expect</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-mj-accent font-serif italic">01</span>
                  <div>
                    <h4 className="text-sm font-medium text-mj-text mb-1">One-on-One Consultation</h4>
                    <p className="text-xs text-mj-muted font-light leading-relaxed">深入了解您的生活型態、美學偏好與空間需求。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-mj-accent font-serif italic">02</span>
                  <div>
                    <h4 className="text-sm font-medium text-mj-text mb-1">Spatial Strategy</h4>
                    <p className="text-xs text-mj-muted font-light leading-relaxed">針對空間尺度與動線，提出初步的配置策略與風格定調。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-mj-accent font-serif italic">03</span>
                  <div>
                    <h4 className="text-sm font-medium text-mj-text mb-1">Custom Proposal</h4>
                    <p className="text-xs text-mj-muted font-light leading-relaxed">提供專屬的家具、軟裝與藝術品配置提案與報價。</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* 4. Direct Contact */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl text-mj-text border-b border-white/10 pb-4">Direct Contact</h3>
              <p className="text-xs text-mj-muted font-light leading-relaxed mb-6">
                * 專案需求請優先填寫表單，一般詢問可透過以下方式聯繫。
              </p>
              <div className="space-y-4 text-sm font-light">
                <div className="flex items-start gap-4">
                  <iconify-icon icon="lucide:map-pin" width="16" className="text-mj-accent mt-1"></iconify-icon>
                  <div>
                    <p className="text-mj-text mb-1">Location</p>
                    <p className="text-mj-muted">台中市西屯區台灣大道三段266號</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <iconify-icon icon="lucide:phone" width="16" className="text-mj-accent mt-1"></iconify-icon>
                  <div>
                    <p className="text-mj-text mb-1">Phone / LINE</p>
                    <p className="text-mj-muted">0988-795-925 (Yuzu)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
