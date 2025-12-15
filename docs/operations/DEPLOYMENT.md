# Deployment

## Backend (Flask)

Reference: `/docs/development/DEPLOYMENT.md`

- Recommended: Render.com
- Start command: `gunicorn app:app`
- Required env vars:
  - `OPENAI_API_KEY`
  - `FRONTEND_URL`

## Frontend (Vite/React)

- Recommended: Vercel
- Required env vars:
  - `VITE_API_URL` (e.g. `https://your-backend.onrender.com/api`)

## Notes

- Ensure CORS origin matches frontend domain.
- Monitor OpenAI usage/costs.
