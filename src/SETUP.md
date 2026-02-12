# BrainFlip - Setup Instructions

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **VS Code**
   - Download from: https://code.visualstudio.com/

4. **Supabase CLI** (for running backend locally)
   - Install: `npm install -g supabase`
   - Verify installation: `supabase --version`

5. **Docker Desktop** (required for Supabase local development)
   - Download from: https://www.docker.com/products/docker-desktop/

---

## Setup Steps

### Step 1: Open Project in VS Code

1. Open VS Code
2. Go to **File** → **Open Folder**
3. Navigate to your BrainFlip project folder and open it

### Step 2: Install Dependencies

Open the integrated terminal in VS Code (**Terminal** → **New Terminal** or `` Ctrl+` ``) and run:

```bash
npm install
```

This will install all required packages including:
- React
- React Router
- Tailwind CSS
- Lucide icons
- Motion (animations)
- Supabase client
- And other dependencies

### Step 3: Set Up Environment Variables

The Supabase credentials are already configured in `/utils/supabase/info.tsx`, so no additional environment setup is needed for the frontend.

### Step 4: Start Supabase Backend (Local Development)

**Option A: Use Hosted Supabase (Recommended for Quick Start)**

The project is already configured to use the hosted Supabase instance. You can skip to Step 5.

**Option B: Run Supabase Locally**

If you want to run the backend locally:

1. Make sure Docker Desktop is running
2. In the terminal, run:
   ```bash
   supabase init
   supabase start
   ```
3. This will start local Supabase services on your machine
4. Note the API URL and anon key provided in the output
5. Update `/utils/supabase/info.tsx` with your local credentials

### Step 5: Start the Development Server

In the terminal, run:

```bash
npm run dev
```

You should see output similar to:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 6: Open the Application

1. Open your web browser
2. Navigate to: **http://localhost:5173/**
3. You should see the BrainFlip landing page!

---

## Deployment (Supabase Functions)

If you need to deploy the backend functions to Supabase:

1. Login to Supabase CLI:
   ```bash
   supabase login
   ```

2. Link your project:
   ```bash
   supabase link --project-ref ibaagpbnytaewimmrofm
   ```

3. Deploy the functions:
   ```bash
   supabase functions deploy server
   ```

---

## Project Structure

```
BrainFlip/
├── App.tsx                          # Main entry point with routing
├── components/                      # React components
│   ├── LandingPage.tsx             # Home screen
│   ├── LevelsScreen.tsx            # Level selection
│   ├── GameScreen.tsx              # Main game logic
│   ├── LeaderboardScreen.tsx       # High scores
│   └── [other components]
├── data/
│   └── vocabulary.ts               # British/American word pairs
├── utils/
│   ├── api.ts                      # Backend API calls
│   ├── levelConfig.ts              # Level configurations
│   └── supabase/info.tsx           # Supabase credentials
├── supabase/functions/server/
│   ├── index.tsx                   # Backend server routes
│   └── kv_store.tsx                # Database utilities
└── styles/
    └── globals.css                 # Global styles

```

---

## Common Issues & Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Run `npm install` again to ensure all dependencies are installed.

### Issue: Port 5173 is already in use
**Solution:** 
- Stop any other Vite/dev servers running
- Or change the port: `npm run dev -- --port 3000`

### Issue: Backend API calls failing (401 errors)
**Solution:** 
- Verify that `/utils/supabase/info.tsx` has the correct credentials
- Check that the Supabase project is running (locally or hosted)

### Issue: Supabase local services won't start
**Solution:**
- Make sure Docker Desktop is running
- Try `supabase stop` then `supabase start`
- Check Docker Desktop for any container errors

### Issue: Cards not flipping or animations not working
**Solution:**
- Clear browser cache and reload
- Check browser console for JavaScript errors

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `supabase start` - Start local Supabase services
- `supabase stop` - Stop local Supabase services
- `supabase functions deploy server` - Deploy backend to Supabase

---

## Game Features

✅ **No Authentication Required** - Jump straight into playing
✅ **Multiple Difficulty Levels** - Easy (6 pairs) to Hard (15 pairs)
✅ **Progressive Unlocking** - Complete levels to unlock new ones
✅ **3D Card Flip Animations** - Smooth, engaging card flips
✅ **Scoring System** - Based on time and number of attempts
✅ **Leaderboard** - Track top scores across all players
✅ **Persistent Progress** - Scores and unlocked levels save automatically
✅ **Custom Username** - Set your display name in settings
✅ **British vs American English** - Learn vocabulary differences

---

## Development Tips

1. **Hot Reload**: The dev server supports hot reload - save any file and see changes instantly
2. **React DevTools**: Install the React Developer Tools browser extension for easier debugging
3. **Console Logging**: Check browser console for errors and API responses
4. **Backend Logs**: If running Supabase locally, check terminal for backend logs

---

## Next Steps

1. Start the dev server with `npm run dev`
2. Open http://localhost:5173/
3. Click **Start Game** on the landing page
4. Play through the tutorial level
5. Set your username in Settings (gear icon)
6. Compete on the leaderboard!

---

## Need Help?

- Check browser console for errors (F12 → Console tab)
- Review this SETUP.md file
- Ensure all prerequisites are installed
- Verify Docker is running (for local Supabase)

Happy coding! 🧠🎮
