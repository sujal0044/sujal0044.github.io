import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Volume2, VolumeX, Mail, Code, Terminal, Layers, ExternalLink } from 'lucide-react';

// --- PRODUCTION IMAGES ---
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

// --- NEURAL NETWORK CANVAS ---
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
    const particleCount = isMobile ? 20 : 60; 
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
      window.addEventListener('mousemove', handleMouseMove);
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
              ctx.strokeStyle = `rgba(255, 106, 0, ${0.2 - mouseDist / 200 * 0.2})`;
              ctx.lineWidth = 1;
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50 mix-blend-screen" />;
};


// --- MAIN APP ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const audioRef = useRef(null);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]); // Parallax effect

  // CURSOR PHYSICS
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotX = useSpring(mouseX, { stiffness: 1500, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 1500, damping: 40 });
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  useEffect(() => {
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
      
      {/* CURSOR */}
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

      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=cinematic-time-lapse-115672.mp3" />

      {/* PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
          >
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute w-64 h-64 bg-[#ff6a00]/20 blur-[100px] rounded-full" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              transition={{ duration: 1.5 }}
              className="text-6xl font-black tracking-widest z-10"
            >
              SP<span className="text-[#ff6a00]">.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <NeuralNetwork />

          {/* NAVIGATION */}
          <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="font-bold text-xl tracking-tighter pointer-events-auto cursor-none">
              SUJAL<span className="text-[#ff6a00]">.</span>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} onClick={toggleMusic} className="pointer-events-auto cursor-none px-4 py-2 glass-card rounded-full hover:bg-white/10 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? 'Sound Off' : 'Sound On'}
            </motion.button>
          </nav>

          {/* 1. UPGRADED HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
            
            <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 flex items-center justify-center">
               {/* Slow Pan & Scale Cinematic Image */}
               <motion.img 
                 src={abstractCoreImg}
                 alt="AI Core" 
                 initial={{ opacity: 0, filter: "blur(40px)", scale: 1.2 }} 
                 animate={{ opacity: 0.15, filter: "blur(4px)", scale: [1.2, 1.3, 1.2], x: [0, 30, 0], y: [0, -20, 0] }} 
                 transition={{ opacity: { duration: 4 }, scale: { duration: 40, repeat: Infinity, ease: "linear" }, x: { duration: 40, repeat: Infinity, ease: "linear" }, y: { duration: 40, repeat: Infinity, ease: "linear" } }}
                 className="w-full h-[120%] object-cover mix-blend-screen"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
               
               {/* Fluid Animated Blur Orbs */}
               <motion.div 
                 animate={{ x: [-100, 100, -100], y: [-50, 50, -50], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                 className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] bg-[#ff6a00]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
               />
               <motion.div 
                 animate={{ x: [100, -100, 100], y: [50, -50, 50], scale: [1.2, 1, 1.2] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                 className="absolute bottom-1/3 right-1/4 w-[50vw] h-[50vw] bg-yellow-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"
               />
            </motion.div>

            <div className="relative z-10 text-center max-w-5xl mt-10">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-[#ff6a00] uppercase tracking-widest text-sm font-bold mb-8">
                 Creative Technologist • AI Enthusiast
               </motion.div>
               <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none">
                 BUILDING <br /> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-yellow-500 drop-shadow-[0_0_30px_rgba(255,106,0,0.2)]">FUTURE.</span>
               </motion.h1>
               <motion.p initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: 1.3, duration: 1.5 }} className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                 I am Sujal Patel. A creative technologist and AI architect based in London. I don't just write code—I engineer intelligent digital ecosystems. <span className="text-white font-semibold">Welcome to my operational cortex.</span>
               </motion.p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 space-y-40 pb-40 relative z-10">
            
            {/* 2. THE MINDSET SECTION */}
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
                     <div className="glass-card p-10 rounded-2xl h-full border-t border-white/5 hover:border-[#ff6a00]/50 transition-colors cursor-none relative overflow-hidden">
                       <h3 className="text-xl font-bold mb-4 text-white relative z-10">{box.title}</h3>
                       <p className="text-[#ff6a00] font-mono text-sm leading-loose relative z-10">{box.skills}</p>
                     </div>
                   </TiltCard>
                 ))}
               </div>
            </section>

            {/* 4. SELECTED WORKS */}
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

            {/* 5. EXPERIENCE */}
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

            {/* 6. STATS & CERTIFICATIONS */}
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

            {/* 7. CONTACT SECTION */}
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
