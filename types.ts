import { Type } from "@google/genai";

export enum ReviewCategory {
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  LOGIC = 'LOGIC',
  STYLE = 'STYLE',
  BEST_PRACTICE = 'BEST_PRACTICE'
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  INFO = 'INFO'
}

export interface ReviewComment {
  category: ReviewCategory;
  severity: Severity;
  file: string;
  lineNumber: string;
  description: string;
  suggestion: string;
  codeSnippet?: string;
}

export interface ReviewSummary {
  summary: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  filesAnalyzedCount: number;
  totalIssues: number;
  qualityScore: number; // 0 to 100
  comments: ReviewComment[];
}

export interface PRDetails {
  owner: string;
  repo: string;
  pullNumber: number;
  title?: string;
  description?: string;
  diffUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  FETCHING_DIFF = 'FETCHING_DIFF',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

// Gemini Schema Definition for response
export const ReviewSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A high-level executive summary of the changes." },
    riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"], description: "The overall risk level of merging this PR." },
    filesAnalyzedCount: { type: Type.INTEGER, description: "Number of files identified in the diff." },
    totalIssues: { type: Type.INTEGER, description: "Total count of issues found." },
    qualityScore: { type: Type.INTEGER, description: "A score from 0-100 indicating code quality." },
    comments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: Object.values(ReviewCategory) },
          severity: { type: Type.STRING, enum: Object.values(Severity) },
          file: { type: Type.STRING, description: "The filename related to the comment." },
          lineNumber: { type: Type.STRING, description: "The approximate line number or range." },
          description: { type: Type.STRING, description: "The issue description." },
          suggestion: { type: Type.STRING, description: "Actionable fix or advice." },
          codeSnippet: { type: Type.STRING, description: "A small snippet of the problematic code if applicable." }
        },
        required: ["category", "severity", "file", "description", "suggestion"]
      }
    }
  },
  required: ["summary", "riskLevel", "filesAnalyzedCount", "totalIssues", "qualityScore", "comments"]
};