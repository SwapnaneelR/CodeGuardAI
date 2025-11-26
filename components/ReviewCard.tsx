import React, { useState } from 'react';
import { ReviewComment, ReviewCategory, Severity } from '../types';
import { Icons } from './ui/Icons';
import ReactMarkdown from 'react-markdown';

interface ReviewCardProps {
  comment: ReviewComment;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const colors = {
    [Severity.CRITICAL]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [Severity.MAJOR]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    [Severity.MINOR]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [Severity.INFO]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full border ${colors[severity]} font-bold tracking-wider uppercase`}>
      {severity}
    </span>
  );
};

const CategoryIcon: React.FC<{ category: ReviewCategory }> = ({ category }) => {
  switch (category) {
    case ReviewCategory.SECURITY: return <Icons.Security className="w-5 h-5 text-red-400" />;
    case ReviewCategory.PERFORMANCE: return <Icons.Performance className="w-5 h-5 text-brand-yellow" />;
    case ReviewCategory.LOGIC: return <Icons.Logic className="w-5 h-5 text-orange-400" />;
    case ReviewCategory.STYLE: return <Icons.Style className="w-5 h-5 text-blue-400" />;
    default: return <Icons.Activity className="w-5 h-5 text-gray-400" />;
  }
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ comment }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all hover:border-white/20 group">
      <div 
        className="p-5 flex items-start justify-between cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-black/40 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
            <CategoryIcon category={comment.category} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-sm text-gray-200 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {comment.file}
              </span>
              <span className="text-xs text-gray-500">
                Line {comment.lineNumber}
              </span>
              <SeverityBadge severity={comment.severity} />
            </div>
            <h4 className="text-base font-medium text-white/90 leading-snug">{comment.description}</h4>
          </div>
        </div>
        <button className="text-gray-600 hover:text-white transition-colors bg-transparent p-1 rounded-md hover:bg-white/5">
          {isExpanded ? <Icons.Up className="w-5 h-5" /> : <Icons.Down className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-glass-border bg-black/20">
          <div className="prose prose-invert prose-sm max-w-none text-gray-400">
            <div className="mb-4">
                <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold mb-2 block flex items-center gap-2">
                    <Icons.Success className="w-3 h-3" />
                    Recommended Action
                </span>
                <div className="bg-green-500/5 border-l-2 border-green-500/50 pl-4 py-3 rounded-r-lg">
                    <ReactMarkdown>{comment.suggestion}</ReactMarkdown>
                </div>
            </div>
            
            {comment.codeSnippet && (
              <div className="mt-4">
                 <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Context</span>
                <pre className="bg-[#050505] p-4 rounded-lg overflow-x-auto text-xs font-mono border border-white/10 shadow-inner">
                  <code className="text-gray-300">{comment.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};