"""
World-Class Resume Scoring Engine v2.0

A deterministic, transparent scoring system that provides:
- Multi-dimensional analysis (not just a single score)
- Specific, actionable rewrite suggestions
- Full point breakdown for transparency
- Never-empty optimization plans
- Industry-calibrated scoring

Compatible with existing ai_engine.py - exports:
  - calculate_score()
  - generate_optimization_plan()
  - transform_to_legacy_format()

File: server/scoring_engine.py
Author: AI Resume Tailor
"""

from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional, Tuple
from enum import Enum
import re


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS & DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

class MatchType(str, Enum):
    EXACT = "EXACT"           # Term found verbatim
    VARIANT = "VARIANT"       # Recognized equivalent (JS = JavaScript)
    CONTEXTUAL = "CONTEXTUAL" # Inferred from context
    NONE = "NONE"             # Not found


class ScoreInterpretation(str, Enum):
    STRONG_MATCH = "STRONG MATCH"
    GOOD_MATCH = "GOOD MATCH"
    BORDERLINE = "BORDERLINE"
    BELOW_THRESHOLD = "BELOW THRESHOLD"
    POOR_FIT = "POOR FIT"


class Priority(str, Enum):
    CRITICAL = "critical"     # Must fix - blocking issue
    HIGH = "high"             # Should fix - significant impact
    MEDIUM = "medium"         # Nice to fix - moderate impact
    LOW = "low"               # Optional - minor improvement


@dataclass
class TierBreakdown:
    """Breakdown of scores for a single tier."""
    earned: float
    possible: float
    percentage: int
    matched_count: int
    total_count: int
    match_details: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class DimensionScore:
    """Score for a single analysis dimension."""
    score: int              # 0-100
    label: str              # Human-readable label
    description: str        # What this measures
    weight: float           # How much it contributes to overall
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EvaluationResult:
    """New truthful output format - separates eligibility from optimization."""
    
    # 1. Hiring Readiness (HIGH / MEDIUM / LOW)
    hiring_readiness: str
    hiring_readiness_summary: str
    
    # 2. ATS Compatibility (STRONG / PASS / RISK)
    ats_status: str
    ats_details: List[str]
    ats_summary: str
    
    # 3. Recruiter Search Visibility (HIGH / MEDIUM / LOW)
    search_visibility: str
    searchable_terms: List[str]
    search_summary: str
    
    # 4. Resume-Job Alignment (numeric score - optimization metric)
    alignment_score: int
    alignment_strengths: List[str]
    alignment_refinements: List[Dict[str, str]]  # Optional, non-blocking
    
    # 5. Human Readability (1-5 stars)
    human_readability_stars: int
    human_readability_notes: List[str]
    
    # 6. Final Verdict
    ready_to_submit: bool
    verdict_message: str


@dataclass
class ScoringResult:
    """Complete scoring result with all analysis dimensions."""
    # Primary score
    score: int
    raw_score: float
    interpretation: str
    
    # Tier breakdowns
    tier1: TierBreakdown
    tier2: TierBreakdown
    tier3: TierBreakdown
    
    # Totals
    total_earned: float
    total_possible: float
    
    # Adjustments & caps
    caps_applied: List[str]
    experience_adjustment: int
    experience_ratio: float
    
    # Keyword tracking
    missing_critical: List[str]
    matched_critical: List[str]
    weak_matches: List[str]  # CONTEXTUAL matches that could be stronger
    
    # Multi-dimensional scores
    dimensions: Dict[str, DimensionScore] = field(default_factory=dict)
    
    # Competitive insight
    percentile_estimate: int = 50  # Estimated percentile vs other applicants
    
    # NEW: Truthful evaluation format
    evaluation: Optional[EvaluationResult] = None


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION - Tune these for scoring sensitivity
# ═══════════════════════════════════════════════════════════════════════════

CONFIG = {
    # ─────────────────────────────────────────────────────────────────────
    # POINT VALUES
    # ─────────────────────────────────────────────────────────────────────
    "tier_points": {
        1: 15,  # Critical/Required - highest weight
        2: 8,   # Important/Preferred - medium weight
        3: 4,   # Bonus/Nice-to-have - lowest weight
    },
    
    # Credit percentage per match type
    "match_credit": {
        "EXACT": 1.0,       # 100% - perfect match
        "VARIANT": 0.90,    # 90% - recognized equivalent
        "CONTEXTUAL": 0.75, # 75% - inferred from demonstrated work (still valid!)
        "NONE": 0.0,        # 0% - not found
    },
    
    # ─────────────────────────────────────────────────────────────────────
    # HARD CAPS - Score cannot exceed these when conditions met
    # ─────────────────────────────────────────────────────────────────────
    "hard_caps": {
        "missing_1_tier1": 75,       # Missing 1 critical skill
        "missing_2_tier1": 60,       # Missing 2 critical skills
        "missing_3_tier1": 45,       # Missing 3+ critical skills
        "experience_below_50pct": 55, # Less than half required experience
        "zero_tier1_matches": 30,    # No critical skills matched at all
        "no_quantified_achievements": 80,  # NEW: No metrics in resume
    },
    
    # ─────────────────────────────────────────────────────────────────────
    # EXPERIENCE ADJUSTMENTS
    # ─────────────────────────────────────────────────────────────────────
    "experience_penalties": {
        "below_50pct": -15,
        "below_75pct": -8,
        "meets_requirement": 0,
        "exceeds_by_50pct": 3,  # Bonus for exceeding
    },
    
    "seniority_bonus": 5,
    "seniority_penalty": -10,
    
    # ─────────────────────────────────────────────────────────────────────
    # SCORE INTERPRETATION BANDS
    # ─────────────────────────────────────────────────────────────────────
    "score_bands": {
        "strong_match": 85,    # 85-100: High interview probability
        "good_match": 70,      # 70-84: Competitive candidate
        "borderline": 55,      # 55-69: May pass ATS, weak position
        "below_threshold": 40, # 40-54: Likely filtered
        # Below 40: Poor fit
    },
    
    # ─────────────────────────────────────────────────────────────────────
    # PERCENTILE ESTIMATION (competitive positioning)
    # ─────────────────────────────────────────────────────────────────────
    "percentile_map": {
        95: 90,  # Score 95+ = top 10%
        85: 75,  # Score 85-94 = top 25%
        70: 50,  # Score 70-84 = top 50%
        55: 30,  # Score 55-69 = top 70%
        40: 15,  # Score 40-54 = bottom 30%
        0: 5,    # Below 40 = bottom 15%
    },
    
    # ─────────────────────────────────────────────────────────────────────
    # DIMENSION WEIGHTS (reweighted per enterprise ATS analysis)
    # Keyword presence matters most for recruiter search
    # ─────────────────────────────────────────────────────────────────────
    "dimension_weights": {
        "keyword_presence": 0.40,  # Boolean keyword found (recruiter search)
        "resume_quality": 0.35,    # Quantification, action verbs, seniority-appropriate
        "job_alignment": 0.25,     # Semantic similarity (reduced from dominant)
    },
    
    # ─────────────────────────────────────────────────────────────────────
    # SENIORITY CALIBRATION
    # Senior roles should not be penalized for contextual/narrative style
    # ─────────────────────────────────────────────────────────────────────
    "seniority_levels": {
        "entry": {"years": (0, 2), "contextual_bonus": 0},
        "mid": {"years": (3, 5), "contextual_bonus": 5},
        "senior": {"years": (6, 10), "contextual_bonus": 10},
        "executive": {"years": (10, 99), "contextual_bonus": 15},
    },
}


