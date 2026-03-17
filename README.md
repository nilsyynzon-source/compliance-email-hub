# Compliance Email Hub
### Philadelphia Property Management — AI-Powered Email Generator

---

## Deploy to Vercel (5 minutes, free)

### Step 1 — Get an Anthropic API key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3 — Deploy
In this folder, run:
```bash
vercel
```
Follow the prompts:
- Set up and deploy? → **Y**
- Which scope? → your account
- Link to existing project? → **N**
- Project name → `compliance-email-hub` (or anything you like)
- In which directory is your code? → **./** (just press Enter)
- Want to modify settings? → **N**

### Step 4 — Add your API key (keeps it secret)
After deploying, run:
```bash
vercel env add ANTHROPIC_API_KEY
```
- Select **Production**, **Preview**, and **Development**
- Paste your Anthropic API key when prompted

### Step 5 — Redeploy with the key active
```bash
vercel --prod
```

Your app will be live at a URL like:
`https://compliance-email-hub.vercel.app`

---

## Local development
```bash
npm install
vercel dev
```
Then open http://localhost:3000

---

## Project structure
```
/
├── public/
│   └── index.html        ← Full frontend app
├── api/
│   └── generate.js       ← Secure backend (hides your API key)
├── package.json
├── vercel.json
└── README.md
```

---

## Features
- Single property email generation
- Batch mode — multiple properties at once with live progress
- 4 email types: First reminder, Follow-up, Final notice, Review request
- 20 Philadelphia compliance item types
- Saved email history (persists in browser)
- Export all emails as .txt
- API key never exposed to the browser
