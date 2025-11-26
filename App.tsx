import React, { useState } from 'react';
import { AppStatus, ReviewSummary } from './types';
import { analyzeDiff } from './services/geminiService';
import { fetchPRDiff, parseGitHubUrl } from './services/githubService';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { LoadingState } from './components/LoadingState';
import { Icons } from './components/ui/Icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [reviewData, setReviewData] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: { type: 'URL' | 'TEXT', content: string, token?: string }) => {
    setError(null);
    setStatus(AppStatus.FETCHING_DIFF);
    
    try {
      let diffContent = data.content;

      if (data.type === 'URL') {
        const params = parseGitHubUrl(data.content);
        if (!params) throw new Error("Invalid GitHub URL format");
        diffContent = await fetchPRDiff(params.owner, params.repo, params.pullNumber, data.token);
      }

      setStatus(AppStatus.ANALYZING);
      
      // Perform AI Analysis
      const result = await analyzeDiff(diffContent);
      
      setReviewData(result);
      setStatus(AppStatus.COMPLETE);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setReviewData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans text-gray-200 selection:bg-brand-yellow/30 selection:text-white pb-20">
      
      {/* Navbar - Glassmorphism */}
      <header className="border-b border-glass-border bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                <Icons.PR className="text-black w-5 h-5" />
             </div>
             <div>
                <h1 className="text-white font-bold tracking-tight text-lg">CodeGuard AI</h1>
                <span className="text-[10px] uppercase tracking-wider text-brand-yellow font-bold bg-brand-yellow/10 px-1.5 py-0.5 rounded border border-brand-yellow/20">Beta</span>
             </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <Icons.Github className="w-5 h-5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        
        {status === AppStatus.IDLE && (
          <div className="animate-fade-in">
            <div className="text-center mb-16 mt-8">
              <div className="inline-block mb-4 px-3 py-1 rounded-full border border-glass-border bg-glass-surface backdrop-blur-md">
                 <span className="text-xs font-mono text-brand-yellow">AI-POWERED CODE REVIEW</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Automated <span className="text-brand-yellow relative inline-block">
                  Intelligent
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-yellow opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                     <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span> <br/>
                Code Reviews
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Deploy a multi-agent system to analyze Pull Requests for security, logic, and performance issues. Powered by Gemini 2.5.
              </p>
            </div>
            
            <InputSection onAnalyze={handleAnalyze} isLoading={false} />
            
            {/* Features Grid - Glass Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
              <div className="glass-card p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1">
                 <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors border border-red-500/20">
                    <Icons.Security className="w-6 h-6 text-red-500" />
                 </div>
                 <h3 className="text-white text-xl font-bold mb-3">Security Audit</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Detects injection attacks, exposed secrets, and weak authentication patterns before they merge.
                 </p>
              </div>

              <div className="glass-card p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1">
                 <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center mb-6 group-hover:bg-brand-yellow/20 transition-colors border border-brand-yellow/20">
                    <Icons.Performance className="w-6 h-6 text-brand-yellow" />
                 </div>
                 <h3 className="text-white text-xl font-bold mb-3">Performance Check</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Identifies inefficient loops, N+1 queries, and memory leaks to keep your application fast and scalable.
                 </p>
              </div>

              <div className="glass-card p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1">
                 <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                    <Icons.Style className="w-6 h-6 text-blue-400" />
                 </div>
                 <h3 className="text-white text-xl font-bold mb-3">Clean Code</h3>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Enforces SOLID principles, DRY patterns, and consistency for a healthier, maintainable codebase.
                 </p>
              </div>
            </div>
          </div>
        )}

        {(status === AppStatus.FETCHING_DIFF || status === AppStatus.ANALYZING) && (
          <LoadingState />
        )}

        {status === AppStatus.ERROR && (
           <div className="max-w-xl mx-auto mt-20 text-center animate-fade-in glass-card p-10 rounded-2xl">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <Icons.Error className="w-10 h-10 text-red-500" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">Analysis Failed</h3>
             <p className="text-gray-400 mb-8">{error}</p>
             <button 
                onClick={handleReset}
                className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
             >
                Try Again
             </button>
           </div>
        )}

        {status === AppStatus.COMPLETE && reviewData && (
          <Dashboard summary={reviewData} onReset={handleReset} />
        )}

      </main>
      
      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-yellow/20 to-transparent"></div>
    </div>
  );
};

export default App;