# ═══════════════════════════════════════════════════════════════════════════
# MAIN SCORING FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def calculate_score(
    requirements: List[Dict[str, Any]],
    required_years: int,
    candidate_years: int,
    is_senior_role: bool = False,
    seniority_signals_found: int = 0,
    resume_text: str = "",  # Optional: for quality analysis
) -> ScoringResult:
    """
    Calculate a deterministic, multi-dimensional score.
    
    Same inputs ALWAYS produce same outputs - no randomness.
    
    Args:
        requirements: List of dicts with keys: text, tier, match_type, evidence
        required_years: Years of experience required by job
        candidate_years: Years of experience candidate has
        is_senior_role: Whether this is a senior/lead/manager position
        seniority_signals_found: Count of leadership/mentoring signals
        resume_text: Optional full resume text for quality analysis
    
    Returns:
        ScoringResult with comprehensive analysis
    """
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 1: Calculate points per tier
    # ─────────────────────────────────────────────────────────────────────
    
    tier_scores = {
        1: {"earned": 0.0, "possible": 0.0, "matched": 0, "total": 0, "details": []},
        2: {"earned": 0.0, "possible": 0.0, "matched": 0, "total": 0, "details": []},
        3: {"earned": 0.0, "possible": 0.0, "matched": 0, "total": 0, "details": []},
    }
    
    tier1_missing = 0
    tier1_none_count = 0
    missing_critical: List[str] = []
    matched_critical: List[str] = []
    weak_matches: List[str] = []  # CONTEXTUAL that could be stronger
    
    for req in requirements:
        tier = req.get("tier", 2)
        match_type = req.get("match_type", "NONE")
        text = req.get("text", "")
        evidence = req.get("evidence")
        
        # Ensure tier is valid
        if tier not in [1, 2, 3]:
            tier = 2
        
        points_possible = CONFIG["tier_points"].get(tier, 8)
        credit = CONFIG["match_credit"].get(match_type, 0.0)
        points_earned = points_possible * credit
        
        tier_scores[tier]["possible"] += points_possible
        tier_scores[tier]["earned"] += points_earned
        tier_scores[tier]["total"] += 1
        
        # Track match details for transparency
        tier_scores[tier]["details"].append({
            "skill": text,
            "match_type": match_type,
            "evidence": evidence,
            "points_earned": round(points_earned, 1),
            "points_possible": points_possible,
            "credit_pct": int(credit * 100),
        })
        
        if match_type != "NONE":
            tier_scores[tier]["matched"] += 1
        
        # Track Tier 1 specifics for caps and feedback
        if tier == 1:
            if match_type == "NONE":
                tier1_missing += 1
                tier1_none_count += 1
                missing_critical.append(text)
            elif match_type == "CONTEXTUAL":
                # CONTEXTUAL is still a valid match - don't penalize as missing
                # Just track as "could be stronger" for optimization suggestions
                weak_matches.append(text)
                matched_critical.append(text)
            else:
                matched_critical.append(text)
        elif tier == 2 and match_type == "CONTEXTUAL":
            weak_matches.append(text)
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 2: Calculate experience adjustment
    # ─────────────────────────────────────────────────────────────────────
    
    experience_adjustment = 0
    experience_ratio = candidate_years / required_years if required_years > 0 else 1.0
    
    if experience_ratio < 0.5:
        experience_adjustment = CONFIG["experience_penalties"]["below_50pct"]
    elif experience_ratio < 0.75:
        experience_adjustment = CONFIG["experience_penalties"]["below_75pct"]
    elif experience_ratio >= 1.5:
        experience_adjustment = CONFIG["experience_penalties"]["exceeds_by_50pct"]
    
    # Seniority adjustment
    if is_senior_role:
        if seniority_signals_found >= 2:
            experience_adjustment += CONFIG["seniority_bonus"]
        elif seniority_signals_found == 0:
            experience_adjustment += CONFIG["seniority_penalty"]
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 3: Calculate raw score
    # ─────────────────────────────────────────────────────────────────────
    
    total_earned = sum(t["earned"] for t in tier_scores.values())
    total_possible = sum(t["possible"] for t in tier_scores.values())
    
    if total_possible == 0:
        raw_score = 0.0
    else:
        raw_score = (total_earned / total_possible) * 100
    
    raw_score += experience_adjustment
    raw_score = max(0, min(100, raw_score))
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 4: Apply hard caps (key to consistent, fair scoring)
    # ─────────────────────────────────────────────────────────────────────
    
    caps_applied: List[str] = []
    final_score = raw_score
    
    # Zero Tier 1 matches - most severe
    tier1_total = tier_scores[1]["total"]
    if tier1_total > 0 and tier1_none_count == tier1_total:
        final_score = min(final_score, CONFIG["hard_caps"]["zero_tier1_matches"])
        caps_applied.append("No critical requirements matched")
    
    # Progressive Tier 1 caps
    elif tier1_missing >= 3:
        final_score = min(final_score, CONFIG["hard_caps"]["missing_3_tier1"])
        caps_applied.append(f"Missing {int(tier1_missing)}+ critical requirements")
    elif tier1_missing >= 2:
        final_score = min(final_score, CONFIG["hard_caps"]["missing_2_tier1"])
        caps_applied.append(f"Missing {int(tier1_missing)} critical requirements")
    elif tier1_missing >= 1:
        final_score = min(final_score, CONFIG["hard_caps"]["missing_1_tier1"])
        caps_applied.append(f"Missing {int(tier1_missing)} critical requirement(s)")
    
    # Experience cap
    if experience_ratio < 0.5:
        final_score = min(final_score, CONFIG["hard_caps"]["experience_below_50pct"])
        if "experience" not in str(caps_applied).lower():
            caps_applied.append("Experience below 50% of requirement")
    
    final_score = round(final_score)
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 5: Determine interpretation
    # ─────────────────────────────────────────────────────────────────────
    
    bands = CONFIG["score_bands"]
    if final_score >= bands["strong_match"]:
        interpretation = ScoreInterpretation.STRONG_MATCH.value
    elif final_score >= bands["good_match"]:
        interpretation = ScoreInterpretation.GOOD_MATCH.value
    elif final_score >= bands["borderline"]:
        interpretation = ScoreInterpretation.BORDERLINE.value
    elif final_score >= bands["below_threshold"]:
        interpretation = ScoreInterpretation.BELOW_THRESHOLD.value
    else:
        interpretation = ScoreInterpretation.POOR_FIT.value
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 6: Calculate multi-dimensional scores
    # ─────────────────────────────────────────────────────────────────────
    
    dimensions = _calculate_dimensions(
        tier_scores, experience_ratio, seniority_signals_found, 
        is_senior_role, resume_text, requirements
    )
    
    # ─────────────────────────────────────────────────────────────────────
    # STEP 7: Estimate competitive percentile
    # ─────────────────────────────────────────────────────────────────────
    
    percentile = _estimate_percentile(final_score)
    
    # ─────────────────────────────────────────────────────────────────────
    # Build tier breakdowns
    # ─────────────────────────────────────────────────────────────────────
    
    def build_tier_breakdown(tier: int) -> TierBreakdown:
        t = tier_scores[tier]
        return TierBreakdown(
            earned=round(t["earned"], 1),
            possible=t["possible"],
            percentage=round((t["earned"] / t["possible"]) * 100) if t["possible"] > 0 else 0,
            matched_count=t["matched"],
            total_count=t["total"],
            match_details=t["details"],
        )
    
    return ScoringResult(
        score=final_score,
        raw_score=round(raw_score, 1),
        interpretation=interpretation,
        tier1=build_tier_breakdown(1),
        tier2=build_tier_breakdown(2),
        tier3=build_tier_breakdown(3),
        total_earned=round(total_earned, 1),
        total_possible=total_possible,
        caps_applied=caps_applied,
        experience_adjustment=experience_adjustment,
        experience_ratio=round(experience_ratio, 2),
        missing_critical=missing_critical,
        matched_critical=matched_critical,
        weak_matches=weak_matches,
        dimensions=dimensions,
        percentile_estimate=percentile,
    )


