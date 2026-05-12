import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Volume2, VolumeX, Mail, Code, Terminal, Layers, ExternalLink } from 'lucide-react';

const abstractCoreImg = "https://images.unsplash.com/photo-1614729939124-03290b56c9ce?q=80&w=2500&auto=format&fit=crop";
const mindsetBg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop";

// --- 1. OPTION 1: NEURAL NETWORK (Fixed Visibility) ---
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
    const particleCount = isMobile ? 20 : 40; 
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
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 106, 0, 0.4)';
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 106, 0, ${0.15 - dist / connectionDistance * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        if (!isMobile) { 
            let mouseDist = Math.sqrt(Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2));
            if (mouseDist < 200) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(255, 106, 0, ${0.3 - mouseDist / 200 * 0.3})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
        }
      }
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; };
    window.addEventListener('resize', handleResize);
    return () => { if (!isMobile) { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseout', handleMouseOut); } window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-70 mix-blend-screen" />;
};

// --- 2. EXACT LETTER MAGNIFIER ENGINE ---
const MagLetter = ({ text, className = "" }) => {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-flex whitespace-pre">
          {word.split('').map((char, cIdx) => (
            <span 
              key={cIdx} 
              className="inline-block transition-all duration-75 ease-out hover:scale-[1.7] hover:-translate-y-2 hover:text-[#ff6a00] hover:z-50 relative cursor-none hover:drop-shadow-[0_0_10px_rgba(255,106,0,0.8)]"
            >
              {char}
            </span>
          ))}
          {wIdx !== text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

// --- 3. RESTORED GLASS TILT CARDS ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]); 
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div style={{ perspective: 1000 }} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }} className={className}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </motion.div>
  );
};

