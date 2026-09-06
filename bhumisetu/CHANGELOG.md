# Changelog

All notable changes to the **BhumiSetu** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
*AI Agents: Please document your work here before making your final commits.*

### Added
- **Phase 11: Field Verification Module (`app/field/page.tsx`)**:
  - Mock dataset containing 20+ field verification tasks with GPS coordinates and priority (`data/fieldTasks.json`).
  - REST API route (`app/api/field-tasks/route.ts`) for fetching sorted tasks and reconciling offline sync updates.
  - Mobile-optimized sticky `FieldHeader.tsx` displaying live connectivity status and a dynamic Sync button with a pending changes badge.
  - Swipeable, glassmorphic `TaskQueue.tsx` with color-coded priority tags and status indicators.
  - Immersive `TaskDetailModal.tsx` simulating real-world execution with live GPS radar animation and document capture checklist.
  - Premium `SyncProgressOverlay.tsx` providing satisfying visual feedback during data synchronization to the server.
- **Phase 10: Gamified Officer Performance Dashboard (`app/officers/page.tsx`)**:
  - Rich mock dataset with 20 officers across 8 states/districts, XP, levels (Bronze→Diamond), badges, streaks, and monthly trends (`data/officers.json`).
  - Backend API route (`app/api/officers/route.ts`) with state/level/search filtering, sorting, and aggregate stats.
  - KPI Stats Header (`components/officers/OfficerStatsHeader.tsx`) with 5 animated cards: Total Officers, Avg SLA, Cases This Month, Top Performer, Active Streaks.
  - Premium Leaderboard Table (`components/officers/LeaderboardTable.tsx`) with podium-style top-3 highlighting, gradient avatar, XP progress bars, SLA ring gauges, mini sparkline trends, streak flames, and rank change animations.
  - Achievement Badge Showcase (`components/officers/BadgeShowcase.tsx`) with 12 unique badges as glassmorphic cards with glow effects; earned = vivid, locked = greyed with lock overlay and hover tooltip.
  - Performance Trends (`components/officers/PerformanceTrends.tsx`) with Recharts composed chart (area + line), level distribution, and top badge collector leaderboard.
  - Officer Profile Card (`components/officers/OfficerProfileCard.tsx`) expandable modal with SVG radar chart (5 axes), XP progress to next level, key metrics, and full badge showcase.
  - District Heatmap (`components/officers/DistrictHeatmap.tsx`) with performance-colored grid, best/worst district summary, and click-to-filter leaderboard.
  - Tab-based page navigation: Leaderboard | Badges & Achievements | Performance Trends | District Heatmap.
  - Sidebar navigation link with HiOutlineTrophy icon.
  - 5-language localization support (`en`, `hi`, `bn`, `ta`, `te`).
- **Phase 9: Rehabilitation & Resettlement (R&R) Family Entitlement & Resettlement Tracker (`app/rr-tracker/page.tsx`)**:
  - Enriched family dataset with 15+ comprehensive displaced and affected families spanning national highway, railway, irrigation, solar, port, and airport projects (`data/families.json`).
  - Shared in-memory R&R store (`lib/rrStore.ts`) with dynamic entitlement fulfillment and DBT progress recalculation.
  - REST API routes (`app/api/rr/route.ts`, `app/api/rr/[id]/route.ts`) supporting multi-parameter filtering (project, category, vulnerability, compliance status), search, aggregate compliance analytics, and entitlement fulfillment via `POST`.
  - Executive KPI stats overview (`components/rr/RRStatsOverview.tsx`) with animated counters for affected families, housing allotment %, job delivery %, DBT disbursed (₹ Cr), and RFCTLARR Act 2013 statutory compliance gauge.
  - Model Resettlement Colony Civic Amenities Bar (`components/rr/ColonyAmenitiesBar.tsx`) tracking Third Schedule 25 statutory amenities (water, power, roads, school, health clinic).
  - Multi-faceted Filter Bar (`components/rr/RRFilters.tsx`) with search, dropdowns, card/table view toggle, and CSV compliance export.
  - Responsive Glassmorphic Family Card (`components/rr/FamilyCard.tsx`) with 4-pillar statutory entitlement chips (Housing, Job/Grant, Annuity, Shifting), Aadhaar verification badge, and progress bar.
  - Dense Administrative Ledger Table (`components/rr/FamilyTable.tsx`) with sortable columns, DBT status chips, pagination, and direct inspection triggers.
  - Interactive Family Entitlement Dossier Modal (`components/rr/FamilyDetailModal.tsx`) showing demographic census, Second Schedule statutory benefits, banking & DBT verification, Third Schedule colony readiness, and one-click "Release DBT / Fulfill Entitlement" simulation.
  - Complete R&R Tracker command center page (`app/rr-tracker/page.tsx`) integrated with global navbar and sidebar.
