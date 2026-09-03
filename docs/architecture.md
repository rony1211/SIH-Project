# BhumiSetu — Frontend Architecture & Design System

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │   Layouts    │  │  Components  │  │    i18n (22     │ │
│  │  (per role)  │  │  (Reusable)  │  │   languages)   │ │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘ │
│         │                │                   │          │
│  ┌──────▼──────────────▼──────────────────▼────────┐  │
│  │              State Management (Zustand)          │  │
│  └──────────────────────┬──────────────────────────┘  │
│                         │                              │
│  ┌──────────────────────▼──────────────────────────┐  │
│  │           API Layer (React Query + Fetch)        │  │
│  └──────────────────────┬──────────────────────────┘  │
│                         │                              │
│  ┌─────────┐  ┌────────▼───────┐  ┌────────────────┐ │
│  │ Leaflet │  │  Chart.js /    │  │  Framer Motion  │ │
│  │ Maps    │  │  Recharts      │  │  Animations     │ │
│  └─────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Language prefix (en, hi, bn, ta, te, etc.)
│   │   ├── layout.tsx            # Root layout with language wrapper
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # National Command Dashboard
│   │   ├── projects/
│   │   │   ├── page.tsx          # Project listing
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Project detail + timeline
│   │   ├── map/
│   │   │   └── page.tsx          # Full geospatial viewer
│   │   ├── rr-tracker/
│   │   │   └── page.tsx          # R&R tracking dashboard
│   │   ├── documents/
│   │   │   └── page.tsx          # Document repository
│   │   ├── grievance/
│   │   │   └── page.tsx          # Citizen grievance portal
│   │   ├── field/
│   │   │   └── page.tsx          # Mobile field verification
│   │   └── admin/
│   │       └── page.tsx          # Admin panel (RBAC)
│   └── api/                      # API routes (mock data)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSelector.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── NationalMap.tsx
│   │   ├── AcquisitionChart.tsx
│   │   ├── CompensationTracker.tsx
│   │   └── TimelineAdherence.tsx
│   ├── map/
│   │   ├── CadastralMap.tsx
│   │   ├── ParcelLayer.tsx
│   │   ├── OverlapDetector.tsx
│   │   └── MapControls.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectTimeline.tsx
│   │   └── ProjectFilter.tsx
│   ├── rr/
│   │   ├── FamilyTracker.tsx
│   │   ├── EntitlementCard.tsx
│   │   └── RRProgressBar.tsx
│   ├── common/
│   │   ├── AnimatedCounter.tsx
│   │   ├── GlassCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SearchBar.tsx
│   │   └── DataTable.tsx
│   └── ui/                       # Base UI primitives
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Tooltip.tsx
│       └── Dropdown.tsx
│
├── i18n/
│   ├── config.ts                 # Language configuration
│   ├── routing.ts                # Locale routing
│   └── locales/
│       ├── en.json               # English
│       ├── hi.json               # Hindi
│       ├── bn.json               # Bengali
│       ├── te.json               # Telugu
│       ├── mr.json               # Marathi
│       ├── ta.json               # Tamil
│       ├── gu.json               # Gujarati
│       ├── kn.json               # Kannada
│       ├── ml.json               # Malayalam
│       ├── pa.json               # Punjabi
│       ├── or.json               # Odia
│       ├── as.json               # Assamese
│       ├── ur.json               # Urdu (RTL)
│       ├── sa.json               # Sanskrit
│       ├── sd.json               # Sindhi
│       ├── ks.json               # Kashmiri
│       ├── ne.json               # Nepali
│       ├── mni.json              # Manipuri
│       ├── sat.json              # Santali
│       ├── brx.json              # Bodo
│       ├── doi.json              # Dogri
│       ├── mai.json              # Maithili
│       └── kok.json              # Konkani
│
├── data/                         # Mock/demo data
│   ├── states.json
│   ├── projects.json
│   ├── parcels.geojson
│   └── families.json
│
├── hooks/                        # Custom React hooks
│   ├── useMapInteraction.ts
│   ├── useAnimatedValue.ts
│   └── useOfflineSync.ts
│
├── lib/                          # Utilities
│   ├── api.ts
│   ├── constants.ts
│   └── formatters.ts
│
├── styles/
│   └── globals.css               # Tailwind + custom design tokens
│
└── public/
    ├── icons/
    ├── images/
    └── manifest.json             # PWA manifest
```

---

## 🎨 Design System

### Color Palette

```
Primary:       #0F172A (Deep Navy)       — Authority, trust
Accent 1:      #F97316 (Saffron)         — Indian identity, warmth
Accent 2:      #10B981 (Emerald)         — Progress, completion
Accent 3:      #3B82F6 (Royal Blue)      — Information, links
Warning:       #EAB308 (Amber)           — Caution, pending
Danger:        #EF4444 (Red)             — Overdue, critical
Surface:       #1E293B (Slate 800)       — Card backgrounds
Glass:         rgba(255,255,255,0.05)    — Glassmorphism overlays
Text Primary:  #F8FAFC (Slate 50)        — Main text
Text Secondary:#94A3B8 (Slate 400)       — Supporting text
```

### Typography

```
Headings:  "Inter" (Latin) / "Noto Sans Devanagari" (Hindi/Marathi/etc.)
Body:      "Inter" / Noto Sans [Script] per language
Monospace: "JetBrains Mono" — for data/numbers
```

### Visual Language

- **Glassmorphism Cards** with frosted backdrop-filter
- **Gradient borders** using conic-gradient
- **Micro-animations** on all interactive elements (hover, focus, click)
- **Animated counters** for statistics (count-up on scroll-in)
- **Smooth page transitions** with Framer Motion
- **Dark mode primary** with light mode toggle
- **India map as hero** with animated state highlighting

---

## 🔀 User Roles & Portal Views

| Role                    | Portal View             | Key Features                                      |
| ----------------------- | ----------------------- | ------------------------------------------------- |
| **Central Ministry**    | National Dashboard      | Cross-state analytics, policy compliance, reports  |
| **State Authority**     | State Dashboard         | District-wise tracking, approvals, resource alloc  |
| **District Collector**  | District Operations     | Parcel management, awards, possession workflow     |
| **CALA**                | Acquisition Workbench   | Survey, measurement, compensation computation      |
| **Field Officer**       | Mobile Field App        | Photo upload, GPS tagging, inspection forms        |
| **Project Agency**      | Project Tracker         | Proposal status, timeline, requirement tracking    |
| **Citizen/Landowner**   | Public Portal           | Compensation status, grievance, R&R entitlements   |

---

## 📐 Responsive Breakpoints

```
Mobile:    < 640px   — Field officer PWA view
Tablet:    640-1024px — District collector dashboard  
Desktop:   1024-1440px — Standard admin view
Wide:      > 1440px  — National command center (multi-monitor)
```

---

## 🔑 Key Technical Decisions

1. **Next.js 14 App Router** — Server components for SEO, streaming for dashboard
2. **Tailwind CSS** — Per problem statement recommendation + rapid prototyping
3. **Leaflet** over MapLibre — Easier setup, rich plugin ecosystem, great for demos
4. **Recharts** — React-native charting, responsive, animated
5. **Framer Motion** — Premium animations, layout transitions, gesture support
6. **next-intl** — Mature i18n with App Router support, ICU message format
7. **Zustand** — Lightweight state management, no boilerplate
8. **Mock API data** — Realistic JSON fixtures for demo (no backend needed for SIH round 1)
