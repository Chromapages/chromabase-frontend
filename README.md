# ChromaBASE - Modern CRM Frontend

The frontend interface for ChromaBASE, a high-performance CRM built with **Swiss Modernism 2.0** aesthetics.

## Tech Stack
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI / shadcn/ui
- **Icons**: Lucide React
- **Authentication**: Firebase Authentication

## Design Philosophy
- **Swiss Modernism 2.0**: Clean typography (Fira Sans/Fira Code), bold accents (Amber #f59e0b), and advanced glassmorphism.
- **Glassmorphism**: High-trust, professional translucency across dashboards and feeds.
- **Micro-interactions**: Fluid transitions and feedback for a premium fintech feel.

## Getting Started

### Prerequisites
- Node.js 18+
- [ChromaBASE API](https://github.com/Chroma-Team/chromabase) running locally or accessible via URL.

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following (see `.env.example` if available):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   # ... other Firebase config
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **Unified Dashboard**: Integrative view of Accounts, Tasks, and Calendar.
- **Mobile-First Feed**: Swipeable CRM interactions optimized for on-the-go productivity.
- **Real-time Sync**: Bi-directional updates between tasks and scheduling.
- **Premium Reporting**: Analytics with curated color palettes and responsive charts.
