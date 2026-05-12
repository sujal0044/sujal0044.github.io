import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Instagram, Volume2, VolumeX, Mail, ExternalLink, Code, Award, Terminal } from 'lucide-react';
// Importing your exact uploaded image
import heroImg from '../sujal.jpg';

// --- 3D INTERACTIVE WRAPPER COMPONENT ---
// This makes any card tilt and rotate tracking the user's mouse
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  // Cinematic load
  useEffect(() => {
    setTimeout(() => setLoading(false), 2800);
  }, []);

  const toggleMusic = () => {
    if (isMuted) {
      audioRef.current.play();
      audioRef.current.volume = 0.3;
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#ff6a00] selection:text-white">
      
      {/* Audio Player (Cinematic Ambient Track) */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=cinematic-time-lapse-115672.mp3" />

      {/* 1. PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }} exit={{ opacity: 0, y: -1000 }} transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
          >
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-64 h-64 bg-[#ff6a00]/20 blur-[100px] rounded-full" />
            <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-bold tracking-widest z-10">
              SP<span className="text-[#ff6a00]">.</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          {/* NAVIGATION & MUSIC TOGGLE */}
          <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 pointer-events-none">
            <div className="font-bold text-xl tracking-tighter pointer-events-auto">SUJAL<span className="text-[#ff6a00]">.</span></div>
            <button onClick={toggleMusic} className="pointer-events-auto p-3 glass-card rounded-full hover:bg-white/10 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? 'Sound Off' : 'Sound On'}
            </button>
          </nav>

          {/* 2. HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
            <div className="absolute inset-0 z-0">
               {/* Your Cinematic Photo with Filters applied */}
               <img src={heroImg} alt="Sujal Patel" className="w-full h-full object-cover opacity-40 filter grayscale hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/90 to-[#050505]"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#ff6a00]/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
            </div>

            <div className="relative z-10 text-center max-w-5xl">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[#ff6a00] uppercase tracking-widest text-sm font-bold mb-6">
                 Creative Technologist
               </motion.div>
               <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                 BUILDING <br /> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-yellow-500">FUTURE.</span>
               </motion.h1>
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                 Sujal Patel is a modern creative developer and technology enthusiast currently pursuing a Master’s degree in Computer Science in London. Blending development, AI, motion, and modern UI design into meaningful products.
               </motion.p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 space-y-40 pb-40">
            
            {/* 3. ABOUT SECTION (3D Interaction) */}
            <section id="about" className="pt-20">
              <TiltCard>
                <div className="glass-card p-12 md:p-20 rounded-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#ff6a00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h2 className="text-3xl md:text-5xl font-bold mb-8">The Mindset.</h2>
                  <div className="grid md:grid-cols-2 gap-12 text-gray-400 text-lg leading-relaxed">
                    <p>I am an ambitious international student, bridging my roots in India to the tech landscape of London. Beyond the code, I am a disciplined reader of psychology and self-growth literature.</p>
                    <p>This perspective allows me to remain exceptionally calm under pressure. Whether debugging complex machine learning algorithms or deploying full-stack architectures, I adapt and build with precision.</p>
                  </div>
                </div>
              </TiltCard>
            </section>

            {/* 4. SKILLS SECTION */}
            <section>
               <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Code className="text-[#ff6a00]" /> Technical Arsenal</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: "Frontend & UI", skills: "React.js • Next.js • Tailwind CSS • Framer Motion • Three.js" },
                   { title: "Backend & Cloud", skills: "Node.js • Python • Firebase • AWS Architecture" },
                   { title: "AI & Creative", skills: "Machine Learning • Deep Learning • Motion Graphics • Branding" }
                 ].map((box, i) => (
                   <TiltCard key={i} className="h-full">
                     <div className="glass-card p-10 rounded-2xl h-full border-t border-white/5 hover:border-[#ff6a00]/50 transition-colors">
                       <h3 className="text-xl font-bold mb-4 text-white">{box.title}</h3>
                       <p className="text-[#ff6a00] font-mono text-sm leading-loose">{box.skills}</p>
                     </div>
                   </TiltCard>
                 ))}
               </div>
            </section>

            {/* 5. EXPERIENCE & PROJECTS */}
            <section>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4"><Terminal className="text-[#ff6a00]" /> Featured Work & Experience</h2>
              <div className="space-y-6">
                {[
                  { role: "Frontend Developer Intern", company: "TechNova Solutions", year: "2024", desc: "Built responsive React web apps and improved UI performance metrics." },
                  { role: "Freelance Creative Developer", company: "Independent", year: "2023", desc: "Developed cinematic portfolio platforms and AI productivity assistants." }
                ].map((exp, i) => (
                  <motion.div key={i} whileHover={{ x: 20 }} className="glass-card p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center group cursor-pointer">
                     <div>
                       <h3 className="text-2xl font-bold group-hover:text-[#ff6a00] transition-colors">{exp.role}</h3>
                       <p className="text-gray-500 mt-2">{exp.company} • {exp.desc}</p>
                     </div>
                     <div className="text-gray-600 font-mono mt-4 md:mt-0">{exp.year}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 6. STATS & CERTIFICATIONS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
               {[
                 { num: "3+", label: "AI/ML Certifications" },
                 { num: "50+", label: "Projects Completed" },
                 { num: "2026", label: "Master's Graduation" },
                 { num: "100%", label: "Calm Under Pressure" }
               ].map((stat, i) => (
                 <TiltCard key={i}>
                   <div className="glass-card p-8 rounded-2xl">
                     <div className="text-4xl md:text-5xl font-black text-[#ff6a00] mb-2">{stat.num}</div>
                     <div className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</div>
                   </div>
                 </TiltCard>
               ))}
            </section>

            {/* 7. CONTACT SECTION */}
            <section className="text-center pt-20">
               <TiltCard>
                 <div className="glass-card p-16 md:p-24 rounded-[3rem] relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#ff6a00]/20 to-transparent opacity-50" />
                   <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 relative z-10">READY TO <br/>INNOVATE?</h2>
                   <a href="mailto:sa.tech080044@gmail.com" className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-[#ff6a00] hover:text-white hover:scale-105 transition-all duration-300">
                     <Mail size={20} /> sa.tech080044@gmail.com
                   </a>
                 </div>
               </TiltCard>
               
               <div className="flex justify-center gap-8 mt-16 text-gray-500">
                 <a href="https://instagram.com/_sujal.0044" className="hover:text-[#ff6a00] transition-colors"><Instagram size={24} /></a>
                 <a href="https://sujal0044.github.io" className="hover:text-[#ff6a00] transition-colors"><Github size={24} /></a>
               </div>
               <div className="mt-10 text-xs text-gray-700 uppercase tracking-widest">
                 Sujal Patel — Building the Future Through Creativity & Code
               </div>
            </section>

          </div>
        </>
      )}
    </div>
  );
}
