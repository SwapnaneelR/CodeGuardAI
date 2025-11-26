import { GoogleGenAI } from "@google/genai";
import { ReviewSchema, ReviewSummary } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeDiff = async (diffContent: string): Promise<ReviewSummary> => {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please ensure process.env.API_KEY is set.");
  }

  // Sanity check for empty diff
  if (!diffContent || diffContent.trim().length === 0) {
    throw new Error("The provided diff is empty.");
  }

  // Truncate extremely large diffs to prevent token overflow (though Gemini Flash handles a lot)
  // 1 token ~= 4 chars. 1M tokens ~= 4MB. Safe limit.
  const MAX_CHARS = 500000;
  const processedDiff = diffContent.length > MAX_CHARS 
    ? diffContent.substring(0, MAX_CHARS) + "\n...[Diff Truncated]..." 
    : diffContent;

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const systemInstruction = `
    You are CodeGuard AI, an elite automated Code Review Agent.
    Your goal is to act as a strict but helpful Senior Staff Engineer reviewing a Pull Request.
    
    You must analyze the provided Git Diff and look for:
    1. **Security Vulnerabilities** (Injection, XSS, exposed secrets, auth issues).
    2. **Logic Bugs** (Race conditions, off-by-one, null pointer exceptions, infinite loops).
    3. **Performance Bottlenecks** (N+1 queries, expensive loops, memory leaks).
    4. **Code Style & Best Practices** (Clean code, DRY, SOLID principles, variable naming).
    
    Be concise, specific, and actionable. Do not nitpick on minor whitespace unless it affects readability significantly.
    Focus on "Blocking" issues first.
  `;

  const prompt = `
    Please review the following git diff content:
    
    \`\`\`diff
    ${processedDiff}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ReviewSchema,
        temperature: 0.2, // Low temperature for factual analysis
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Received empty response from Gemini.");
    }

    const data = JSON.parse(jsonText) as ReviewSummary;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze the code. Please try again or check the diff format.");
  }
};