// --- SVG PRELOADER ---
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
  const audioRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    setIsDesktop(mql.matches); 
    
    const handleMouseMove = (e) => {
      if (!cursorRef.current) return;
      
      // 144Hz direct tracking
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const target = e.target;
      const isHovering = target.closest('.glass-lens-trigger') || target.closest('a') || target.closest('button');
      
      // TRUE GLASS CURSOR LOGIC (White background, translucent)
      if (isHovering) {
        cursorRef.current.classList.add('w-20', 'h-20', '-ml-10', '-mt-10', 'bg-white/20', 'backdrop-blur-sm', 'border-white/50');
        cursorRef.current.classList.remove('w-6', 'h-6', '-ml-3', '-mt-3', 'bg-white/40', 'backdrop-blur-[1px]', 'border-transparent');
      } else {
        cursorRef.current.classList.add('w-6', 'h-6', '-ml-3', '-mt-3', 'bg-white/40', 'backdrop-blur-[1px]', 'border-transparent');
        cursorRef.current.classList.remove('w-20', 'h-20', '-ml-10', '-mt-10', 'bg-white/20', 'backdrop-blur-sm', 'border-white/50');
      }
    };
    
    if (mql.matches) window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => { if (mql.matches) window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  useEffect(() => { setTimeout(() => setLoading(false), 2800); }, []);

  const toggleMusic = () => {
    if (isMuted) { audioRef.current.play(); audioRef.current.volume = 0.2; } 
    else { audioRef.current.pause(); }
    setIsMuted(!isMuted);
  };

  return (
    <div className={`bg-[#050505] text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#ff6a00] selection:text-white relative ${isDesktop ? 'cursor-none' : ''}`}>
      
      {/* 4. TRUE GLASS LENS CURSOR */}
      {isDesktop && (
        <div 
          ref={cursorRef}
          className="fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 bg-white/40 backdrop-blur-[1px] border border-transparent rounded-full pointer-events-none z-[9999] transition-[width,height,margin,background,border] duration-200 ease-out will-change-transform shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        />
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
          {/* THE NEURAL NETWORK IS FULLY VISIBLE HERE */}
          <NeuralNetwork />

          {/* NAVIGATION */}
          <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-bold text-xl tracking-tighter pointer-events-auto glass-lens-trigger cursor-none">
              <MagLetter text="SUJAL" /><span className="text-[#ff6a00]">.</span>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onClick={toggleMusic} className="pointer-events-auto cursor-none px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? 'Sound Off' : 'Sound On'}
            </motion.button>
          </nav>

          {/* HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden z-10">
            {/* Background image is low opacity, allowing Neural Network to shine through */}
            <div className="absolute inset-0 z-0">
               <motion.img src={abstractCoreImg} alt="AI Core" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1.5 }} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
            </div>

            <div className="relative z-20 text-center max-w-5xl mt-10 glass-lens-trigger">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[#ff6a00] uppercase tracking-widest text-sm font-bold mb-8">
                 <MagLetter text="Creative Technologist • AI Enthusiast" />
               </motion.div>
               <br />
               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none">
                 <MagLetter text="BUILDING" /> <br />
                 <MagLetter text="THE" /> <span className="text-[#ff6a00]"><MagLetter text="FUTURE." /></span>
               </motion.h1>
               <br />
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }} className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                 <MagLetter text="I am Sujal Patel. A creative technologist and AI architect based in London. I don't just write code—I engineer intelligent digital ecosystems." /> <span className="text-white font-semibold"><MagLetter text="Welcome to my operational cortex." /></span>
               </motion.p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 space-y-32 pb-40 relative z-20">
            
            {/* THE MINDSET */}
            <section className="pt-20 relative glass-lens-trigger">
              <motion.img src={mindsetBg} initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} transition={{ duration: 1.5 }} viewport={{ once: true }} className="absolute inset-0 w-full h-full object-cover -z-10 rounded-3xl" />
              <TiltCard>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-24 rounded-3xl relative overflow-hidden transition-colors hover:border-[#ff6a00]/40 shadow-2xl">
                  <div className="relative z-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">
                      <MagLetter text="The Mindset." />
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12 text-gray-300 text-lg leading-relaxed font-light">
                      <p><MagLetter text="The architecture of code means nothing without the architecture of the mind. My journey from India to the heart of London's tech landscape wasn't just geographical; it was an evolution of extreme discipline. I operate at the intersection of rigorous logic and relentless creativity." /></p>
                      <p><MagLetter text="I study human psychology and stoicism as intensely as I study machine learning algorithms. The ability to remain exceptionally calm under immense pressure is the ultimate developer superpower. When servers crash or complex models fail, I don't panic." /> <strong className="text-white font-bold"><MagLetter text="I execute." /></strong></p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </section>

            {/* TECHNICAL ARSENAL */}
            <section className="glass-lens-trigger">
               <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Code className="text-[#ff6a00]" /> <MagLetter text="Technical Arsenal" /></h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: "Frontend & UI", skills: "React.js • Next.js • Tailwind CSS • Framer Motion • Three.js" },
                   { title: "Backend & Cloud", skills: "Node.js • Python • Firebase • AWS Architecture" },
                   { title: "AI & Creative", skills: "Machine Learning • Deep Learning • Motion Graphics • UI/UX" }
                 ].map((box, i) => (
                   <TiltCard key={i} className="h-full">
                     <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl h-full hover:border-[#ff6a00]/50 transition-colors cursor-none w-full shadow-lg">
                       <h3 className="text-xl font-bold mb-4 text-white relative z-10"><MagLetter text={box.title} /></h3>
                       <p className="text-[#ff6a00] font-mono text-sm leading-loose relative z-10">{box.skills}</p>
                     </div>
                   </TiltCard>
                 ))}
               </div>
            </section>

            {/* SELECTED WORKS */}
            <section className="glass-lens-trigger">
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Layers className="text-[#ff6a00]" /> <MagLetter text="Selected Works" /></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "AI Resume Analyzer", tech: "Python • NLP • React", desc: "An intelligent platform that parses and scores resumes against job descriptions using machine learning." },
                  { name: "Smart Cloud Dashboard", tech: "Next.js • AWS • Tailwind", desc: "A cinematic, data-heavy dashboard monitoring real-time cloud server metrics and analytics." },
                  { name: "AI Productivity Assistant", tech: "OpenAI API • Node.js", desc: "A personalized AI agent designed to automate daily workflows and task management." },
                  { name: "Cinematic Portfolio", tech: "React • Framer Motion", desc: "Award-winning, high-performance portfolio templates featuring fast routing and optimized UI." }
                ].map((project, i) => (
                  <TiltCard key={i}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl h-full hover:border-[#ff6a00]/40 transition-all cursor-none group shadow-lg">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#ff6a00] transition-colors"><MagLetter text={project.name} /></h3>
                        <ExternalLink size={20} className="text-gray-600 group-hover:text-[#ff6a00] transition-colors" />
                      </div>
                      <p className="text-gray-400 mb-6 font-light group-hover:text-white transition-colors">{project.desc}</p>
                      <div className="text-xs font-mono text-[#ff6a00]/80 uppercase tracking-widest bg-[#ff6a00]/10 inline-block px-3 py-1 rounded-full">{project.tech}</div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </section>

            {/* EXPERIENCE */}
            <section className="glass-lens-trigger">
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Terminal className="text-[#ff6a00]" /> <MagLetter text="Operational Experience" /></h2>
              <div className="space-y-6">
                {[
                  { role: "Frontend Developer Intern", company: "TechNova Solutions", year: "2024 - Present", desc: "Engineered scalable React architectures, implemented global state management, and optimized UI rendering." },
                  { role: "Freelance Creative Developer", company: "Independent", year: "2023 - 2024", desc: "Architected modern web experiences, integrating headless CMS and secure Firebase authentication." }
                ].map((exp, i) => (
                   <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center group cursor-none hover:border-[#ff6a00]/40 transition-all shadow-lg">
                     <div className="max-w-2xl">
                       <h3 className="text-2xl font-bold group-hover:text-[#ff6a00] transition-colors"><MagLetter text={exp.role} /></h3>
                       <p className="text-gray-400 mt-2"><span className="text-white font-semibold">{exp.company}</span> • {exp.desc}</p>
                     </div>
                     <div className="text-[#ff6a00] font-mono mt-4 md:mt-0 opacity-80 bg-[#ff6a00]/10 px-4 py-2 rounded-lg">{exp.year}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* CONTACT */}
            <section className="text-center pt-20 pb-20 relative z-10 glass-lens-trigger">
               <TiltCard>
                 <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-16 md:p-32 rounded-[4rem] relative overflow-hidden cursor-none hover:border-[#ff6a00]/40 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#ff6a00]/10 to-transparent opacity-50" />
                   
                   <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 relative z-10 text-white">
                     <MagLetter text="INITIATE" /> <br/><span className="text-[#ff6a00]"><MagLetter text="SEQUENCE." /></span>
                   </h2>
                   
                   <a href="mailto:sa.tech080044@gmail.com" className="cursor-none relative z-10 inline-flex items-center gap-4 px-12 py-6 mt-10 bg-white text-black font-bold rounded-full hover:bg-[#ff6a00] hover:text-white transition-all duration-300 hover:scale-105 tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                     <Mail size={20} /> Contact Me
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
