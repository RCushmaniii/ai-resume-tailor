from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import os
import re
import jwt
import requests
from datetime import datetime
from dotenv import load_dotenv

# Import AI engine
from ai_engine import analyze_resume

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Clerk JWKS cache
_clerk_jwks = None
_clerk_jwks_fetched_at = 0

# App version for deployment tracking
VERSION = "1.0.2"

# Load environment variables
load_dotenv()

app = Flask(__name__)

# CORS configuration - allow requests from your frontend domain
# In production, replace with your actual frontend URL
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv("FRONTEND_URL", "*"),  # Set FRONTEND_URL in production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

# Security: Suspicious patterns that might indicate injection attempts
SUSPICIOUS_PATTERNS = [
    r'<script[\s\S]*?>[\s\S]*?</script>',  # Script tags
    r'javascript:',                         # JavaScript protocol
    r'on\w+\s*=',                          # Event handlers
    r'<iframe[\s\S]*?>',                   # Iframe tags
    r'eval\s*\(',                          # eval() calls
    r'<embed[\s\S]*?>',                    # Embed tags
    r'<object[\s\S]*?>',                   # Object tags
]

_usage_counts_guest = {}
_usage_counts_user = {}


def api_error(
    *,
    error_code: str,
    status_code: int,
    message: str,
    details: dict | None = None,
    extra: dict | None = None,
):
    payload = {
        "error_code": error_code,
        "error": message,
        "message": message,
    }
    if details:
        payload["details"] = details
    if extra:
        payload.update(extra)
    return jsonify(payload), status_code


def _get_bearer_token() -> str | None:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.replace("Bearer ", "", 1).strip()
    return token or None


def _get_clerk_jwks():
    """Fetch Clerk's JWKS for JWT verification (cached for 1 hour)."""
    global _clerk_jwks, _clerk_jwks_fetched_at
    import time as _time

    now = _time.time()
    if _clerk_jwks and (now - _clerk_jwks_fetched_at) < 3600:
        return _clerk_jwks

    clerk_secret = os.getenv("CLERK_SECRET_KEY", "").strip()
    if not clerk_secret:
        return None

    # Extract the Clerk instance ID from the secret key to build the JWKS URL
    # Clerk JWKS endpoint: https://<clerk-frontend-api>/.well-known/jwks.json
    # The frontend API domain can be derived or set explicitly
    clerk_jwks_url = os.getenv("CLERK_JWKS_URL", "")
    if not clerk_jwks_url:
        # Try to get from Clerk's API
        try:
            resp = requests.get(
                "https://api.clerk.com/v1/jwks",
                headers={"Authorization": f"Bearer {clerk_secret}"},
                timeout=10,
            )
            if resp.status_code == 200:
                _clerk_jwks = resp.json()
                _clerk_jwks_fetched_at = now
                return _clerk_jwks
        except Exception as e:
            logger.error(f"Failed to fetch Clerk JWKS: {e}")
            return None

    try:
        resp = requests.get(clerk_jwks_url, timeout=10)
        if resp.status_code == 200:
            _clerk_jwks = resp.json()
            _clerk_jwks_fetched_at = now
            return _clerk_jwks
    except Exception as e:
        logger.error(f"Failed to fetch JWKS from {clerk_jwks_url}: {e}")

    return None


def _validate_clerk_token(token: str):
    """Validate a Clerk JWT and return user info."""
    jwks_data = _get_clerk_jwks()
    if not jwks_data:
        logger.error("Could not fetch Clerk JWKS for token validation")
        return None

    try:
        # Decode JWT header to find the key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        # Find the matching key in JWKS
        rsa_key = None
        for key in jwks_data.get("keys", []):
            if key.get("kid") == kid:
                rsa_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break

        if not rsa_key:
            logger.warning(f"No matching key found in JWKS for kid={kid}")
            return None

        # Verify and decode the token
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )

        user_id = payload.get("sub")
        if not user_id:
            return None

        return {
            "id": user_id,
            "email": payload.get("email"),
            "session_id": payload.get("sid"),
        }

    except jwt.ExpiredSignatureError:
        logger.warning("Clerk token expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid Clerk token: {e}")
        return None
    except Exception as e:
        logger.error(f"Error validating Clerk token: {e}")
        return None


