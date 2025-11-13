# Python Backend Deployment Guide

## ✅ Pre-Deployment Checklist

Your backend is ready for deployment with:

- ✅ `requirements.txt` with all dependencies including `gunicorn`
- ✅ `app.py` with CORS configured
- ✅ Security validation for input sanitization
- ✅ Environment variable support
- ✅ Production-ready error handling

## 📋 Required Environment Variables

Create a `.env` file in production with:

```bash
OPENAI_API_KEY=sk-your-actual-openai-key
FLASK_ENV=production
FLASK_DEBUG=False
FRONTEND_URL=https://your-frontend-domain.com
```

**Important:** 
- Set `FRONTEND_URL` to your actual frontend domain in production
- Never commit `.env` to version control (already in `.gitignore`)

## 🚀 Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repo**
3. **Configure:**
   - **Root Directory:** `server`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python 3.11+

4. **Add Environment Variables:**
   - `OPENAI_API_KEY`
   - `FRONTEND_URL`
   - `FLASK_ENV=production`

5. **Deploy!**

### Option 2: Railway.app

1. **Create new project** from GitHub
2. **Configure:**
   - **Root Directory:** `server`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

3. **Add Environment Variables** (same as above)

### Option 3: Heroku

1. **Create `Procfile` in server directory:**
   ```
   web: gunicorn app:app
   ```

2. **Deploy:**
   ```bash
   heroku create your-app-name
   git subtree push --prefix server heroku main
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=sk-your-key
   heroku config:set FRONTEND_URL=https://your-frontend.com
   heroku config:set FLASK_ENV=production
   ```

### Option 4: DigitalOcean App Platform

1. **Create new App** from GitHub
2. **Configure:**
   - **Source Directory:** `server`
   - **Run Command:** `gunicorn app:app --bind 0.0.0.0:8080`
   - **HTTP Port:** 8080

3. **Add Environment Variables**

## 🔧 Production Configuration

### Gunicorn Configuration (Optional)

Create `gunicorn.conf.py` in server directory:

```python
import multiprocessing

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'
```

Then use: `gunicorn -c gunicorn.conf.py app:app`

## 🧪 Test Production Build Locally

1. **Install dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run with Gunicorn:**
   ```bash
   gunicorn app:app --bind 0.0.0.0:5000
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:5000/api/health
   ```

   Expected response:
   ```json
   {"status": "ok", "message": "Flask backend is running"}
   ```

## 🔒 Security Checklist

Before deploying:

- [ ] `FLASK_DEBUG=False` in production
- [ ] `FRONTEND_URL` set to actual domain (not `*`)
- [ ] `OPENAI_API_KEY` stored securely (environment variable, not in code)
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enabled on hosting platform
- [ ] Rate limiting configured (if needed)

## 📊 Monitoring

After deployment, monitor:

1. **Application logs** - Check for errors
2. **API response times** - Should be < 5s for analysis
3. **OpenAI API usage** - Monitor costs
4. **Error rates** - Track 4xx and 5xx responses

## 🆘 Troubleshooting

### Issue: CORS errors in production

**Solution:** Make sure `FRONTEND_URL` environment variable is set correctly:
```bash
FRONTEND_URL=https://your-actual-frontend-domain.com
```

### Issue: OpenAI API errors

**Solution:** Verify `OPENAI_API_KEY` is set and valid:
```bash
# Test locally
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('OPENAI_API_KEY'))"
```

### Issue: Module not found errors

**Solution:** Ensure all dependencies are in `requirements.txt` and installed:
```bash
pip install -r requirements.txt
```

### Issue: Port already in use

**Solution:** Use environment variable for port:
```python
# In app.py
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)
```

## 🎯 Next Steps

1. Deploy backend to your chosen platform
2. Note the backend URL (e.g., `https://your-api.render.com`)
3. Update frontend to use production API URL
4. Deploy frontend
5. Test end-to-end functionality

---

**Your backend is production-ready!** 🚀
