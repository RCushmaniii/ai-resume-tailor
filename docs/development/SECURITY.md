# Security Measures

This document outlines the security measures implemented in the AI Resume Tailor application to protect against common web vulnerabilities.

## 🛡️ Protection Against Code Injection & XSS

### Frontend Protection (Client-Side)

**Location:** `client/src/lib/validation.ts`

1. **Pattern Detection**
   - Detects and blocks `<script>` tags
   - Blocks JavaScript protocols (`javascript:`)
   - Blocks event handlers (`onclick`, `onerror`, etc.)
   - Blocks `<iframe>`, `<embed>`, `<object>` tags
   - Blocks `eval()` and CSS `expression()` calls

2. **React's Built-in Protection**
   - All user input is rendered using React's JSX syntax (`{variable}`)
   - React automatically escapes HTML entities
   - No use of `dangerouslySetInnerHTML` in user input areas

3. **Validation Flow**
   ```
   User Input → Pattern Detection → Length Validation → Submit
   ```

### Backend Protection (Server-Side)

**Location:** `server/app.py`

1. **Duplicate Pattern Detection**
   - Same suspicious patterns checked on backend
   - Prevents bypassing frontend validation
   - Logs suspicious attempts for monitoring

2. **Input Sanitization**
   - All inputs validated before processing
   - Suspicious content rejected with 400 error
   - Clear error messages returned to user

3. **OpenAI API Safety**
   - Text sent to OpenAI is treated as plain text
   - No code execution occurs in AI processing
   - Response is structured JSON, not executable code

## 🔒 Additional Security Layers

### 1. Input Length Limits
- **Maximum:** 10,000 characters per field
- **Minimum:** 200 chars (resume), 100 chars (job)
- Prevents resource exhaustion attacks

### 2. Content Type Validation
- Detects accidental file pastes (PDF markers, HTML documents)
- Ensures only plain text is processed

### 3. CORS Configuration
- Flask-CORS properly configured
- Prevents unauthorized cross-origin requests

### 4. Error Handling
- Generic error messages to users
- Detailed logging for administrators
- No sensitive information exposed in errors

## 🚨 What We're Protected Against

| Attack Type | Protection Method | Status |
|------------|------------------|--------|
| XSS (Cross-Site Scripting) | React escaping + Pattern detection | ✅ Protected |
| Script Injection | Pattern blocking on client & server | ✅ Protected |
| HTML Injection | Pattern detection + React escaping | ✅ Protected |
| Event Handler Injection | Pattern blocking (`on*=` attributes) | ✅ Protected |
| SQL Injection | N/A - No database used | ✅ N/A |
| Command Injection | Text-only processing, no shell commands | ✅ Protected |
| Resource Exhaustion | Length limits (10k chars) | ✅ Protected |

## 🔍 Monitoring & Logging

All suspicious activity is logged:
```python
logger.warning(f"Suspicious pattern detected: {pattern}")
logger.warning("Suspicious content detected in resume text")
```

Monitor your logs for repeated attempts, which may indicate:
- Automated attack attempts
- Malicious users
- Need for additional security measures (e.g., rate limiting)

## 📋 Security Best Practices Implemented

1. ✅ **Defense in Depth** - Multiple layers of validation
2. ✅ **Fail Secure** - Reject suspicious input by default
3. ✅ **Least Privilege** - OpenAI API only receives text data
4. ✅ **Input Validation** - Both client and server-side
5. ✅ **Secure by Default** - React's automatic escaping
6. ✅ **Logging & Monitoring** - Track suspicious attempts

## 🚀 Future Security Enhancements (Optional)

For production at scale, consider:

1. **Rate Limiting**
   - Limit requests per IP address
   - Prevent brute force attacks
   - Use Flask-Limiter or similar

2. **CAPTCHA**
   - Add reCAPTCHA for bot protection
   - Especially important if abuse occurs

3. **Content Security Policy (CSP)**
   - Add CSP headers to prevent XSS
   - Already protected by React, but adds extra layer

4. **API Authentication**
   - Add user authentication if needed
   - Protect against unauthorized API access

5. **Input Sanitization Library**
   - Consider using `bleach` or `html5lib` for Python
   - Additional HTML sanitization layer

## 📝 Testing Security

To verify protections are working:

1. **Test Script Injection**
   ```
   Paste: <script>alert('XSS')</script>
   Expected: "Invalid content detected" error
   ```

2. **Test Event Handler**
   ```
   Paste: <img src=x onerror="alert('XSS')">
   Expected: "Invalid content detected" error
   ```

3. **Test JavaScript Protocol**
   ```
   Paste: <a href="javascript:alert('XSS')">Click</a>
   Expected: "Invalid content detected" error
   ```

All tests should be blocked at the validation layer before reaching the backend.

## 🆘 Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT open a public issue
2. Contact the development team privately
3. Provide detailed reproduction steps
4. Allow time for a fix before public disclosure

---

**Last Updated:** November 2025  
**Security Review Status:** ✅ MVP Security Measures Implemented
