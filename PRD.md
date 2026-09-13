# 📄 Product Requirements Document (PRD)

# 🌟 VASLKAAR — The All-In-One AI Freelancer OS
> **Connect Your Creative Work to Real Business Impact.**

---

| Document Metadata | Details |
|---|---|
| **Product Name** | VASLKAAR |
| **Product Type** | Web-based AI Operating System & Business Hub for Freelancers |
| **Version** | 1.0.0 (Production MVP) |
| **Status** | Approved & Live |
| **Live Working URL** | [https://vaslkaar.vercel.app](https://vaslkaar.vercel.app) |
| **Repository** | [https://github.com/Javeriaf19/vaslkaar](https://github.com/Javeriaf19/vaslkaar) |
| **Author / Lead Architect** | Javeria Farhan & Core Engineering Team |
| **Date** | September 2026 |

---

## 1. Executive Summary

**VASLKAAR** (derived from Urdu: *Vasl* وصل = connection, *Kaar* کار = work) is an end-to-end, privacy-first AI Operating System built specifically for independent creative professionals, graphic designers, video editors, and indie creators. 

Freelancers currently waste over 40% of their working hours context-switching between 6+ disconnected applications for case study writing, social media slide design, client CRM, invoice billing, and gig discovery. VASLKAAR bridges this entire creative-to-business lifecycle into one unified, sub-second, client-side encrypted workspace.

---

## 2. Problem Statement & Market Friction

### The Core Problem: The 6-App Fragmentation Trap
Creative freelancers excel at visual execution but suffer from heavy administrative burnout and operational fragmentation:

1. **Portfolio & Case Study Inertia:** Writing a 1,000-word structured Behance case study and formatting viral LinkedIn posts after a 12-hour client project takes 2–3 hours. Consequently, 70% of creative work remains unpublished.
2. **Repetitive Graphic Asset Recreation:** Rebuilding carousel slide decks in Figma or Canva for social proof consumes billable hours.
3. **Scattered Client Records:** Client briefs and communication are lost across unorganized WhatsApp chats, Fiverr/Upwork inboxes, and spreadsheets.
4. **Manual Invoicing & Awkward Payment Follow-ups:** Designing invoices manually, calculating taxes/discounts, and chasing overdue balances creates friction and delays payments.
5. **Growth Blindspots:** Finding vetted, real freelance opportunities with clear, actionable execution steps is overwhelming.

---

## 3. Target Audience & User Personas

| Persona | Role | Key Pain Point | VASLKAAR Solution |
|---|---|---|---|
| **Ayesha (22)** | Freelance Graphic / Brand Designer | Spends hours drafting case studies and formatting carousel posts for LinkedIn. | Upload screenshots ➔ 1-Click Behance Case Study + 4-Slide High-Res Carousel PNGs. |
| **Hamza (25)** | Video Editor & Motion Designer | Juggles multiple international clients on WhatsApp with unorganized billing. | Client CRM with status badges + 1-Click WhatsApp Invoicing with auto-calculated PDFs. |
| **Sarah (20)** | Student & Junior UI/UX Designer | Wants to break into high-paying freelance gigs but lacks execution roadmaps. | Ideas Lab with 3-Phase Execution Roadmaps + 100% verified deep-search platform URLs. |

---

## 4. Product Goals & Success Metrics (KPIs)

### Primary Goals
* Reduce post-project case study generation and copywriting time from **120 minutes to < 30 seconds**.
* Eliminate external graphic software dependency for standard social carousel slide decks.
* Provide instant, zero-setup vector PDF invoicing with direct client communication channels (WhatsApp).
* Eliminate 404/broken link frustration in freelance gig exploration.

### Target Metrics (KPIs)
* **Time-to-Publish:** < 60 seconds from screenshot upload to downloadable case study & carousel deck.
* **API Uptime & Latency:** 99.9% uptime with sub-second AI inference via Groq LPU hardware acceleration.
* **Privacy Assurance:** 100% client financial data retained in browser LocalStorage with 0% cloud database leakage.

---

## 5. Functional Requirements & Feature Specifications

```
+-----------------------------------------------------------------------------------+
|                                 VASLKAAR ECOSYSTEM                                |
+-----------------------------------------------------------------------------------+
|  1. CREATIVE HUB      |  2. GRAPHIC STUDIO   |  3. BUSINESS SUITE | 4. GROWTH LAB |
|  - Design DNA Profile |  - 4-Slide Carousels |  - Client CRM      | - Ideas Lab   |
|  - Behance Case Study |  - 3 Ratios (1:1/4:5)|  - Vector PDF Bills| - Gig Radar   |
|  - 3 LinkedIn Formats |  - 4 Luxury Themes   |  - Payment Tracker | - 3-Phase Plan|
|  - Palette Extraction |  - 2.5x Retina PNGs  |  - WhatsApp Chat   | - Verified URL|
+-----------------------------------------------------------------------------------+
```

### Module 1: Creative Hub & Copy Engine
* **FR-1.1: Design DNA Profiling:** Supports 11+ creative professions, customizable aesthetic styles, and native generation in 7 languages (English, Urdu, Hindi, Punjabi, French, Arabic, Spanish).
* **FR-1.2: HTML5 Canvas Color Extraction:** Automatically samples uploaded project screenshots to compute dominant brand color hex codes.
* **FR-1.3: Web Speech API Input:** Allows voice-to-text dictation for project descriptions.
* **FR-1.4: Multi-Format Copy Output:**
  * Complete Behance Case Study (Overview, Challenge, Process, Solution, Tags, Description).
  * 3 LinkedIn Post Formats (Short <150 chars, Medium ~300 chars, Long ~500 chars with hashtags).
  * 1-Click "Share to LinkedIn" Composer integration and Behance Creator launch.
  * SEO Package with Alt-Texts, Meta Descriptions, and Keywords.

### Module 2: 4-Slide Graphic & Document Studio
* **FR-2.1: Multi-Slide Carousel Architecture:**
  * **Slide 1:** Hook & Cover (Title, Extracted Palette Dots, Brandmark).
  * **Slide 2:** The Challenge & Strategic Narrative.
  * **Slide 3:** Deliverables & Design Tools Used (Figma, Photoshop, etc.).
  * **Slide 4:** Measurable Impact, Key Metrics & Author Call-to-Action.
* **FR-2.2: Dynamic Ratios & Theming:** Supports 1:1 Square, 4:5 Portrait (Carousel), and 16:9 Banner across 4 themes (*✨ Dark Gold, ⚪ Minimal, 🌌 Cyber, 🌿 Emerald*).
* **FR-2.3: High-Res Rasterization:** Exports single slides or full 4-slide carousel decks sequentially in 2.5x Retina PNG resolution using `html2canvas`.

### Module 3: Business Suite (CRM, Invoices, Payments)
* **FR-3.1: Client CRM:** Tracks leads and active clients with status indicators (*Active, On-Hold, Completed, Problem*), notes, and direct `wa.me` WhatsApp messaging.
* **FR-3.2: Automated Vector Invoices:** Multi-currency calculations (`PKR`, `USD`, `EUR`, `GBP`), dynamic line-item addition/deletion, auto-numbering (`INV-001`), and instant client-side vector PDF compilation (`jsPDF`).
* **FR-3.3: Payment Health Tracker:** Live dashboard summarizing Total Earned, Pending Balances, and Overdue Accounts with automated polite WhatsApp reminder triggers.
* **FR-3.4: CSV Ledger Export:** 1-click export of CRM records and financial transactions for external bookkeeping.

### Module 4: Growth Engine (Ideas Lab & Live Opportunities)
* **FR-4.1: 5-Category AI Advisor:** Generates bespoke ideas for *Portfolio Projects, Hackathon Concepts, 30-Day Income Boosts, High-Income Skills, and Passive Digital Products*.
* **FR-4.2: 100% Verified Deep-Search URLs:** Maps AI recommendations directly to active search query endpoints on Upwork, Fiverr, LinkedIn (24h remote), and Devpost with zero 404 errors.
* **FR-4.3: 3-Phase Actionable Roadmaps:** Step-by-step breakdown (Phase 1 Setup, Phase 2 Build, Phase 3 Pitch) with free tool stacks (`Figma`, `Canva`, `CapCut`, `GitHub`) and curated YouTube masterclass learning links.

---

## 6. Technical Architecture & Tech Stack

```
                              [ User Browser (Client-Side) ]
                                            |
              +-----------------------------+-----------------------------+
              |                             |                             |
              v                             v                             v
     [ Single Page UI ]            [ Client Vector Engine ]      [ Storage Engine ]
  (HTML5, Tailwind, JS ES6+)    (html2canvas PNGs, jsPDF Bills)   (Browser LocalStorage)
              |
              +-----------------------------> [ Vercel Serverless Edge API ]
                                                            |
                                                            v
                                                  [ Groq Cloud LPU ]
                                           (openai/gpt-oss-120b & qwen3.6-27b)
                                                            |
                                                            v
                                            [ Auto-Repair JSON Parser ]
```

| Layer | Component | Technical Implementation |
|---|---|---|
| **Frontend UI** | SPA Architecture | Vanilla JavaScript (ES6+), Tailwind CSS (CDN), Lucide Icons |
| **AI Inference** | High-Throughput LLMs | Groq SDK (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`) via LPU hardware |
| **Serverless API** | Edge Endpoints | `/api/generate.js`, `/api/ideas.js` on Vercel Node.js Serverless Runtime |
| **Client-Side Graphics**| Rasterization Engine | `html2canvas` (v1.4.1) at 2.5x device pixel ratio scale |
| **PDF Generation** | Vector Compiler | `jsPDF` (v2.5.2) with dynamic fallback loader |
| **Voice Dictation** | Audio Processing | Browser-Native Web Speech API (`webkitSpeechRecognition`) |
| **Data Persistence** | Zero-Knowledge DB | Browser `localStorage` (Privacy-first, zero server database storage) |
| **Hosting & CI/CD** | Global CDN Edge | Vercel Edge Network connected to GitHub `main` branch |

---

## 7. Non-Functional Requirements

* **Security & Privacy:** No sensitive financial data or client names are transmitted to external database servers. The Groq API key is encrypted on the serverless backend.
* **Performance & Speed:** Sub-500ms DOM rendering; AI responses parsed and rendered in < 2 seconds.
* **Reliability:** Built-in auto-repairing JSON parser handles token boundary truncations to guarantee zero runtime 500 errors.
* **Responsiveness:** Fluid adaptation across mobile, tablet, and ultra-wide desktop viewports.

---

## 8. Future Product Roadmap

* **Phase 2.0:** Multi-device Cloud Sync with Firebase Auth and Firestore.
* **Phase 2.1:** Automated WhatsApp Cloud API Webhooks for instant invoice delivery.
* **Phase 2.2:** AI Video Script, Hook & Storyboard Studio for TikTok, YouTube Shorts, and Reels creators.
* **Phase 2.3:** Progressive Web App (PWA) with push notification payment reminders.

---

## 9. Conclusion & Project Sign-Off

VASLKAAR solves a validated, high-friction operational crisis for global creative freelancers. Built with disciplined modularity, high-speed LPU AI inference, and privacy-first local vector compiling, VASLKAAR provides an empowering, commercially viable solution ready for hackathon evaluation and scaling.
