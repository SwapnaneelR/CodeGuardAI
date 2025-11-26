export const fetchPRDiff = async (owner: string, repo: string, pullNumber: number, token?: string): Promise<string> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3.diff',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Pull Request not found. Please check the URL or repo visibility.");
    }
    if (response.status === 403 || response.status === 401) {
      throw new Error("Access denied. If this is a private repo, please provide a Personal Access Token.");
    }
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  const diffText = await response.text();
  return diffText;
};

export const parseGitHubUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    // Expected format: /owner/repo/pull/number
    if (pathParts.length >= 4 && pathParts[2] === 'pull') {
      return {
        owner: pathParts[0],
        repo: pathParts[1],
        pullNumber: parseInt(pathParts[3], 10)
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};