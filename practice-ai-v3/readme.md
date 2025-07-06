# superai2025
The repository of Mahidol SuperAI

practice-ai-v3/
│
├── frontend/                # Vue 3 + Vite (generated via V0)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── assets/
│       │   └── main.css
│       ├── components/
│       ├── pages/
│       │   ├── LandingPage.vue
│       │   ├── Login.vue
│       │   ├── Register.vue
│       │   ├── StudentDashboard.vue
│       │   ├── AdminDashboard.vue
│       │   ├── QuizDesigner.vue
│       │   └── TakeQuiz.vue
│       ├── router/
│       │   └── index.js
│       ├── store/
│       │   └── auth.js
│       └── main.js
│
├── backend/                 # Node.js + Express API (see below)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Question.js
│       │   └── Attempt.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── questionController.js
│       │   └── adminController.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── questions.js
│       │   └── admin.js
│       ├── middlewares/
│       │   └── auth.js
│       ├── services/
│       │   └── n8nService.js
│       └── utils/
│           └── evaluateCode.js
│
├── n8n/                     # Low‑code orchestration
│   ├── docker-compose.yml   # Stand‑alone n8n instance
│   └── workflows/
│       └── generate-questions.json  # Exports of the question‑gen flow
│
├── infra/                   # Dev & prod orchestration
│   └── docker-compose.yml   # Combines backend, mongo, n8n (frontend deploys on Vercel)
│
├── README.md                # Setup guide
└── .gitignore


---

# AI Quiz Backend

## Quick Start (backend)
1. Copy `.env.example` to `.env` and fill the values.
2. `npm install`
3. `npm run dev` // start with nodemon (npm install --save-dev nodemon)

## Quick Start (dev all‑in‑one)
```bash
# 1️⃣ clone repo & install deps
npm install -r          # or npm install in each package

# 2️⃣ spin up services
cd infra && docker compose up -d   # launches mongo + n8n + backend

# 3️⃣ run frontend
cd ../frontend && npm run dev         # Vite dev server http://localhost:5173 
(npm install --save-dev autoprefixer)
```

> **Note** Frontend is auto‑deployed on Vercel; backend/n8n use Render/Railway or Docker VPS in production.

---