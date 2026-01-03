import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Code, Terminal, Sun, Moon, Palette } from 'lucide-react';

const App = () => {
  // --- THEME ENGINE ---
  // Index 0 is Dark. Indexes 1, 2, 3 are the Light Mode Loop.
  const [themeIndex, setThemeIndex] = useState(0);

  const themes = [
    {
      name: "Dark Void",
      isDark: true,
      colors: {
        bg: "#020617", // slate-950
        textMain: "#e2e8f0", // slate-200
        textMuted: "#94a3b8", // slate-400
        accent: "#22d3ee", // cyan-400
        accentGradient: "#c084fc", // purple-400
        glassBg: "rgba(255, 255, 255, 0.05)",
        glassBorder: "rgba(255, 255, 255, 0.1)",
        glow1: "rgba(147, 51, 234, 0.2)", // purple glow
        glow2: "rgba(8, 145, 178, 0.1)" // cyan glow
      }
    },
    {
      name: "Daylight Blue",
      isDark: false,
      colors: {
        bg: "#f8fafc", // slate-50
        textMain: "#0f172a", // slate-900
        textMuted: "#475569", // slate-600
        accent: "#2563eb", // blue-600
        accentGradient: "#7c3aed", // violet-600
        glassBg: "rgba(0, 0, 0, 0.04)", // Darker tint for light mode
        glassBorder: "rgba(0, 0, 0, 0.08)",
        glow1: "rgba(59, 130, 246, 0.15)", // blue glow
        glow2: "rgba(139, 92, 246, 0.15)" // violet glow
      }
    },
    {
      name: "Sunset Warmth",
      isDark: false,
      colors: {
        bg: "#fff7ed", // orange-50
        textMain: "#431407", // orange-950
        textMuted: "#9a3412", // orange-800
        accent: "#ea580c", // orange-600
        accentGradient: "#db2777", // pink-600
        glassBg: "rgba(67, 20, 7, 0.04)",
        glassBorder: "rgba(67, 20, 7, 0.08)",
        glow1: "rgba(234, 88, 12, 0.15)", // orange glow
        glow2: "rgba(219, 39, 119, 0.15)" // pink glow
      }
    },
    {
      name: "Neo Mint",
      isDark: false,
      colors: {
        bg: "#f0fdf4", // green-50
        textMain: "#064e3b", // green-900
        textMuted: "#166534", // green-700
        accent: "#059669", // emerald-600
        accentGradient: "#0d9488", // teal-600
        glassBg: "rgba(6, 78, 59, 0.04)",
        glassBorder: "rgba(6, 78, 59, 0.08)",
        glow1: "rgba(16, 185, 129, 0.15)", // emerald glow
        glow2: "rgba(20, 184, 166, 0.15)" // teal glow
      }
    }
  ];

  const currentTheme = themes[themeIndex];

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    // MAIN WRAPPER: Using CSS Variables for dynamic theme switching
    <div 
      className="relative min-h-screen font-sans transition-colors duration-700 ease-in-out overflow-hidden selection:bg-[var(--accent)] selection:text-white"
      style={{
        backgroundColor: currentTheme.colors.bg,
        '--bg-main': currentTheme.colors.bg,
        '--text-main': currentTheme.colors.textMain,
        '--text-muted': currentTheme.colors.textMuted,
        '--accent': currentTheme.colors.accent,
        '--accent-grad': currentTheme.colors.accentGradient,
        '--glass-bg': currentTheme.colors.glassBg,
        '--glass-border': currentTheme.colors.glassBorder,
      }}
    >
      
      {/* THEME SWITCHER BUTTON */}
      <button 
        onClick={cycleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md shadow-lg hover:scale-110 transition-transform group"
      >
        <div className="text-[var(--text-main)]">
            {currentTheme.isDark ? <Sun size={24} /> : <Palette size={24} />}
        </div>
      </button>

      {/* BACKGROUND GLOWS (Dynamic Colors) */}
      <div 
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000" 
        style={{ backgroundColor: currentTheme.colors.glow1 }}
      />
      <div 
        className="fixed bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentTheme.colors.glow2 }}
      />

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
        
        {/* HEADER SECTION */}
        <motion.header 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
          className="mb-24"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent)] text-xs font-medium tracking-wide mb-6 backdrop-blur-sm transition-colors duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
            </span>
            {currentTheme.name} Mode
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-main)] mb-6 transition-colors duration-500">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-grad)]">Shivam Rai</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-light text-[var(--text-muted)] max-w-2xl leading-relaxed transition-colors duration-500">
            Architecting intelligent <span className="text-[var(--text-main)] font-medium">AI systems</span> & scalable <span className="text-[var(--text-main)] font-medium">MLOps pipelines</span>.
          </h2>

          <p className="mt-8 max-w-xl text-[var(--text-muted)] leading-relaxed text-lg transition-colors duration-500">
            I bridge the gap between complex machine learning models and production software. Passionate about Graph Neural Networks, RAG, and high-performance backend systems.
          </p>

          <div className="mt-10 flex gap-6">
            <SocialLink href="https://github.com/shivamrai009" icon={<Github size={22} />} label="GitHub" />
            <SocialLink href="#" icon={<Linkedin size={22} />} label="LinkedIn" />
            <SocialLink href="mailto:your-email@example.com" icon={<Mail size={22} />} label="Email" />
          </div>
        </motion.header>

        {/* PROJECTS SECTION */}
        <main>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-12"
          >
            <Terminal size={24} className="text-[var(--accent)]" />
            <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-wide transition-colors duration-500">Featured Projects</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            
            <ProjectCard 
              title="Finance Graph RAG"
              description="A financial analysis system combining Graph Neural Networks with RAG to uncover complex relationships in financial data."
              tags={['Python', 'Graph NN', 'RAG']}
              link="https://github.com/shivamrai009/finance-graph-rag"
            />

            <ProjectCard 
              title="RAG Pipeline Optimizer"
              description="Optimization framework for determining the best RAG parameters (chunk size, embeddings) for enterprise use cases."
              tags={['MLOps', 'Vector DB', 'Docker']}
              link="https://github.com/shivamrai009/RAG-Pipeline-Optimizer"
            />

            <ProjectCard 
              title="CV Experience Parser"
              description="AI-powered Resume-to-JSON extractor using a LoRA fine-tuned LLM to automatically structure job experience data."
              tags={['LLM', 'LoRA', 'Fine-tuning']}
              link="https://github.com/shivamrai009/CV-Experience-Parser"
            />

            <ProjectCard 
              title="Smart Model Router"
              description="Intelligent AI gateway that dynamically routes prompts to the most cost-effective model (Llama 3 vs. GPT-4)."
              tags={['FastAPI', 'Groq', 'Llama 3']}
              link="https://github.com/shivamrai009/smart-model-router"
            />

          </div>
        </main>
        
        <footer className="mt-32 border-t border-[var(--glass-border)] pt-8 text-center text-[var(--text-muted)] text-sm transition-colors duration-500">
          <p>© 2026 Shivam Rai • Crafted with React, Tailwind & Framer Motion</p>
        </footer>
      </div>
    </div>
  );
};

// --- MODERN COMPONENTS ---

const SocialLink = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group"
  >
    <div className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] group-hover:border-[var(--accent)] transition-all">
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const ProjectCard = ({ title, description, tags, link }) => (
  <motion.a 
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className={`block relative p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] hover:border-[var(--accent)] transition-all group overflow-hidden`}
  >
    {/* Subtle gradient glow on hover */}
    <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity`}>
      <ExternalLink size={20} className="text-[var(--text-main)]" />
    </div>

    <div className="mb-4">
      <div className={`w-12 h-12 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] transition-colors`}>
        <Code size={24} />
      </div>
    </div>

    <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
      {title}
    </h3>
    
    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 transition-colors duration-300">
      {description}
    </p>

    <div className="flex flex-wrap gap-2 mt-auto">
      {tags.map((tag) => (
        <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-muted)]">
          {tag}
        </span>
      ))}
    </div>
  </motion.a>
);

export default App;