from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import os
import re
import requests
from dotenv import load_dotenv

# Import AI engine
from ai_engine import analyze_resume

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

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


def _validate_supabase_token(token: str):
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    publishable_key = os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
    publishable_key = (publishable_key or "").strip()

    if not supabase_url or not publishable_key:
        return None

    resp = requests.get(
        f"{supabase_url}/auth/v1/user",
        headers={
            "apikey": publishable_key,
            "Authorization": f"Bearer {token}",
        },
        timeout=10,
    )

    if resp.status_code != 200:
        return None
    return resp.json()


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


@app.route("/api/me", methods=["GET"])
def me():
    """Validate Supabase access token and return basic user info.

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
        user_json = _validate_supabase_token(token)
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
        logger.exception("Error validating Supabase token")
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
            user_json = _validate_supabase_token(token)
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)

