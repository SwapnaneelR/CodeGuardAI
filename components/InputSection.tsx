import React, { useState } from 'react';
import { Icons } from './ui/Icons';
import { parseGitHubUrl } from '../services/githubService';

interface InputSectionProps {
  onAnalyze: (data: { type: 'URL' | 'TEXT', content: string, token?: string }) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'URL' | 'TEXT'>('URL');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [githubToken, setGithubToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'URL') {
      if (!parseGitHubUrl(url)) {
        alert("Please enter a valid GitHub Pull Request URL.");
        return;
      }
      onAnalyze({ type: 'URL', content: url, token: githubToken });
    } else {
      if (!rawText.trim()) {
        alert("Please paste the diff content.");
        return;
      }
      onAnalyze({ type: 'TEXT', content: rawText });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-2xl overflow-hidden mt-8 shadow-2xl relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-50"></div>

      <div className="flex border-b border-glass-border">
        <button
          onClick={() => setActiveTab('URL')}
          className={`flex-1 py-5 text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
            activeTab === 'URL' 
              ? 'text-brand-yellow bg-white/5 border-b-2 border-brand-yellow' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Icons.Github className="w-4 h-4" />
          GITHUB URL
        </button>
        <button
          onClick={() => setActiveTab('TEXT')}
          className={`flex-1 py-5 text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
            activeTab === 'TEXT' 
              ? 'text-brand-yellow bg-white/5 border-b-2 border-brand-yellow' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Icons.File className="w-4 h-4" />
          PASTE DIFF
        </button>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'URL' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2 ml-1">
                  Pull Request URL
                </label>
                <div className="relative group">
                  <Icons.Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-brand-yellow transition-colors" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo/pull/123"
                    className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                 <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2 ml-1 flex items-center gap-2">
                  GitHub Token <span className="text-[10px] text-gray-600 border border-gray-700 px-1 rounded">OPTIONAL</span>
                </label>
                <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="github_pat_..."
                    className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all"
                  />
              </div>
            </div>
          ) : (
             <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2 ml-1">
                  Raw Diff Content
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste the output of `git diff` here..."
                  className="w-full h-64 px-4 py-3.5 glass-input rounded-xl text-white font-mono text-xs placeholder-gray-600 focus:outline-none transition-all resize-none leading-relaxed"
                />
              </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
              isLoading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-brand-yellow text-black hover:bg-brand-hover shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]'
            }`}
          >
            {isLoading ? (
              <>
                <Icons.Loading className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icons.PR className="w-5 h-5" />
                Review Pull Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};