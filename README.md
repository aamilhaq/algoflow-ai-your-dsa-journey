# ⚡ AlgoFlow AI

> **Day 1 of #ProjectGetHired** — Gamified DSA learning platform with interactive skill roadmap, AI coding tutor, instant demo profile, automated code analysis & real-time analytics.
> *(Duolingo × LeetCode × AI Tutor)*

---

## ✨ Features

- 🗺️ **Interactive DSA Roadmap**: A structured skill path covering Arrays, Two Pointers, Trees, Dynamic Programming, Graphs, and more, complete with unlocks and progress tracking.
- 🤖 **AI-Powered DSA Tutor**: Ask for step-by-step hints, conceptual explanations, time/space complexity breakdowns, and similar problem suggestions.
- 💻 **Explain My Code**: Paste any code snippet to diagnose edge cases, identify hidden bugs, understand complexity, and receive performance optimizations.
- 🏆 **Gamification & Progression**: Earn XP, build daily coding streaks, unlock achievements, level up, and climb the global leaderboard.
- ⚡ **Instant Demo Access**: Pre-filled demo profile (`demo@algoflow.ai`) with 10+ completed submissions, Level 8 stats, 14-day streak, and unlocked achievements for instant exploration.
- 📊 **Deep Analytics & Revision**: Comprehensive activity heatmaps, weak area diagnostics, acceptance rate tracking, and spaced-repetition revision reminders (1, 3, 7, and 30-day intervals).
- 🎨 **Modern Responsive UI**: Built with Tailwind CSS v4, Radix UI primitives, Framer Motion animations, and seamless dark/light mode toggling.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) (Full-stack SSR framework powered by TanStack Router & Vite)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query) (React Query v5)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth, PostgreSQL Database, Row-Level Security)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [Recharts](https://recharts.org/), [Lucide Icons](https://lucide.dev/)
- **Bundler & Build Tool**: [Vite 8](https://vitejs.dev/) + [Nitro](https://nitro.unjs.io/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher (v24.x recommended)
- **npm** v10+ or **Bun**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aamilhaq/algoflow-ai-your-dsa-journey.git
   cd algoflow-ai-your-dsa-journey
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (or update existing `.env`):
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:8080](http://localhost:8080).

---

## 📁 Project Structure

```text
algoflow-ai-your-dsa-journey/
├── src/
│   ├── components/         # Reusable UI components (Radix UI, charts, badges, sidebar)
│   ├── integrations/       # Supabase client & generated database types
│   ├── lib/                # Helper utilities (cn, formatting, constants)
│   └── routes/             # TanStack Start file-based routing
│       ├── __root.tsx      # Root app shell
│       ├── index.tsx       # Landing page
│       ├── auth.tsx        # Authentication page (Login / Sign-up / Demo Access)
│       └── _authenticated/ # Protected application routes
│           ├── dashboard.tsx    # User main dashboard & quick stats
│           ├── roadmap.tsx      # Interactive skill roadmap
│           ├── problems.$slug.tsx # DSA problem solver
│           ├── tutor.tsx        # AI DSA Tutor interface
│           ├── explain.tsx      # Code analysis & explanation tool
│           ├── achievements.tsx # Badges, levels & leaderboards
│           ├── analytics.tsx    # Heatmaps & weak area insights
│           └── profile.tsx      # User profile & settings
├── supabase/               # Database migrations & configuration
├── package.json            # Project metadata & dependency list
└── vite.config.ts          # Vite & TanStack Start configuration
```

---

## 📜 Available Scripts

- **`npm run dev`**: Starts the Vite local development server.
- **`npm run build`**: Compiles production bundles via Vite & Nitro.
- **`npm run preview`**: Previews the production build locally.
- **`npm run lint`**: Runs ESLint to check for code quality and syntax issues.
- **`npm run format`**: Formats all codebase files using Prettier.

---

## 📄 License

This project is licensed under the MIT License.
