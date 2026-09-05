# Changelog

All notable changes to the **BhumiSetu** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
*AI Agents: Please document your work here before making your final commits.*

### Added
- `.agents/rules/agent_guidelines.md` to ensure AI agents follow tech constraints and maintain this changelog.
- `README.md` for project overview and startup instructions.
- Fully live, animated data feeds across all Dashboard components (AcquisitionChart, CompensationTracker, RecentActivity, StateTable, StatsCard).
- Cinematic 3D live dashboard preview on the Landing page (`app/page.tsx`).
- Responsive side navigation and dark/light mode integration using Zustand and Tailwind v4 `@theme`.

### Fixed
- Fixed legend coloring bug in `AcquisitionChart` to correctly reflect the "Acquired" bar color.
- Corrected Timeline Adherence chart to update the most recent data point dynamically.
- Ensured Zustand theme changes persist across page reloads via local storage.

### Changed
- Replaced hardcoded Tailwind colors with dynamic theme variables (`text-heading`, `bg-card`, etc.) to support both Light and Dark modes.
