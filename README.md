# ScholarHub

ScholarHub is an AI-powered student platform that helps learners plan, learn, track progress, and discover opportunities through a single personalized dashboard.

## Features

### Authentication
- User registration and login
- JWT-based session management
- Protected routes with auth middleware

### Dashboard
- Overview stats: upcoming tasks, plans created, tasks completed
- Recent study plans list

### AI Study Planner
- Generate personalized 7-day study plans via AI (OpenRouter / Gemini)
- Add multiple subjects with deadlines
- Set available hours per day
- View plan details with day-by-day tasks
- Toggle task completion
- Delete plans

### AI Academic Assistant
- Ask questions about your studies
- AI-powered responses via OpenRouter
- Conversation history across sessions

### Opportunities (Quests)
- Browse hackathons, internships, scholarships, and competitions
- Color-coded cards by type
- Bookmark/unbookmark opportunities

### Profile
- Player profile with avatar initial
- Name, email, online status
- Level indicator

### UI Theme
- Retro game aesthetic with pixel fonts (Press Start 2P, VT323)
- Neon color palette (cyan, magenta, green, yellow)
- CRT-inspired glow effects

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- TanStack React Query v5

### Backend
- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

### AI
- OpenRouter API (Gemini 2.5 Flash model)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI
- OpenRouter API key

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Lashmi-Sajja/ScholarHub.git
   cd ScholarHub
   ```

2. Backend:
   ```bash
   cd server
   cp .env.example .env   # or copy your existing .env
   npm install
   npm run dev
   ```

3. Frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Environment Variables (server/.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/scholarhub
JWT_SECRET=<your-secret>
OPENROUTER_API_KEY=<your-openrouter-key>
```

## Possible Future Features

- Study progress charts and analytics
- Email notifications for deadlines
- Google Calendar sync
- Collaborative study groups
- Spaced repetition flashcards
- Resource library (links, documents, notes)
- Pomodoro timer integration
- Dark/light theme toggle (beyond retro)
- Social login (Google, GitHub)
- Mobile responsive refinements
- Offline support (PWA)
- Export study plans as PDF
- Automated opportunity scraping
- Rate limiting and request caching
