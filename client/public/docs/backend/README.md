# AI Resume Tailor - Backend

Flask API for resume analysis and tailoring.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

5. Create `.env` file from `.env.example` and add your OpenAI API key

6. Run the server:
```bash
python app.py
```

Server will run on `http://localhost:5000`

## API Endpoints

### GET /api/health
Health check endpoint

### POST /api/analyze
Analyze resume against job description

**Request body:**
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
  }
}
```
