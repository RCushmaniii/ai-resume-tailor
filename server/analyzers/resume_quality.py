"""
Resume Quality Analyzer

Analyzes resume quality independent of job matching:
- Quantified achievements (metrics, numbers, percentages)
- Action verb strength
- Structure and formatting
- Length and completeness

File: server/analyzers/resume_quality.py
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.text_analysis import (
    extract_metrics,
    extract_metrics_simple,
    analyze_action_verbs,
    get_text_stats,
    extract_name,
    extract_email,
    extract_phone,
    extract_skills_section,
    POWER_VERBS,
    WEAK_VERBS,
    MetricMatch,
    VerbAnalysis,
    TextStats,
)


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

QUALITY_CONFIG = {
    # Ideal ranges
    "ideal_word_count": {"min": 400, "max": 800, "optimal": 600},
    "ideal_bullet_count": {"min": 8, "max": 20, "optimal": 12},
    "ideal_metrics_count": {"min": 3, "max": 10, "optimal": 6},
    "ideal_power_verbs": {"min": 5, "max": 15, "optimal": 10},
    
    # Scoring weights
    "weights": {
        "metrics": 0.30,          # Quantified achievements
        "action_verbs": 0.25,     # Strong action verbs
        "structure": 0.20,        # Sections, formatting
        "completeness": 0.15,     # Contact info, skills
        "length": 0.10,           # Appropriate length
    },
    
    # Score thresholds
    "thresholds": {
        "excellent": 85,
        "good": 70,
        "fair": 55,
        "needs_work": 40,
    },
}


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class QualityDimension:
    """Score for a single quality dimension."""
    name: str
    score: int  # 0-100
    weight: float
    status: str  # excellent, good, fair, needs_work
    findings: List[str]
    suggestions: List[str]


@dataclass
class ResumeQualityResult:
    """Complete resume quality analysis result."""
    overall_score: int
    overall_status: str
    dimensions: Dict[str, QualityDimension]
    
    # Extracted data
    metrics_found: List[MetricMatch]
    verb_analysis: VerbAnalysis
    text_stats: TextStats
    
    # Contact info
    has_name: bool
    has_email: bool
    has_phone: bool
    
    # Top suggestions (prioritized)
    top_suggestions: List[Dict[str, Any]]
    
    # Quick stats for display
    quick_stats: Dict[str, Any]


# ═══════════════════════════════════════════════════════════════════════════
# MAIN ANALYSIS FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def analyze_resume_quality(resume_text: str) -> ResumeQualityResult:
    """
    Analyze resume quality independent of job matching.
    
    Args:
        resume_text: Full resume text
        
    Returns:
        ResumeQualityResult with scores, findings, and suggestions
    """
    
    # Extract all data
    metrics = extract_metrics(resume_text)
    metrics_simple = extract_metrics_simple(resume_text)
    verb_analysis = analyze_action_verbs(resume_text)
    text_stats = get_text_stats(resume_text)
    skills = extract_skills_section(resume_text)
    
    # Contact info
    has_name = extract_name(resume_text) is not None
    has_email = extract_email(resume_text) is not None
    has_phone = extract_phone(resume_text) is not None
    
    # Analyze each dimension
    dimensions = {}
    
    # 1. Metrics/Quantification
    dimensions["metrics"] = _analyze_metrics_dimension(metrics, metrics_simple)
    
    # 2. Action Verbs
    dimensions["action_verbs"] = _analyze_verbs_dimension(verb_analysis)
    
    # 3. Structure
    dimensions["structure"] = _analyze_structure_dimension(text_stats, resume_text)
    
    # 4. Completeness
    dimensions["completeness"] = _analyze_completeness_dimension(
        has_name, has_email, has_phone, skills, text_stats
    )
    
    # 5. Length
    dimensions["length"] = _analyze_length_dimension(text_stats)
    
    # Calculate overall score
    overall_score = _calculate_overall_score(dimensions)
    overall_status = _get_status(overall_score)
    
    # Generate prioritized suggestions
    top_suggestions = _prioritize_suggestions(dimensions)
    
    # Quick stats for display
    quick_stats = {
        "word_count": text_stats.word_count,
        "bullet_points": text_stats.bullet_count,
        "metrics_count": len(metrics),
        "power_verbs_count": verb_analysis.power_verb_count,
        "weak_verbs_count": verb_analysis.weak_verb_count,
        "skills_count": len(skills),
        "has_contact_info": all([has_name, has_email, has_phone]),
    }
    
    return ResumeQualityResult(
        overall_score=overall_score,
        overall_status=overall_status,
        dimensions=dimensions,
        metrics_found=metrics,
        verb_analysis=verb_analysis,
        text_stats=text_stats,
        has_name=has_name,
        has_email=has_email,
        has_phone=has_phone,
        top_suggestions=top_suggestions,
        quick_stats=quick_stats,
    )


# ═══════════════════════════════════════════════════════════════════════════
# DIMENSION ANALYZERS
# ═══════════════════════════════════════════════════════════════════════════

def _analyze_metrics_dimension(
    metrics: List[MetricMatch], 
    metrics_simple: Dict[str, List[str]]
) -> QualityDimension:
    """Analyze quantified achievements."""
    
    config = QUALITY_CONFIG["ideal_metrics_count"]
    count = len(metrics)
    
    findings = []
    suggestions = []
    
    # Calculate score
    if count >= config["optimal"]:
        score = 100
    elif count >= config["min"]:
        score = 70 + (count - config["min"]) * 10
    elif count > 0:
        score = 40 + count * 10
    else:
        score = 20
    
    # Generate findings
    if count == 0:
        findings.append("No quantified achievements found")
        suggestions.append("Add specific metrics: percentages, dollar amounts, or numbers (e.g., 'Increased sales by 35%')")
        suggestions.append("Quantify team sizes, project scope, or users impacted")
    elif count < config["min"]:
        findings.append(f"Only {count} metrics found (aim for {config['min']}+)")
        suggestions.append("Add more quantified results to strengthen impact")
    else:
        findings.append(f"Strong: {count} quantified achievements found")
    
    # Check metric types
    has_percentage = len(metrics_simple.get("percentage", [])) > 0
    has_dollar = len(metrics_simple.get("dollar_amount", [])) > 0
    
    if not has_percentage:
        suggestions.append("Add percentage improvements (e.g., 'reduced costs by 25%')")
    if not has_dollar:
        suggestions.append("Include dollar amounts where relevant (e.g., 'managed $1.2M budget')")
    
    return QualityDimension(
        name="Quantified Achievements",
        score=min(100, score),
        weight=QUALITY_CONFIG["weights"]["metrics"],
        status=_get_status(score),
        findings=findings,
        suggestions=suggestions[:3],  # Limit suggestions
    )


def _analyze_verbs_dimension(verb_analysis: VerbAnalysis) -> QualityDimension:
    """Analyze action verb usage."""
    
    config = QUALITY_CONFIG["ideal_power_verbs"]
    power_count = verb_analysis.power_verb_count
    weak_count = verb_analysis.weak_verb_count
    
    findings = []
    suggestions = []
    
    # Calculate score
    base_score = 50
    
    # Add points for power verbs
    if power_count >= config["optimal"]:
        base_score += 40
    elif power_count >= config["min"]:
        base_score += 25 + (power_count - config["min"]) * 3
    else:
        base_score += power_count * 5
    
    # Subtract for weak verbs
    penalty = weak_count * 5
    score = max(20, base_score - penalty)
    
    # Cap at 100
    score = min(100, score)
    
    # Generate findings
    if power_count >= config["min"]:
        findings.append(f"Good variety: {power_count} strong action verbs")
        top_verbs = verb_analysis.power_verbs[:5]
        findings.append(f"Using: {', '.join(top_verbs)}")
    else:
        findings.append(f"Only {power_count} power verbs found")
        suggestions.append("Start bullets with strong verbs: led, developed, achieved, increased")
    
    if weak_count > 0:
        findings.append(f"Found {weak_count} weak verb(s): {', '.join(verb_analysis.weak_verbs[:3])}")
        suggestions.append(f"Replace weak verbs like '{verb_analysis.weak_verbs[0]}' with action-oriented alternatives")
    
    # Check verb categories
    categories = verb_analysis.verb_categories
    if categories.get("achievement", 0) == 0:
        suggestions.append("Add achievement verbs: achieved, accomplished, exceeded, delivered")
    if categories.get("leadership", 0) == 0:
        suggestions.append("Add leadership verbs if applicable: led, managed, directed, coordinated")
    
    return QualityDimension(
        name="Action Verbs",
        score=score,
        weight=QUALITY_CONFIG["weights"]["action_verbs"],
        status=_get_status(score),
        findings=findings,
        suggestions=suggestions[:3],
    )


def _analyze_structure_dimension(text_stats: TextStats, resume_text: str) -> QualityDimension:
    """Analyze resume structure and formatting."""
    
    findings = []
    suggestions = []
    score = 50
    
    # Check sections
    section_count = text_stats.section_count
    if section_count >= 4:
        score += 25
        findings.append(f"Well-structured with {section_count} clear sections")
    elif section_count >= 2:
        score += 10
        findings.append(f"Basic structure with {section_count} sections")
        suggestions.append("Add clear section headers: Experience, Skills, Education")
    else:
        findings.append("Missing clear section structure")
        suggestions.append("Organize with clear headers: Summary, Experience, Skills, Education")
    
    # Check bullets
    bullet_config = QUALITY_CONFIG["ideal_bullet_count"]
    if text_stats.bullet_count >= bullet_config["min"]:
        score += 20
        findings.append(f"Good use of bullet points ({text_stats.bullet_count})")
    elif text_stats.bullet_count > 0:
        score += 10
        suggestions.append("Add more bullet points for readability")
    else:
        findings.append("No bullet points detected")
        suggestions.append("Use bullet points for achievements and responsibilities")
    
    # Check for common sections
    resume_lower = resume_text.lower()
    has_experience = "experience" in resume_lower
    has_education = "education" in resume_lower
    has_skills = "skills" in resume_lower or "technologies" in resume_lower
    
    if all([has_experience, has_education, has_skills]):
        score += 5
    else:
        missing = []
        if not has_experience:
            missing.append("Experience")
        if not has_education:
            missing.append("Education")
        if not has_skills:
            missing.append("Skills")
        if missing:
            suggestions.append(f"Add missing section(s): {', '.join(missing)}")
    
    return QualityDimension(
        name="Structure & Format",
        score=min(100, score),
        weight=QUALITY_CONFIG["weights"]["structure"],
        status=_get_status(score),
        findings=findings,
        suggestions=suggestions[:3],
    )


def _analyze_completeness_dimension(
    has_name: bool,
    has_email: bool,
    has_phone: bool,
    skills: List[str],
    text_stats: TextStats
) -> QualityDimension:
    """Analyze resume completeness."""
    
    findings = []
    suggestions = []
    score = 40
    
    # Contact information
    contact_items = [has_name, has_email, has_phone]
    contact_score = sum(contact_items)
    
    if contact_score == 3:
        score += 30
        findings.append("Complete contact information")
    elif contact_score >= 2:
        score += 20
        if not has_name:
            suggestions.append("Add your name at the top of the resume")
        if not has_email:
            suggestions.append("Add your email address")
        if not has_phone:
            suggestions.append("Consider adding a phone number")
    else:
        findings.append("Missing contact information")
        suggestions.append("Add complete contact info: name, email, phone")
    
    # Skills section
    if len(skills) >= 8:
        score += 20
        findings.append(f"Strong skills section with {len(skills)} skills")
    elif len(skills) >= 4:
        score += 10
        findings.append(f"Skills section has {len(skills)} items")
        suggestions.append("Consider expanding your skills list")
    elif len(skills) > 0:
        score += 5
        suggestions.append("Add more relevant skills to your skills section")
    else:
        findings.append("No clear skills section found")
        suggestions.append("Add a dedicated Skills section with relevant technologies/competencies")
    
    # Check for summary/objective
    if text_stats.section_count > 0:
        score += 10
    
    return QualityDimension(
        name="Completeness",
        score=min(100, score),
        weight=QUALITY_CONFIG["weights"]["completeness"],
        status=_get_status(score),
        findings=findings,
        suggestions=suggestions[:3],
    )


def _analyze_length_dimension(text_stats: TextStats) -> QualityDimension:
    """Analyze resume length."""
    
    config = QUALITY_CONFIG["ideal_word_count"]
    word_count = text_stats.word_count
    
    findings = []
    suggestions = []
    
    if config["min"] <= word_count <= config["max"]:
        score = 100
        findings.append(f"Ideal length: {word_count} words")
    elif word_count < config["min"]:
        # Too short
        deficit = config["min"] - word_count
        score = max(30, 70 - (deficit // 10) * 5)
        findings.append(f"Too brief: {word_count} words (aim for {config['min']}+)")
        suggestions.append("Add more detail to your experience descriptions")
        suggestions.append("Include specific accomplishments and responsibilities")
    else:
        # Too long
        excess = word_count - config["max"]
        score = max(50, 90 - (excess // 50) * 5)
        findings.append(f"Lengthy: {word_count} words (consider {config['max']} or less)")
        suggestions.append("Focus on most relevant and recent experience")
        suggestions.append("Remove outdated or less relevant information")
    
    return QualityDimension(
        name="Length",
        score=score,
        weight=QUALITY_CONFIG["weights"]["length"],
        status=_get_status(score),
        findings=findings,
        suggestions=suggestions[:2],
    )


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def _calculate_overall_score(dimensions: Dict[str, QualityDimension]) -> int:
    """Calculate weighted overall score."""
    total = 0
    for dim in dimensions.values():
        total += dim.score * dim.weight
    return round(total)


def _get_status(score: int) -> str:
    """Get status label for a score."""
    thresholds = QUALITY_CONFIG["thresholds"]
    if score >= thresholds["excellent"]:
        return "excellent"
    elif score >= thresholds["good"]:
        return "good"
    elif score >= thresholds["fair"]:
        return "fair"
    else:
        return "needs_work"


def _prioritize_suggestions(dimensions: Dict[str, QualityDimension]) -> List[Dict[str, Any]]:
    """Collect and prioritize suggestions from all dimensions."""
    
    all_suggestions = []
    
    # Priority order based on impact
    priority_order = ["metrics", "action_verbs", "completeness", "structure", "length"]
    
    for dim_name in priority_order:
        dim = dimensions.get(dim_name)
        if not dim:
            continue
            
        # Only include suggestions from dimensions that need improvement
        if dim.score < 80:
            for suggestion in dim.suggestions:
                priority = "high" if dim.score < 50 else "medium" if dim.score < 70 else "low"
                all_suggestions.append({
                    "category": dim.name,
                    "suggestion": suggestion,
                    "priority": priority,
                    "impact": f"+{max(5, (100 - dim.score) // 4)} potential points",
                })
    
    # Return top 5 suggestions
    return all_suggestions[:5]


# ═══════════════════════════════════════════════════════════════════════════
# OUTPUT FORMATTER
# ═══════════════════════════════════════════════════════════════════════════

def format_quality_report(result: ResumeQualityResult) -> Dict[str, Any]:
    """
    Format quality analysis for API response.
    
    Args:
        result: ResumeQualityResult from analyze_resume_quality()
        
    Returns:
        Dict ready for JSON serialization
    """
    return {
        "quality_score": result.overall_score,
        "quality_status": result.overall_status,
        "quality_label": {
            "excellent": "Excellent Resume",
            "good": "Good Resume",
            "fair": "Fair - Needs Improvement",
            "needs_work": "Needs Significant Work",
        }.get(result.overall_status, "Unknown"),
        
        "dimensions": {
            name: {
                "score": dim.score,
                "status": dim.status,
                "name": dim.name,
                "findings": dim.findings,
                "suggestions": dim.suggestions,
            }
            for name, dim in result.dimensions.items()
        },
        
        "quick_stats": result.quick_stats,
        
        "top_suggestions": result.top_suggestions,
        
        "metrics_found": [
            {"text": m.text, "type": m.type, "context": m.context[:100]}
            for m in result.metrics_found[:10]
        ],
        
        "verb_analysis": {
            "power_verbs": result.verb_analysis.power_verbs[:10],
            "weak_verbs": result.verb_analysis.weak_verbs,
            "power_verb_count": result.verb_analysis.power_verb_count,
            "categories": result.verb_analysis.verb_categories,
        },
        
        "contact_info": {
            "has_name": result.has_name,
            "has_email": result.has_email,
            "has_phone": result.has_phone,
            "complete": all([result.has_name, result.has_email, result.has_phone]),
        },
    }


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import json
    
    sample_resume = """
    John Doe
    Senior Software Engineer
    john.doe@email.com | (555) 123-4567
    
    SUMMARY
    Results-driven software engineer with 8+ years of experience leading development teams
    and delivering scalable solutions.
    
    EXPERIENCE
    
    Senior Software Engineer | Tech Corp | 2020-Present
    • Led a team of 5 engineers, increasing sprint velocity by 40%
    • Reduced deployment time by 60% through CI/CD pipeline optimization
    • Architected microservices platform serving 2M+ daily active users
    • Managed $1.5M annual cloud infrastructure budget
    
    Software Engineer | StartUp Inc | 2016-2020
    • Developed RESTful APIs handling 10,000+ requests per minute
    • Improved database query performance by 75%
    • Mentored 3 junior developers
    
    EDUCATION
    BS Computer Science | University of Technology | 2016
    
    SKILLS
    Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Git
    """
    
    print("=== Resume Quality Analysis ===\n")
    
    result = analyze_resume_quality(sample_resume)
    report = format_quality_report(result)
    
    print(f"Overall Score: {report['quality_score']}/100 ({report['quality_label']})")
    print(f"\nDimensions:")
    for name, dim in report['dimensions'].items():
        print(f"  {dim['name']}: {dim['score']}/100 ({dim['status']})")
    
    print(f"\nQuick Stats: {report['quick_stats']}")
    
    print(f"\nTop Suggestions:")
    for suggestion in report['top_suggestions']:
        print(f"  [{suggestion['priority']}] {suggestion['suggestion']}")
    
    print(f"\n=== Full JSON Output ===")
    print(json.dumps(report, indent=2))