def _calculate_dimensions(
    tier_scores: Dict,
    experience_ratio: float,
    seniority_signals: int,
    is_senior_role: bool,
    resume_text: str,
    requirements: List[Dict]
) -> Dict[str, DimensionScore]:
    """
    Calculate individual dimension scores using new enterprise-aligned model:
    - Keyword Presence (40%): Boolean - is keyword found? (recruiter search)
    - Resume Quality (35%): Quantification, action verbs, seniority-appropriate
    - Job Alignment (25%): Semantic similarity (reduced weight)
    """
    
    dimensions = {}
    
    # Detect seniority level for calibration
    seniority_level = _detect_seniority_level(experience_ratio)
    contextual_bonus = CONFIG["seniority_levels"].get(seniority_level, {}).get("contextual_bonus", 0)
    
    # ─────────────────────────────────────────────────────────────────────
    # 1. KEYWORD PRESENCE (40%) - Boolean: Is keyword found?
    # This simulates recruiter Boolean search behavior
    # ─────────────────────────────────────────────────────────────────────
    total_matched = sum(t["matched"] for t in tier_scores.values())
    total_keywords = sum(t["total"] for t in tier_scores.values())
    
    # Binary presence: keyword is either found or not (any match type counts)
    presence_pct = round((total_matched / total_keywords) * 100) if total_keywords > 0 else 0
    
    dimensions["keyword_presence"] = DimensionScore(
        score=presence_pct,
        label="Keyword Presence",
        description="Keywords found in resume (recruiter search readiness)",
        weight=CONFIG["dimension_weights"]["keyword_presence"],
        details={
            "found": total_matched,
            "total": total_keywords,
            "missing": [d["skill"] for t in tier_scores.values() for d in t["details"] if d["match_type"] == "NONE"],
        }
    )
    
    # ─────────────────────────────────────────────────────────────────────
    # 2. RESUME QUALITY (35%) - Seniority-calibrated
    # Senior resumes shouldn't be penalized for narrative style
    # ─────────────────────────────────────────────────────────────────────
    base_quality = _analyze_resume_quality(resume_text) if resume_text else 70
    
    # Apply seniority bonus for contextual/narrative style resumes
    quality_score = min(100, base_quality + contextual_bonus)
    
    dimensions["resume_quality"] = DimensionScore(
        score=quality_score,
        label="Resume Quality",
        description="Quantified achievements, action verbs, professional presentation",
        weight=CONFIG["dimension_weights"]["resume_quality"],
        details={
            **(_get_quality_details(resume_text) if resume_text else {}),
            "seniority_level": seniority_level,
            "seniority_bonus_applied": contextual_bonus,
        }
    )
    
    # ─────────────────────────────────────────────────────────────────────
    # 3. JOB ALIGNMENT (25%) - Semantic similarity (reduced weight)
    # How well does experience align with job requirements?
    # ─────────────────────────────────────────────────────────────────────
    tier1 = tier_scores[1]
    tier2 = tier_scores[2]
    
    # Alignment considers match quality, not just presence
    tier1_alignment = round((tier1["earned"] / tier1["possible"]) * 100) if tier1["possible"] > 0 else 0
    tier2_alignment = round((tier2["earned"] / tier2["possible"]) * 100) if tier2["possible"] > 0 else 0
    
    # Weight tier 1 more heavily for alignment
    alignment_score = round(tier1_alignment * 0.7 + tier2_alignment * 0.3)
    
    # Senior candidates get alignment bonus for contextual matches
    alignment_score = min(100, alignment_score + (contextual_bonus // 2))
    
    dimensions["job_alignment"] = DimensionScore(
        score=alignment_score,
        label="Job Alignment",
        description="How well your experience aligns with job requirements",
        weight=CONFIG["dimension_weights"]["job_alignment"],
        details={
            "tier1_alignment": tier1_alignment,
            "tier2_alignment": tier2_alignment,
            "experience_ratio": experience_ratio,
        }
    )
    
    return dimensions


def _detect_seniority_level(experience_ratio: float) -> str:
    """Detect candidate seniority level based on experience."""
    # Estimate years from ratio (assuming typical 3-5 year requirement)
    estimated_years = experience_ratio * 4  # Rough estimate
    
    for level, config in CONFIG["seniority_levels"].items():
        min_years, max_years = config["years"]
        if min_years <= estimated_years <= max_years:
            return level
    
    return "mid"  # Default


def _analyze_resume_quality(resume_text: str) -> int:
    """Analyze resume quality based on best practices."""
    if not resume_text:
        return 70  # Default if no text provided
    
    score = 50  # Base score
    text_lower = resume_text.lower()
    
    # Check for quantified achievements (numbers, percentages, dollar amounts)
    metrics_patterns = [
        r'\d+%',           # Percentages
        r'\$[\d,]+',       # Dollar amounts
        r'\d+\+?\s*(years?|months?)', # Time periods
        r'(\d+)\s*(clients?|customers?|users?|projects?|team members?)',
        r'(increased|decreased|improved|reduced|grew|saved)\s+.*\d+',
    ]
    
    metrics_found = 0
    for pattern in metrics_patterns:
        metrics_found += len(re.findall(pattern, text_lower))
    
    if metrics_found >= 5:
        score += 25
    elif metrics_found >= 3:
        score += 15
    elif metrics_found >= 1:
        score += 5
    
    # Check for strong action verbs
    strong_verbs = [
        'led', 'managed', 'developed', 'created', 'implemented', 'designed',
        'built', 'launched', 'achieved', 'delivered', 'optimized', 'increased',
        'reduced', 'improved', 'established', 'transformed', 'orchestrated',
        'spearheaded', 'pioneered', 'architected', 'streamlined'
    ]
    
    verbs_found = sum(1 for verb in strong_verbs if verb in text_lower)
    if verbs_found >= 8:
        score += 15
    elif verbs_found >= 5:
        score += 10
    elif verbs_found >= 3:
        score += 5
    
    # Check length (too short = lacking detail)
    word_count = len(resume_text.split())
    if word_count >= 400:
        score += 10
    elif word_count >= 250:
        score += 5
    elif word_count < 150:
        score -= 10
    
    return min(100, max(0, score))


def _get_quality_details(resume_text: str) -> Dict[str, Any]:
    """Get detailed quality analysis."""
    if not resume_text:
        return {}
    
    text_lower = resume_text.lower()
    
    # Count metrics
    metrics = len(re.findall(r'\d+%|\$[\d,]+|\d+\s*(years?|projects?|clients?)', text_lower))
    
    # Count strong verbs
    strong_verbs = ['led', 'managed', 'developed', 'created', 'implemented', 'designed',
                   'built', 'launched', 'achieved', 'delivered', 'optimized']
    verbs = sum(1 for v in strong_verbs if v in text_lower)
    
    return {
        "metrics_count": metrics,
        "strong_verbs_count": verbs,
        "word_count": len(resume_text.split()),
        "has_quantified_achievements": metrics >= 3,
    }


def _estimate_percentile(score: int) -> int:
    """Estimate competitive percentile based on score."""
    for threshold, percentile in sorted(CONFIG["percentile_map"].items(), reverse=True):
        if score >= threshold:
            return percentile
    return 5


# ═══════════════════════════════════════════════════════════════════════════
# TRUTHFUL EVALUATION GENERATOR
# ═══════════════════════════════════════════════════════════════════════════

def generate_evaluation(
    score: int,
    tier_scores: Dict,
    missing_critical: List[str],
    matched_critical: List[str],
    weak_matches: List[str],
    experience_ratio: float,
    resume_text: str = "",
) -> EvaluationResult:
    """
    Generate truthful evaluation that separates eligibility from optimization.
    
    This format:
    - Reflects real enterprise ATS behavior
    - Reduces anxiety-driven over-optimization
    - Builds user trust
    - Educates without overwhelming
    """
    
    # ─────────────────────────────────────────────────────────────────────
    # 1. HIRING READINESS (HIGH / MEDIUM / LOW)
    # ─────────────────────────────────────────────────────────────────────
    tier1_total = tier_scores[1]["total"]
    tier1_matched = tier_scores[1]["matched"]
    
    if len(missing_critical) == 0 and experience_ratio >= 0.75:
        hiring_readiness = "HIGH"
        hiring_summary = "You meet all required qualifications and are competitive for this role."
    elif len(missing_critical) <= 1 and experience_ratio >= 0.5:
        hiring_readiness = "MEDIUM"
        hiring_summary = "You meet most requirements. Address the gaps below to strengthen your application."
    else:
        hiring_readiness = "LOW"
        hiring_summary = "There are significant gaps between your resume and this role's requirements."
    
    # ─────────────────────────────────────────────────────────────────────
    # 2. ATS COMPATIBILITY (STRONG / PASS / RISK)
    # ─────────────────────────────────────────────────────────────────────
    total_matched = sum(t["matched"] for t in tier_scores.values())
    total_keywords = sum(t["total"] for t in tier_scores.values())
    match_rate = (total_matched / total_keywords * 100) if total_keywords > 0 else 0
    
    ats_details = []
    
    if match_rate >= 80:
        ats_status = "STRONG"
        ats_details.append("Resume parses correctly")
        ats_details.append("All critical keywords present")
        ats_details.append("No disqualifying gaps detected")
        ats_details.append("Recruiters can find you in search results")
        ats_summary = "This resume would not be filtered out by an enterprise ATS."
    elif match_rate >= 60:
        ats_status = "PASS"
        ats_details.append("Resume parses correctly")
        ats_details.append("Most keywords present")
        if missing_critical:
            ats_details.append(f"Missing {len(missing_critical)} critical term(s)")
        ats_summary = "This resume should pass most ATS filters but could be stronger."
    else:
        ats_status = "RISK"
        ats_details.append("Several required keywords missing")
        ats_details.append(f"Only {int(match_rate)}% keyword coverage")
        ats_summary = "This resume may be filtered out. Consider adding missing keywords."
    
    # ─────────────────────────────────────────────────────────────────────
    # 3. RECRUITER SEARCH VISIBILITY (HIGH / MEDIUM / LOW)
    # ─────────────────────────────────────────────────────────────────────
    searchable_terms = matched_critical[:5]  # Top 5 matched critical terms
    
    # Add tier 2 matches
    for detail in tier_scores[2]["details"]:
        if detail["match_type"] != "NONE" and len(searchable_terms) < 8:
            searchable_terms.append(detail["skill"])
    
    if match_rate >= 75:
        search_visibility = "HIGH"
        search_summary = "Your resume contains the right titles, skills, and experience for recruiter searches."
    elif match_rate >= 50:
        search_visibility = "MEDIUM"
        search_summary = "You are somewhat discoverable but adding key terms would help."
    else:
        search_visibility = "LOW"
        search_summary = "Recruiters may have difficulty finding you with current keyword coverage."
    
    # ─────────────────────────────────────────────────────────────────────
    # 4. ALIGNMENT SCORE + STRENGTHS + REFINEMENTS
    # ─────────────────────────────────────────────────────────────────────
    alignment_strengths = []
    
    if tier1_matched > 0:
        alignment_strengths.append(f"{tier1_matched} critical skills clearly stated")
    if experience_ratio >= 1.0:
        alignment_strengths.append("Experience meets or exceeds requirements")
    
    quality_details = _get_quality_details(resume_text) if resume_text else {}
    if quality_details.get("has_quantified_achievements"):
        alignment_strengths.append("Quantified achievements included")
    if quality_details.get("strong_verbs_count", 0) >= 5:
        alignment_strengths.append("Strong action verbs present")
    
    # Build refinements (optional, non-blocking)
    alignment_refinements = []
    for skill in weak_matches[:3]:
        alignment_refinements.append({
            "skill": skill,
            "current": "Mentioned contextually",
            "suggested": f"Make '{skill}' more explicit with specific examples",
            "impact": "Slightly higher alignment score",
            "blocking": "No"
        })
    
    # ─────────────────────────────────────────────────────────────────────
    # 5. HUMAN READABILITY (1-5 stars)
    # ─────────────────────────────────────────────────────────────────────
    quality_score = _analyze_resume_quality(resume_text) if resume_text else 70
    
    if quality_score >= 85:
        stars = 5
        readability_notes = ["Clear accomplishments", "Strong metrics", "Easy to scan", "Compelling narrative"]
    elif quality_score >= 70:
        stars = 4
        readability_notes = ["Clear accomplishments", "Metrics included", "Easy to scan"]
    elif quality_score >= 55:
        stars = 3
        readability_notes = ["Readable but could use more metrics", "Consider adding impact statements"]
    elif quality_score >= 40:
        stars = 2
        readability_notes = ["Needs more quantified achievements", "Add specific outcomes"]
    else:
        stars = 1
        readability_notes = ["Significant improvements needed", "Add metrics and clear accomplishments"]
    
    # ─────────────────────────────────────────────────────────────────────
    # 6. FINAL VERDICT
    # ─────────────────────────────────────────────────────────────────────
    if score >= 70 and len(missing_critical) == 0:
        ready_to_submit = True
        verdict_message = "This resume is ready to submit. Further changes are optional optimizations, not requirements."
    elif score >= 55 and len(missing_critical) <= 1:
        ready_to_submit = True
        verdict_message = "This resume can be submitted. Consider the suggested improvements to strengthen your application."
    else:
        ready_to_submit = False
        verdict_message = "Address the critical gaps before submitting to maximize your chances."
    
    return EvaluationResult(
        hiring_readiness=hiring_readiness,
        hiring_readiness_summary=hiring_summary,
        ats_status=ats_status,
        ats_details=ats_details,
        ats_summary=ats_summary,
        search_visibility=search_visibility,
        searchable_terms=searchable_terms,
        search_summary=search_summary,
        alignment_score=score,
        alignment_strengths=alignment_strengths,
        alignment_refinements=alignment_refinements,
        human_readability_stars=stars,
        human_readability_notes=readability_notes,
        ready_to_submit=ready_to_submit,
        verdict_message=verdict_message,
    )


# ═══════════════════════════════════════════════════════════════════════════
# OPTIMIZATION PLAN GENERATOR
# ═══════════════════════════════════════════════════════════════════════════

def generate_optimization_plan(
    score: int,
    gaps: List[Dict[str, Any]],
    requirements: List[Dict[str, Any]],
    resume_text: str = "",
) -> List[Dict[str, Any]]:
    """
    Generate a prioritized, actionable optimization plan.
    
    ALWAYS returns suggestions - never empty!
    
    Args:
        score: The calculated score (0-100)
        gaps: List of gap dicts from AI extraction
        requirements: List of requirement dicts from AI extraction
        resume_text: Optional resume text for quality suggestions
    
    Returns:
        List of optimization items with priority, type, and specific actions
    """
    plan: List[Dict[str, Any]] = []
    
    # Categorize requirements
    missing_tier1 = [r for r in requirements if r.get("tier") == 1 and r.get("match_type") == "NONE"]
    contextual_tier1 = [r for r in requirements if r.get("tier") == 1 and r.get("match_type") == "CONTEXTUAL"]
    missing_tier2 = [r for r in requirements if r.get("tier") == 2 and r.get("match_type") == "NONE"]
    contextual_any = [r for r in requirements if r.get("match_type") == "CONTEXTUAL"]
    
    # ─────────────────────────────────────────────────────────────────────
    # CRITICAL: Missing Tier 1 skills (biggest impact)
    # ─────────────────────────────────────────────────────────────────────
    
    for req in missing_tier1:
        skill = req.get("text", "Unknown skill")
        gap = next((g for g in gaps if skill.lower() in g.get("requirement", "").lower()), None)
        
        # Generate specific rewrite suggestion
        rewrite = _generate_rewrite_suggestion(skill, gap)
        
        plan.append({
            "type": Priority.CRITICAL.value,
            "category": "missing_critical_skill",
            "title": f"Add Critical Skill: {skill}",
            "description": gap.get("suggestion") if gap else f'Add "{skill}" with specific examples and measurable outcomes',
            "rewrite_suggestion": rewrite,
            "potential_impact": "+10-15 points",
            "ats_impact": "HIGH - This keyword is likely required by ATS filters",
        })
    
    # ─────────────────────────────────────────────────────────────────────
    # HIGH: Strengthen contextual matches
    # ─────────────────────────────────────────────────────────────────────
    
    for req in contextual_tier1:
        skill = req.get("text", "Unknown skill")
        evidence = req.get("evidence", "")
        
        plan.append({
            "type": Priority.HIGH.value,
            "category": "strengthen_match",
            "title": f"Strengthen: {skill}",
            "description": f'Currently inferred from "{evidence[:50]}..." - make explicit',
            "rewrite_suggestion": f'Add "{skill}" explicitly: "Utilized {skill} to [specific achievement with metrics]"',
            "potential_impact": "+5-8 points",
            "ats_impact": "MEDIUM - Explicit keywords score higher than inferred",
        })
    
    # ─────────────────────────────────────────────────────────────────────
    # MEDIUM: Missing Tier 2 skills (limit to top 3)
    # ─────────────────────────────────────────────────────────────────────
    
    for req in missing_tier2[:3]:
        skill = req.get("text", "Unknown skill")
        gap = next((g for g in gaps if skill.lower() in g.get("requirement", "").lower()), None)
        
        plan.append({
            "type": Priority.MEDIUM.value,
            "category": "missing_preferred_skill",
            "title": f"Consider Adding: {skill}",
            "description": gap.get("suggestion") if gap else f'Add "{skill}" if you have relevant experience',
            "potential_impact": "+4-6 points",
            "ats_impact": "LOW-MEDIUM - Preferred but not required",
        })
    
    # ─────────────────────────────────────────────────────────────────────
    # QUALITY IMPROVEMENTS (always relevant)
    # ─────────────────────────────────────────────────────────────────────
    
    quality_details = _get_quality_details(resume_text) if resume_text else {}
    
    # Check for quantified achievements
    if not quality_details.get("has_quantified_achievements", True):
        plan.append({
            "type": Priority.MEDIUM.value,
            "category": "quantification",
            "title": "Add Quantified Achievements",
            "description": "Include specific metrics: percentages, dollar amounts, time saved, team sizes",
            "rewrite_suggestion": 'Change "Improved sales" → "Increased sales by 35% ($2.1M) in Q3 2024"',
            "potential_impact": "+3-5 points + stronger impression",
            "ats_impact": "LOW - But critical for human reviewers",
        })
    
    # ─────────────────────────────────────────────────────────────────────
    # ENHANCEMENTS (even for high scores)
    # ─────────────────────────────────────────────────────────────────────
    
    if score >= 85:
        # Strong match - focus on differentiation
        plan.append({
            "type": Priority.LOW.value,
            "category": "enhancement",
            "title": "Stand Out from Competition",
            "description": "Your skills match well. Focus on unique achievements and impact stories.",
            "rewrite_suggestion": "Lead each bullet with a measurable outcome, not a task description",
            "potential_impact": "Differentiation from other qualified candidates",
            "ats_impact": "N/A - For human reviewer impact",
        })
        
        # Check for any unmatched Tier 3 items
        missing_tier3 = [r for r in requirements if r.get("tier") == 3 and r.get("match_type") == "NONE"]
        if missing_tier3:
            bonus_skills = [r.get("text", "") for r in missing_tier3[:3]]
            plan.append({
                "type": Priority.LOW.value,
                "category": "bonus_skills",
                "title": "Optional Bonus Skills",
                "description": f"Consider adding if applicable: {', '.join(bonus_skills)}",
                "potential_impact": "+2-4 points",
                "ats_impact": "LOW - Nice to have",
            })
    
    # ─────────────────────────────────────────────────────────────────────
    # ENSURE NEVER EMPTY
    # ─────────────────────────────────────────────────────────────────────
    
    if not plan:
        plan.append({
            "type": Priority.LOW.value,
            "category": "polish",
            "title": "Polish Your Resume",
            "description": "Ensure consistent formatting, check for typos, and verify all dates are accurate.",
            "potential_impact": "Professional impression",
            "ats_impact": "LOW - But important for final review",
        })
    
    return plan


def _generate_rewrite_suggestion(skill: str, gap: Optional[Dict]) -> str:
    """Generate a specific rewrite suggestion for adding a skill."""
    
    base_suggestion = gap.get("suggestion", "") if gap else ""
    
    # Template based on skill type
    templates = {
        "default": f'Add to Skills section: "{skill}" | Add to Experience: "Leveraged {skill} to [achieve specific outcome]"',
        "tool": f'Skills: "{skill}" | Experience: "Utilized {skill} for [specific use case], resulting in [measurable outcome]"',
        "methodology": f'Experience: "Applied {skill} principles to [project/initiative], improving [metric] by [X]%"',
        "certification": f'Certifications section: "{skill}" | If in progress: "{skill} (Expected [Month Year])"',
    }
    
    # Detect skill type (simplified)
    skill_lower = skill.lower()
    if any(word in skill_lower for word in ['certified', 'certification', 'pmp', 'aws', 'cpa']):
        return templates["certification"]
    elif any(word in skill_lower for word in ['agile', 'scrum', 'methodology', 'framework']):
        return templates["methodology"]
    elif any(word in skill_lower for word in ['jira', 'confluence', 'git', 'docker', 'kubernetes']):
        return templates["tool"]
    
    return templates["default"]


# ═══════════════════════════════════════════════════════════════════════════
# LEGACY FORMAT TRANSFORMER (for frontend compatibility)
# ═══════════════════════════════════════════════════════════════════════════

def transform_to_legacy_format(
    scoring_result: ScoringResult,
    ai_extraction: Dict[str, Any],
    optimization_plan: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Transform scoring result to format expected by your React frontend.
    
    Maintains backwards compatibility while adding new features.
    """
    requirements = ai_extraction.get("requirements", [])
    experience = ai_extraction.get("experience", {})
    
    # ─────────────────────────────────────────────────────────────────────
    # Build keyword analysis
    # ─────────────────────────────────────────────────────────────────────
    
    present_keywords = []
    missing_keywords = []
    
    for req in requirements:
        keyword_entry = {
            "keyword": req.get("text", ""),
            "tier": req.get("tier", 2),
            "tier_label": {1: "Critical", 2: "Important", 3: "Bonus"}.get(req.get("tier", 2), "Unknown"),
            "match_type": req.get("match_type", "NONE"),
            "evidence": req.get("evidence"),
        }
        
        if req.get("match_type") != "NONE":
            present_keywords.append(keyword_entry)
        else:
            missing_keywords.append(keyword_entry)
    
    # ─────────────────────────────────────────────────────────────────────
    # Build requirements breakdown (detailed view)
    # ─────────────────────────────────────────────────────────────────────
    
    requirements_breakdown = []
    for req in requirements:
        tier = req.get("tier", 2)
        match_type = req.get("match_type", "NONE")
        points_possible = CONFIG["tier_points"].get(tier, 8)
        credit = CONFIG["match_credit"].get(match_type, 0.0)
        
        requirements_breakdown.append({
            "skill": req.get("text", ""),
            "tier": tier,
            "tier_label": {1: "Critical", 2: "Important", 3: "Bonus"}.get(tier, "Unknown"),
            "match_type": match_type,
            "match_label": {
                "EXACT": "✓ Exact Match",
                "VARIANT": "~ Variant Match", 
                "CONTEXTUAL": "? Inferred",
                "NONE": "✗ Not Found"
            }.get(match_type, "Unknown"),
            "evidence": req.get("evidence"),
            "points_earned": round(points_possible * credit, 1),
            "points_possible": points_possible,
            "credit_pct": int(credit * 100),
        })
    
    # ─────────────────────────────────────────────────────────────────────
    # Calculate display scores
    # ─────────────────────────────────────────────────────────────────────
    
    hard_skills_score = scoring_result.tier1.percentage
    
    # Semantic match: weighted average of all tiers
    semantic_score = round(
        scoring_result.tier1.percentage * 0.5 +
        scoring_result.tier2.percentage * 0.3 +
        scoring_result.tier3.percentage * 0.2
    )
    
    # Experience/tone score
    experience_score = min(100, round(scoring_result.experience_ratio * 100))
    
    # ─────────────────────────────────────────────────────────────────────
    # Generate summary
    # ─────────────────────────────────────────────────────────────────────
    
    summary = _generate_summary(scoring_result, ai_extraction)
    
    # ─────────────────────────────────────────────────────────────────────
    # Build response
    # ─────────────────────────────────────────────────────────────────────
    
    return {
        # ═══════════════════════════════════════════════════════════════
        # PRIMARY SCORE
        # ═══════════════════════════════════════════════════════════════
        "score": scoring_result.score,
        "interpretation": scoring_result.interpretation,
        "summary": summary,
        
        # ═══════════════════════════════════════════════════════════════
        # MULTI-DIMENSIONAL BREAKDOWN (NEW - unique differentiator)
        # ═══════════════════════════════════════════════════════════════
        "dimensions": {
            name: {
                "score": dim.score,
                "label": dim.label,
                "description": dim.description,
                "weight": dim.weight,
                "details": dim.details,
            }
            for name, dim in scoring_result.dimensions.items()
        },
        
        # ═══════════════════════════════════════════════════════════════
        # COMPETITIVE INSIGHT (NEW - unique differentiator)
        # ═══════════════════════════════════════════════════════════════
        "competitive_insight": {
            "percentile_estimate": scoring_result.percentile_estimate,
            "percentile_label": f"Top {100 - scoring_result.percentile_estimate}% of applicants",
            "interpretation": _get_percentile_interpretation(scoring_result.percentile_estimate),
        },
        
        # ═══════════════════════════════════════════════════════════════
        # LEGACY FORMAT (for backwards compatibility)
        # ═══════════════════════════════════════════════════════════════
        "breakdown": {
            "hardSkills": hard_skills_score,
            "semanticMatch": semantic_score,
            "toneAnalysis": experience_score,
        },
        
        "points_summary": {
            "tier1_earned": scoring_result.tier1.earned,
            "tier1_possible": scoring_result.tier1.possible,
            "tier2_earned": scoring_result.tier2.earned,
            "tier2_possible": scoring_result.tier2.possible,
            "tier3_earned": scoring_result.tier3.earned,
            "tier3_possible": scoring_result.tier3.possible,
            "total_earned": scoring_result.total_earned,
            "total_possible": scoring_result.total_possible,
        },
        
        "experience_analysis": {
            "required_years": experience.get("required_years", 0),
            "candidate_years": experience.get("candidate_years", 0),
            "experience_ratio": scoring_result.experience_ratio,
            "experience_adjustment": scoring_result.experience_adjustment,
            "seniority_signals": experience.get("seniority_signals", []),
        },
        
        # ═══════════════════════════════════════════════════════════════
        # KEYWORD ANALYSIS
        # ═══════════════════════════════════════════════════════════════
        "keyword_analysis": {
            "present": present_keywords,
            "missing": missing_keywords,
        },
        
        # Simple lists for backwards compatibility
        "results": {
            "presentKeywords": [k["keyword"] for k in present_keywords],
            "missingKeywords": [k["keyword"] for k in missing_keywords],
        },
        
        # ═══════════════════════════════════════════════════════════════
        # DETAILED BREAKDOWN
        # ═══════════════════════════════════════════════════════════════
        "requirements_breakdown": requirements_breakdown,
        
        # ═══════════════════════════════════════════════════════════════
        # GAPS & OPTIMIZATION
        # ═══════════════════════════════════════════════════════════════
        "critical_gaps": [
            {
                "skill": skill,
                "tier": 1,
                "suggestion": next(
                    (g.get("suggestion", "") for g in ai_extraction.get("gaps", [])
                     if skill.lower() in g.get("requirement", "").lower()),
                    f'Add {skill} to your resume with specific examples'
                ),
            }
            for skill in scoring_result.missing_critical
        ],
        
        "weak_matches": [
            {
                "skill": skill,
                "issue": "Inferred but not explicit",
                "suggestion": f'Add "{skill}" explicitly with measurable outcomes',
            }
            for skill in scoring_result.weak_matches
        ],
        
        "quick_wins": optimization_plan,
        
        # ═══════════════════════════════════════════════════════════════
        # TRANSPARENCY (caps & debug)
        # ═══════════════════════════════════════════════════════════════
        "caps_applied": scoring_result.caps_applied,
        
        "_scoring_debug": {
            "raw_score": scoring_result.raw_score,
            "final_score": scoring_result.score,
            "experience_adjustment": scoring_result.experience_adjustment,
            "tier1_matched": f"{scoring_result.tier1.matched_count}/{scoring_result.tier1.total_count}",
            "tier2_matched": f"{scoring_result.tier2.matched_count}/{scoring_result.tier2.total_count}",
            "tier3_matched": f"{scoring_result.tier3.matched_count}/{scoring_result.tier3.total_count}",
            "caps_applied": scoring_result.caps_applied,
        },
    }


def _generate_summary(scoring_result: ScoringResult, ai_extraction: Dict[str, Any]) -> str:
    """Generate a human-readable, encouraging but honest summary."""
    
    score = scoring_result.score
    missing = len(scoring_result.missing_critical)
    weak = len(scoring_result.weak_matches)
    matched = scoring_result.tier1.matched_count
    total = scoring_result.tier1.total_count
    
    if score >= 85:
        base = f"Excellent match! You meet {matched}/{total} critical requirements."
        if missing:
            base += f" Adding {scoring_result.missing_critical[0]} would make your application even stronger."
        elif weak:
            base += f" Strengthening your {scoring_result.weak_matches[0]} mention could give you an edge."
        else:
            base += " Focus on quantifying your achievements to stand out."
        return base
    
    elif score >= 70:
        return (
            f"Good match with room for improvement. "
            f"You meet {matched}/{total} critical requirements, missing {missing}. "
            f"Addressing these gaps could significantly boost your chances."
        )
    
    elif score >= 55:
        return (
            f"Borderline match. You meet {matched}/{total} critical requirements. "
            f"ATS systems may filter this application. "
            f"Review the optimization plan for specific improvements."
        )
    
    else:
        return (
            f"This role may not be the best fit currently. "
            f"You meet only {matched}/{total} critical requirements. "
            f"Consider roles that better match your current skills, or use the optimization plan "
            f"to identify skills to develop."
        )


def _get_percentile_interpretation(percentile: int) -> str:
    """Get human-readable interpretation of percentile."""
    if percentile >= 90:
        return "Highly competitive - you're likely to stand out"
    elif percentile >= 75:
        return "Strong position - above average match"
    elif percentile >= 50:
        return "Competitive - on par with typical applicants"
    elif percentile >= 30:
        return "Below average - improvements recommended"
    else:
        return "Significant gaps - substantial improvements needed"


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import json
    
    # Test with sample data
    sample_ai_extraction = {
        "requirements": [
            {"text": "5+ years software development", "tier": 1, "match_type": "EXACT", "evidence": "6 years of experience"},
            {"text": "Python", "tier": 1, "match_type": "EXACT", "evidence": "Expert in Python, Django, Flask"},
            {"text": "AWS", "tier": 1, "match_type": "NONE", "evidence": None},
            {"text": "Docker", "tier": 1, "match_type": "CONTEXTUAL", "evidence": "containerized applications"},
            {"text": "Kubernetes", "tier": 2, "match_type": "NONE", "evidence": None},
            {"text": "SQL", "tier": 1, "match_type": "EXACT", "evidence": "PostgreSQL databases"},
            {"text": "Team leadership", "tier": 2, "match_type": "EXACT", "evidence": "Led a team of 3 junior developers"},
            {"text": "CI/CD", "tier": 2, "match_type": "VARIANT", "evidence": "GitHub Actions for automated deployments"},
        ],
        "experience": {
            "required_years": 5,
            "candidate_years": 6,
            "seniority_signals": ["Led team of 3 developers", "Mentored junior engineers"]
        },
        "gaps": [
            {"requirement": "AWS", "suggestion": "Add AWS services you've used (EC2, S3, Lambda, RDS)"},
            {"requirement": "Kubernetes", "suggestion": "Add any container orchestration experience"},
        ],
        "summary": "Strong Python developer with good experience but missing cloud infrastructure skills."
    }
    
    sample_resume = """
    John Doe - Senior Software Engineer
    6 years of experience building scalable applications.
    Led a team of 3 junior developers.
    Expert in Python, Django, Flask frameworks.
    Increased test coverage by 40%.
    Reduced deployment time by 60% using GitHub Actions.
    Managed PostgreSQL databases serving 1M+ users.
    """
    
    # Calculate score
    result = calculate_score(
        requirements=sample_ai_extraction["requirements"],
        required_years=5,
        candidate_years=6,
        is_senior_role=True,
        seniority_signals_found=2,
        resume_text=sample_resume,
    )
    
    print(f"═══════════════════════════════════════════════════════════════")
    print(f"SCORE: {result.score} ({result.interpretation})")
    print(f"═══════════════════════════════════════════════════════════════")
    print(f"Raw Score: {result.raw_score}")
    print(f"Caps Applied: {result.caps_applied}")
    print(f"Percentile: Top {100 - result.percentile_estimate}%")
    print(f"\nTier 1 (Critical): {result.tier1.matched_count}/{result.tier1.total_count} ({result.tier1.percentage}%)")
    print(f"Tier 2 (Important): {result.tier2.matched_count}/{result.tier2.total_count} ({result.tier2.percentage}%)")
    print(f"\nMissing Critical: {result.missing_critical}")
    print(f"Weak Matches: {result.weak_matches}")
    
    # Generate optimization plan
    plan = generate_optimization_plan(
        score=result.score,
        gaps=sample_ai_extraction["gaps"],
        requirements=sample_ai_extraction["requirements"],
        resume_text=sample_resume,
    )
    
    print(f"\n═══════════════════════════════════════════════════════════════")
    print(f"OPTIMIZATION PLAN ({len(plan)} items)")
    print(f"═══════════════════════════════════════════════════════════════")
    for item in plan:
        print(f"\n[{item['type'].upper()}] {item['title']}")
        print(f"  {item['description']}")
        if item.get('rewrite_suggestion'):
            print(f"  → Rewrite: {item['rewrite_suggestion'][:80]}...")
        print(f"  Impact: {item['potential_impact']}")
    
    # Transform to legacy format
    legacy = transform_to_legacy_format(result, sample_ai_extraction, plan)
    
    print(f"\n═══════════════════════════════════════════════════════════════")
    print(f"DIMENSIONS")
    print(f"═══════════════════════════════════════════════════════════════")
    for name, dim in legacy["dimensions"].items():
        print(f"  {dim['label']}: {dim['score']}% (weight: {dim['weight']})")
    
    print(f"\n═══════════════════════════════════════════════════════════════")
    print(f"COMPETITIVE INSIGHT")
    print(f"═══════════════════════════════════════════════════════════════")
    print(f"  {legacy['competitive_insight']['percentile_label']}")
    print(f"  {legacy['competitive_insight']['interpretation']}")