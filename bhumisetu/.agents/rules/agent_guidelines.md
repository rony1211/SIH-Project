---
trigger: always_on
description: Crucial project guidelines and constraints for BhumiSetu UI and State Management.
---

# BhumiSetu Agent Guidelines

Welcome to the **BhumiSetu** project. You are an AI Agent assisting in the development of this platform. This is a collaborative project, meaning you and other AI agents will be editing these files over time.

To ensure consistency and prevent breaking changes, you **MUST** follow these strict rules:

## 1. Tech Stack Constraints
- **Next.js 14 App Router**: Use server components by default. Use `'use client'` only when utilizing React hooks or interactive animations.
- **Tailwind CSS v4**: We are using Tailwind v4, which uses `@theme` in `globals.css`. 
  - **Do NOT** use hardcoded colors like `white`, `black`, `slate-900`, `gray-100` for text or backgrounds. 
  - **Always** use theme-aware utilities: `text-heading`, `text-body`, `text-muted`, `bg-background`, `bg-card`, etc.
  - Do not use `text-white` or `bg-white` unless the element specifically needs to remain white in both dark and light modes.
- **Zustand**: State management (like theme toggle) uses `zustand` with the `persist` middleware to ensure state survives page reloads.

## 2. Design Aesthetics
- The design must be extremely premium, cinematic, and interactive.
- Use `framer-motion` for smooth layout transitions and hover effects.
- Ensure all charts (Recharts) adapt their colors and tooltips based on the `isDark` boolean from the Zustand store.

## 3. Collaboration Protocol (CRITICAL)
Since you are part of a multi-agent collaboration team:
- **Always update the CHANGELOG.md**: Before finishing your task and committing, you must record what you added, changed, or fixed in `CHANGELOG.md`. This allows the next agent to quickly understand the delta since they last pulled the code.
- **Respect existing code**: Do not rip out existing architectures or styles unless explicitly instructed to do so by the human user.
- **Commit messages**: Use semantic commit messages (e.g., `feat:`, `fix:`, `refactor:`, `docs:`).

By following these guidelines, you ensure that the next AI agent or human developer can smoothly continue the work!
