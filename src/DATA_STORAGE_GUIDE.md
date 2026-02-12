# BrainFlip - Data Storage & Access Guide

Now that your project is integrated with GitHub, here's everything you need to know about how data is stored and how to access it.

---

## 🗂️ Data Storage Overview

BrainFlip uses **two storage systems**:

1. **Local Storage (Browser)** - Temporary, device-specific
2. **Supabase Backend (Cloud)** - Persistent, cross-device

---

## 1️⃣ Local Storage (Browser)

### What's Stored:
```javascript
localStorage.setItem('username', 'Player');           // Player's display name
localStorage.setItem('profilePic', '1');              // Profile picture (1-6)
localStorage.setItem('soundEnabled', 'true');         // Sound on/off
localStorage.setItem('volume', '1');                  // Volume level (0-1)
localStorage.setItem('completedLevels', '{...}');     // Completed levels with stars
localStorage.setItem('unlockedLevel', '1');           // Highest unlocked level
```

### How to Access:

#### Option 1: Browser DevTools Console
1. Open your game in browser
2. Press **F12** (or Right-click → Inspect)
3. Go to **Console** tab
4. Type these commands:

```javascript
// View all stored data
console.log('Username:', localStorage.getItem('username'));
console.log('Profile Pic:', localStorage.getItem('profilePic'));
console.log('Completed Levels:', JSON.parse(localStorage.getItem('completedLevels')));
console.log('Unlocked Level:', localStorage.getItem('unlockedLevel'));
console.log('Sound Enabled:', localStorage.getItem('soundEnabled'));
console.log('Volume:', localStorage.getItem('volume'));
```

#### Option 2: Application Tab
1. Press **F12** → Go to **Application** tab
2. In the left sidebar: **Storage** → **Local Storage**
3. Click on your site URL (e.g., `http://localhost:5173`)
4. You'll see all key-value pairs visually

#### Example Data:
```json
{
  "username": "Player",
  "profilePic": "1",
  "soundEnabled": "true",
  "volume": "1",
  "completedLevels": {
    "1": { "completed": true, "stars": 3 },
    "2": { "completed": true, "stars": 2 }
  },
  "unlockedLevel": "3"
}
```

### Limitations:
- ⚠️ **Device-specific** - Data doesn't sync between devices
- ⚠️ **Browser-specific** - Chrome data ≠ Firefox data
- ⚠️ **Temporary** - Clearing browser cache deletes it
- ⚠️ **Not secure** - Anyone with browser access can view/edit

---

## 2️⃣ Supabase Backend (Cloud Database)

### What's Stored:

#### Key-Value Store Table: `kv_store_473c2504`

The backend uses a flexible key-value database that stores:

| Key Pattern | Value | Description |
|-------------|-------|-------------|
| `user:{username}:progress` | `{ completedLevels, unlockedLevel }` | Player's level progress |
| `user:{username}:settings` | `{ profilePic, soundEnabled, volume }` | Player's settings |
| `leaderboard` | `[{ username, level, score, stars, time, date }]` | Top scores |

#### Example Data Structure:
```json
// Key: "user:Player:progress"
{
  "completedLevels": {
    "1": { "completed": true, "stars": 3 },
    "2": { "completed": true, "stars": 2 }
  },
  "unlockedLevel": 3
}

// Key: "leaderboard"
[
  {
    "username": "Player",
    "level": 5,
    "score": 1200,
    "stars": 3,
    "time": 65,
    "date": "2026-02-12T10:30:00Z"
  }
]
```

---

## 📊 How to Access Your Backend Data

### Option 1: Supabase Dashboard (Web Interface)

1. **Login to Supabase:**
   - Go to https://supabase.com
   - Click **Sign In**
   - Login with your account

2. **Select Your Project:**
   - Click on **BrainFlip** project (or whatever you named it)
   - You'll see your project dashboard

3. **View the Database:**
   - In the left sidebar, click **Table Editor**
   - Select the `kv_store_473c2504` table
   - You'll see all stored data in rows:
     - **key** column: The storage key (e.g., "user:Player:progress")
     - **value** column: JSON data
     - **created_at** / **updated_at**: Timestamps

4. **Search/Filter:**
   - Use the search bar to find specific keys
   - Example: Search for "leaderboard" to see all scores
   - Example: Search for "user:Player" to see a specific player's data

### Option 2: SQL Editor (Advanced)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run queries to analyze data:

```sql
-- View all data
SELECT * FROM kv_store_473c2504;

-- View only leaderboard
SELECT * FROM kv_store_473c2504 WHERE key = 'leaderboard';

-- View a specific player's progress
SELECT * FROM kv_store_473c2504 WHERE key = 'user:Player:progress';

-- View all players (keys starting with 'user:')
SELECT * FROM kv_store_473c2504 WHERE key LIKE 'user:%';

-- Count total players
SELECT COUNT(*) FROM kv_store_473c2504 WHERE key LIKE 'user:%:progress';
```

