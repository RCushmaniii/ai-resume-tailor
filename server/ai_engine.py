"""
AI Engine for Resume Analysis v2.0

Hybrid approach:
1. AI extracts and classifies requirements (semantic understanding)
2. Python calculates deterministic scores (consistent math)
3. Modular analyzers provide additional insights

File: server/ai_engine.py
"""

import os
import json
import logging
import hashlib
from typing import Dict, Any, Optional, List
from openai import OpenAI
from dotenv import load_dotenv
import time

# Core scoring
from scoring_engine import (
    calculate_score,
    generate_optimization_plan,
    transform_to_legacy_format,
    generate_evaluation,
    EvaluationResult
)

# Modular analyzers
from analyzers.resume_quality import analyze_resume_quality, format_quality_report
from analyzers.interview_prep import generate_interview_questions, format_interview_prep
from analyzers.cover_letter import (
    generate_cover_letter, 
    format_cover_letter_response, 
    extract_resume_data_for_cover_letter,
    ToneStyle
)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ═══════════════════════════════════════════════════════════════════════════
# CACHING FOR CONSISTENCY
# ═══════════════════════════════════════════════════════════════════════════

# In-memory cache for extraction results (same input = same output)
_extraction_cache: Dict[str, Dict[str, Any]] = {}

def _get_cache_key(resume_text: str, job_text: str) -> str:
    """Generate a cache key from resume and job text."""
    combined = f"{resume_text.strip()}|||{job_text.strip()}"
    return hashlib.sha256(combined.encode()).hexdigest()

def _get_cached_extraction(cache_key: str) -> Optional[Dict[str, Any]]:
    """Get cached extraction result if available."""
    return _extraction_cache.get(cache_key)

def _cache_extraction(cache_key: str, result: Dict[str, Any]) -> None:
    """Cache extraction result. Limit cache size to prevent memory issues."""
    if len(_extraction_cache) > 100:  # Simple LRU-ish behavior
        # Remove oldest entries
        keys_to_remove = list(_extraction_cache.keys())[:50]
        for key in keys_to_remove:
            del _extraction_cache[key]
    _extraction_cache[cache_key] = result

def clear_cache() -> None:
    """Clear the extraction cache (for testing)."""
    _extraction_cache.clear()
    logger.info("Extraction cache cleared")


# ═══════════════════════════════════════════════════════════════════════════
# AI EXTRACTION PROMPT (extraction only - no scoring)
# ═══════════════════════════════════════════════════════════════════════════

EXTRACTION_PROMPT = """You are a DETERMINISTIC resume analysis engine. Extract and match keywords consistently.

CRITICAL: Same input MUST produce identical output. When uncertain, use these tie-breakers:
- If skill name appears anywhere in resume → EXACT or VARIANT (never NONE)
- If related work is described → CONTEXTUAL (never NONE)
- Only use NONE if absolutely no connection exists

TASK 1: Parse job description requirements into tiers
- TIER 1: Explicitly required ("Required", "Must have", "X+ years", mentioned 2+ times)
- TIER 2: Preferred/important ("Preferred", "Nice to have", mentioned once)
- TIER 3: Bonus items ("Plus", "a plus", secondary tools)

TASK 2: For each requirement, find resume evidence (BE GENEROUS - favor matches)
Match types (in order of preference):
- EXACT: Term found verbatim OR common abbreviation (Python/Py, JavaScript/JS)
- VARIANT: Recognized equivalent (React.js = ReactJS, AWS = Amazon Web Services)
- CONTEXTUAL: Skill is demonstrated through described work (cite specific evidence)
- NONE: Absolutely no evidence in resume (use sparingly)

MATCHING GUIDANCE:
- "Communication skills" → Match if ANY client/team interaction described
- "Technical understanding" → Match if ANY technical work described
- "Problem solving" → Match if ANY achievement/improvement described
- Soft skills → Almost always CONTEXTUAL if person held relevant job
- Years experience → Calculate from employment dates, round UP

TASK 3: Extract experience data
- required_years: From job description (e.g., "3+ years" → 3)
- candidate_years: From resume dates (round UP partial years)
- seniority_signals: Leadership, mentoring, "led", "managed", "senior"

TASK 4: Identify gaps (only for TRUE NONE matches)
Provide specific, actionable suggestions.

OUTPUT FORMAT (JSON only):
{
  "requirements": [
    {"text": "skill name", "tier": 1, "match_type": "EXACT", "evidence": "quote from resume"}
  ],
  "experience": {
    "required_years": 3,
    "candidate_years": 5,
    "seniority_signals": ["Led team of 3"]
  },
  "gaps": [
    {"requirement": "Missing Skill", "suggestion": "Add X experience"}
  ],
  "job_title": "extracted title",
  "company_name": "company if mentioned",
  "summary": "2-3 sentence assessment"
}

RULES:
1. BE CONSISTENT - same resume+job = same classification every time
2. FAVOR MATCHES over NONE when evidence is ambiguous
3. Extract ALL requirements from job description
4. Always cite evidence for CONTEXTUAL matches
"""

