import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-473c2504`;

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error('API Request Error:', {
      endpoint,
      url,
      error: error.message
    });
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch' || !error.message) {
      throw new Error('Cannot connect to server. The backend may not be deployed yet.');
    }
    
    throw error;
  }
}

// ===== GAME PROGRESS API =====

export async function saveProgress(
  username: string,
  completedLevels: Record<number, { completed: boolean; stars: number }>,
  unlockedLevel: number
) {
  return apiRequest('/progress/save', {
    method: 'POST',
    body: JSON.stringify({ username, completedLevels, unlockedLevel }),
  });
}

export async function getProgress(username: string) {
  return apiRequest(`/progress?username=${encodeURIComponent(username)}`, {
    method: 'GET',
  });
}

// ===== LEADERBOARD API =====

export async function saveScore(
  username: string,
  profilePic: number,
  level: number,
  stars: number,
  moves: number,
  time: number
) {
  return apiRequest('/leaderboard/score', {
    method: 'POST',
    body: JSON.stringify({ username, profilePic, level, stars, moves, time }),
  });
}

export async function getLeaderboard(level?: number) {
  const endpoint = level ? `/leaderboard?level=${level}` : '/leaderboard';
  return apiRequest(endpoint, {
    method: 'GET',
  });
}

export async function getUserStats(username: string) {
  return apiRequest(`/leaderboard/stats?username=${encodeURIComponent(username)}`, {
    method: 'GET',
  });
}