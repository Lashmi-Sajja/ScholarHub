# ScholarHub – Todo

## Setup
- [ ] Initialize React project with Vite
- [ ] Initialize Express project with TypeScript
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure Tailwind CSS
- [ ] Set up ESLint and Prettier
- [ ] Configure GitHub Actions CI/CD (lint → test → build → deploy)

## Auth
- [ ] Create User model and schema
- [ ] Build register endpoint (`POST /api/auth/register`)
- [ ] Build login endpoint (`POST /api/auth/login`)
- [ ] Implement JWT middleware
- [ ] Build frontend login/register forms
- [ ] Implement auth state management (React Context)

## AI Study Planner
- [ ] Build plan form UI (subjects, deadlines, hours)
- [ ] Integrate Google Gemini API for plan generation
- [ ] Build `POST /api/plans` endpoint
- [ ] Build `GET /api/plans` and `GET /api/plans/:id` endpoints
- [ ] Build `PATCH /api/plans/:id/tasks/:taskId` endpoint
- [ ] Build plan view UI (generated schedule display)
- [ ] Add plan history list UI
- [ ] Add delete plan functionality

## Dashboard
- [ ] Build `GET /api/dashboard` endpoint
- [ ] Build upcoming tasks card
- [ ] Build recent activity feed
- [ ] Build stats summary (plans created, tasks completed)

## AI Academic Assistant
- [ ] Build chat interface UI
- [ ] Integrate Google Gemini API for Q&A
- [ ] Build `POST /api/assistant/ask` endpoint
- [ ] Build `GET /api/assistant/history` endpoint
- [ ] Store conversation history

## Opportunity Discovery
- [ ] Create Opportunity model and schema
- [ ] Build `GET /api/opportunities` endpoint
- [ ] Build bookmark/unbookmark endpoints
- [ ] Build opportunity list UI with filtering
- [ ] Build bookmarked list UI
- [ ] Set up manual curation workflow for adding opportunities

## Profile
- [ ] Build profile page UI
- [ ] Add profile update endpoint

## Polish
- [ ] Mobile responsiveness pass
- [ ] Error handling (frontend and backend)
- [ ] Loading states for all API calls
- [ ] Form validation (frontend and backend)
- [ ] Accessibility audit
