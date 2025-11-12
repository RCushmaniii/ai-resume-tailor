# AI Resume Tailor - AI Engine

This document describes the AI-powered resume analysis engine implemented in Phase 1 of the AI Resume Tailor project.

## Architecture Changes

We've transformed the backend from a manual NLP-based analysis to a fully AI-powered solution using OpenAI's GPT-4. The key changes include:

1. **Replaced manual NLP with AI**: Instead of using spaCy, TF-IDF, and custom algorithms, we now use GPT-4 to analyze resumes and job descriptions.

2. **New AI Engine Module**: Created `ai_engine.py` that handles all OpenAI API interactions, prompt engineering, and response parsing.

3. **Updated API Flow**: The `/api/analyze` endpoint now uses the AI engine while maintaining the same request/response format.

## Key Components

### 1. AI Engine (`ai_engine.py`)

- **Prompt Engineering**: Carefully crafted system and user prompts to guide GPT-4 in analyzing resumes.
- **OpenAI API Integration**: Uses the OpenAI Python client to make API calls.
- **JSON Parsing & Validation**: Ensures the AI's response is properly formatted and contains all required fields.
- **Error Handling**: Gracefully handles API errors, rate limits, and malformed responses.
- **Debug Logging**: Logs prompts and responses in debug mode for troubleshooting.

### 2. Updated Flask API (`app.py`)

- **Same API Interface**: Maintains the same request/response format for compatibility.
- **Input Validation**: Checks for required fields and valid input formats.
- **Job URL Handling**: Still supports fetching job descriptions from URLs.
- **Error Handling**: Comprehensive error handling for all potential failure points.

## Response Format

The AI analysis returns a structured JSON with:

```json
{
  "match_score": 75,  // Overall match score (0-100)
  "score_breakdown": {
    "keyword_overlap": 70,  // Score based on matching keywords
    "semantic_match": 80,   // Score based on overall relevance
    "structure": 75         // Score based on resume structure
  },
  "missing_keywords": [
    {
      "keyword": "Docker",
      "priority": "high"
    },
    {
      "keyword": "Kubernetes",
      "priority": "medium"
    }
  ],
  "improvement_suggestions": [
    "Add experience with containerization technologies like Docker",
    "Highlight any cloud platform experience (AWS, Azure, GCP)",
    "Quantify achievements with more specific metrics"
  ],
  "processing_time_seconds": 3.45
}
```

## Testing

You can test the AI engine with the included `test_ai_analysis.py` script:

```bash
cd server
python test_ai_analysis.py
```

This will run a sample resume and job description through the AI engine and display the results.

## Environment Setup

1. Make sure you have an OpenAI API key
2. Copy `.env.example` to `.env` and add your API key:

```
OPENAI_API_KEY=sk-your-actual-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

## API Usage Example

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Python developer with 5 years experience...",
    "job_description": "Looking for a Python developer with AWS experience..."
  }'
```

## Performance Considerations

- **Response Time**: The AI analysis typically takes 2-5 seconds depending on input length.
- **Token Limits**: Very long resumes or job descriptions may hit token limits.
- **API Costs**: Each analysis makes one call to the OpenAI API, which has associated costs.

## Future Improvements

- Implement caching to reduce API calls for repeated analyses
- Add more detailed analysis categories
- Fine-tune the prompts for better accuracy
- Add support for different resume formats (PDF parsing)
