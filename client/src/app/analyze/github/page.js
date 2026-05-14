"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, ChevronRight, Loader2, ArrowLeft, Star, GitFork, BookOpen } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function GithubAnalysis() {
  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputError, setInputError] = useState("");

  const extractUsername = (input) => {
    const trimmed = input.trim();
    // Match full GitHub URL patterns like https://github.com/username or github.com/username
    const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)(?:\/.*)?$/);
    if (urlMatch) return urlMatch[1];
    // Otherwise treat as plain username (no slashes or dots)
    if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) return trimmed;
    return null;
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUsernameInput(val);
    setInputError("");
    const extracted = extractUsername(val);
    setUsername(extracted || "");
  };

  const handleAnalyze = async () => {
    const extracted = extractUsername(usernameInput);
    if (!extracted) {
      setInputError("Please enter a valid GitHub username or profile URL.");
      return;
    }
    if (!targetRole) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/api/github/analyze`, {
        username: extracted,
        targetRole
      });
      setResult(response.data);
      setUsername(extracted);
    } catch (error) {
      console.error("Error analyzing github", error);
      setInputError("Failed to analyze GitHub profile. Make sure the username exists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="blob bg-purple-600/20 w-[30rem] h-[30rem] top-0 right-0"></div>
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Analyze GitHub Profile</h1>
          <p className="text-slate-400 text-lg">Paste your GitHub profile URL or enter your username to get AI-powered insights on your portfolio.</p>
        </div>

        {!result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">GitHub Username or Profile URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GitBranch className="h-5 w-5 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    value={usernameInput}
                    onChange={handleInputChange}
                    placeholder="e.g., torvalds or https://github.com/torvalds"
                    className={`w-full bg-white/5 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      inputError ? "border-red-500/60" : "border-white/10"
                    }`}
                  />
                </div>
                {inputError && (
                  <p className="text-red-400 text-xs mt-1">{inputError}</p>
                )}
                {username && !inputError && usernameInput !== username && (
                  <p className="text-emerald-400 text-xs mt-1">Detected username: <span className="font-semibold">@{username}</span></p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Backend Developer, Full Stack Engineer"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!usernameInput || !targetRole || loading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    Analyze GitHub
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <GitBranch className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Portfolio Assessment</h3>
              <p className="text-slate-400 mb-6">We evaluate your public repositories, languages used, and coding activity to measure how closely your portfolio aligns with industry expectations.</p>
              <ul className="text-left w-full space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Detects strengths in code
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Identifies missing practical experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Recommends next projects to build
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
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white/5 border border-white/10 rounded-2xl p-6">
              <img src={result.profile.avatar_url} alt="Profile" className="w-24 h-24 rounded-full border-4 border-purple-500/30" />
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">{result.profile.name || username}</h2>
                <a href={result.profile.html_url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline mb-4 inline-block">
                  @{username}
                </a>
                <p className="text-slate-400">Target Role: <span className="text-white font-medium">{targetRole}</span></p>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center mt-4 md:mt-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-purple-500)" strokeWidth="3" strokeDasharray={`${result.analysis.readinessScore}, 100`} />
                </svg>
                <span className="absolute text-xl font-bold text-white">{result.analysis.readinessScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 border-t-4 border-t-emerald-500">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-400" />
                  Portfolio Strengths
                </h3>
                <ul className="space-y-3">
                  {result.analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border-t-4 border-t-pink-500">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GitFork className="w-5 h-5 text-pink-400" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {result.analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border-t-4 border-t-purple-500">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Recommendations for Next Steps
              </h3>
              <div className="space-y-4">
                {result.analysis.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors text-slate-300">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
            
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
