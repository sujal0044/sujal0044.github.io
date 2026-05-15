import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Volume2, VolumeX, Mail, Code, Terminal, Layers, ExternalLink } from 'lucide-react';

const abstractCoreImg = "https://images.unsplash.com/photo-1614729939124-03290b56c9ce?q=80&w=2500&auto=format&fit=crop";
const mindsetBg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop";

// --- LIGHTWEIGHT TILT (Reduced Math) ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]); 
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </motion.div>
  );
};

// --- LIGHTWEIGHT SVG PRELOADER ---
const ChipPreloader = () => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay: i * 0.2, duration: 1 }, opacity: { delay: i * 0.2, duration: 0.2 } }
    })
  };

  return (
    <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64">
      <svg viewBox="0 0 100 100" className="w-full h-full z-10">
        {[
          "M 5 30 L 20 30", "M 5 50 L 20 50", "M 5 70 L 20 70",
          "M 95 30 L 80 30", "M 95 50 L 80 50", "M 95 70 L 80 70",
          "M 30 5 L 30 20", "M 50 5 L 50 20", "M 70 5 L 70 20",
          "M 30 95 L 30 80", "M 50 95 L 50 80", "M 70 95 L 70 80" 
        ].map((d, i) => (
          <motion.path key={i} d={d} stroke="#ff6a00" strokeWidth="2" fill="none" strokeLinecap="round" variants={draw} custom={1} initial="hidden" animate="visible" />
        ))}
        <motion.rect x="20" y="20" width="60" height="60" rx="4" stroke="#ff6a00" strokeWidth="2.5" fill="none" variants={draw} custom={2} initial="hidden" animate="visible" />
        <motion.rect x="24" y="24" width="52" height="52" rx="2" stroke="#ff6a00" strokeWidth="1" strokeDasharray="2 2" fill="none" variants={draw} custom={3} initial="hidden" animate="visible" />
        <motion.rect x="32" y="32" width="36" height="36" rx="3" fill="#ff6a00" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }} />
        <motion.text x="50" y="55" textAnchor="middle" fill="#050505" fontSize="18" fontWeight="900" fontFamily="sans-serif" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}>
          SP
        </motion.text>
      </svg>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const audioRef = useRef(null);

  // LIGHTWEIGHT CURSOR PHYSICS (Lower Stiffness/Damping)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotX = useSpring(mouseX, { stiffness: 500, damping: 20 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 20 });

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    setIsDesktop(mql.matches); 
    
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    if (mql.matches) window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      if (mql.matches) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); 
  }, []);

  const toggleMusic = () => {
    if (isMuted) {
      audioRef.current.play();
      audioRef.current.volume = 0.2;
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className={`bg-[#050505] text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#ff6a00] selection:text-white relative ${isDesktop ? 'cursor-none' : ''}`}>
      
      {/* PERFORMANCE CURSOR (1 Layer Only) */}
      {isDesktop && (
        <motion.div className="fixed top-0 left-0 w-8 h-8 border-2 border-[#ff6a00] rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 will-change-transform" style={{ x: dotX, y: dotY }} />
      )}

      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=cinematic-time-lapse-115672.mp3" />

      {/* PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]">
            <ChipPreloader />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          {/* NAVIGATION */}
          <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-bold text-xl tracking-tighter pointer-events-auto cursor-none">
              SUJAL<span className="text-[#ff6a00]">.</span>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onClick={toggleMusic} className="pointer-events-auto cursor-none px-4 py-2 bg-[#111] border border-white/10 rounded-full hover:bg-white/10 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? 'Sound Off' : 'Sound On'}
            </motion.button>
          </nav>

          {/* 1. LAG-FREE HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[#050505]">
               {/* Static Opacity Background, No mix-blend-screen */}
               <motion.img 
                 src={abstractCoreImg} alt="AI Core" 
                 initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1.5 }}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
            </div>

            <div className="relative z-10 text-center max-w-5xl mt-10">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[#ff6a00] uppercase tracking-widest text-sm font-bold mb-8">
                 Creative Technologist • AI Enthusiast
               </motion.div>
               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none">
                 BUILDING <br /> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-yellow-500">FUTURE.</span>
               </motion.h1>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }} className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                 I am Sujal Patel. A creative technologist and AI architect based in London. I don't just write code—I engineer intelligent digital ecosystems. <span className="text-white font-semibold">Welcome to my operational cortex.</span>
               </motion.p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 space-y-32 pb-40 relative z-10">
            
            {/* 2. THE MINDSET (Solid Matte Backgrounds) */}
            <section className="pt-20 relative">
              <TiltCard>
                <div className="bg-[#0a0a0a] border border-[#222] p-12 md:p-24 rounded-3xl relative overflow-hidden transition-all duration-300 hover:border-[#ff6a00]/30 shadow-2xl">
                  <div className="relative z-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">The <span className="text-[#ff6a00]">Mindset.</span></h2>
                    <div className="grid md:grid-cols-2 gap-12 text-gray-300 text-lg leading-relaxed font-light">
                      <p>The architecture of code means nothing without the architecture of the mind. My journey from India to the heart of London's tech landscape wasn't just geographical; it was an evolution of extreme discipline. I operate at the intersection of rigorous logic and relentless creativity.</p>
                      <p>I study human psychology and stoicism as intensely as I study machine learning algorithms. The ability to remain exceptionally calm under immense pressure is the ultimate developer superpower. When servers crash or complex models fail, I don't panic. <strong className="text-white font-bold">I execute.</strong></p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </section>

            {/* 3. TECHNICAL ARSENAL */}
            <section>
               <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Code className="text-[#ff6a00]" /> Technical Arsenal</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: "Frontend & UI", skills: "React.js • Next.js • Tailwind CSS • Framer Motion • Three.js" },
                   { title: "Backend & Cloud", skills: "Node.js • Python • Firebase • AWS Architecture" },
                   { title: "AI & Creative", skills: "Machine Learning • Deep Learning • Motion Graphics • UI/UX" }
                 ].map((box, i) => (
                   <TiltCard key={i} className="h-full">
                     <div className="bg-[#0a0a0a] border border-[#222] p-10 rounded-2xl h-full hover:border-[#ff6a00]/50 transition-colors cursor-none">
                       <h3 className="text-xl font-bold mb-4 text-white relative z-10">{box.title}</h3>
                       <p className="text-[#ff6a00] font-mono text-sm leading-loose relative z-10">{box.skills}</p>
                     </div>
                   </TiltCard>
                 ))}
               </div>
            </section>

            {/* 4. SELECTED WORKS */}
            <section>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Layers className="text-[#ff6a00]" /> Selected Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "AI Resume Analyzer", tech: "Python • NLP • React", desc: "An intelligent platform that parses and scores resumes against job descriptions using machine learning." },
                  { name: "Smart Cloud Dashboard", tech: "Next.js • AWS • Tailwind", desc: "A cinematic, data-heavy dashboard monitoring real-time cloud server metrics and analytics." },
                  { name: "AI Productivity Assistant", tech: "OpenAI API • Node.js", desc: "A personalized AI agent designed to automate daily workflows and task management." },
                  { name: "Cinematic Portfolio", tech: "React • Framer Motion", desc: "Award-winning, high-performance portfolio templates featuring fast routing and optimized UI." }
                ].map((project, i) => (
                  <TiltCard key={i}>
                    <div className="bg-[#0a0a0a] border border-[#222] p-10 rounded-3xl h-full hover:border-[#ff6a00]/40 transition-all cursor-none group">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#ff6a00] transition-colors">{project.name}</h3>
                        <ExternalLink size={20} className="text-gray-600 group-hover:text-[#ff6a00] transition-colors" />
                      </div>
                      <p className="text-gray-400 mb-6 font-light">{project.desc}</p>
                      <div className="text-xs font-mono text-[#ff6a00]/80 uppercase tracking-widest bg-[#ff6a00]/10 inline-block px-3 py-1 rounded-full">{project.tech}</div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </section>

            {/* 5. EXPERIENCE */}
            <section>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Terminal className="text-[#ff6a00]" /> Operational Experience</h2>
              <div className="space-y-6">
                {[
                  { role: "Frontend Developer Intern", company: "TechNova Solutions", year: "2024 - Present", desc: "Engineered scalable React architectures, implemented global state management, and optimized UI rendering." },
                  { role: "Freelance Creative Developer", company: "Independent", year: "2023 - 2024", desc: "Architected modern web experiences, integrating headless CMS and secure Firebase authentication." }
                ].map((exp, i) => (
                   <div key={i} className="bg-[#0a0a0a] border border-[#222] p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center group cursor-none hover:border-[#ff6a00]/30 transition-all">
                     <div className="max-w-2xl">
                       <h3 className="text-2xl font-bold group-hover:text-[#ff6a00] transition-colors">{exp.role}</h3>
                       <p className="text-gray-500 mt-2"><span className="text-white font-semibold">{exp.company}</span> • {exp.desc}</p>
                     </div>
                     <div className="text-[#ff6a00] font-mono mt-4 md:mt-0 opacity-80 bg-[#ff6a00]/10 px-4 py-2 rounded-lg">{exp.year}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
               {[
                 { num: "3+", label: "AI/ML Certifications" },
                 { num: "50+", label: "Projects Deployed" },
                 { num: "2026", label: "Master's Graduation" },
                 { num: "100%", label: "Calm Under Pressure" }
               ].map((stat, i) => (
                 <TiltCard key={i}>
                   <div className="bg-[#0a0a0a] border border-[#222] p-8 rounded-2xl cursor-none hover:bg-[#111] transition-colors">
                     <div className="text-4xl md:text-5xl font-black text-[#ff6a00] mb-2">{stat.num}</div>
                     <div className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</div>
                   </div>
                 </TiltCard>
               ))}
            </section>

            {/* 7. CONTACT */}
            <section className="text-center pt-20">
               <TiltCard>
                 <div className="bg-[#0a0a0a] border border-[#222] p-16 md:p-32 rounded-[4rem] relative overflow-hidden cursor-none hover:border-[#ff6a00]/40 transition-all duration-300 shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#ff6a00]/5 to-transparent opacity-50" />
                   
                   <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 relative z-10 text-white">
                     INITIATE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-yellow-500">SEQUENCE.</span>
                   </h2>
                   <p className="text-gray-300 mb-12 relative z-10 max-w-lg mx-auto text-lg md:text-xl font-light">
                     Ready to build a digital experience that pushes the boundaries of the modern web? Let's engineer the future together.
                   </p>
                   
                   <a href="mailto:sa.tech080044@gmail.com" className="cursor-none relative z-10 inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-bold rounded-full hover:bg-[#ff6a00] hover:text-white transition-all duration-300 tracking-widest uppercase text-sm">
                     <Mail size={20} /> Contact Me
                   </a>
                 </div>
               </TiltCard>
               
               <div className="flex justify-center gap-10 mt-20 text-gray-400 relative z-10">
                 <a href="https://instagram.com/_sujal.0044" target="_blank" rel="noreferrer" className="hover:text-[#ff6a00] hover:-translate-y-2 transition-all duration-300 cursor-none"><Instagram size={28} /></a>
                 <a href="https://sujal0044.github.io" target="_blank" rel="noreferrer" className="hover:text-[#ff6a00] hover:-translate-y-2 transition-all duration-300 cursor-none"><Github size={28} /></a>
               </div>
               <div className="mt-12 pb-10 text-xs text-gray-600 uppercase tracking-widest relative z-10 font-bold">
                 Sujal Patel <span className="text-[#ff6a00] mx-2">///</span> Building The Future
               </div>
            </section>

          </div>
        </>
      )}
    </div>
  );
}
