from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import os
import re
from dotenv import load_dotenv

# Import AI engine
from ai_engine import analyze_resume

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# CORS configuration - allow requests from your frontend domain
# In production, replace with your actual frontend URL
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv("FRONTEND_URL", "*"),  # Set FRONTEND_URL in production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
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
    return jsonify({"status": "ok", "message": "Flask backend is running"})

@app.route("/api/analyze", methods=["POST"])
def analyze():
    start_time = time.time()
    logger.info("Received analyze request")
    
    try:
        # Get data from request
        data = request.json
        if not data:
            return jsonify({
                "error": "No data provided",
                "match_score": 0
            }), 400
        
        # Get resume and job description text
        resume_text = data.get("resume", "")
        job_text = data.get("job_description", "")
        
        # Validate inputs - empty check
        if not resume_text or not resume_text.strip():
            return jsonify({
                "error": "Resume text is required",
                "match_score": 0
            }), 400
        
        if not job_text or not job_text.strip():
            return jsonify({
                "error": "Job description text is required",
                "match_score": 0
            }), 400
        
        # Security check - detect suspicious content
        if contains_suspicious_content(resume_text):
            logger.warning("Suspicious content detected in resume text")
            return jsonify({
                "error": "Invalid content detected in resume. Please provide plain text only.",
                "match_score": 0
            }), 400
        
        if contains_suspicious_content(job_text):
            logger.warning("Suspicious content detected in job description text")
            return jsonify({
                "error": "Invalid content detected in job description. Please provide plain text only.",
                "match_score": 0
            }), 400
        
        # Validate input lengths - reject if too long
        max_length = 10000
        min_resume_length = 200
        min_job_length = 100
        
        if len(resume_text.strip()) < min_resume_length:
            return jsonify({
                "error": f"Resume text is too short (minimum {min_resume_length} characters)",
                "match_score": 0
            }), 400
        
        if len(job_text.strip()) < min_job_length:
            return jsonify({
                "error": f"Job description text is too short (minimum {min_job_length} characters)",
                "match_score": 0
            }), 400
        
        if len(resume_text) > max_length:
            return jsonify({
                "error": f"Resume text is too long (maximum {max_length:,} characters)",
                "match_score": 0
            }), 400
        
        if len(job_text) > max_length:
            return jsonify({
                "error": f"Job description text is too long (maximum {max_length:,} characters)",
                "match_score": 0
            }), 400
        
        # Use AI engine to analyze resume against job description
        result = analyze_resume(resume_text, job_text)
        
        # Calculate processing time (if not already included in result)
        if "processing_time_seconds" not in result:
            elapsed_time = time.time() - start_time
            result["processing_time_seconds"] = round(elapsed_time, 2)
        
        logger.info(f"Analysis completed in {result.get('processing_time_seconds', 0):.2f} seconds")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": f"Server error: {str(e)}",
            "match_score": 0
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

