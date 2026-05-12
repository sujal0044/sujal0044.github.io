import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Volume2, VolumeX, Mail, Code, Terminal, Layers, ExternalLink } from 'lucide-react';

// --- PRODUCTION IMAGES (Optimized for Scroll Parallax) ---
const abstractCoreImg = "https://images.unsplash.com/photo-1614729939124-03290b56c9ce?q=80&w=2500&auto=format&fit=crop";
const mindsetBg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop";
const worksBg = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop";
const contactBg = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop";

// --- 3D TILT WRAPPER ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [6, -6]); 
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </motion.div>
    </motion.div>
  );
};

// --- THE CORE POWER-UP (CUSTOM SVG PRELOADER) ---
const ChipPreloader = () => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay: i * 0.2, type: "spring", duration: 2, bounce: 0 }, opacity: { delay: i * 0.2, duration: 0.2 } }
    })
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Background Ambient Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-full h-full bg-[#ff6a00]/20 blur-[60px] rounded-full"
      />
      
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,106,0,0.8)] z-10">
        {/* Outer Circuit Traces */}
        {[
          "M 5 30 L 20 30", "M 5 50 L 20 50", "M 5 70 L 20 70", // Left
          "M 95 30 L 80 30", "M 95 50 L 80 50", "M 95 70 L 80 70", // Right
          "M 30 5 L 30 20", "M 50 5 L 50 20", "M 70 5 L 70 20", // Top
          "M 30 95 L 30 80", "M 50 95 L 50 80", "M 70 95 L 70 80"  // Bottom
        ].map((d, i) => (
          <motion.path key={i} d={d} stroke="#ff6a00" strokeWidth="2" fill="none" strokeLinecap="round" variants={draw} custom={1} initial="hidden" animate="visible" />
        ))}
        
        {/* Outer Chip Frame */}
        <motion.rect x="20" y="20" width="60" height="60" rx="4" stroke="#ff6a00" strokeWidth="2.5" fill="none" variants={draw} custom={3} initial="hidden" animate="visible" />
        <motion.rect x="24" y="24" width="52" height="52" rx="2" stroke="#ff6a00" strokeWidth="1" strokeDasharray="2 2" fill="none" variants={draw} custom={4} initial="hidden" animate="visible" />
        
        {/* Inner Core */}
        <motion.rect 
          x="32" y="32" width="36" height="36" rx="3" fill="#ff6a00"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 1] }}
          transition={{ delay: 2.5, duration: 1.5 }}
        />
        
        {/* SP Text */}
        <motion.text 
          x="50" y="55" textAnchor="middle" fill="#050505" fontSize="18" fontWeight="900" fontFamily="sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          SP
        </motion.text>
      </svg>
    </div>
  );
};