- **Phase 8: Citizen Grievance Portal & Statutory SLA Tracker (`app/grievance/page.tsx`)**:
  - Zero-login complaint filing wizard (`components/grievance/ComplaintForm.tsx`) with 3-step animated progression, auto ticket generator, and RFCTLARR statutory rights guidance.
  - Real-time SLA tracking engine (`components/grievance/ComplaintTracker.tsx`) featuring dynamic countdown timer, urgency thresholds, status indicators, and audit trails.
  - Interactive Public Registry & SLA Board (`components/grievance/GrievanceTable.tsx`) with instant search, multi-parameter filtering (Category, Status, Priority, SLA risk), sortable columns, CSV export, and complete lifecycle inspection modal.
  - Chain-of-custody vertical timeline (`components/grievance/GrievanceTimeline.tsx`) mapping lifecycle events from filing to resolution with officer notes and escalation warnings.
  - Post-resolution Citizen Satisfaction Survey (`components/grievance/SatisfactionSurvey.tsx`) with star ratings, smooth hover feedback, and optional review notes.
  - Executive KPI summary bar (`components/grievance/GrievanceStatsBar.tsx`) tracking total complaints, resolution rate, active disputes, SLA escalations, and average resolution time.
  - Shared in-memory data store (`lib/grievancesStore.ts`) & REST APIs (`app/api/grievances/route.ts`, `app/api/grievances/[id]/route.ts`) supporting live submission, filtering, and single-ticket retrieval.
  - Full grievance portal page (`app/grievance/page.tsx`) with tab-based navigation and citizen assurance highlights.
  - 5-language localization support across English, Hindi, Bengali, Tamil, and Telugu.
- **Phase 7: Project Lifecycle & Statutory Timeline Tracker (`app/projects/page.tsx` & `app/projects/[id]/page.tsx`)**:
  - Enriched dataset with 8 mega infrastructure projects and RFCTLARR Act 2013 milestone pipelines (`data/projects.json`).
  - Backend API routes (`app/api/projects/route.ts`, `app/api/projects/[id]/route.ts`) with multi-param filtering and aggregate stats.
  - KPI Stats Header (`components/projects/ProjectStatsHeader.tsx`) with animated counters and land progress bar.
  - Triple-view Filter Bar (`components/projects/ProjectFilters.tsx`) with Grid, Kanban, and Table view switcher.
  - Glassmorphic Project Card (`components/projects/ProjectCard.tsx`) with SVG radial progress gauge, budget meter, milestone steps.
  - Statutory Kanban Board (`components/projects/ProjectKanbanView.tsx`) grouping projects by LARR acquisition phase.
  - Interactive Data Table (`components/projects/ProjectTableView.tsx`) with sortable columns, progress bars, and status badges.
  - RFCTLARR Act 2013 Statutory Timeline (`components/projects/ProjectTimeline.tsx`) with color-coded milestone connector.
  - Full Project Detail View (`components/projects/ProjectDetailView.tsx`) with land/finance/family metrics and statutory audit.
  - Dynamic project detail page (`app/projects/[id]/page.tsx`) with Next.js async params.
  - 5-language localization support (`en`, `hi`, `bn`, `ta`, `te`).
- **Phase 6: Secure Document Repository (`app/documents/page.tsx`)**:
  - Mock dataset with 12 comprehensive documents across 8 categories (`data/documents.json`).
  - Backend API route (`app/api/documents/route.ts`) supporting search, status & category filtering, and stats aggregation.
  - KPI Stat Row (`components/documents/DocumentStatsRow.tsx`) with animated counters and live pulse indicators.
  - Interactive Filter Bar (`components/documents/DocumentFilters.tsx`) with search, category/status filters, and grid/table view toggle.
  - Blockchain Hash Verifier (`components/documents/HashVerifier.tsx`) with SHA-256 verification and chain-link animation.
  - Chain-of-Custody Timeline (`components/documents/AuditTrailTimeline.tsx`) with color-coded event log.
  - Document Card (`components/documents/DocumentCard.tsx`) & Expandable Data Table (`components/documents/DocumentTable.tsx`).
  - Drag-and-Drop Document Upload Modal (`components/documents/DocumentUploadModal.tsx`) with SHA-256 hash generation simulation.
  - 5-language localization support (`en`, `hi`, `bn`, `ta`, `te`).
- Real backend API endpoint (`app/api/parcels/route.ts`) serving GeoJSON-like parcel data.
- Refactored `MapViewer.tsx` to fetch map polygons from the real API rather than using static constants.
- Phase 5: Geospatial Map Viewer (`app/map/page.tsx` & `components/map/MapViewer.tsx`) with Leaflet integration, dark mode tile filters, and simulated land parcel polygon overlays (Acquired, Notified, Disputed).
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
