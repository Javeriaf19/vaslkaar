# VASLKAAR — Your work, connected.

> AI-Powered Freelancer OS — Work. Track. Earn.

**VASLKAAR** (from Urdu: *vasl* = connection/receipt, *kaar* = work/doer) is an AI-powered Freelancer OS built for creative professionals who manage multiple income streams, clients, and projects.

## ✨ What it does

- 📋 **Auto-documents** your creative work into polished Behance case studies & LinkedIn posts
- 📊 **Tracks** your clients, projects, deadlines, and payment status
- 🧾 **Generates** invoices, payment reminders, and income summaries

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML + Tailwind CSS (CDN) + Vanilla JS |
| AI Engine | Google Gemini API |
| Backend | Vercel Serverless Functions |
| Storage | localStorage (MVP) |
| Deployment | Vercel |
| Fonts | Inter + DM Sans (Google Fonts) |
| Icons | Lucide Icons |

## 🚀 Getting Started

### Local Development

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vaslkaar.git
   cd vaslkaar
   ```

2. Install serverless function dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run with Vercel CLI:
   ```bash
   npx vercel dev
   ```

5. Open `http://localhost:3000`

### Deploy to Vercel

```bash
npx vercel --prod
```

## 📂 Project Structure

```
vaslkaar/
├── index.html          # Single-page app (all screens)
├── css/
│   └── styles.css      # Custom styles beyond Tailwind
├── js/
│   ├── app.js          # Main app controller & routing
│   ├── dna.js          # Design DNA setup logic
│   ├── upload.js       # Project upload & image handling
│   ├── generate.js     # AI generation API calls
│   ├── output.js       # Results display & copy
│   ├── projects.js     # My Projects list
│   └── storage.js      # localStorage wrapper
├── api/
│   └── generate.js     # Vercel serverless function
├── assets/
│   └── logo.png        # Vaslkaar logo
├── vercel.json         # Vercel config
├── package.json        # Dependencies
└── README.md
```

## 🏆 Pixel Forge AI Hackathon 2026

Built in 7 days for the Pixel Forge AI Hackathon (Aug 15–22, 2026).

**Demo:** [vaslkaar.vercel.app](https://vaslkaar.vercel.app)

## 📄 License

MIT License — built with ❤️ in Pakistan 🇵🇰