USER_PROMPT_TEMPLATE = """
RESUME TEXT:
"{resume_text}"

JOB DESCRIPTION:
"{job_text}"

Extract requirements, match them to the resume, and identify gaps. Return JSON only.
"""


# ═══════════════════════════════════════════════════════════════════════════
# MAIN ANALYSIS FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def analyze_resume(
    resume_text: str, 
    job_text: str,
    include_quality_analysis: bool = True,
    include_interview_prep: bool = False,
    include_cover_letter: bool = False,
    cover_letter_tone: str = "professional",
) -> Dict[str, Any]:
    """
    Analyze a resume against a job description.
    
    Uses a hybrid approach:
    1. AI extracts and classifies requirements (semantic understanding)
    2. Python calculates deterministic scores (consistent math)
    3. Optional: Additional analyzers for quality, interview prep, cover letter
    
    Args:
        resume_text: The resume text
        job_text: The job description text
        include_quality_analysis: Include resume quality analysis
        include_interview_prep: Generate interview questions
        include_cover_letter: Generate tailored cover letter
        cover_letter_tone: Tone for cover letter (professional/confident/conversational)
        
    Returns:
        Dict with analysis results
    """
    start_time = time.time()
    logger.info("Starting AI-powered resume analysis (hybrid mode v2)")
    
    try:
        # ─────────────────────────────────────────────────────────────────
        # STEP 1: AI Extraction
        # ─────────────────────────────────────────────────────────────────
        
        user_prompt = USER_PROMPT_TEMPLATE.format(
            resume_text=resume_text,
            job_text=job_text
        )
        
        # Check cache first for consistency
        cache_key = _get_cache_key(resume_text, job_text)
        cached_result = _get_cached_extraction(cache_key)
        
        if cached_result:
            logger.info("Using cached extraction (ensuring consistent results)")
            ai_extraction = cached_result
        else:
            # Call OpenAI with deterministic settings
            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o"),
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": EXTRACTION_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0,      # Maximum determinism
                max_tokens=3000,
                seed=42,            # Fixed seed for reproducibility
            )
            
            ai_extraction = parse_extraction_response(response)
            _cache_extraction(cache_key, ai_extraction)  # Cache for future requests
            logger.info("AI extraction completed and cached")
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 2: Deterministic Scoring
        # ─────────────────────────────────────────────────────────────────
        
        requirements = ai_extraction.get("requirements", [])
        experience = ai_extraction.get("experience", {})
        gaps = ai_extraction.get("gaps", [])
        
        # Detect senior role
        job_lower = job_text.lower()
        is_senior_role = any(term in job_lower for term in [
            "senior", "lead", "principal", "staff", "architect", "manager", "director"
        ])
        
        scoring_result = calculate_score(
            requirements=requirements,
            required_years=experience.get("required_years", 0),
            candidate_years=experience.get("candidate_years", 0),
            is_senior_role=is_senior_role,
            seniority_signals_found=len(experience.get("seniority_signals", [])),
            resume_text=resume_text,
        )
        logger.info(f"Deterministic score: {scoring_result.score}")
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 3: Optimization Plan
        # ─────────────────────────────────────────────────────────────────
        
        optimization_plan = generate_optimization_plan(
            score=scoring_result.score,
            gaps=gaps,
            requirements=requirements,
            resume_text=resume_text,
        )
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 3.5: Generate Truthful Evaluation
        # ─────────────────────────────────────────────────────────────────
        
        # Build tier_scores dict for evaluation
        tier_scores = {
            1: {
                "total": scoring_result.tier1.total_count,
                "matched": scoring_result.tier1.matched_count,
                "details": scoring_result.tier1.match_details,
            },
            2: {
                "total": scoring_result.tier2.total_count,
                "matched": scoring_result.tier2.matched_count,
                "details": scoring_result.tier2.match_details,
            },
            3: {
                "total": scoring_result.tier3.total_count,
                "matched": scoring_result.tier3.matched_count,
                "details": scoring_result.tier3.match_details,
            },
        }
        
        evaluation = generate_evaluation(
            score=scoring_result.score,
            tier_scores=tier_scores,
            missing_critical=scoring_result.missing_critical,
            matched_critical=scoring_result.matched_critical,
            weak_matches=scoring_result.weak_matches,
            experience_ratio=scoring_result.experience_ratio,
            resume_text=resume_text,
        )
        logger.info(f"Evaluation: Hiring Readiness={evaluation.hiring_readiness}, ATS={evaluation.ats_status}")
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 4: Transform to Frontend Format
        # ─────────────────────────────────────────────────────────────────
        
        result = transform_to_legacy_format(
            scoring_result=scoring_result,
            ai_extraction=ai_extraction,
            optimization_plan=optimization_plan
        )
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 5: Optional - Resume Quality Analysis
        # ─────────────────────────────────────────────────────────────────
        
        if include_quality_analysis:
            try:
                quality_result = analyze_resume_quality(resume_text)
                result["resume_quality"] = format_quality_report(quality_result)
                logger.info(f"Quality analysis: {quality_result.overall_score}/100")
            except Exception as e:
                logger.warning(f"Quality analysis failed: {e}")
                result["resume_quality"] = None
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 6: Optional - Interview Questions
        # ─────────────────────────────────────────────────────────────────
        
        if include_interview_prep:
            try:
                job_title = ai_extraction.get("job_title", "this role")
                interview_result = generate_interview_questions(
                    job_title=job_title,
                    requirements=requirements,
                    gaps=gaps,
                    num_questions=12,
                )
                result["interview_prep"] = format_interview_prep(interview_result)
                logger.info(f"Generated {interview_result.question_count} interview questions")
            except Exception as e:
                logger.warning(f"Interview prep failed: {e}")
                result["interview_prep"] = None
        
        # ─────────────────────────────────────────────────────────────────
        # STEP 7: Optional - Cover Letter
        # ─────────────────────────────────────────────────────────────────
        
        if include_cover_letter:
            try:
                # Map tone string to enum
                tone_map = {
                    "professional": ToneStyle.PROFESSIONAL,
                    "confident": ToneStyle.CONFIDENT,
                    "conversational": ToneStyle.CONVERSATIONAL,
                    "executive": ToneStyle.EXECUTIVE,
                }
                tone = tone_map.get(cover_letter_tone, ToneStyle.PROFESSIONAL)
                
                # Extract resume data for cover letter
                resume_data = extract_resume_data_for_cover_letter(resume_text, result)
                
                job_title = ai_extraction.get("job_title", "this position")
                company_name = ai_extraction.get("company_name", "your company")
                
                cover_result = generate_cover_letter(
                    job_title=job_title,
                    company_name=company_name,
                    requirements=requirements,
                    resume_data=resume_data,
                    gaps=gaps,
                    tone=tone,
                    include_gap_acknowledgment=False,
                    target_length="medium",
                )
                result["cover_letter"] = format_cover_letter_response(cover_result)
                logger.info(f"Generated cover letter: {cover_result.word_count} words")
            except Exception as e:
                logger.warning(f"Cover letter generation failed: {e}")
                result["cover_letter"] = None
        
        # ─────────────────────────────────────────────────────────────────
        # Finalize
        # ─────────────────────────────────────────────────────────────────
        
        elapsed_time = time.time() - start_time
        result["processing_time_seconds"] = round(elapsed_time, 2)
        result["scoring_method"] = "hybrid_v2"
        result["features_enabled"] = {
            "quality_analysis": include_quality_analysis,
            "interview_prep": include_interview_prep,
            "cover_letter": include_cover_letter,
        }
        
        # Add gate-based evaluation data
        result["evaluation"] = {
            "hiring": {
                "status": evaluation.hiring_status,
                "summary": evaluation.hiring_summary,
                "reassurance": evaluation.hiring_reassurance,
            },
            "ats": {
                "status": evaluation.ats_status,
                "checks": evaluation.ats_checks,
                "summary": evaluation.ats_summary,
            },
            "search": {
                "status": evaluation.search_status,
                "matched": evaluation.search_matched,
                "total": evaluation.search_total,
                "terms": evaluation.searchable_terms,
                "summary": evaluation.search_summary,
            },
            "alignment": {
                "score": evaluation.alignment_score,
                "label": evaluation.alignment_label,
                "strengths": evaluation.alignment_strengths,
                "refinements": evaluation.alignment_refinements,
            },
            "readability": {
                "label": evaluation.readability_label,
                "notes": evaluation.readability_notes,
            },
            "verdict": {
                "ready_to_submit": evaluation.ready_to_submit,
                "message": evaluation.verdict_message,
                "stop_optimizing": evaluation.stop_optimizing,
            },
        }
        
        logger.info(f"Analysis completed in {elapsed_time:.2f}s")
        return result
        
    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}")
        return create_error_response(str(e))