def _get_guest_identity() -> str:
    ip = request.headers.get("X-Forwarded-For", "")
    ip = ip.split(",")[0].strip() if ip else (request.remote_addr or "unknown")
    ua = request.headers.get("User-Agent", "unknown")
    return f"{ip}|{ua}"

def contains_suspicious_content(text: str) -> bool:
    """
    Check if text contains suspicious patterns that might indicate injection attempts.
    """
    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            logger.warning(f"Suspicious pattern detected: {pattern}")
            return True
    return False

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "Flask backend is running",
        "version": VERSION
    })


# ═══════════════════════════════════════════════════════════════════════════
# FILE UPLOAD ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════

@app.route("/api/parse-resume", methods=["POST"])
def parse_resume():
    """
    Parse uploaded resume file (PDF or DOCX) and return extracted text.

    Accepts multipart/form-data with a 'file' field.
    Returns JSON with extracted text, character count, and file type.
    """
    from file_parser import parse_resume_file, FileParserError

    # Check if file was provided
    if 'file' not in request.files:
        return api_error(
            error_code="FILE_MISSING",
            status_code=400,
            message="No file provided. Please upload a PDF or DOCX file."
        )

    file = request.files['file']

    # Check if a file was actually selected
    if not file.filename:
        return api_error(
            error_code="FILE_EMPTY",
            status_code=400,
            message="No file selected. Please choose a file to upload."
        )

    try:
        # Read file bytes
        file_bytes = file.read()
        filename = file.filename

        logger.info(f"Parsing resume file: {filename} ({len(file_bytes)} bytes)")

        # Parse the file
        result = parse_resume_file(file_bytes, filename)

        logger.info(f"Successfully extracted {result['character_count']} characters from {filename}")

        return jsonify({
            "success": True,
            "text": result["text"],
            "character_count": result["character_count"],
            "file_type": result["file_type"]
        })

    except FileParserError as e:
        logger.warning(f"File parsing error for {file.filename}: {e}")
        return api_error(
            error_code="PARSE_ERROR",
            status_code=400,
            message=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error parsing file {file.filename}: {e}")
        return api_error(
            error_code="INTERNAL_ERROR",
            status_code=500,
            message="Failed to parse file. Please try copy-pasting your resume text instead."
        )


@app.route("/api/dev/debug", methods=["GET"])
def dev_debug():
    """Debug endpoint to check localStorage content"""
    if os.getenv("FLASK_ENV") != "development":
        return jsonify({"error": "Not available in production"}), 403
    
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Debug localStorage</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .info { background: #f0f0f0; padding: 10px; margin: 10px 0; }
            button { padding: 10px 20px; margin: 5px; cursor: pointer; }
        </style>
    </head>
    <body>
        <h1>localStorage Debug</h1>
        <div id="info"></div>
        <button onclick="checkStorage()">Check Storage</button>
        <button onclick="clearStorage()">Clear guest_analyses_used</button>
        <button onclick="clearAll()">Clear All</button>
        
        <script>
            function checkStorage() {
                const info = document.getElementById('info');
                let html = '<h2>Current localStorage contents:</h2>';
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = localStorage.getItem(key);
                    html += `<div class="info"><strong>${key}:</strong> ${value}</div>`;
                }
                
                const analyses = localStorage.getItem('guest_analyses_used');
                html += `<div class="info"><strong>guest_analyses_used parsed:</strong> ${analyses ? parseInt(analyses) : 'null'}</div>`;
                
                info.innerHTML = html;
            }
            
            function clearStorage() {
                localStorage.removeItem('guest_analyses_used');
                checkStorage();
            }
            
            function clearAll() {
                localStorage.clear();
                checkStorage();
            }
            
            // Auto-check on load
            checkStorage();
        </script>
    </body>
    </html>
    """
    
    return html_content, 200, {'Content-Type': 'text/html'}


@app.route("/api/dev/reset", methods=["GET", "POST"])
def dev_reset():
    """Development-only endpoint to reset application state"""
    if os.getenv("FLASK_ENV") != "development":
        return jsonify({"error": "Not available in production"}), 403
    
    logger.info("Development reset requested")
    
    # Reset server-side usage counters
    global _usage_counts_guest, _usage_counts_user
    _usage_counts_guest.clear()
    _usage_counts_user.clear()
    logger.info("Server-side usage counters reset")
    
    # Check if this is an API request (JSON) or a browser request
    if request.headers.get('Content-Type') == 'application/json' or request.headers.get('Accept') == 'application/json':
        # Return JSON for API calls
        return jsonify({
            "success": True,
            "message": "Development state reset. Use the browser interface at http://localhost:5000/api/dev/reset to clear localStorage.",
            "timestamp": datetime.utcnow().isoformat()
        })
    
    # Return HTML page with cross-domain localStorage clearing
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Development State - AI Resume Tailor</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                padding: 40px;
                max-width: 600px;
                width: 100%;
                text-align: center;
            }
            
            .icon {
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
            }
            
            .icon svg {
                width: 32px;
                height: 32px;
                color: white;
            }
            
            h1 {
                font-size: 28px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 12px;
            }
            
            .subtitle {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 32px;
                line-height: 1.5;
            }
            
            .button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 14px 32px;
                font-size: 16px;
                font-weight: 600;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin: 8px;
            }
            
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            
            .button:active {
                transform: translateY(0);
            }
            
            .button.secondary {
                background: #6b7280;
            }
            
            .message {
                margin-top: 24px;
                padding: 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                display: none;
                animation: slideIn 0.3s ease-out;
            }
            
            .message.success {
                background: #d1fae5;
                color: #065f46;
                border: 1px solid #a7f3d0;
            }
            
            .message.error {
                background: #fee2e2;
                color: #991b1b;
                border: 1px solid #fecaca;
            }
            
            .message.show {
                display: block;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .footer {
                margin-top: 32px;
                font-size: 12px;
                color: #9ca3af;
            }
            
            .instructions {
                background: #f3f4f6;
                border-radius: 8px;
                padding: 16px;
                margin: 20px 0;
                text-align: left;
            }
            
            .instructions h3 {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #1f2937;
            }
            
            .instructions ol {
                font-size: 13px;
                color: #6b7280;
                margin-left: 20px;
            }
            
            .instructions li {
                margin: 4px 0;
            }
            
            .code {
                background: #1f2937;
                color: #f9fafb;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
            </div>
            
            <h1>Development Reset</h1>
            <p class="subtitle">Reset your free analysis counter to continue testing</p>
            
            <div class="instructions">
                <h3>⚠️ Important: localStorage is per-domain</h3>
                <p>Your frontend runs on a different port than this server, so you need to clear it on the frontend domain.</p>
                <ol>
                    <li>Open your frontend application (http://localhost:3000)</li>
                    <li>Open browser console (F12)</li>
                    <li>Run: <span class="code">localStorage.removeItem('guest_analyses_used')</span></li>
                    <li>Refresh the frontend page</li>
                </ol>
            </div>
            
            <button class="button" onclick="tryDirectReset()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Open Frontend & Reset
            </button>
            
            <button class="button secondary" onclick="copyInstructions()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy Reset Code
            </button>
            
            <div id="message" class="message"></div>
            
            <div class="footer">
                Development tool • Not available in production
            </div>
        </div>
        
        <script>
            function tryDirectReset() {
                // Open the frontend on port 3000
                const url = "http://localhost:3000";
                window.open(url, '_blank');
                
                document.getElementById('message').className = 'message success show';
                document.getElementById('message').innerHTML = '✓ Frontend opened in new tab. Use the console to reset localStorage.';
            }
            
            function copyInstructions() {
                const code = "localStorage.removeItem('guest_analyses_used')";
                navigator.clipboard.writeText(code).then(() => {
                    document.getElementById('message').className = 'message success show';
                    document.getElementById('message').innerHTML = '✓ Reset code copied to clipboard!';
                }).catch(() => {
                    document.getElementById('message').className = 'message error show';
                    document.getElementById('message').innerHTML = '✗ Failed to copy to clipboard.';
                });
            }
        </script>
    </body>
    </html>
    """
    
    return html_content, 200, {'Content-Type': 'text/html'}


@app.route("/api/me", methods=["GET"])
def me():
    """Validate Clerk access token and return basic user info.

    Client should send:
      Authorization: Bearer <access_token>
    """

    token = _get_bearer_token()
    if not token:
        return api_error(
            error_code="AUTH_MISSING_BEARER_TOKEN",
            status_code=401,
            message="Missing bearer token",
        )

    try:
        user_json = _validate_clerk_token(token)
        if not user_json:
            return api_error(
                error_code="AUTH_INVALID_TOKEN",
                status_code=401,
                message="Invalid token",
            )
        return jsonify(
            {
                "id": user_json.get("id"),
                "email": user_json.get("email"),
            }
        )
    except Exception:
        logger.exception("Error validating Clerk token")
        return api_error(
            error_code="AUTH_VALIDATION_FAILED",
            status_code=500,
            message="Auth validation failed",
        )

@app.route("/api/analyze", methods=["POST"])
def analyze():
    start_time = time.time()
    logger.info("Received analyze request")
    
    try:
        # Get data from request
        data = request.json
        if not data:
            return api_error(
                error_code="ANALYZE_NO_DATA",
                status_code=400,
                message="No data provided",
                extra={"match_score": 0},
            )
        
        # Get resume and job description text
        resume_text = data.get("resume", "")
        job_text = data.get("job_description", "")
        
        # Validate inputs - empty check
        if not resume_text or not resume_text.strip():
            return api_error(
                error_code="ANALYZE_RESUME_REQUIRED",
                status_code=400,
                message="Resume text is required",
                details={"field": "resume"},
                extra={"match_score": 0},
            )
        
        if not job_text or not job_text.strip():
            return api_error(
                error_code="ANALYZE_JOB_REQUIRED",
                status_code=400,
                message="Job description text is required",
                details={"field": "job_description"},
                extra={"match_score": 0},
            )
        
        # Security check - detect suspicious content
        if contains_suspicious_content(resume_text):
            logger.warning("Suspicious content detected in resume text")
            return api_error(
                error_code="ANALYZE_RESUME_SUSPICIOUS",
                status_code=400,
                message="Invalid content detected in resume. Please provide plain text only.",
                details={"field": "resume"},
                extra={"match_score": 0},
            )
        
        if contains_suspicious_content(job_text):
            logger.warning("Suspicious content detected in job description text")
            return api_error(
                error_code="ANALYZE_JOB_SUSPICIOUS",
                status_code=400,
                message="Invalid content detected in job description. Please provide plain text only.",
                details={"field": "job_description"},
                extra={"match_score": 0},
            )
        
        # Validate input lengths - reject if too long
        max_length = 10000
        min_resume_length = 200
        min_job_length = 100
        
        if len(resume_text.strip()) < min_resume_length:
            return api_error(
                error_code="ANALYZE_RESUME_TOO_SHORT",
                status_code=400,
                message=f"Resume text is too short (minimum {min_resume_length} characters)",
                details={"field": "resume", "min_length": min_resume_length},
                extra={"match_score": 0},
            )
        
        if len(job_text.strip()) < min_job_length:
            return api_error(
                error_code="ANALYZE_JOB_TOO_SHORT",
                status_code=400,
                message=f"Job description text is too short (minimum {min_job_length} characters)",
                details={"field": "job_description", "min_length": min_job_length},
                extra={"match_score": 0},
            )
        
        if len(resume_text) > max_length:
            return api_error(
                error_code="ANALYZE_RESUME_TOO_LONG",
                status_code=400,
                message=f"Resume text is too long (maximum {max_length:,} characters)",
                details={"field": "resume", "max_length": max_length},
                extra={"match_score": 0},
            )
        
        if len(job_text) > max_length:
            return api_error(
                error_code="ANALYZE_JOB_TOO_LONG",
                status_code=400,
                message=f"Job description text is too long (maximum {max_length:,} characters)",
                details={"field": "job_description", "max_length": max_length},
                extra={"match_score": 0},
            )
        
        token = _get_bearer_token()
        user_id = None
        if token:
            user_json = _validate_clerk_token(token)
            if user_json:
                user_id = user_json.get("id")

        guest_limit = int(os.getenv("GUEST_CREDITS_TOTAL", "3"))
        reg_limit = int(os.getenv("REG_CREDITS_TOTAL", "7"))

        if user_id:
            used = int(_usage_counts_user.get(user_id, 0))
            total = reg_limit
            remaining = max(0, total - used)
            if used >= total:
                return api_error(
                    error_code="ANALYZE_CREDITS_EXCEEDED_REGISTERED",
                    status_code=429,
                    message="Credit limit reached",
                    extra={
                        "match_score": 0,
                        "credits_total": total,
                        "credits_used": used,
                        "credits_remaining": remaining,
                    },
                )
        else:
            guest_id = _get_guest_identity()
            used = int(_usage_counts_guest.get(guest_id, 0))
            total = guest_limit
            remaining = max(0, total - used)
            if used >= total:
                return api_error(
                    error_code="ANALYZE_CREDITS_EXCEEDED_GUEST",
                    status_code=429,
                    message="Free limit reached. Please create an account to continue.",
                    extra={
                        "match_score": 0,
                        "credits_total": total,
                        "credits_used": used,
                        "credits_remaining": remaining,
                    },
                )

        # Use AI engine to analyze resume against job description
        result = analyze_resume(resume_text, job_text)

        if user_id:
            _usage_counts_user[user_id] = int(_usage_counts_user.get(user_id, 0)) + 1
            used = int(_usage_counts_user.get(user_id, 0))
            total = reg_limit
        else:
            guest_id = _get_guest_identity()
            _usage_counts_guest[guest_id] = int(_usage_counts_guest.get(guest_id, 0)) + 1
            used = int(_usage_counts_guest.get(guest_id, 0))
            total = guest_limit

        result["credits_total"] = total
        result["credits_used"] = used
        result["credits_remaining"] = max(0, total - used)
        
        # Calculate processing time (if not already included in result)
        if "processing_time_seconds" not in result:
            elapsed_time = time.time() - start_time
            result["processing_time_seconds"] = round(elapsed_time, 2)
        
        logger.info(f"Analysis completed in {result.get('processing_time_seconds', 0):.2f} seconds")
        
        return jsonify(result)
        
    except Exception:
        logger.exception("Error processing request")
        return api_error(
            error_code="INTERNAL_ERROR",
            status_code=500,
            message="Server error",
            extra={"match_score": 0},
        )

# Register Stripe routes
try:
    from stripe_integration import register_stripe_routes
    register_stripe_routes(app)
except ImportError:
    logger.warning("Stripe integration not available - stripe_integration module not found")
except Exception as e:
    logger.warning(f"Stripe integration not initialized: {e}")

# Register Clerk webhook routes
try:
    from clerk_webhooks import register_clerk_webhook_routes
    register_clerk_webhook_routes(app)
except ImportError:
    logger.warning("Clerk webhooks not available - clerk_webhooks module not found")
except Exception as e:
    logger.warning(f"Clerk webhooks not initialized: {e}")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
