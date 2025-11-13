# Validation & Security Testing Guide

## 🧪 Quick Test Checklist

### Test 1: Empty Fields
- [ ] Leave both fields empty → Click "Analyze Match"
- **Expected:** Button is disabled, no action occurs

### Test 2: Resume Too Short
- [ ] Paste 50 characters in resume field
- [ ] Paste valid job description (200+ chars)
- [ ] Click outside resume field (blur)
- **Expected:** Red border + "Resume seems too short (minimum 200 characters)"

### Test 3: Job Description Too Short
- [ ] Paste valid resume (200+ chars)
- [ ] Paste 50 characters in job field
- [ ] Click outside job field (blur)
- **Expected:** Red border + "Job description seems too short (minimum 100 characters)"

### Test 4: Text Too Long
- [ ] Paste 11,000 characters in resume field
- [ ] Click outside field
- **Expected:** Red border + "Resume is too long (maximum 10,000 characters)"

### Test 5: Script Injection (XSS)
- [ ] Paste: `<script>alert('test')</script>` in resume field
- [ ] Click outside field
- **Expected:** Red border + "Invalid content detected. Please paste plain text only"

### Test 6: Event Handler Injection
- [ ] Paste: `<img src=x onerror="alert('test')">` in job field
- [ ] Click outside field
- **Expected:** Red border + "Invalid content detected. Please paste plain text only"

### Test 7: JavaScript Protocol
- [ ] Paste: `<a href="javascript:alert('test')">Click</a>` in resume field
- [ ] Click outside field
- **Expected:** Red border + "Invalid content detected. Please paste plain text only"

### Test 8: PDF File Paste
- [ ] Paste: `%PDF-1.7 some binary content` in resume field
- [ ] Click outside field
- **Expected:** Red border + "It looks like you pasted a file. Please paste plain text instead"

### Test 9: HTML Document Paste
- [ ] Paste: `<!DOCTYPE html><html><head></head><body>test</body></html>` in job field
- [ ] Click outside field
- **Expected:** Red border + "It looks like you pasted a file. Please paste plain text instead"

### Test 10: Valid Input
- [ ] Paste a real resume (200+ chars) in resume field
- [ ] Paste a real job description (100+ chars) in job field
- **Expected:** 
  - No errors shown
  - Character counters update
  - "Analyze Match" button is enabled
  - Can click to submit

### Test 11: Character Counter
- [ ] Type in resume field
- **Expected:** Counter updates in real-time (e.g., "1,234 / 10,000 characters")

### Test 12: API Error Handling
- [ ] Stop the Flask backend server
- [ ] Submit valid inputs
- **Expected:** Toast notification appears at top: "Analysis Failed - [error message]"

### Test 13: Backend Security (Optional - Advanced)
- [ ] Use Postman or curl to bypass frontend
- [ ] Send request with `<script>` in resume text
- **Expected:** 400 error response with message about invalid content

```bash
# Test with curl (Windows PowerShell)
curl -X POST http://localhost:5000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{\"resume\":\"<script>alert(1)</script>\",\"job_description\":\"test job\"}'
```

## ✅ Success Criteria

All tests should pass with:
- ✅ Inline errors appear below fields
- ✅ Red borders on invalid fields
- ✅ Button disabled when invalid
- ✅ Character counters work
- ✅ Toast appears for API errors
- ✅ No console errors in browser
- ✅ Backend logs suspicious attempts

## 🚀 Ready to Test

1. Start the backend: `cd server && python app.py`
2. Start the frontend: `cd client && pnpm dev`
3. Navigate to `/analyze` page
4. Run through the test checklist above

---

**Note:** If any test fails, check browser console and backend logs for details.