# ═══════════════════════════════════════════════════════════════════════════
# INDIVIDUAL FEATURE FUNCTIONS (for separate API endpoints)
# ═══════════════════════════════════════════════════════════════════════════

def get_resume_quality(resume_text: str) -> Dict[str, Any]:
    """
    Get resume quality analysis only.
    
    Args:
        resume_text: The resume text
        
    Returns:
        Quality analysis result
    """
    try:
        result = analyze_resume_quality(resume_text)
        return format_quality_report(result)
    except Exception as e:
        logger.error(f"Quality analysis error: {e}")
        return {"error": str(e)}


def get_interview_questions(
    job_title: str,
    requirements: List[Dict[str, Any]],
    gaps: List[Dict[str, Any]],
    num_questions: int = 12,
) -> Dict[str, Any]:
    """
    Get interview questions only.
    
    Args:
        job_title: Target job title
        requirements: Job requirements with match info
        gaps: Identified skill gaps
        num_questions: Number of questions to generate
        
    Returns:
        Interview prep result
    """
    try:
        result = generate_interview_questions(
            job_title=job_title,
            requirements=requirements,
            gaps=gaps,
            num_questions=num_questions,
        )
        return format_interview_prep(result)
    except Exception as e:
        logger.error(f"Interview prep error: {e}")
        return {"error": str(e)}


