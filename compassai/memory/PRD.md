# Compass AI - AI Governance Engine - PRD

## Current Repo Status Note

- This PRD mixes product target state, historical implementation notes, and backend scope.
- As inspected on 2026-03-14, the canonical runtime proven in this repo is `backend/server.py`.
- The frontend is staged/partial only. This repo does not currently prove a runnable standalone frontend package, full route tree, build validation, or standalone hosting.
- Treat PHAROS as the current browser shell and treat the sections below as product scope unless a claim is separately proven by the current repo tree.

## Original Problem Statement
Build an AI Governance Engine web application. A governance scoring engine that assesses AI systems against controls (scope, data, evaluation, oversight, monitoring, change, resilience, lifecycle), generates maturity scores, risk tiers, readiness labels, and produces deliverables.

## User Choices & Branding
- **App Name**: Compass AI
- **Logo**: Custom logo at `/public/compass-logo.png`
- **Theme**: Dark mode with Regulatory Blue (#3B82F6) primary, Construction Amber (#F59E0B) accent
- **Typography**: Playfair Display (headings), Manrope (body)
- **Target**: Governance professionals, compliance officers, C-suite executives
- **Desktop**: target direction only; not current standalone frontend proof in this repo

## Architecture

### Backend (FastAPI + MongoDB)
- **Core Models**: Client, AISystem, Assessment, ControlAssessment, AssessmentResult
- **AI Services**: Multi-LLM support (GPT-5.2, Claude, Gemini) via pharos_integrations
- **New Models**: OnboardingSubmission, PolicyAnalysis, MarketIntelCache
- **Governance Engine**: 8 control categories, sector-specific weights

### Frontend (staged module direction, not current standalone app proof)
- **Design System**: Authority-focused with trust badges, grid borders, glass effects
- **Components**: HelpTooltip, QuickTips, OnboardingStep helpers

## Feature Scope And Historical Implementation Notes

### Core Governance Features ✅
- [x] Full CRUD for Clients, AI Systems, Assessments
- [x] Governance scoring engine (8 categories)
- [x] Sector-specific weights (SaaS, Healthcare, Finance, Public, Education, **Construction**)
- [x] Risk tier classification (LOW/MEDIUM/ELEVATED/HIGH)
- [x] Assessment wizard (3-step flow)
- [x] Results visualization (score gauge, radar chart, maturity bars)
- [x] Export to PDF/JSON/Markdown
- [x] Evidence file upload with drag-and-drop
- [x] Assessment comparison view

### AI-Powered Features ✅
- [x] Executive summary generation
- [x] Smart remediation recommendations
- [x] Policy/Contract document analysis
- [x] Market Intelligence dashboard (24h cache)
- [x] Auto-fill from uploaded documents
- [x] Multi-LLM support (GPT-5.2, Claude, Gemini)

### Client-Facing Features
- backend and product scope are real, but the inspected repo does not currently prove a runnable standalone frontend app for these surfaces
- email notifications on submission remain backend-facing scope where implemented

### Construction Sector
- product scope and backend/domain logic remain in play, but the inspected repo does not currently prove a standalone runnable browser route for these pages
- **Construction Assessment** (`/construction-assessment`) target flow:
  1. Operating environments (jobsites, subcontractors, offline)
  2. Asset tracking categories
  3. Check-out/return processes
  4. Field data quality issues
  5. AI/automation features
  6. Access control across sites
  7. Incident reconstruction capability
  8. Worker privacy boundaries
- [x] Construction sector weights (monitoring +8%, resilience +6%, data +4%)
- [x] Featured on Industries page with full copy

### User Experience Enhancements
- staged frontend/module intent exists, but these items should not be read as proof of a runnable standalone frontend in this repo
- **Assessment Templates** (`/assessment-templates`) intended set:
  - Quick Start (5 min, Basic)
  - Construction & Infrastructure (15 min, Intermediate)
  - Healthcare AI Compliance (20 min, Advanced)
  - Financial Services AI (20 min, Advanced)
  - Public Sector Transparency (15 min, Intermediate)
  - SaaS Product AI (10 min, Basic)
  - Comprehensive Audit (30 min, Expert)
- [x] **Help System** - Tooltips with governance term definitions
- [x] **Trust Badges** - ISO 42001, EU AI Act, NIST RMF, SOC 2
- [x] **Design System** - Authority cards, risk tier colors, maturity bars

### Admin Features
- [x] Onboarding review & approval workflow
- [x] JWT authentication
- [x] User profile in sidebar
- [x] **Audit Log** (`/admin/audit-log`) - Track all system activities with filters
- [x] **API Keys Management** (`/admin/api-keys`) - Create, list, revoke API keys
- [x] **Governance Maturity Benchmark** (`/benchmarks`) - Compare scores to industry peers
- [x] RBAC dependency functions (require_admin, require_assessor_or_admin)
- [x] Audit logging on CRUD operations (clients, systems, assessments)

### Technical Features
- backend modularization and API surfaces are real
- do not read this section as proof of a working standalone PWA in the current repo

## Pages & Routes

Status note:
- the route list below reflects intended or partial product surface, not proof of a runnable standalone frontend in this repo as currently inspected

### Public Routes
- `/welcome` - Landing page
- `/login` - Authentication
- `/onboarding` - Client intake wizard
- `/onboarding/success` - Confirmation

### Authenticated Routes
- `/` - Dashboard
- `/sectors` - Industries page
- `/clients` - Client management
- `/ai-systems` - AI system management
- `/assessment-templates` - Pre-configured assessments
- `/new-assessment` - Assessment wizard
- `/assessment/:id` - Results view
- `/assessment/:id/deliverables` - Deliverables viewer
- `/history` - Assessment history
- `/compare` - Side-by-side comparison
- `/benchmarks` - Governance Maturity Benchmark
- `/document-analysis` - AI document analysis
- `/market-intelligence` - Regulatory insights
- `/construction-assessment` - Construction 8-question assessment
- `/onboarding-admin` - Review submissions
- `/scheduled-assessments` - Assessment schedules
- `/bulk-import` - CSV bulk import
- `/admin/api-keys` - API key management
- `/admin/audit-log` - System activity audit

## API Endpoints

### Core
- `/api/clients`, `/api/ai-systems`, `/api/assessments`
- `/api/assessments/compare/{id1}/{id2}`
- `/api/assessments/{id}/deliverables`
- `/api/assessments/{id}/export/pdf|json|markdown`
- `/api/evidence`

### AI-Powered
- `/api/ai/executive-summary/{id}`, `/api/ai/remediation-plan/{id}`
- `/api/ai/analyze-policy`, `/api/ai/analyze-contract`
- `/api/ai/auto-fill`
- `/api/market-intelligence/{sector}`

### Onboarding
- `/api/onboarding/submit`
- `/api/onboarding/submissions`
- `/api/onboarding/submissions/{id}/approve|reject`

## Design System

### Colors
- **Primary**: Regulatory Blue `hsl(220, 80%, 55%)`
- **Success**: Emerald `hsl(150, 80%, 45%)`
- **Warning**: Amber `hsl(35, 100%, 55%)`
- **Danger**: Red `hsl(0, 84%, 60%)`
- **Construction Accent**: Amber-Orange gradient

### Typography
- **Headings**: Playfair Display (serif, authoritative)
- **Body**: Manrope (sans-serif, clean)
- **Code**: JetBrains Mono

### Components
- `.authority-card` - Gradient border top, subtle background
- `.trust-badge` - Compliance certification badges
- `.risk-low/medium/elevated/high` - Status colors
- `.glass` / `.glass-card` - Frosted glass effects

## Testing & Quality
- backend API verification is supported by the current repo and bounded local runtime checks
- do not read this section as current proof of standalone frontend test coverage or a fully runnable PWA

## Prioritized Backlog

### P0
Backend-first governance engine scope is materially implemented, but this should not be read as proof that the standalone frontend product surface is fully implemented in the current repo.

### P1 - COMPLETED ✅ (Feb 27, 2026)
- [x] Role-based access control (RBAC) - Admin/Assessor/Viewer roles implemented
- [x] Audit logging for all changes - Login events and CRUD operations tracked
- [x] Industry benchmarking comparisons - Governance Maturity Benchmark page with sector data
- [x] API keys for external integrations - Create, list, revoke API keys
- [x] Frontend routing fix for admin pages (/admin/api-keys, /admin/audit-log)

### P2 - COMPLETED ✅ (Feb 27, 2026)
- [x] Scheduled re-assessments - Full CRUD for recurring assessments with frequency options
- [x] Shareable report links - Token-based public access with expiration
- [x] Bulk import clients/systems from CSV - Working CSV upload with error handling
- [x] Bulk evidence upload from ZIP - ZIP extraction and attachment
- [x] Enhanced offline PWA support - Improved sw.js with caching strategies

### P3 - COMPLETED ✅ (Feb 27, 2026)
- [x] Contextual help tooltips - HelpTooltip component with HELP_CONTENT definitions
- [x] Backend modular structure - Created /routers, /models, /utils directories (reference implementation)

### Backlog (Future)
- [ ] E-signature support for shareable reports
- [ ] Cron job runner for scheduled assessments (manual trigger only currently)
- [ ] Full backend refactoring - migrate from server.py to modular structure
- [ ] Cascade delete for scheduled assessments when client/system deleted
- [ ] Push notifications for scheduled assessments

## File Structure
```
/app/
├── backend/
│   ├── server.py           # Main FastAPI app
│   ├── ai_services.py      # LLM integrations
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   │   ├── compass-logo.png    # Custom logo
│   │   ├── manifest.json       # PWA
│   │   └── sw.js               # Service worker
│   ├── src/
│   │   ├── pages/              # All pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SectorsPage.jsx
│   │   │   ├── ConstructionAssessmentPage.jsx
│   │   │   ├── AssessmentTemplatesPage.jsx
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── HelpSystem.jsx  # Tooltips & help
│   │   │   └── ui/             # Shadcn components
│   │   ├── contexts/
│   │   └── lib/api.js
│   └── package.json
└── memory/
    └── PRD.md
```
