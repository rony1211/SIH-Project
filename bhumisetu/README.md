# BhumiSetu (भूमि-सेतु)
**Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support**

BhumiSetu is a unified digital platform developed for the Ministry of Rural Development (SIH26016) to streamline land acquisition across India. It provides real-time monitoring, transparent compensation disbursement, and Rehabilitation & Resettlement (R&R) tracking.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@theme` directives in `globals.css`)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (with `persist` middleware for themes/settings)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Localization**: `next-intl` (Support for 22 Indian Languages)

## 📁 Project Structure

```
bhumisetu/
├── app/                  # Next.js App Router pages (Dashboard, Projects, etc.)
├── components/           # Reusable UI components and Dashboard charts
│   ├── dashboard/        # Stats cards, Live charts, Timeline
│   ├── layout/           # Navbar, Sidebar, Page Layouts
│   └── providers/        # Theme & Locale Providers
├── lib/                  # Zustand store (store.ts), utils, etc.
├── docs/                 # Documentation (Architecture, Problem Statement)
└── .agents/              # AI Agent Guidelines & Rules (Do not delete)
```

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤖 Collaborative AI Development

This project uses Antigravity Agent configurations to ensure that multiple developers (and their AI assistants) can collaborate seamlessly.
When AI agents work on this repository, they automatically read the guidelines in `.agents/rules/agent_guidelines.md`.

**To Developers**: Please ensure you pull the latest changes before starting your work.
**To AI Agents**: Always document your major changes in `CHANGELOG.md` so the next agent has full context on what was updated.