def get_cover_letter(
    job_title: str,
    company_name: str,
    requirements: List[Dict[str, Any]],
    resume_text: str,
    gaps: Optional[List[Dict[str, Any]]] = None,
    tone: str = "professional",
) -> Dict[str, Any]:
    """
    Get cover letter only.
    
    Args:
        job_title: Target job title
        company_name: Target company
        requirements: Job requirements with match info
        resume_text: Resume text for context
        gaps: Optional skill gaps
        tone: Writing tone (professional/confident/conversational/executive)
        
    Returns:
        Cover letter result
    """
    try:
        tone_map = {
            "professional": ToneStyle.PROFESSIONAL,
            "confident": ToneStyle.CONFIDENT,
            "conversational": ToneStyle.CONVERSATIONAL,
            "executive": ToneStyle.EXECUTIVE,
        }
        tone_style = tone_map.get(tone, ToneStyle.PROFESSIONAL)
        
        resume_data = extract_resume_data_for_cover_letter(resume_text)
        
        result = generate_cover_letter(
            job_title=job_title,
            company_name=company_name,
            requirements=requirements,
            resume_data=resume_data,
            gaps=gaps or [],
            tone=tone_style,
        )
        return format_cover_letter_response(result)
    except Exception as e:
        logger.error(f"Cover letter error: {e}")
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def parse_extraction_response(response) -> Dict[str, Any]:
    """Parse the OpenAI API extraction response."""
    try:
        content = response.choices[0].message.content
        result = json.loads(content)
        validate_extraction_response(result)
        return result
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse OpenAI response: {e}")
        raise ValueError(f"Invalid JSON from OpenAI: {e}")


def validate_extraction_response(result: Dict[str, Any]) -> None:
    """Validate AI extraction response has required fields."""
    required_fields = ["requirements", "experience", "gaps"]
    for field in required_fields:
        if field not in result:
            logger.warning(f"Missing field: {field}, using default")
            if field == "requirements":
                result["requirements"] = []
            elif field == "experience":
                result["experience"] = {
                    "required_years": 0, 
                    "candidate_years": 0, 
                    "seniority_signals": []
                }
            elif field == "gaps":
                result["gaps"] = []
    
    # Validate requirements structure
    for req in result.get("requirements", []):
        if "text" not in req:
            req["text"] = "Unknown requirement"
        if "tier" not in req:
            req["tier"] = 2
        if "match_type" not in req:
            req["match_type"] = "NONE"


def create_error_response(error_message: str) -> Dict[str, Any]:
    """Create standardized error response."""
    return {
        "error": f"Analysis failed: {error_message}",
        "score": 0,
        "interpretation": "ERROR",
        "summary": "Analysis failed due to a technical error.",
        "points_summary": {
            "tier1_earned": 0, "tier1_possible": 0,
            "tier2_earned": 0, "tier2_possible": 0,
            "tier3_earned": 0, "tier3_possible": 0,
            "total_earned": 0, "total_possible": 0,
        },
        "experience_analysis": {
            "required_years": 0,
            "candidate_years": 0,
            "seniority_signals": [],
        },
        "keyword_analysis": {"missing": [], "present": []},
        "critical_gaps": [],
        "quick_wins": [{
            "type": "critical",
            "title": "Analysis Failed",
            "description": "Please try again later."
        }],
        "requirements_breakdown": [],
    }


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    logger.setLevel(logging.DEBUG)
    
    print("AI Engine v2.0 loaded successfully")
    print("Available functions:")
    print("  - analyze_resume(resume, job, include_quality=True, include_interview=False, include_cover=False)")
    print("  - get_resume_quality(resume)")
    print("  - get_interview_questions(job_title, requirements, gaps)")
    print("  - get_cover_letter(job_title, company, requirements, resume)")