// --- MAIN APP ARCHITECTURE ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const audioRef = useRef(null);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]); // Parallax effect

  // CURSOR PHYSICS (Optimized for Desktop Only)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotX = useSpring(mouseX, { stiffness: 1500, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 1500, damping: 40 });
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  useEffect(() => {
    // Check if device has a fine pointer (mouse)
    const mql = window.matchMedia('(pointer: fine)');
    const handleDeviceChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches); 
    mql.addEventListener('change', handleDeviceChange);
    
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    if (mql.matches) window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      mql.removeEventListener('change', handleDeviceChange);
      if (mql.matches) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    // 4.5 seconds to let the cinematic chip sequence fully play out
    setTimeout(() => setLoading(false), 4500); 
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
      
      {/* DESKTOP MAGNETIC CURSOR */}
      {isDesktop && (
        <>
          <motion.div 
            className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            style={{ x: dotX, y: dotY }}
          />
          <motion.div 
            className="fixed top-0 left-0 w-10 h-10 border border-[#ff6a00]/40 rounded-full pointer-events-none z-[998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
            style={{ x: ringX, y: ringY }}
          />
        </>
      )}

      {/* AMBIENT AUDIO TRACK */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=cinematic-time-lapse-115672.mp3" />

      {/* 1. THE PRELOADER SEQUENCE */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }} 
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
          >
            <ChipPreloader />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          {/* NAVIGATION */}
          <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="font-bold text-xl tracking-tighter pointer-events-auto cursor-none">
              SUJAL<span className="text-[#ff6a00]">.</span>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={toggleMusic} className="pointer-events-auto cursor-none px-4 py-2 glass-card rounded-full hover:bg-white/10 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? 'Sound Off' : 'Sound On'}
            </motion.button>
          </nav>

          {/* 2. THE HERO (CLEVER COPY + FLUID ORBS) */}
          <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
            
            <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 flex items-center justify-center">
               <motion.img 
                 src={abstractCoreImg}
                 alt="AI Core" 
                 initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }} 
                 animate={{ opacity: 0.15, filter: "blur(4px)", scale: [1.1, 1.2, 1.1], x: [0, 20, 0] }} 
                 transition={{ opacity: { duration: 3 }, scale: { duration: 30, repeat: Infinity, ease: "linear" }, x: { duration: 30, repeat: Infinity, ease: "linear" } }}
                 className="w-full h-[120%] object-cover mix-blend-screen"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
               
               {/* Zero-Lag Fluid CSS Orbs */}
               <motion.div 
                 animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                 className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] bg-[#ff6a00]/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
               />
               <motion.div 
                 animate={{ x: [50, -50, 50], y: [20, -20, 20] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                 className="absolute bottom-1/3 right-1/4 w-[60vw] h-[60vw] bg-yellow-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"
               />
            </motion.div>

            <div className="relative z-10 text-center max-w-5xl mt-10">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[#ff6a00] uppercase tracking-widest text-sm font-bold mb-8">
                 Creative Technologist • AI Enthusiast
               </motion.div>
               <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none">
                 BUILDING <br /> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-yellow-500 drop-shadow-[0_0_30px_rgba(255,106,0,0.2)]">FUTURE.</span>
               </motion.h1>
               {/* Clever Introduction Copy */}
               <motion.p initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 0.9, duration: 1.5 }} className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                 I am Sujal Patel. A creative technologist and AI architect based in London. I don't just write code—I engineer intelligent digital ecosystems. <span className="text-white font-semibold">Welcome to my operational cortex.</span>
               </motion.p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 space-y-40 pb-40 relative z-10">
            
            {/* 3. THE MINDSET SECTION */}
            <section className="pt-20 relative">
              <motion.img 
                src={mindsetBg}
                initial={{ opacity: 0, filter: "blur(20px)" }} whileInView={{ opacity: 0.08, filter: "blur(5px)" }} transition={{ duration: 2 }} viewport={{ once: false, margin: "-100px" }}
                className="absolute inset-0 w-full h-full object-cover -z-10 mix-blend-screen rounded-3xl"
              />
              <TiltCard>
                <div className="glass-card p-12 md:p-24 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-[#ff6a00]/20 transition-all duration-700">
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

            {/* 4. TECHNICAL ARSENAL */}
            <section>
               <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Code className="text-[#ff6a00]" /> Technical Arsenal</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: "Frontend & UI", skills: "React.js • Next.js • Tailwind CSS • Framer Motion • Three.js" },
                   { title: "Backend & Cloud", skills: "Node.js • Python • Firebase • AWS Architecture" },
                   { title: "AI & Creative", skills: "Machine Learning • Deep Learning • Motion Graphics • UI/UX" }
                 ].map((box, i) => (
                   <TiltCard key={i} className="h-full">
                     <div className="glass-card p-10 rounded-2xl h-full border-t border-white/5 hover:border-[#ff6a00]/50 transition-colors cursor-none relative overflow-hidden">
                       <h3 className="text-xl font-bold mb-4 text-white relative z-10">{box.title}</h3>
                       <p className="text-[#ff6a00] font-mono text-sm leading-loose relative z-10">{box.skills}</p>
                     </div>
                   </TiltCard>
                 ))}
               </div>
            </section>

            {/* 5. SELECTED WORKS */}
            <section className="relative">
              <motion.img 
                src={worksBg}
                initial={{ opacity: 0, filter: "blur(20px)" }} whileInView={{ opacity: 0.05, filter: "blur(3px)" }} transition={{ duration: 2 }} viewport={{ once: false }}
                className="absolute inset-0 w-full h-full object-cover -z-10 mix-blend-screen rounded-3xl"
              />
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Layers className="text-[#ff6a00]" /> Selected Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "AI Resume Analyzer", tech: "Python • NLP • React", desc: "An intelligent platform that parses and scores resumes against job descriptions using machine learning." },
                  { name: "Smart Cloud Dashboard", tech: "Next.js • AWS • Tailwind", desc: "A cinematic, data-heavy dashboard monitoring real-time cloud server metrics and analytics." },
                  { name: "AI Productivity Assistant", tech: "OpenAI API • Node.js", desc: "A personalized AI agent designed to automate daily workflows and task management." },
                  { name: "Cinematic Portfolio Platform", tech: "React • Framer Motion", desc: "Award-winning, high-performance portfolio templates featuring complex 3D routing and physics." }
                ].map((project, i) => (
                  <TiltCard key={i}>
                    <div className="glass-card p-10 rounded-3xl h-full border border-white/5 hover:border-[#ff6a00]/40 transition-all cursor-none group">
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

            {/* 6. EXPERIENCE */}
            <section>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Terminal className="text-[#ff6a00]" /> Operational Experience</h2>
              <div className="space-y-6">
                {[
                  { role: "Frontend Developer Intern", company: "TechNova Solutions", year: "2024 - Present", desc: "Engineered scalable React architectures, implemented global state management, and optimized UI rendering performance metrics." },
                  { role: "Freelance Creative Developer", company: "Independent", year: "2023 - 2024", desc: "Architected modern web experiences, integrating headless CMS, secure Firebase authentication, and cinematic Framer/GSAP animations." }
                ].map((exp, i) => (
                  <motion.div key={i} whileHover={{ x: 10 }} className="glass-card p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center group cursor-none border border-white/5 hover:border-[#ff6a00]/30 transition-all">
                     <div className="max-w-2xl">
                       <h3 className="text-2xl font-bold group-hover:text-[#ff6a00] transition-colors">{exp.role}</h3>
                       <p className="text-gray-500 mt-2"><span className="text-white font-semibold">{exp.company}</span> • {exp.desc}</p>
                     </div>
                     <div className="text-[#ff6a00] font-mono mt-4 md:mt-0 opacity-60 bg-[#ff6a00]/5 px-4 py-2 rounded-lg">{exp.year}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 7. STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
               {[
                 { num: "3+", label: "AI/ML Certifications" },
                 { num: "50+", label: "Projects Deployed" },
                 { num: "2026", label: "Master's Graduation" },
                 { num: "100%", label: "Calm Under Pressure" }
               ].map((stat, i) => (
                 <TiltCard key={i}>
                   <div className="glass-card p-8 rounded-2xl cursor-none hover:bg-white/5 transition-colors">
                     <div className="text-4xl md:text-5xl font-black text-[#ff6a00] mb-2">{stat.num}</div>
                     <div className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</div>
                   </div>
                 </TiltCard>
               ))}
            </section>

            {/* 8. CONTACT */}
            <section className="text-center pt-20 relative">
               <motion.img 
                src={contactBg}
                initial={{ opacity: 0, filter: "blur(30px)" }} whileInView={{ opacity: 0.15, filter: "blur(0px)" }} transition={{ duration: 3 }} viewport={{ once: false }}
                className="absolute inset-0 w-full h-full object-cover -z-10 mix-blend-screen rounded-[4rem]"
               />
               <TiltCard>
                 <div className="glass-card p-16 md:p-32 rounded-[4rem] relative overflow-hidden cursor-none border border-white/10 hover:border-[#ff6a00]/40 transition-all duration-700 shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#ff6a00]/10 to-transparent opacity-50" />
                   
                   <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 relative z-10 text-white drop-shadow-lg">
                     INITIATE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-yellow-500">SEQUENCE.</span>
                   </h2>
                   <p className="text-gray-300 mb-12 relative z-10 max-w-lg mx-auto text-lg md:text-xl font-light">
                     Ready to build a digital experience that pushes the boundaries of the modern web? Let's engineer the future together.
                   </p>
                   
                   <a href="mailto:sa.tech080044@gmail.com" className="cursor-none relative z-10 inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-bold rounded-full hover:bg-[#ff6a00] hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,106,0,0.4)] tracking-widest uppercase text-sm">
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
