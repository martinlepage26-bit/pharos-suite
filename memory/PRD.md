# AI Governance Consulting Website - PRD

## Original Problem Statement
User lost their AI Governance consulting website and needed it recreated from screenshots. The website is for Martin Lepage, PhD - AI Governance Strategy & Oversight consultant.

## User Personas
- **Primary**: Executives and compliance officers seeking AI governance consulting
- **Secondary**: Procurement teams evaluating AI vendors
- **Tertiary**: Auditors assessing AI governance readiness

## Core Requirements
1. Multi-page consulting website with professional design
2. Pages: Home, Services, Service Menu, Tool, FAQ, Research, About, Connect
3. Fully functional AI Governance Readiness Snapshot tool
4. Clean, minimal design with navy/white color scheme
5. Responsive layout

## Design Specifications (User Feedback)
- No logo in navigation header
- Flat footer with small logo on far right
- Medium logo positioned on right side of home page
- Tool page with "playing card deck" stacked card UI
- Results shown in right-side drawer with circular score ring

## What's Been Implemented (Jan 2026)

### Pages Completed
- [x] Home - Hero section with branding, CTAs, medium logo on right
- [x] Services - Core offers, pricing factors
- [x] Service Menu - 3 packages with deliverables
- [x] Tool - Full readiness assessment wizard with card deck UI and results drawer
- [x] FAQ - 6 common questions
- [x] Research - 7 briefings with varied titles, context filters, paper reader drawer
- [x] Library - Curated AI governance reference hub (frameworks, regulations, standards)
- [x] About - Practice approach, bio, link to Portfolio
- [x] Connect - Contact form with mailto
- [x] Sealed Card Protocol - Full research protocol page with PDF link
- [x] Portfolio - Publications and engagement areas

### Design Updates
- Purple accent color (#6366f1) added throughout site
- Navigation shows purple underline for active pages
- Buttons have purple hover states
- Research papers have purple left border
- Tool uses purple for active selections and progress dots

### Research Papers (from LEGIBLE.txt)
- When Hiring AI Quietly Rewrites Your Talent Pipeline
- When Data Collection Becomes Regulatory Exposure
- When a Forecasting Model Moves Real Money
- When Risk Scores Replace Due Process
- When Vendors Hold the Model and You Hold the Liability
- When Employees Turn GenAI Into a Leak Vector
- When a Customer Chatbot Turns Into Institutional Speech

### Tool Functionality
- Step 1: Sector selection (6 sectors)
- Step 2: 8 readiness questions, one at a time
- Step 3: Results drawer with:
  - Circular score ring (0-100%)
  - Risk level classification
  - Score breakdown per question
  - Recommended next steps
  - CTAs (Book debrief, View services, Retake)

### Technical Stack
- React 19 frontend
- React Router for navigation
- Tailwind CSS for styling
- Custom fonts: Cormorant Garamond (headings), DM Sans (body)

## Prioritized Backlog

### P0 (Critical)
- All pages functional ✅
- Tool wizard complete ✅

### P1 (High Priority)
- [ ] Library page (from library.html - AI governance references)
- [ ] Admin page for managing research posts

### P2 (Medium Priority)
- [ ] Research posts/papers integration from JSON
- [ ] PDF download functionality for resources
- [ ] Calendar booking integration for consultations

### P3 (Nice to Have)
- [ ] Dark mode theme
- [ ] Animation enhancements
- [ ] Analytics integration

## Next Tasks
1. Add Library page with curated resources
2. Integrate external calendar for booking
3. Add PDF download links for audit checklist and templates
