import React, { useState } from 'react';
import FurnitureViewer from './FurnitureViewer';

const OPTIONS = {
  fabric: [
    { id: 'beige', name: '米白', color: '#EBE5D9', price: 0 },
    { id: 'dark_gray', name: '深灰', color: '#5A5A5A', price: 0 },
    { id: 'forest_green', name: '森林綠', color: '#2B4A3B', price: 1000 },
    { id: 'brick_red', name: '磚紅', color: '#8C3A3A', price: 1000 },
  ],
  wood: [
    { id: 'natural', name: '原木色', color: '#D4B595', price: 0 },
    { id: 'walnut', name: '胡桃棕', color: '#6B4A31', price: 2000 },
    { id: 'black_oak', name: '黑橡木', color: '#2C2C2C', price: 2500 },
  ],
  leg: [
    { id: 'metal', name: '鐵件', price: 0 },
    { id: 'solid_wood', name: '實木', price: 1500 },
  ],
  armrest: [
    { id: 'no_armrest', name: '無扶手', price: 0 },
    { id: 'with_armrest', name: '有扶手', price: 3000 },
  ],
  pillow: [
    { id: 'none', name: '不需要', price: 0 },
    { id: 'two_included', name: '附贈 2 個', price: 0 },
  ],
};

export default function CustomFurnitureSection() {
  const [selections, setSelections] = useState({
    fabric: OPTIONS.fabric[0],
    wood: OPTIONS.wood[0],
    leg: OPTIONS.leg[0],
    armrest: OPTIONS.armrest[0],
    pillow: OPTIONS.pillow[0],
  });

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', note: '' });
  const [formErrors, setFormErrors] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Price Calculation
  const basePrice = 18000;
  const currentPrice = basePrice + 
    selections.fabric.price + 
    selections.wood.price + 
    selections.leg.price + 
    selections.armrest.price + 
    selections.pillow.price;

  const handleSelection = (category: keyof typeof OPTIONS, item: any) => {
    setSelections((prev) => ({ ...prev, [category]: item }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: '', email: '', phone: '' };

    if (!formData.name.trim()) {
      errors.name = '必填';
      valid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = '請輸入有效的 Email';
      valid = false;
    }

    const phoneRegex = /^09\d{2}-\d{6}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      errors.phone = '請輸入有效的手機號碼 (例如: 0912-345678)';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      product: "Moderno 單人沙發",
      color: `${selections.fabric.name} / ${selections.wood.name}`,
      leg: selections.leg.name,
      armrest: selections.armrest.name,
      pillow: selections.pillow.name,
      price_estimate: currentPrice,
      note: formData.note,
      submitted_at: new Date().toISOString()
    };

    console.log("Submitting custom order:", payload);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section className="py-24 md:py-32 bg-transparent text-mj-text relative z-content font-sans border-t border-white/5" id="custom-furniture">
      <div className="max-w-7xl mx-auto px-6 md:px-[5vw]">
        
        {/* Title & Description */}
        <div className="text-center mb-16 gs-reveal">
          <div className="flex items-center justify-center gap-4 mb-6 text-mj-accent">
            <span className="font-serif text-xl">05</span>
            <div className="h-[1px] w-12 bg-mj-accent/50"></div>
            <span className="tracking-[0.2em] text-sm uppercase">Bespoke</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-mj-text mb-4">客製化你的家具</h2>
          <p className="text-lg md:text-xl text-mj-accent mb-8 font-serif italic">從設計到送達，每一件都是你的</p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 max-w-4xl mx-auto opacity-80">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-mj-accent">
                <iconify-icon icon="lucide:clipboard-list" width="20"></iconify-icon>
              </div>
              <span className="text-sm font-medium tracking-widest text-mj-text">資訊確認</span>
              <span className="text-xs text-mj-muted">選擇規格與材質</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-mj-accent">
                <iconify-icon icon="lucide:palette" width="20"></iconify-icon>
              </div>
              <span className="text-sm font-medium tracking-widest text-mj-text">設計細節</span>
              <span className="text-xs text-mj-muted">3D 即時預覽</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-mj-accent">
                <iconify-icon icon="lucide:hammer" width="20"></iconify-icon>
              </div>
              <span className="text-sm font-medium tracking-widest text-mj-text">專業製作</span>
              <span className="text-xs text-mj-muted">預計工期 14-21 天</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-mj-accent">
                <iconify-icon icon="lucide:truck" width="20"></iconify-icon>
              </div>
              <span className="text-sm font-medium tracking-widest text-mj-text">安排運送</span>
              <span className="text-xs text-mj-muted">到府安裝定位</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-8 border-b border-white/10 pb-6 gs-reveal">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h3 className="text-3xl font-serif tracking-widest text-mj-text mb-2">Moderno 單人沙發</h3>
              <p className="text-sm tracking-widest text-mj-muted">材質說明：實木骨架 / 布藝 / 皮革（可選）</p>
            </div>
            <div className="md:text-right">
              <p className="text-2xl font-serif text-mj-accent mb-1">NT$ 18,000 – 35,000</p>
              <p className="text-sm tracking-widest text-mj-muted">預計交期：下單後 14–21 個工作天</p>
            </div>
          </div>
        </div>

        {/* Main Content Area: 3D + Configurator */}
        <div className="flex flex-col lg:flex-row gap-12 gs-reveal">
          
          {/* 3D Viewer Area */}
          <div className="w-full lg:w-3/5 bg-[#F0EBE3] rounded-mj overflow-hidden relative shadow-2xl">
            {/* Loading State */}
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F0EBE3]/90 backdrop-blur-sm">
                <iconify-icon icon="lucide:loader-2" width="32" className="text-mj-accent animate-spin mb-4"></iconify-icon>
                <span className="text-sm text-[#3D2B1F] tracking-widest font-medium">載入家具模型中…</span>
              </div>
            )}
            
            {/* CSS Vignette/Depth Fog Layer */}
            <div 
              className="pointer-events-none absolute inset-0 z-20" 
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(240,235,227,0.6) 70%, rgba(240,235,227,1) 100%)' }}
            ></div>

            <div className="w-full h-[300px] md:h-[400px] lg:h-[520px]">
              <FurnitureViewer 
                modelUrl="https://storage.googleapis.com/furnimesh-3d/gbl-files/xSUhtOSGZ2DWgnwpU2kya.glb"
                targetColorHex={selections.fabric.color}
                onLoaded={() => setIframeLoaded(true)}
              />
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <h4 className="text-xl tracking-widest uppercase font-serif mb-6 border-b border-white/10 pb-4 text-mj-text">設計選項面板</h4>
            
            <div className="space-y-8 flex-1 overflow-y-auto pr-2 pb-8 custom-scrollbar">
              
              {/* Fabric Color */}
              <div>
                <p className="text-sm tracking-widest uppercase font-light text-mj-muted mb-4">布藝色系</p>
                <div className="flex flex-wrap gap-4">
                  {OPTIONS.fabric.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSelection('fabric', item)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-mj border text-sm transition-all hover-target ${
                        selections.fabric.id === item.id 
                          ? 'border-mj-accent bg-mj-accent/10 text-mj-text' 
                          : 'border-white/20 text-mj-muted hover:border-mj-accent/50 hover:text-white'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/50" style={{ backgroundColor: item.color }}></span>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wood Color */}
              <div>
                <p className="text-sm tracking-widest uppercase font-light text-mj-muted mb-4">木色系</p>
                <div className="flex flex-wrap gap-4">
                  {OPTIONS.wood.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSelection('wood', item)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-mj border text-sm transition-all hover-target ${
                        selections.wood.id === item.id 
                          ? 'border-mj-accent bg-mj-accent/10 text-mj-text' 
                          : 'border-white/20 text-mj-muted hover:border-mj-accent/50 hover:text-white'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/50" style={{ backgroundColor: item.color }}></span>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories: Legs */}
              <div>
                <p className="text-sm tracking-widest uppercase font-light text-mj-muted mb-4">椅腳材質</p>
                <div className="flex flex-wrap gap-3">
                  {OPTIONS.leg.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSelection('leg', item)}
                      className={`px-4 py-2 rounded-mj border text-sm transition-all hover-target ${
                        selections.leg.id === item.id 
                          ? 'border-mj-accent bg-mj-accent/10 text-mj-text' 
                          : 'border-white/20 text-mj-muted hover:border-mj-accent/50 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories: Armrest */}
              <div>
                <p className="text-sm tracking-widest uppercase font-light text-mj-muted mb-4">扶手設計</p>
                <div className="flex flex-wrap gap-3">
                  {OPTIONS.armrest.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSelection('armrest', item)}
                      className={`px-4 py-2 rounded-mj border text-sm transition-all hover-target ${
                        selections.armrest.id === item.id 
                          ? 'border-mj-accent bg-mj-accent/10 text-mj-text' 
                          : 'border-white/20 text-mj-muted hover:border-mj-accent/50 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories: Pillows */}
              <div>
                <p className="text-sm tracking-widest uppercase font-light text-mj-muted mb-4">抱枕</p>
                <div className="flex flex-wrap gap-3">
                  {OPTIONS.pillow.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSelection('pillow', item)}
                      className={`px-4 py-2 rounded-mj border text-sm transition-all hover-target ${
                        selections.pillow.id === item.id 
                          ? 'border-mj-accent bg-mj-accent/10 text-mj-text' 
                          : 'border-white/20 text-mj-muted hover:border-mj-accent/50 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Summary & Checkout Trigger */}
            <div className="mt-auto pt-6 border-t border-white/10 bg-mj-base">
              <div className="bg-mj-surface2 p-6 rounded-mj border border-white/5 mb-6">
                <p className="text-xs tracking-widest font-light text-mj-muted mb-3">目前選擇：</p>
                <p className="font-light text-sm tracking-wider text-mj-text mb-4">
                  {selections.fabric.name}布藝 × {selections.wood.name}木紋 × {selections.leg.name}椅腳 × {selections.armrest.name} × {selections.pillow.name}
                </p>
                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <span className="text-sm tracking-widest uppercase font-light text-mj-muted">預估報價</span>
                  <span className="text-2xl font-serif text-mj-accent">NT$ {currentPrice.toLocaleString()}</span>
                </div>
              </div>

              {!isFormVisible && !isSuccess && (
                <button 
                  onClick={() => setIsFormVisible(true)}
                  className="hover-target group relative w-full py-5 bg-mj-accent text-mj-base rounded-mj overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
                  <span className="relative z-10 flex justify-center items-center gap-3 font-bold tracking-[0.2em] uppercase">
                    確認設計並填寫資料
                    <iconify-icon icon="lucide:arrow-right" className="transition-transform group-hover:translate-x-1"></iconify-icon>
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Lead Gen Form - Slides down when confirmed */}
        {isFormVisible && !isSuccess && (
          <div className="mt-16 bg-mj-surface2 rounded-mj border border-white/5 p-8 md:p-12 gs-reveal">
            <div className="flex flex-col md:flex-row gap-12">
              
              <div className="w-full md:w-1/3">
                <h4 className="text-xl tracking-widest uppercase font-serif mb-6 text-mj-text">訂製需求摘要</h4>
                <div className="bg-[#1a1715] p-6 rounded-mj text-sm font-light tracking-wider space-y-6">
                  <div>
                    <span className="block text-mj-muted text-xs uppercase mb-2">商品名稱</span>
                    <span className="text-mj-text">Moderno 單人沙發</span>
                  </div>
                  <div>
                    <span className="block text-mj-muted text-xs uppercase mb-2">已選設計</span>
                    <ul className="list-disc pl-4 space-y-2 text-mj-text/80">
                      <li>布藝：{selections.fabric.name}</li>
                      <li>木質：{selections.wood.name}</li>
                      <li>椅腳：{selections.leg.name}</li>
                      <li>扶手：{selections.armrest.name}</li>
                      <li>配件：{selections.pillow.name}</li>
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <span className="block text-mj-muted text-xs uppercase mb-2">預估總價</span>
                    <span className="text-xl font-serif text-mj-accent">NT$ {currentPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h4 className="text-xl tracking-widest uppercase font-serif mb-8 text-mj-text">聯絡資訊</h4>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-mj-muted mb-3">姓名 <span className="text-red-500/80">*</span></label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-0 py-3 bg-transparent border-b ${formErrors.name ? 'border-red-500/50' : 'border-white/20'} text-mj-text focus:outline-none focus:border-mj-accent transition-colors`}
                        placeholder="e.g. 王大明"
                      />
                      {formErrors.name && <p className="text-red-500/80 text-xs mt-2">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-mj-muted mb-3">手機號碼 <span className="text-red-500/80">*</span></label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`w-full px-0 py-3 bg-transparent border-b ${formErrors.phone ? 'border-red-500/50' : 'border-white/20'} text-mj-text focus:outline-none focus:border-mj-accent transition-colors`}
                        placeholder="0912-345678"
                      />
                      {formErrors.phone && <p className="text-red-500/80 text-xs mt-2">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-mj-muted mb-3">Email <span className="text-red-500/80">*</span></label>
                    <input 
                      type="text" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-0 py-3 bg-transparent border-b ${formErrors.email ? 'border-red-500/50' : 'border-white/20'} text-mj-text focus:outline-none focus:border-mj-accent transition-colors`}
                      placeholder="user@example.com"
                    />
                    {formErrors.email && <p className="text-red-500/80 text-xs mt-2">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-mj-muted mb-3">備註 / 特殊需求</label>
                    <textarea 
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-mj text-mj-text focus:outline-none focus:border-mj-accent transition-colors resize-none h-24"
                      placeholder="任何其他想告訴我們的事情..."
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="hover-target group relative px-10 py-5 bg-mj-accent text-mj-base rounded-mj overflow-hidden transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
                      <span className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-[0.2em] uppercase">
                        {isSubmitting ? (
                          <>
                            <iconify-icon icon="lucide:loader-2" className="animate-spin"></iconify-icon>
                            送出中
                          </>
                        ) : (
                          <>
                            送出我的訂製需求
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-16 bg-mj-surface2 border border-mj-accent/20 p-12 rounded-mj text-center gs-reveal">
            <div className="w-16 h-16 rounded-full bg-mj-accent/10 border border-mj-accent flex items-center justify-center text-mj-accent mx-auto mb-8">
              <iconify-icon icon="lucide:check" width="32"></iconify-icon>
            </div>
            <h4 className="text-2xl tracking-widest text-mj-text font-serif mb-6">我們已收到你的需求！</h4>
            <p className="text-mj-muted font-light tracking-widest max-w-lg mx-auto leading-relaxed">
              您的設計配置已成功送出，專屬設計師將於 1–2 個工作天內，透過 Email 或電話與您聯繫後續細節。
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
