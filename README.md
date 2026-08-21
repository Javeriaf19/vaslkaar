# 🌟 VASLKAAR — Your Work, Connected.

> **The All-In-One AI Freelancer OS** — Document creative projects, generate multi-slide carousel decks, manage clients, issue PDF invoices, track real-time payments, and discover live gig opportunities with AI execution roadmaps.

[![Pixel Forge AI Hackathon](https://img.shields.io/badge/Pixel%20Forge-AI%20Hackathon%202026-gold?style=for-the-badge)](https://vaslkaar.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
[![Built with Groq](https://img.shields.io/badge/AI%20Engine-Groq%20SDK%20120B-f59e0b?style=for-the-badge)](https://groq.com)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-22c55e?style=for-the-badge)](#)

---

## 📑 Table of Contents

- [About](#about)
- [Features](#features)
  - [1. Creative Hub & Case Study Engine](#1-creative-hub--case-study-engine)
  - [2. 4-Slide Graphic & Document Studio](#2-4-slide-graphic--document-studio)
  - [3. Business Suite (CRM, Invoices, Payments)](#3-business-suite-crm-invoices-payments)
  - [4. Growth Engine (Ideas Lab & Live Opportunities)](#4-growth-engine-ideas-lab--live-opportunities)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Setup](#installation--local-setup)
- [Configuration](#configuration)
- [Security](#security)
- [How to Contribute?](#how-to-contribute)
- [What's Next?](#whats-next)
- [License](#license)
- [Acknowledgements](#-acknowledgements)
- [Author & Founder](#-author--founder)

---

## 📖 About

**VASLKAAR** (derived from Urdu: *Vasl* وصل = connection / coming together, *Kaar* کار = work / doer) is an all-in-one operating system engineered specifically for creative freelancers, graphic designers, video editors, and indie builders who juggle multiple clients, platforms, and income streams.

### The Problem
Freelancers currently waste 40%+ of their working hours context-switching between 6 different disconnected tools:
- **Case Studies & Portfolios:** Writing long Behance narratives and LinkedIn hooks manually.
- **Graphic Design:** Spending hours recreating carousel slides in Canva or Figma.
- **Client Management:** Losing track of leads across WhatsApp, Upwork, and Fiverr.
- **Invoicing & Payments:** Using spreadsheets and manual PDF creators, following up on unpaid bills with awkward messages.
- **Growth & Direction:** Struggling to find high-paying gigs and actionable skill roadmaps.

### The VASLKAAR Solution
VASLKAAR bridges the entire creative-to-business lifecycle in a unified, private, lightning-fast workspace. Powered by Groq's high-speed LLM engine and client-side vector graphics rendering, VASLKAAR turns screenshots into Behance case studies, LinkedIn posts, 4-slide carousel graphic decks, professional PDF invoices, and automated client reminders in seconds.

---

## ✨ Features

### 1. Creative Hub & Case Study Engine
* **🧬 Design DNA Profiling:** Set your unique creative profile — choose from **11+ professions** (Graphic Designer, UI/UX, Video Editor, 3D Artist, etc.), aesthetic styles, inspirations, and output language.
* **🌐 Multilingual AI Generation:** Auto-writes in **English, Urdu (اردو), Hindi (हिंदी), Punjabi (پنجابی), French (Français), Arabic (العربية), and Spanish (Español)**.
* **🎤 Built-in Voice Input:** Speak instead of typing project briefs using browser-native Web Speech API.
* **🎨 Canvas Color Palette Extraction:** Automatically extracts dominant hex codes from uploaded images via HTML5 Canvas.
* **📝 Multi-Format Output:**
  * **Behance Case Study:** Complete overview, design challenge, process, strategic solution, and full description with 1-click Behance Editor launcher.
  * **LinkedIn Post Variations:** 3 viral formats (Short <150 chars, Medium ~300 chars, Long ~500 chars with hashtags) with **1-Click Publish to LinkedIn Composer**.
  * **SEO & Accessibility Package:** Behance tags, Google meta descriptions, and image alt text for every uploaded asset.

### 2. 4-Slide Graphic & Document Studio
* **🖼️ Multi-Slide Carousel Deck Studio:** Turn your project instantly into a 4-slide LinkedIn Document / Instagram carousel:
  * **Slide 1:** *Viral Hook & Cover* (Project Title + Badge + Extracted Palette)
  * **Slide 2:** *The Challenge & Strategy* (Core Problem + Strategic Solution)
  * **Slide 3:** *Visual Deliverables & Palette* (Palette Swatches + Tools Used)
  * **Slide 4:** *Results & Call to Action* (Key Metrics + Author Handle + CTA)
* **📐 3 Format Ratios:** 1:1 Square (Feed), 4:5 Portrait (Carousel), 16:9 Banner (Cover).
* **🎭 4 Design Themes:** ✨ *Dark Gold* (Luxury), ⚪ *Minimal* (Clean Editorial), 🌌 *Cyber* (Neon Modern), 🌿 *Emerald* (Warm Organic).
* **📥 High-Res Export:** Download single slides or one-click **"Download All 4 Slides (Deck)"** in crisp 2.5x Retina PNG quality via `html2canvas`.

### 3. Business Suite (CRM, Invoices, Payments)
* **🧑‍💼 Client CRM:** Track clients across Fiverr, Upwork, LinkedIn, and Direct contracts with status badges (*Active, On-Hold, Completed, Problem*), notes, and **1-Click WhatsApp Direct Chat**.
* **🧾 Professional Invoices & PDF Export:** Dynamic line items, auto-numbering (`INV-001`), multi-currency (`PKR`, `USD`, `EUR`, `GBP`), one-click branded PDF download (via `jsPDF`), and direct WhatsApp invoice sharing.
* **💰 Payment Tracker & AI Reminders:** Live financial metrics for *Total Earned, Pending Payments, and Overdue Balances* with automated polite WhatsApp reminder messages.
* **📊 One-Click CSV Export:** Export client rosters, invoice ledgers, and payment history to CSV for Excel / Google Sheets bookkeeping.

### 4. Growth Engine (Ideas Lab & Live Opportunities)
* **💡 5-Category Ideas Lab:** AI consultant tailored to your Design DNA for *Portfolio Projects, Hackathon Concepts, 30-Day Income Boosts, High-Income Skills, and Passive Digital Products*.
* **🎯 Opportunities Radar:** AI-matched gigs and remote jobs scanning Upwork, Fiverr, LinkedIn, Devpost, Contra, and Wellfound.
* **🗺️ 3-Phase Execution Roadmaps:** Step-by-step actionable roadmaps with free tool badges (`Figma`, `Canva`, `CapCut`, `GitHub`) and direct **YouTube masterclass tutorial links**.
* **🔗 Verified Live Deep-Search URLs:** Zero broken or 404 links — every platform link leads directly to live filtered search results.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6+) |
| **Icons & Typography** | Lucide Icons, Plus Jakarta Sans, DM Sans |
| **AI Engine & Inference** | [Groq SDK](https://groq.com) (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`) |
| **Graphic Vector Rendering** | `html2canvas` (2.5x Retina Scale Canvas-to-PNG Exporter) |
| **PDF Generation** | `jsPDF` (Client-Side Vector PDF Engine) |
| **Voice Recognition** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **Serverless Backend** | Vercel Serverless Functions (`api/generate.js`, `api/ideas.js`) |
| **Local Development** | Node.js HTTP Proxy Server (`server.js`) |
| **Data Storage** | LocalStorage API (Zero-database, private, client-side persistence) |
| **Deployment & Hosting** | Vercel Global Edge Network |

---

## 🏛 Architecture

```
                                    +-----------------------------------------+
                                    |               USER BROWSER              |
                                    |  Single Page App (Tailwind + Vanilla JS)|
                                    +----+-------------------------------+----+
                                         |                               |
                   +---------------------+-------------------------------+---------------------+
                   |                                                     |                     |
                   v                                                     v                     v
       +-----------------------+                             +-----------------------+  +--------------+
       |   Client-Side Engine  |                             | LocalStorage Database |  | Web Speech   |
       |  - html2canvas (PNG)  |                             | - vaslkaar_dna        |  | API (Voice)  |
       |  - jsPDF (Invoices)   |                             | - vaslkaar_projects   |  +--------------+
       |  - Canvas (Colors)    |                             | - vaslkaar_clients    |
       +-----------+-----------+                             | - vaslkaar_invoices   |
                   |                                         +-----------------------+
                   v
       +-----------------------+
       | Exported Files & PNGs |
       +-----------------------+
                   ^
                   | (POST JSON Payload)
                   v
       +-------------------------------------------------------------------------------+
       |                         VERCEL SERVERLESS EDGE API / NODE.JS                  |
       |              /api/generate (Case Studies)   |   /api/ideas (Growth Engine)    |
       +---------------------------------------+---------------------------------------+
                                               |
                                               v
                             +-----------------------------------+
                             |          GROQ CLOUD API           |
                             |  - openai/gpt-oss-120b (Primary)  |
                             |  - qwen/qwen3.6-27b (Fallback)    |
                             +-----------------------------------+
```

---

## 📁 Project Structure

```
vaslkaar/
├── index.html              # Complete SPA architecture (all screens, modals, & tabs)
├── css/
│   └── styles.css          # Theme tokens, custom animations, artboard styles & scrollbars
├── js/
│   ├── app.js              # SPA router, sidebar controller, toast system, tab switcher
│   ├── utils.js            # Voice input, HTML5 Canvas color extraction, CSV exporter
│   ├── dna.js              # Design DNA profiling (professions, languages, aesthetics)
│   ├── upload.js           # Drag-drop file uploader, image resizer, form validator
│   ├── generate.js         # Groq AI generation controller & step animation runner
│   ├── graphics.js         # 4-Slide Graphic & Document Studio + html2canvas PNG exporter
│   ├── output.js           # Multi-tab results renderer, clipboard & 1-click share triggers
│   ├── projects.js         # Project gallery, detail modal & status manager
│   ├── crm.js              # Client CRM manager, modal CRUD & WhatsApp chat launcher
│   ├── invoice.js          # Invoice creator, jsPDF renderer & WhatsApp share engine
│   ├── payments.js         # Revenue calculator & payment reminder engine
│   ├── ideas.js            # Ideas Lab runner, verified URL resolver & roadmap drawer
│   ├── opportunities.js    # Opportunities radar & live apply link generator
│   └── storage.js          # Unified LocalStorage persistence layer
├── api/
│   ├── generate.js         # Serverless API for Behance case studies, LinkedIn & SEO
│   └── ideas.js            # Serverless API for Growth ideas, gigs & execution roadmaps
├── assets/
│   └── logo.png            # VASLKAAR brandmark
├── server.js               # Local development server with API proxying
├── vercel.json             # Vercel deployment configuration
├── package.json            # Node.js dependencies (`groq-sdk`, `dotenv`)
└── README.md               # Complete project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher)
* A free Groq Cloud API Key ([Get one free at console.groq.com](https://console.groq.com))
* Modern browser (Google Chrome, Microsoft Edge, Brave, Safari)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Javeriaf19/vaslkaar.git
   cd vaslkaar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   ```

4. **Start the local development server:**
   ```bash
   node server.js
   ```

5. **Open your browser:**
   Navigate to **`http://localhost:3000`** to experience VASLKAAR.

---

## ⚙️ Configuration

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | **Yes** | Your Groq Cloud API Key for AI generation. Obtainable for free at [console.groq.com](https://console.groq.com). |
| `PORT` | No | Port for local dev server (Default: `3000`). Configurable in `server.js`. |

### Vercel Deployment Configuration
Deploy directly to Vercel in seconds:
1. Push your repository to GitHub.
2. Connect your repo in the [Vercel Dashboard](https://vercel.com).
3. Under **Settings → Environment Variables**, add:
   * **Key:** `GROQ_API_KEY`
   * **Value:** `gsk_your_groq_api_key_here`
4. Click **Deploy**.

---

## 🔒 Security

* **Client-Side Privacy First:** All user files, client databases, invoice records, and financial earnings are stored strictly in client-side `localStorage`. No sensitive client data is ever sold or permanently stored on external database servers.
* **API Key Protection:** The Groq API key is stored securely in environment variables on the backend serverless layer (`api/generate.js` and `api/ideas.js`) and is never exposed to the client-side JavaScript bundle.
* **Zero Malicious Dependencies:** Clean, audit-free architecture built with zero heavy frameworks, eliminating client-side supply-chain attack vectors.

---

## 🤝 How to Contribute?

Contributions, issues, and feature requests are welcome!

1. **Fork the repository** (`https://github.com/Javeriaf19/vaslkaar/fork`).
2. **Create your feature branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "feat: Add AmazingFeature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request** with a detailed summary of your changes.

---

## 🗺️ What's Next?

- [ ] **v1.1 — Cloud Sync & Auth:** Optional Firebase Auth & Firestore cloud synchronization across multiple devices.
- [ ] **v1.2 — Direct Social Publishing:** OAuth 2.0 direct publishing to LinkedIn Company Pages and Twitter/X threads.
- [ ] **v1.3 — WhatsApp Business Automation:** Automated invoice sending via official Meta Cloud WhatsApp Business Webhooks.
- [ ] **v1.4 — AI Video Script & Storyboard Studio:** Auto-generate TikTok/Reels captions, video hooks, and B-roll shot lists.
- [ ] **v2.0 — Mobile PWA:** Progressive Web App with offline support and push notifications for payment due dates.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgements

* **[Pixel Forge AI Hackathon 2026](https://vaslkaar.vercel.app)** — For the inspiration and platform to build VASLKAAR.
* **[Groq](https://groq.com)** — For blazing-fast AI inference speeds with LPU technology.
* **[Lucide Icons](https://lucide.dev)** — For the beautiful vector icons.
* **[Tailwind CSS](https://tailwindcss.com)** — For the utility-first styling system.
* **[html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://github.com/parallax/jsPDF)** — For client-side graphic rendering and PDF generation.

---

## 👩‍💻 Author & Founder

**Javeria Farhan**  
*Founder, Lead Creator & Computer Science Student*

I am a 21-year-old creative technologist from Pakistan combining **Graphic Design, Video Editing, and Full-Stack AI Development**. I built **VASLKAAR** to solve the exact operational fragmentation and burnout I faced while balancing freelance client deliverables, design workflows, and computer science studies.

* 💼 **LinkedIn:** [linkedin.com/in/javeriafarhan](https://www.linkedin.com/in/javeriafarhan)
* 🐙 **GitHub:** [@Javeriaf19](https://github.com/Javeriaf19)
* ✉️ **Email:** [javeriafarhan19@gmail.com](mailto:javeriafarhan19@gmail.com)
* 🌐 **Live Application:** [vaslkaar.vercel.app](https://vaslkaar.vercel.app)
* 🇵🇰 **Proudly Designed & Built with ❤️ in Pakistan**
