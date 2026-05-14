"use client";

import { motion } from "framer-motion";
import { Upload, GitBranch, Sparkles, ArrowRight, Target, Code, BrainCircuit, LineChart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-brand-400" />,
      title: "AI Skill Gap Detection",
      description: "Compare your current skills with industry requirements to identify what's missing.",
      color: "from-blue-500/20 to-indigo-500/20",
      link: "/analyze/resume"
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: "Personalized Roadmap",
      description: "Get actionable, step-by-step learning paths tailored to your dream job.",
      color: "from-emerald-500/20 to-teal-500/20",
      link: "/analyze/resume"
    },
    {
      icon: <Code className="w-6 h-6 text-purple-400" />,
      title: "Smart Project Ideas",
      description: "AI-generated project recommendations to build the exact skills you lack.",
      color: "from-purple-500/20 to-fuchsia-500/20",
      link: "/analyze/github"
    },
    {
      icon: <LineChart className="w-6 h-6 text-orange-400" />,
      title: "Readiness Score",
      description: "Track your career readiness percentage for specific job titles.",
      color: "from-orange-500/20 to-red-500/20",
      link: "/analyze/github"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10">
      {/* Background Orbs */}
      <div className="blob bg-brand-600/30 w-[40rem] h-[40rem] top-[-10rem] left-[-10rem]"></div>
      <div className="blob bg-purple-600/20 w-[35rem] h-[35rem] bottom-[-5rem] right-[-10rem]" style={{ animationDelay: '2s' }}></div>
      <div className="blob bg-emerald-500/10 w-[25rem] h-[25rem] top-[40%] left-[20%]" style={{ animationDelay: '4s' }}></div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl text-center space-y-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-brand-100 mb-4">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Your AI Career Mentor</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-400 pb-2">
          Bridge the Gap Between <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text animate-gradient bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400">Skills and Success</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Upload your resume or GitHub profile, and let our AI analyze your skills, identify gaps, and generate a personalized roadmap to your dream role.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/analyze/resume">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
            >
              <Upload className="w-5 h-5" />
              Analyze Resume
            </motion.button>
          </Link>
          
          <Link href="/analyze/github">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <GitBranch className="w-5 h-5" />
              Analyze GitHub
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 z-10"
      >
        {features.map((feature, index) => (
          <Link href={feature.link} key={index}>
            <motion.div 
              variants={itemVariants}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative p-6 rounded-2xl glass-card border border-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300 h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out`} />
              <div className="relative z-10 flex flex-col h-full gap-4">
                <div className="p-3 rounded-xl bg-white/5 w-fit border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
                <div className="pt-4 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                  Try it out
                  <motion.div
                    animate={{ x: hoveredCard === index ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
