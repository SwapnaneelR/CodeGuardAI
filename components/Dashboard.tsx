import React, { useState } from 'react';
import { ReviewSummary, ReviewCategory, Severity } from '../types';
import { ReviewCard } from './ReviewCard';
import { Icons } from './ui/Icons';

interface DashboardProps {
  summary: ReviewSummary;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ summary, onReset }) => {
  const [filterCategory, setFilterCategory] = useState<ReviewCategory | 'ALL'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');

  const filteredComments = summary.comments.filter(c => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterSeverity !== 'ALL' && c.severity !== filterSeverity) return false;
    return true;
  });

  const getRiskStyles = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-red-500 border-red-500/50 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      case 'MEDIUM': return 'text-orange-500 border-orange-500/50 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.2)]';
      case 'LOW': return 'text-green-500 border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]';
      default: return 'text-gray-500 border-gray-500/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-brand-yellow';
    return 'text-red-400';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Icons.Success className="text-green-500 w-6 h-6" />
            </span>
            Review Complete
          </h1>
          <p className="text-gray-400 ml-1">AI Agent has completed the analysis of {summary.filesAnalyzedCount} files.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-white group"
        >
          <Icons.Search className="w-4 h-4 text-brand-yellow group-hover:scale-110 transition-transform" />
          Review Another
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className={`glass-card p-6 rounded-2xl border flex flex-col justify-between ${getRiskStyles(summary.riskLevel)}`}>
          <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2">Risk Level</div>
          <div className="text-3xl font-bold tracking-tight">{summary.riskLevel}</div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl">
          <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Quality Score</div>
          <div className={`text-3xl font-bold ${getScoreColor(summary.qualityScore)}`}>{summary.qualityScore}<span className="text-lg text-gray-600 font-normal">/100</span></div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Total Issues</div>
          <div className="text-3xl font-bold text-white">{summary.totalIssues}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
           <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Files Analyzed</div>
           <div className="text-3xl font-bold text-white">{summary.filesAnalyzedCount}</div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-10 p-8 glass-card rounded-2xl border-l-4 border-l-brand-yellow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Icons.Activity className="w-5 h-5 text-brand-yellow" />
            Executive Summary
        </h2>
        <p className="text-gray-300 leading-relaxed text-lg">{summary.summary}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 p-2 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-2 px-3">
            <Icons.Terminal className="w-4 h-4 text-brand-yellow" />
            <span className="text-sm font-bold text-white tracking-wide">FILTERS</span>
        </div>
        <div className="h-4 w-px bg-white/10 hidden md:block"></div>
        
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value as any)}
          className="bg-black/40 border border-white/10 text-gray-300 text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-yellow outline-none hover:bg-black/60 transition-colors cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          {Object.values(ReviewCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
           value={filterSeverity} 
           onChange={(e) => setFilterSeverity(e.target.value as any)}
           className="bg-black/40 border border-white/10 text-gray-300 text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-yellow outline-none hover:bg-black/60 transition-colors cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <div className="md:ml-auto px-3 text-xs text-gray-500 font-mono">
            DISPLAYING {filteredComments.length} / {summary.comments.length} ISSUES
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
           <div className="text-center py-20 glass-card rounded-2xl border-dashed border-white/10">
             <Icons.Success className="w-16 h-16 text-green-500/50 mx-auto mb-4" />
             <p className="text-gray-400 text-lg">No issues found matching your filters!</p>
           </div>
        ) : (
          filteredComments.map((comment, index) => (
            <ReviewCard key={index} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};