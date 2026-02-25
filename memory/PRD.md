# Martin Lepage, PhD — AI Governance Website

## Original Problem Statement
Rebuild a professional AI Governance consulting website from provided images. Multi-page, feature-rich application for "Martin Lepage, PhD" AI Governance consulting practice.

## Architecture
- **Frontend**: React.js, React Router, plain CSS with Tailwind utility classes
- **Backend**: FastAPI with MongoDB (publications CRUD, booking system)
- **Database**: MongoDB — `publications` and `bookings` collections
- **Content**: Research papers and case studies in static JSON; publications managed via Admin
- **i18n**: Custom LanguageContext with `translations/en.js` and `translations/fr.js`

## Core Requirements
- 13-page professional consulting website
- Bilingual EN/FR with toggle in header
- Readiness Snapshot assessment tool
- Case studies, research papers, portfolio
- Lead magnet (Governance Starter Kit)
- Calendar-based booking system with backend persistence
- Admin page for managing publications and viewing bookings

## What's Implemented

### Pages
1. Home — Hero, capabilities, starter kit CTA, navigation cards
2. Services — Core offers, pricing factors
3. Service Menu — 3 packages with deliverables
4. Tool (Readiness Snapshot) — Sector selection, 8 questions, results drawer
5. FAQ — 8 Q&A pairs with CTAs
6. Research — 7 briefings with reader drawer, context filters
7. Cases — 5 case studies with detail drawer
8. About — Practice description, bio, headshot, featured research
9. Connect — Message form (mailto) + Calendar booking (backend-persisted)
10. Sealed Card Protocol — Research protocol page
11. Portfolio — Publications fetched from API, engagement areas, expertise
12. Library — Curated governance resources with external links
13. Admin — Publications CRUD + Bookings management (password-protected)

### Features
- **Bilingual (EN/FR)**: Full site translation except Portfolio (stays English). Toggle in navbar, localStorage persistence, browser auto-detection.
- **Readiness Snapshot**: Interactive assessment with 6 sectors, 8 questions, scored results
- **Lead Magnet**: Governance Starter Kit email capture
- **Calendar Booking**: Date picker (no weekends/past dates), 14 time slots (9 AM - 4:30 PM ET), booked slots shown unavailable, persisted to MongoDB
- **Admin Publications**: Full CRUD for portfolio publications, seeded with 6 initial items
- **Admin Bookings**: View all requests, confirm/cancel/delete, pending counter badge

### API Endpoints
- `GET /api/health` — Health check
- `GET /api/publications` — List all publications
- `POST /api/publications` — Create publication
- `PUT /api/publications/{id}` — Update publication
- `DELETE /api/publications/{id}` — Delete publication
- `GET /api/bookings` — List all bookings
- `POST /api/bookings` — Create booking
- `PUT /api/bookings/{id}/status` — Update booking status
- `DELETE /api/bookings/{id}` — Delete booking
- `GET /api/bookings/booked-slots` — Public: get booked date/time pairs

### Completed Tasks
- **Session 1**: Full 13-page site built from images
- **Session 2**: Content population, bug fixes, deployment readiness
- **Feb 2026**: French language support (100% test pass)
- **Feb 2026**: Admin publications management + Calendar booking system (100% test pass)

## Database Schema

### publications
```
{ id, type, title, venue, year, description, link, internal, status, abstract, created_at }
```

### bookings
```
{ id, name, email, organization, date, time, topic, current_state, status, created_at }
```

## Prioritized Backlog
- P2: Update the admin passphrase for production if needed
- P3: Email notifications for bookings (currently no automated email)

## Credentials
- Admin passphrase: See `frontend/.env` → `REACT_APP_ADMIN_PASSPHRASE`

## Mocked Functionality
- Contact message form: uses mailto links (no backend persistence)
- Booking confirmation emails: not automated (admin reviews in dashboard)
