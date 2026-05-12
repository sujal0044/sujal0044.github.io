import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Volume2, VolumeX, Mail, Code, Terminal, Layers, ExternalLink } from 'lucide-react';

const abstractCoreImg = "https://images.unsplash.com/photo-1614729939124-03290b56c9ce?q=80&w=2500&auto=format&fit=crop";
const mindsetBg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop";

// --- OPTIMIZED OPTION 1: NEURAL NETWORK INTERACTIVE CANVAS ---
const NeuralNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles = [];
    const isMobile = width < 768;
    const particleCount = isMobile ? 15 : 25; 
    const connectionDistance = 150;
    let mouse = { x: -1000, y: -1000 };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseOut = () => { mouse.x = -1000; mouse.y = -1000; };
    if (!isMobile) { 
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseout', handleMouseOut);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particleCount; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 106, 0, 0.3)';
        ctx.fill();
        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 106, 0, ${0.1 - dist / connectionDistance * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen" />;
};

const TiltCard = ({ children, className }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }} 
      transition={{ duration: 0.3, ease: "easeOut" }} 
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ChipPreloader = () => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({ pathLength: 1, opacity: 1, transition: { pathLength: { delay: i * 0.2, duration: 1 }, opacity: { delay: i * 0.2, duration: 0.2 } }})
  };
  return (
    <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 z-10">
      <svg viewBox="0 0 100 100" className="w-full h-full z-10">
        {[ "M 5 30 L 20 30", "M 5 50 L 20 50", "M 5 70 L 20 70", "M 95 30 L 80 30", "M 95 50 L 80 50", "M 95 70 L 80 70", "M 30 5 L 30 20", "M 50 5 L 50 20", "M 70 5 L 70 20", "M 30 95 L 30 80", "M 50 95 L 50 80", "M 70 95 L 70 80" ].map((d, i) => (
          <motion.path key={i} d={d} stroke="#ff6a00" strokeWidth="2" fill="none" strokeLinecap="round" variants={draw} custom={1} initial="hidden" animate="visible" />
        ))}
        <motion.rect x="20" y="20" width="60" height="60" rx="4" stroke="#ff6a00" strokeWidth="2.5" fill="none" variants={draw} custom={2} initial="hidden" animate="visible" />
        <motion.rect x="24" y="24" width="52" height="52" rx="2" stroke="#ff6a00" strokeWidth="1" strokeDasharray="2 2" fill="none" variants={draw} custom={3} initial="hidden" animate="visible" />
        <motion.rect x="32" y="32" width="36" height="36" rx="3" fill="#ff6a00" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }} />
        <motion.text x="50" y="55" textAnchor="middle" fill="#050505" fontSize="18" fontWeight="900" fontFamily="sans-serif" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}>SP</motion.text>
      </svg>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    setIsDesktop(mql.matches); 
    
    const handleMouseMove = (e) => {
      if (!cursorRef.current || !dotRef.current) return;
      
      const { clientX, clientY } = e;
      // Dot follows instantly
      dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      // Ring follows with a slight tech delay (CSS transition handles smoothness)
      cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;

      const target = e.target;
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('.magnify');
      
      if (isInteractive) {
        cursorRef.current.style.width = '50px';
        cursorRef.current.style.height = '50px';
        cursorRef.current.style.borderColor = 'rgba(255, 106, 0, 0.8)';
        dotRef.current.style.backgroundColor = '#ffffff';
      } else {
        cursorRef.current.style.width = '30px';
        cursorRef.current.style.height = '30px';
        cursorRef.current.style.borderColor = 'rgba(255, 106, 0, 0.3)';
        dotRef.current.style.backgroundColor = '#ff6a00';
      }
    };
    
    if (mql.matches) window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => { setTimeout(() => setLoading(false), 2800); }, []);

  const toggleMusic = () => {
    if (isMuted) { audioRef.current.play(); audioRef.current.volume = 0.2; } 
    else { audioRef.current.pause(); }
    setIsMuted(!isMuted);
  };

  return (
    <div className={`bg-[#050505] text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#ff6a00] selection:text-white relative ${isDesktop ? 'cursor-none' : ''}`}>
      
      {/* PRECISION TECH TOOL CURSOR */}
      {isDesktop && (
        <>
          <div ref={cursorRef} className="fixed top-0 left-0 w-[30px] h-[30px] -ml-[15px] -mt-[15px] border border-[#ff6a00]/30 rounded-full pointer-events-none z-[9999] transition-[width,height,border-color] duration-300 ease-out will-change-transform flex items-center justify-center">
            {/* Minimalist Tech Crosshair lines */}
            <div className="absolute w-[1px] h-2 bg-[#ff6a00]/20 -top-1"></div>
            <div className="absolute w-[1px] h-2 bg-[#ff6a00]/20 -bottom-1"></div>
            <div className="absolute h-[1px] w-2 bg-[#ff6a00]/20 -left-1"></div>
            <div className="absolute h-[1px] w-2 bg-[#ff6a00]/20 -right-1"></div>
          </div>
          <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-[#ff6a00] rounded-full pointer-events-none z-[10000] will-change-transform shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
        </>
      )}

      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=cinematic-time-lapse-115672.mp3" />

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]">
            <NeuralNetwork />
            <ChipPreloader />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <NeuralNetwork />
          <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50">
            <div className="font-bold text-xl tracking-tighter magnify">SUJAL<span className="text-[#ff6a00]">.</span></div>
            <button onClick={toggleMusic} className="px-4 py-2 bg-[#111] border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </nav>

          <section className="relative min-h-screen flex items-center justify-center px-6">
            <div className="absolute inset-0 z-0 bg-[#050505]">
               <motion.img src={abstractCoreImg} alt="AI Core" initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 1.5 }} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
            </div>
            <div className="relative z-10 text-center max-w-5xl">
               <motion.h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-none magnify">
                 BUILDING <br /> THE <span className="text-[#ff6a00]">FUTURE.</span>
               </motion.h1>
               <p className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto font-light magnify">
                 I am Sujal Patel. A creative technologist building intelligent digital ecosystems.
               </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 space-y-32 pb-40 relative z-10">
            <section className="pt-20 relative">
              <motion.img src={mindsetBg} initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} transition={{ duration: 1.5 }} viewport={{ once: true }} className="absolute inset-0 w-full h-full object-cover -z-10 rounded-3xl" />
              <TiltCard>
                <div className="bg-[#0a0a0a] border border-[#222] p-12 md:p-24 rounded-3xl transition-colors hover:border-[#ff6a00]/30 shadow-2xl">
                  <h2 className="text-4xl md:text-6xl font-black mb-10 magnify">The <span className="text-[#ff6a00]">Mindset.</span></h2>
                  <p className="text-gray-300 text-lg font-light leading-relaxed magnify">
                    My journey from India to London was an evolution of extreme discipline. I operate at the intersection of rigorous logic and relentless creativity. I don't panic. <strong className="text-white">I execute.</strong>
                  </p>
                </div>
              </TiltCard>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {["Frontend & UI", "Backend & Cloud", "AI & Creative"].map((title, i) => (
                   <TiltCard key={i}>
                     <div className="bg-[#0a0a0a] border border-[#222] p-10 rounded-2xl h-full hover:border-[#ff6a00]/50 transition-colors magnify">
                       <h3 className="text-xl font-bold mb-4">{title}</h3>
                       <p className="text-[#ff6a00] font-mono text-sm leading-loose">Engineered with precision.</p>
                     </div>
                   </TiltCard>
                 ))}
            </section>

            <section className="text-center pt-20">
               <TiltCard>
                 <div className="bg-[#0a0a0a] border border-[#222] p-16 md:p-32 rounded-[4rem] relative overflow-hidden hover:border-[#ff6a00]/40 transition-all duration-700 shadow-2xl">
                   <h2 className="text-5xl md:text-8xl font-black mb-6 magnify">INITIATE <span className="text-[#ff6a00]">SEQUENCE.</span></h2>
                   <a href="mailto:sa.tech080044@gmail.com" className="px-12 py-6 bg-white text-black font-bold rounded-full hover:bg-[#ff6a00] hover:text-white transition-all uppercase tracking-widest text-sm">
                     <Mail size={20} className="inline mr-2" /> Contact Me
                   </a>
                 </div>
               </TiltCard>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
  );
}