### Option 3: API Calls (Programmatic Access)

You can access data from your code or tools like Postman:

```javascript
// Get leaderboard
fetch('https://ibaagpbnytaewimmrofm.supabase.co/functions/v1/make-server-473c2504/leaderboard', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
.then(res => res.json())
.then(data => console.log('Leaderboard:', data));
```

### Option 4: Export Data

1. In Supabase Dashboard → **Table Editor**
2. Select the `kv_store_473c2504` table
3. Click the **⋯** (three dots) menu
4. Choose **Export as CSV** or **Export as JSON**
5. Save the file to your computer

---

## 💾 Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│                  PLAYER ACTION                  │
│  (Complete level, change settings, etc.)        │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Local Storage        │
         │   (Instant save)       │
         │   - Browser only       │
         └────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   API Call             │
         │   /utils/api.ts        │
         └────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Supabase Backend     │
         │   Edge Function        │
         │   /supabase/functions/ │
         └────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Database             │
         │   kv_store_473c2504    │
         │   (Persistent)         │
         └────────────────────────┘
```

---

## 📂 GitHub Repository Access

### What's in Your GitHub Repo:

Your GitHub repo contains the **source code**, not the player data:

```
brainflip-game/
├── App.tsx                          # Main app logic
├── components/                      # React components
├── data/                            # Vocabulary data
├── utils/                           # API & helper functions
├── supabase/functions/server/       # Backend code
├── styles/                          # CSS files
├── package.json                     # Dependencies
└── README.md / SETUP.md            # Documentation
```

### How to Access Your GitHub Repo:

1. **Via GitHub Website:**
   - Go to https://github.com/YOUR_USERNAME
   - Click on your repository (e.g., "brainflip-game")
   - Browse files, view commits, edit code online

2. **Clone to Local Machine:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/brainflip-game.git
   cd brainflip-game
   npm install
   npm run dev
   ```

3. **VS Code:**
   - Open VS Code
   - File → Open Folder → Select cloned repo
   - Make changes, commit, and push:
     ```bash
     git add .
     git commit -m "Update game logic"
     git push origin main
     ```

---

## 🔍 Quick Access Cheat Sheet

| What You Want | Where to Go | How to Access |
|---------------|-------------|---------------|
| **View player settings** | Browser DevTools | F12 → Application → Local Storage |
| **View level progress** | Browser DevTools | Console: `localStorage.getItem('completedLevels')` |
| **View leaderboard** | Supabase Dashboard | Table Editor → kv_store_473c2504 → key = "leaderboard" |
| **View all players** | Supabase Dashboard | SQL: `SELECT * FROM kv_store_473c2504 WHERE key LIKE 'user:%'` |
| **Export database** | Supabase Dashboard | Table Editor → ⋯ → Export as CSV/JSON |
| **View source code** | GitHub | https://github.com/YOUR_USERNAME/brainflip-game |
| **Edit code locally** | VS Code | Clone repo → Open in VS Code |
| **Backend logs** | Supabase Dashboard | Edge Functions → Logs |

---

## 🔐 Important Notes

### Current Setup (Shared Backend):
- ✅ All players share the same Supabase database
- ⚠️ Anyone with the code can see the Supabase credentials
- ⚠️ Players can potentially see each other's data
- ⚠️ No password protection (username-based only)

### With Your Own Backend:
- ✅ You control all data
- ✅ You can add authentication
- ✅ You can customize the database
- ✅ Private and secure
- 👉 Follow `OWN_BACKEND_SETUP.md` to set this up

---

## 🧪 Testing Data Access

### Test 1: View Your Local Data
1. Play a few levels
2. Press F12 → Console
3. Run: `console.log(localStorage)`
4. You should see your game data

### Test 2: Check Backend Storage
1. Complete a level
2. Go to Supabase Dashboard → Table Editor
3. Look for key: `user:YourUsername:progress`
4. You should see your completed levels

### Test 3: View Leaderboard
1. Complete a level with a good score
2. Go to Supabase Dashboard
3. Look for key: `leaderboard`
4. Your score should be in the list

---

## 📞 Need Help?

**Can't find your data?**
- Check if you're looking at the right Supabase project
- Verify table name is exactly `kv_store_473c2504`
- Check browser console for API errors

**Data not saving?**
- Open browser console (F12)
- Look for error messages
- Check network tab for failed API calls

**Want to reset all data?**
```javascript
// In browser console
localStorage.clear();
console.log('All local data cleared!');
```

---

## 🎉 Summary

- **Local Storage** = Quick access, browser DevTools (F12)
- **Supabase Database** = Persistent storage, Supabase Dashboard
- **GitHub Repo** = Source code, version control
- **Backend Logs** = Debugging, Supabase Edge Functions

You now have complete visibility into how and where your game data is stored! 🚀
