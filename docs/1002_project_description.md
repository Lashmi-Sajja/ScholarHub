# ScholarHub – Project Description

ScholarHub is an AI-powered student platform that helps learners plan, learn, track progress, and discover opportunities through a single personalized dashboard.

## Problem

Students struggle to organize academic tasks, deadlines, and study schedules. Educational opportunities (hackathons, internships, scholarships, competitions) are scattered across multiple websites. Students lack a centralized record of learning activities and progress.

## Features

- **AI Study Planner** – Generates customized study schedules based on subjects, deadlines, and available time.
- **AI Academic Assistant** – Provides explanations for academic concepts and questions.
- **Personalized Dashboard** – Overview of upcoming tasks, recent AI interactions, and activity summary.
- **Opportunity Discovery** – Aggregates hackathons, internships, scholarships, and competitions.
- **Activity History** – Stores past study plans, AI conversations, and saved opportunities.

## Target Users

College/university students, online learners, competitive exam aspirants, and students seeking internships, scholarships, and extracurricular opportunities.

## Technology Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Atlas free tier)

### APIs (All Free)
- **Google Gemini API** – AI-powered study planning and academic Q&A (free tier: 60 requests/minute).
- **Manual curation + free public feeds** – For hackathons, internships, and scholarships.

### Authentication
- JWT

## Technical Architecture

### Component Tree (Frontend)

```
App
├── AuthPage (Login / Register)
└── AuthenticatedLayout
    ├── Sidebar (nav + user menu)
    ├── DashboardPage
    │   ├── UpcomingTasksCard
    │   ├── RecentActivityFeed
    │   └── StatsSummary
    ├── StudyPlannerPage
    │   ├── PlanForm (subjects, deadlines, hours)
    │   ├── PlanView (generated schedule)
    │   └── PlanHistoryList
    ├── AIAssistantPage (chat interface)
    ├── OpportunitiesPage
    │   ├── OpportunityList
    │   └── BookmarkedList
    └── ProfilePage
```

### API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/plans` | Generate study plan |
| GET | `/api/plans` | List user's plans |
| GET | `/api/plans/:id` | Get plan with tasks |
| PATCH | `/api/plans/:id/tasks/:taskId` | Mark task complete |
| POST | `/api/assistant/ask` | Ask AI a question |
| GET | `/api/assistant/history` | Past AI conversations |
| GET | `/api/opportunities` | List opportunities |
| POST | `/api/opportunities/:id/bookmark` | Bookmark opportunity |
| DELETE | `/api/opportunities/:id/bookmark` | Remove bookmark |
| GET | `/api/dashboard` | Aggregated dashboard data |

### Data Models

```
User {
  _id: ObjectId
  name: String
  email: String (unique, indexed)
  passwordHash: String
  createdAt: Date
}

StudyPlan {
  _id: ObjectId
  userId: ObjectId (indexed, ref: User)
  title: String
  subjects: [{ name: String, deadline: Date }]
  availableHoursPerDay: Number
  tasks: [{
    day: Number (1-7)
    subject: String
    description: String
    duration: Number (minutes)
    completed: Boolean (default: false)
  }]
  generatedAt: Date
}

Conversation {
  _id: ObjectId
  userId: ObjectId (indexed, ref: User)
  messages: [{ role: String (user/assistant), content: String, timestamp: Date }]
  createdAt: Date
}

Opportunity {
  _id: ObjectId
  title: String
  type: String (hackathon / internship / scholarship / competition)
  description: String
  url: String
  deadline: Date
  bookmarkedBy: [ObjectId] (ref: User)
  createdAt: Date
}
```

### State Management
- **React Context** for auth state (user, JWT token).
- **TanStack Query** for server state (plans, conversations, opportunities, dashboard).

### Deployment
- **Frontend:** Vercel (free tier)
- **Backend:** Render (free tier)
- **Database:** MongoDB Atlas (free 512MB tier)
