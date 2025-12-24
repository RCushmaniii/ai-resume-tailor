# AI Resume Tailor - Setup Guide

## Phase 0 Complete ✅

The project scaffold is ready with:

- ✅ `/client` - React + Vite + Tailwind + Zustand + TanStack Query + React Router
- ✅ `/server` - Flask backend with CORS
- ✅ API proxy configured in Vite
- ✅ Environment files ready

---

## Quick Start (Running Locally)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Backend

```bash
pnpm dev:server
```

Backend runs at `http://localhost:5000`

### 3. Start Frontend

```bash
pnpm dev:client
```

Frontend runs at `http://localhost:3000`

### 4. Test the End-to-End Flow

- Open `http://localhost:3000/analyze`
- Paste resume + job description
- Click **Analyze Match**

---

## Available Scripts

### Root Level

```bash
pnpm dev              # Start frontend only
pnpm dev:client       # Start frontend (port 3000)
pnpm dev:server       # Start backend (port 5000)
pnpm build            # Build frontend for production
pnpm preview          # Preview production build
pnpm lint             # Lint frontend code
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # Run TypeScript checks
pnpm format           # Format code with Prettier
```

### Client Only

```bash
cd client
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview build
```

### Server Only

```bash
cd server
venv\Scripts\activate # Activate venv (Windows)
python app.py         # Start Flask server
```

---

## Project Structure

```
ai-resume-tailor/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── layout/      # Header, Footer
│   │   │   └── ui/          # ShadCN UI components
│   │   ├── pages/           # Page components
│   │   │   └── TestApiPage.tsx  # API test page
│   │   ├── lib/             # Utilities
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite + proxy config
│
├── server/                  # Flask backend
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment template
│   ├── .env                 # Your environment (gitignored)
│   ├── setup.bat            # Windows setup script
│   └── venv/                # Python virtual env (gitignored)
│
├── package.json             # Root workspace config
├── pnpm-workspace.yaml      # pnpm workspace definition
└── README.md                # Project documentation
```

---

## API Endpoints

### GET `/api/health`

Health check endpoint to verify backend is running.

**Response:**

```json
{
  "status": "ok",
  "message": "Flask backend is running"
}
```

### POST `/api/analyze`

Analyze resume against job description (Phase 0: returns mock data).

**Request:**

```json
{
  "resume": "Your resume text...",
  "job_description": "Job description text..."
}
```

**Response:**

```json
{
  "match_score": 67,
  "score_breakdown": {
    "keyword_overlap": 45,
    "semantic_match": 60,
    "experience_relevance": 70,
    "structure": 85
  },
  "message": "Hello from Flask - Phase 0 mock response"
}
```

---

## Troubleshooting

### Frontend won't start

- Check if port 3000 is available
- Run `pnpm install` in root directory
- Check for TypeScript errors: `pnpm typecheck`

### Backend won't start

- Verify Python 3.9+ is installed: `python --version`
- Check if port 5000 is available
- Activate virtual environment first
- Verify all dependencies installed: `pip list`

### API calls failing

- Ensure both frontend AND backend are running
- Check browser console for CORS errors
- Verify Vite proxy config in `client/vite.config.ts`
- Test backend directly: `http://localhost:5000/api/health`

### spaCy model not found

```bash
cd server
venv\Scripts\activate
python -m spacy download en_core_web_sm
```

---

## Next Steps (Phase 1)

1. ✅ Phase 0 Complete - Project scaffold ready
2. 🔄 Phase 1 - Core Analysis
   - JD URL fetch/clean
   - Keyword extraction (TF-IDF + spaCy)
   - Embeddings similarity (OpenAI)
   - Score computation
3. ⏳ Phase 2 - LLM Suggestions
4. ⏳ Phase 3 - UI/UX Results Dashboard
5. ⏳ Phase 4 - LatAm Language Layer
6. ⏳ Phase 5 - QA & Ship

---

## Support

For issues or questions:

- Check the [README.md](./README.md)
- Review server logs in terminal
- Check browser console for frontend errors
