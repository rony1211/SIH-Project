# SIH26016 — Problem Statement Reference

> **Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support**

## Quick Reference

| Field              | Detail                                           |
| ------------------ | ------------------------------------------------ |
| **Problem ID**     | SIH26016                                         |
| **Track**          | Software                                         |
| **Ministry**       | Ministry of Rural Development                    |
| **Theme**          | Agriculture, FoodTech & Rural Development        |
| **Prize**          | ₹1,00,000                                       |
| **Deadline**       | 20 September 2026                                |

---

## Core Problem Background

Land acquisition in India drives critical public infrastructure — highways, railways, industrial corridors, irrigation works, and renewable energy projects. Projects routinely stall due to fragmented coordination among:

- Project Implementing Agencies
- Requiring Bodies
- District Administrations
- State Revenue Departments
- Central Ministries

The current lack of a unified digital platform causes:
1. Severe workflow bottlenecks
2. Non-standardized approvals
3. Delayed compensation disbursement
4. Opaque Rehabilitation & Resettlement (R&R) monitoring

---

## Mandatory Deliverables

### 1. End-to-End Acquisition Lifecycle
Standardized web platform digitizing every statutory step:
- Project proposal submission
- Gazette notification
- Parcel survey
- Joint measurement
- Award computation
- Compensation disbursement
- Physical possession

### 2. Interactive National Command Dashboard
Executive monitoring tracking across states and districts:
- Total land area notified vs. area acquired
- Compensation assessed vs. actual compensation disbursed
- Affected/displaced family counts + R&R milestones
- Project timeline adherence, pending approvals, possession states

### 3. Geospatial & Cadastral Mapping
- GIS-enabled parcel geotagging
- Spatial visualization integrated with cadastral maps
- Survey boundary inspection and overlap detection

### 4. API Integration Layer
Interoperability with:
- State Bhulekh / Record of Rights databases
- BhuNaksha cadastral maps

### 5. Field Verification & Mobile Interface
- Mobile-responsive workflows
- Revenue officers & field surveyors
- Upload ground inspection reports, photos, boundary validations

### 6. Secure Document Repository
- Centralized storage (gazette notifications, title deeds, joint measurement surveys, court orders)
- Strict version control
- Immutable audit trails

### 7. Role-Based Access Control (RBAC)
Permission tiers:
- Central Ministries
- State Revenue Authorities
- District Collectors / CALAs (Competent Authority for Land Acquisition)
- Project Agencies

---

## Recommended Tech Stack

| Layer              | Technology                          | Role                                              |
| ------------------ | ----------------------------------- | ------------------------------------------------- |
| Frontend UI        | Next.js / React + Tailwind CSS      | Role-specific portals                             |
| Spatial Engine     | MapLibre GL / Leaflet + GeoServer   | Cadastral GeoJSON layers, heatmaps                |
| Backend API        | Python FastAPI or Go                | REST/gRPC microservices                           |
| Database           | PostgreSQL + PostGIS                | Relational + spatial querying                     |
| Audit & Integrity  | SHA-256 Hash Chaining / Hyperledger | Tamper-evident logs                               |
| Analytics Engine   | Scikit-learn / XGBoost              | Predictive forecasting of bottlenecks             |

---

## Key Differentiators Mentioned

1. **Direct R&R Tracking** — Family entitlement + rehabilitation disbursement tracker
2. **Cadastral Boundary Validation** — Automated spatial intersection checks (forest, water, litigation zones)
3. **Offline-First Field PWA** — Offline data collection + auto-sync for rural areas
