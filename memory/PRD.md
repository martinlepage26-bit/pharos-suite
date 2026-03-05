# Govern-AI Landing Page PRD

## Project Overview
**Client:** Martin Lepage, PhD  
**Domain:** AI Governance Consulting  
**Created:** March 2026

## Brand Identity
- **Mission:** AI governance as decision machinery, not observability theater
- **Visual Style:** Light/airy base with dark purple (#581C87), navy (#0F172A), black accents
- **Typography:** Chivo (headings), Inter (body), JetBrains Mono (data)

## Core User Personas
1. **CTOs/Tech Leaders** - Need defensible AI systems before shipping
2. **Compliance Officers** - Need audit-grade evidence trails
3. **AI/ML Team Leads** - Need practical governance without bureaucracy

## Implemented Features (MVP - March 2026)

### Pages
- [x] **Homepage** - Hero, value proposition, services preview, agentic governance section
- [x] **Services** - AurorAI (shipping governance) & CompassAI (agentic governance) 
- [x] **Portfolio** - Mock case studies (Financial Services, Healthcare, E-commerce)
- [x] **Publications** - Research papers/articles with LinkedIn links
- [x] **Assessment Tool** - 8-question AI governance assessment with GPT-powered analysis
- [x] **Contact** - Email form (Resend) + Calendly booking widget

### Integrations
- [x] **Resend** - Contact form emails to martinlepage.ai@gmail.com
- [x] **Calendly** - Embedded booking (martinlepage-ai)
- [x] **OpenAI (GPT-5.2)** - AI analysis for assessment results via Emergent LLM key
- [x] **MongoDB** - Contact submissions, assessments stored

### Design
- [x] Glassmorphism navigation
- [x] Grid pattern backgrounds
- [x] Framer Motion animations
- [x] Sharp/industrial button styles
- [x] User's logos integrated (needle compass, ML monogram)

## Technical Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, react-calendly
- **Backend:** FastAPI, MongoDB, emergentintegrations
- **APIs:** Resend, Calendly embed, OpenAI via Emergent

## P1 Backlog (Future Iterations)
- [ ] Admin dashboard for managing publications/case studies
- [ ] Blog post creation with LinkedIn auto-scheduling
- [ ] More detailed assessment with PDF report generation
- [ ] Testimonials section
- [ ] More case studies

## P2 Backlog
- [ ] Dark mode toggle
- [ ] Multi-language support (EN/FR)
- [ ] Newsletter signup
- [ ] Analytics integration

## Environment Variables
```
RESEND_API_KEY=re_M76tATnr_...
SENDER_EMAIL=Consult@govern-ai.ca
EMERGENT_LLM_KEY=sk-emergent-...
```

## URLs
- **LinkedIn:** https://www.linkedin.com/in/martin-lepage-ai/
- **GitHub:** https://github.com/martinlepage26-bit
- **Calendly:** https://calendly.com/martinlepage-ai
