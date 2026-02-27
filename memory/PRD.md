# Martin Lepage, PhD — AI Governance Website

## Original Problem Statement
Rebuild a professional AI Governance consulting website from provided images. Multi-page, feature-rich application for "Martin Lepage, PhD" AI Governance consulting practice.

## Architecture
- **Frontend**: React.js, React Router, plain CSS with Tailwind utility classes
- **Backend**: FastAPI with MongoDB (publications CRUD, booking system, email notifications)
- **Database**: MongoDB — `publications` and `bookings` collections
- **Email**: Resend API for transactional emails
- **Content**: Research papers and case studies in static JSON; publications managed via Admin
- **i18n**: Custom LanguageContext with `translations/en.js` and `translations/fr.js`

## What's Implemented

### Pages (13 total)
1. Home — Hero, capabilities, starter kit CTA, navigation cards
2. Services — Core offers, pricing factors
3. Service Menu — 3 packages with deliverables
4. Tool (Readiness Snapshot) — Sector selection (7 sectors), 8 questions, results drawer
5. FAQ — 8 Q&A pairs with CTAs
6. Research — 7 briefings with reader drawer, context filters
7. Cases — 7 sector cards (3+3+1 grid layout) + 5 case studies with detail drawer
8. About — Practice description, bio, headshot, featured research
9. Connect — Message form (mailto) + Calendar booking (backend-persisted)
10. Sealed Card Protocol — Research protocol page
11. Portfolio — Publications fetched from API, engagement areas, expertise
12. Library — Curated governance resources with external links + Online Tools section
13. Admin — Publications CRUD + Bookings management (password-protected)

### Features
- **Bilingual (EN/FR)**: Full site translation including sector cards. Toggle in navbar.
- **Calendar Booking**: Date picker, 14 time slots, booked slots unavailable, MongoDB persistence
- **Admin Publications**: Full CRUD for portfolio publications
- **Admin Bookings**: View/confirm/cancel/delete requests, pending badge
- **Email Notifications** (Resend):
  - New booking → admin notified at martinlepage.ai@gmail.com + martinlepage26@me.com
  - Confirm booking → client gets confirmation email
  - Cancel booking → client gets cancellation/reschedule email
- **7 Sectors**: Regulated Systems, Enterprise SaaS, Procurement & Vendor Risk, Public Sector, Financial Systems, Construction & Infrastructure, Governance Operating Model

### API Endpoints
- `GET/POST /api/publications`, `PUT/DELETE /api/publications/{id}`
- `GET/POST /api/bookings`, `DELETE /api/bookings/{id}`
- `PUT /api/bookings/{id}/status` — triggers confirmation/cancellation emails
- `GET /api/bookings/booked-slots` — public endpoint for calendar
- `GET /api/health` — health check

### Completed Tasks
- **Session 1-2**: Full 13-page site, content, deployment readiness
- **Feb 2026**: French language support (100% pass)
- **Feb 2026**: Admin publications + Calendar booking (100% pass)
- **Feb 2026**: Email notifications via Resend
- **Feb 2026**: Canada-centric content reframing (100% pass) - Updated Home, Services, About, Library, and FAQ pages with Quebec/Canada focus (Law 25, Treasury Board, AIDA, Algorithmic Impact Assessment, Commission d'accès à l'information)
- **Feb 2026**: Construction & Infrastructure sector + 7 sector cards on Cases page (3+3+1 grid layout), tightened Tool page sector selection, full bilingual support for sector cards

## Database Schema
### publications
`{ id, type, title, venue, year, description, link, internal, status, abstract, created_at }`

### bookings
`{ id, name, email, organization, date, time, topic, current_state, status, created_at }`

## Important Notes
- **Resend testing mode**: Currently only sends to verified account email (martinlepage26@me.com). To send to all clients, verify a domain at resend.com/domains and update SENDER_EMAIL in backend/.env.
- Admin passphrase: See `frontend/.env` → `REACT_APP_ADMIN_PASSPHRASE`

## Recent Updates (Feb 27, 2026)
- **Deployment Fix**: Added `dnspython==2.8.0` to requirements.txt to enable MongoDB Atlas `mongodb+srv://` URI resolution in production
- Deployment agent scan: PASS - Application is deployment-ready

## Backlog
- P1: Enhance Admin page to manage other content sections (Services, FAQ) to reduce reliance on static JSON files
- P1: Adapt website content to weave construction sector references into Home and Services pages
- P2: Verify domain in Resend to send emails to any recipient
- P2: Update admin passphrase for production
- P2: Migrate static JSON content (Cases, Research) to database
