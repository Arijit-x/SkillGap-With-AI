"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter a target role.");
      return;
    }
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    try {
      const response = await axios.post("http://localhost:5000/api/analyze/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(response.data);
    } catch (err) {
      console.error("Error analyzing resume", err);
      const errorMsg = err.response?.data?.error || "Failed to analyze resume. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="blob bg-brand-600/20 w-[30rem] h-[30rem] top-0 left-0"></div>
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Analyze Your Resume</h1>
          <p className="text-slate-400 text-lg">Upload your resume and tell us your dream role to get a personalized roadmap.</p>
        </div>

        {!result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Frontend Developer, Data Scientist"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Upload Resume (PDF)</label>
                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-brand-500/50 transition-colors bg-white/5 group text-center cursor-pointer">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                      {file ? <FileText className="w-6 h-6 text-brand-400" /> : <Upload className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                      <p className="text-slate-500 text-sm mt-1">PDF files up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-4 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Profile
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>
            
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">How it works</h3>
              <p className="text-slate-400 mb-6">Our AI reads your resume, extracts your skills, and compares them against thousands of job descriptions for your target role.</p>
              <ul className="text-left w-full space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Extracts current skills
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Identifies missing tech stack
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Calculates readiness score
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Career Readiness Score</h2>
                <p className="text-slate-400">Target Role: <span className="text-white font-medium">{targetRole}</span></p>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-brand-500)" strokeWidth="3" strokeDasharray={`${result.readinessScore}, 100`} />
                </svg>
                <span className="absolute text-2xl font-bold text-white">{result.readinessScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Current Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.extractedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 text-slate-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border-l-4 border-l-orange-500">
                <h3 className="text-lg font-semibold text-white mb-4">Missing Skills to Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-orange-500/20 text-orange-200 border border-orange-500/30 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Your Personalized Roadmap</h3>
              <div className="space-y-6">
                {result.roadmap.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {result.projectRecommendations && result.projectRecommendations.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recommended Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.projectRecommendations.map((project, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-brand-500/30 transition-colors">
                      <h4 className="text-lg font-semibold text-brand-300 mb-2">{project.title}</h4>
                      <p className="text-slate-400 text-sm">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setResult(null)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Analyze Another Profile
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
