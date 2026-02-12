import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: false,
  }),
);

// Health check endpoint
app.get("/make-server-473c2504/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== GAME PROGRESS ROUTES (No Auth Required) =====

// Save user's game progress
app.post("/make-server-473c2504/progress/save", async (c) => {
  try {
    const { username, completedLevels, unlockedLevel } = await c.req.json();
    
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    // Save progress to KV store using username as key
    await kv.set(`progress:${username}`, {
      username,
      completedLevels,
      unlockedLevel,
      lastUpdated: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(`Save progress exception: ${error}`);
    return c.json({ error: 'Failed to save progress' }, 500);
  }
});

// Get user's game progress
app.get("/make-server-473c2504/progress", async (c) => {
  try {
    const username = c.req.query('username');
    
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    // Get progress from KV store
    const progress = await kv.get(`progress:${username}`);

    if (!progress) {
      return c.json({ 
        completedLevels: {},
        unlockedLevel: 1
      });
    }

    return c.json({ 
      completedLevels: progress.completedLevels || {},
      unlockedLevel: progress.unlockedLevel || 1
    });
  } catch (error) {
    console.log(`Get progress exception: ${error}`);
    return c.json({ error: 'Failed to get progress' }, 500);
  }
});

// ===== LEADERBOARD ROUTES (No Auth Required) =====

// Save a leaderboard score
app.post("/make-server-473c2504/leaderboard/score", async (c) => {
  try {
    const { username, profilePic, level, stars, moves, time } = await c.req.json();
    
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    // Create score entry
    const scoreEntry = {
      username,
      profilePic: profilePic || 1,
      level,
      stars,
      moves,
      time,
      score: stars * 1000 - time - moves * 5, // Higher stars, lower time/moves = higher score
      timestamp: new Date().toISOString()
    };

    // Save to KV store with composite key for easy retrieval
    const scoreKey = `leaderboard:${level}:${username}:${Date.now()}`;
    await kv.set(scoreKey, scoreEntry);

    // Also save user's best score for this level
    const bestScoreKey = `best_score:${username}:${level}`;
    const existingBest = await kv.get(bestScoreKey);
    
    if (!existingBest || scoreEntry.score > existingBest.score) {
      await kv.set(bestScoreKey, scoreEntry);
    }

    return c.json({ success: true, score: scoreEntry.score });
  } catch (error) {
    console.log(`Save score exception: ${error}`);
    return c.json({ error: 'Failed to save score' }, 500);
  }
});

// Get top scores for a level or globally
app.get("/make-server-473c2504/leaderboard", async (c) => {
  try {
    const level = c.req.query('level');
    
    // Get all leaderboard entries
    const prefix = level ? `leaderboard:${level}:` : 'leaderboard:';
    const allScores = await kv.getByPrefix(prefix);

    if (!allScores || allScores.length === 0) {
      return c.json({ scores: [] });
    }

    // Group by username and keep only best score per user
    const userBestScores = new Map();
    
    for (const score of allScores) {
      const existing = userBestScores.get(score.username);
      if (!existing || score.score > existing.score) {
        userBestScores.set(score.username, score);
      }
    }

    // Convert to array and sort by score (descending)
    const topScores = Array.from(userBestScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 100); // Top 100 scores

    return c.json({ scores: topScores });
  } catch (error) {
    console.log(`Get leaderboard exception: ${error}`);
    return c.json({ error: 'Failed to get leaderboard' }, 500);
  }
});

// Get user's personal stats
app.get("/make-server-473c2504/leaderboard/stats", async (c) => {
  try {
    const username = c.req.query('username');
    
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    // Get all best scores for this user
    const bestScores = await kv.getByPrefix(`best_score:${username}:`);
    
    const stats = {
      totalLevelsCompleted: bestScores.length,
      totalStars: bestScores.reduce((sum, score) => sum + (score.stars || 0), 0),
      bestScores: bestScores.sort((a, b) => b.score - a.score)
    };

    return c.json(stats);
  } catch (error) {
    console.log(`Get stats exception: ${error}`);
    return c.json({ error: 'Failed to get stats' }, 500);
  }
});

Deno.serve(app.fetch);
