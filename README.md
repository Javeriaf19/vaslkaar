# 🌟 VASLKAAR — Your Work, Connected.

> **The AI-Powered Freelancer OS** — Document creative work, manage clients, generate invoices, track payments, and discover new income streams.

[![Pixel Forge Hackathon](https://img.shields.io/badge/Pixel%20Forge-AI%20Hackathon%202026-gold?style=for-the-badge)](https://vaslkaar.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
[![Built for Freelancers](https://img.shields.io/badge/Made%20for-Creative%20Freelancers-22c55e?style=for-the-badge)](#)

---

## 📖 About VASLKAAR

**VASLKAAR** (derived from Urdu: *Vasl* وصل = connection / coming together, *Kaar* کار = work / doer) is an all-in-one operating system engineered specifically for creative freelancers, graphic designers, video editors, and indie builders who juggle multiple clients, platforms, and income streams.

Instead of switching between 6 different apps (Notion, Canva, Google Docs, Excel, Invoice generators, and Behance), **VASLKAAR bridges the entire creative-to-business lifecycle** in a single unified workspace.

---

## ✨ Core Feature Ecosystem

```
VASLKAAR FREELANCER OS
├── 🎨 Creative Hub
│   ├── 🧬 Design DNA Profiling (11+ Professions, 7+ Languages, Aesthetics)
│   ├── 📤 Smart Project Upload & Color Palette Extraction
│   ├── ✨ Multi-Format AI Case Studies (Behance, LinkedIn, SEO Alt-Text)
│   └── 📋 Project Archive & Status Tracking
├── 💼 Business Suite
│   ├── 🧑‍💼 Client CRM (Multi-platform tracking, Client status, CSV Export)
│   ├── 🧾 Invoice Generator (Multi-currency, Instant PDF, WhatsApp Direct)
│   └── 💰 Payment Tracker (Real-time revenue metrics & Smart Reminders)
└── 🚀 Growth Engine
    ├── 💡 Ideas Lab (5 AI Categories: Projects, Hackathons, Income Boost)
    └── 🎯 Opportunities Radar (AI-matched gigs & direct platform links)
```

---

### 🎨 1. Creative Hub

* **🧬 Design DNA System:** Capture your unique creative identity — select your profession (Graphic Designer, UI/UX, Video Editor, 3D Artist, etc.), aesthetic tags (Minimal, Cyberpunk, Luxury, Vintage), designer inspirations, and output language.
* **📤 Smart Upload & Palette Extraction:** Upload screenshots and artwork. VASLKAAR extracts dominant hex colors directly from your files via HTML5 Canvas.
* **✨ AI Case Study Generator:** Powered by ultra-fast Groq LLMs. Generates:
  * **Behance Case Study:** Complete narrative with Project Overview, Creative Challenge, Strategic Solution, and Color/Typography breakdown.
  * **LinkedIn Post Variations:** 2 viral hooks (Storytelling & Metric-driven) with hashtags and CTAs.
  * **SEO & Accessibility Package:** Behance tags, Google-ready meta descriptions, and image alt text for every uploaded asset.
* **🎤 Built-in Voice Input:** Speak instead of typing project briefs using browser-native Speech-to-Text.
* **🌐 Multilingual AI Outputs:** Generate case studies and content in **English, Urdu (اردو), Hindi (हिंदी), Punjabi (پنجابی), French (Français), Arabic (العربية), or Spanish (Español)**.

---

### 💼 2. Business Suite

* **🧑‍💼 Client CRM:** Track clients across Fiverr, Upwork, LinkedIn, Direct Referrals, and Job Boards. Manage statuses (*Active, On-Hold, Completed, Problem*) and client notes.
* **🧾 Invoices & PDF Export:** Create professional invoices with dynamic line items, auto-numbering (`INV-001`), and multi-currency support (`PKR`, `USD`, `EUR`, `GBP`). Download branded PDFs instantly (via `jsPDF`) or share directly via WhatsApp.
* **💰 Payment Tracker & AI Reminders:** Real-time financial dashboards showing *Total Earned, Pending Payments, and Overdue Balances*. Generate courteous payment reminder messages in one click with direct WhatsApp sharing.
* **📊 One-Click CSV Export:** Export client rosters, invoice ledgers, and payment history to CSV for Excel / Google Sheets bookkeeping.

---

### 🚀 3. Growth Engine

* **💡 Ideas Lab:** AI growth consultant offering tailored strategies across 5 categories:
  * 🎨 **Project Ideas:** High-value portfolio concepts matched to your style.
  * 🏆 **Hackathon Ideas:** Winning design + AI technology concepts.
  * 💰 **Income Boost:** Specific actionable tactics to increase revenue in 30 days.
  * 📈 **Skill Growth:** Emerging in-demand creative skills.
  * 🔄 **Passive Income:** Reusable digital products and template ideas.
* **🎯 Opportunities Radar:** AI scans your Design DNA to recommend tailored freelance gigs, remote jobs, and hackathons with direct apply links (Fiverr, Upwork, LinkedIn, Devpost).

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Frontend** | HTML5, Tailwind CSS, Vanilla JavaScript (Zero bloated frameworks) |
| **Icons & Typography** | Lucide Icons, Plus Jakarta Sans, DM Sans |
| **AI Engine** | [Groq SDK](https://groq.com) (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`) |
| **PDF Generation** | jsPDF (Client-side fast rendering) |
| **Speech-to-Text** | Web Speech Recognition API |
| **Backend & Routing** | Vercel Serverless Functions (`/api/generate`, `/api/ideas`) + Node.js local proxy |
| **Storage** | Client-side LocalStorage (Private, fast, zero-auth MVP) |
| **Deployment** | Vercel |

---

## 📁 Repository Structure

```
vaslkaar/
├── index.html              # Complete SPA architecture (all screens & modals)
├── css/
│   └── styles.css          # Custom styling, animations & theme tokens
├── js/
│   ├── app.js              # SPA router, sidebar controller, toast system
│   ├── utils.js            # Voice input, Canvas color extraction, CSV exporter
│   ├── dna.js              # Design DNA profiling & tag chips logic
│   ├── upload.js           # Drag-and-drop file uploader & image resizer
│   ├── generate.js         # Groq AI generation controller & step animations
│   ├── output.js           # Multi-tab results renderer & clipboard tools
│   ├── projects.js         # Project gallery, detail modal & metrics
│   ├── crm.js              # Client CRM manager & modal CRUD
│   ├── invoice.js          # Invoice creator, jsPDF renderer & WhatsApp share
│   ├── payments.js         # Revenue calculator & payment reminder engine
│   ├── ideas.js            # Ideas Lab category runner
│   ├── opportunities.js    # Gig scanner & platform link generator
│   └── storage.js          # Unified LocalStorage persistence layer
├── api/
│   ├── generate.js         # Groq AI serverless endpoint (Behance / LinkedIn / SEO)
│   └── ideas.js            # Groq AI serverless endpoint (Ideas & Opportunities)
├── assets/
│   └── logo.png            # VASLKAAR brandmark
├── server.js               # Local development proxy server
├── vercel.json             # Vercel deployment configuration
├── package.json            # Dependencies (`groq-sdk`, `dotenv`)
└── README.md               # Project documentation
```

---

## 🚀 Quickstart & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* Groq Cloud API Key ([Get one free at console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/Javeriaf19/vaslkaar.git
cd vaslkaar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 4. Start Local Development Server
```bash
node server.js
```
Visit **`http://localhost:3000`** in your browser.

---

## 🌐 Deploy to Vercel

Deploy VASLKAAR to Vercel in seconds:

1. Push your code to GitHub.
2. Import repository into [Vercel Dashboard](https://vercel.com).
3. Add Environment Variable:
   * **Key:** `GROQ_API_KEY`
   * **Value:** `gsk_your_groq_api_key_here`
4. Click **Deploy**.

---

## 🏆 Hackathon Submission

* **Event:** Pixel Forge AI Hackathon 2026 (Aug 15–22, 2026)
* **Creator:** Javeria Farhan ([@Javeriaf19](https://github.com/Javeriaf19))
* **Live App:** [vaslkaar.vercel.app](https://vaslkaar.vercel.app)

---

## 📄 License

This project is licensed under the MIT License — built with ❤️ in Pakistan 🇵🇰
