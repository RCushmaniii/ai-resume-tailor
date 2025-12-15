# Testing

## 1. Validation & Security Testing (UI)

Use this checklist to confirm client-side validation and error states.

### Test 1: Empty Fields

- Leave both fields empty → Click "Analyze Match"
- Expected: Button is disabled

### Test 2: Resume Too Short

- Paste 50 characters in resume field
- Paste valid job description (100+ chars)
- Blur resume field
- Expected: "Resume seems too short (minimum 200 characters)"

### Test 3: Job Description Too Short

- Paste valid resume (200+ chars)
- Paste 50 characters in job field
- Blur job field
- Expected: "Job description seems too short (minimum 100 characters)"

### Test 4: Text Too Long

- Paste 11,000 characters in a field
- Expected: "... maximum 10,000 characters"

### Test 5: Script Injection (XSS)

- Paste: `<script>alert('test')</script>`
- Expected: "Invalid content detected. Please paste plain text only"

### Test 6: PDF / HTML Paste

- Paste: `%PDF-1.7 ...`
- Expected: "It looks like you pasted a file. Please paste plain text instead"

## 2. Analyze Page UX Tests (Results Rendering)

### Happy Path

- Paste real resume text (200+ chars)
- Paste real job description text (100+ chars)
- Click **Analyze Match**
- Expected:
  - Loading UI appears
  - Results render: score, breakdown, missing keywords, suggestions

### Re-analyze

- After results render, click **Analyze Again**
- Expected:
  - Results cleared
  - Inputs remain present

## 3. Backend security bypass test (optional)

Use curl/Postman to confirm backend rejects suspicious content.

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resume":"<script>alert(1)</script>","job_description":"test job"}'
```

Expected:

- HTTP 400 with an "Invalid content" style message
