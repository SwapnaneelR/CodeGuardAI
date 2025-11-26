# CodeGuard AI: Automated PR Reviewer

CodeGuard AI is an automated Pull Request review system powered by the Google Gemini 2.5 Flash model. It analyzes code changes from GitHub PRs or raw diffs to identify security vulnerabilities, logic errors, performance bottlenecks, and style issues.

## Features

- **GitHub Integration**: Fetch PR diffs directly via GitHub URL.
- **Manual Analysis**: Support for pasting raw git diffs.
- **Multi-Agent Simulation**: Simulates specific roles (Security, Performance, Logic) to analyze code.
- **Structured Reporting**: Generates categorized, actionable feedback with severity levels.
- **Glassmorphism UI**: Modern, responsive interface using Tailwind CSS.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **AI/LLM**: Google Gemini API (@google/genai)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Setup and Usage

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your Google Gemini API Key. Ensure `process.env.API_KEY` is available in your environment configuration.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser.
2. Enter a public GitHub Pull Request URL or paste the output of `git diff`.
3. Click "Review Pull Request" to start the analysis.
4. View the generated report containing risk levels, quality scores, and specific code comments.

## License

MIT