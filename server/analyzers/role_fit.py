"""
Role Fit Analyzer

Detects whether gaps are structural (role mismatch) or expressive (fixable with rewording).
When structural gaps are detected, pivots to suggesting eligible roles instead of
false optimization hope.

This is an ethical, trust-building feature that:
- Tells users the truth when a role isn't a fit
- Preserves dignity ("role requires more senior profile" not "you're underqualified")
- Provides actionable redirection (roles they ARE qualified for)
- Creates natural upsell to "Eligible Roles" feature

File: server/analyzers/role_fit.py
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
import re


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════

class GapType(Enum):
    """Classification of gap types."""
    EXPRESSIVE = "expressive"      # Can be fixed with better wording
    STRUCTURAL = "structural"      # Cannot be fixed without actual experience


class GapCategory(Enum):
    """Categories of structural gaps."""
    YEARS_EXPERIENCE = "years_experience"
    LEADERSHIP = "leadership"
    BUDGET_OWNERSHIP = "budget_ownership"
    SCOPE_LEVEL = "scope_level"           # Senior vs Junior scope
    DOMAIN_EXPERTISE = "domain_expertise"  # Industry/vertical experience
    TECHNICAL_DEPTH = "technical_depth"    # Advanced technical skills
    CREDENTIAL = "credential"              # Degrees, certifications


class RoleFitVerdict(Enum):
    """Overall role fit assessment."""
    STRONG_FIT = "strong_fit"           # Good match, optimize away
    MODERATE_FIT = "moderate_fit"       # Some gaps, but achievable
    STRETCH_ROLE = "stretch_role"       # Significant gaps, acknowledge honestly
    ROLE_MISMATCH = "role_mismatch"     # Structural mismatch, redirect


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class StructuralGap:
    """A gap that cannot be fixed with resume rewording."""
    category: GapCategory
    requirement: str           # What the job requires
    current_state: str         # What the resume shows
    severity: str              # "critical" | "significant" | "moderate"
    explanation: str           # Human-readable explanation


@dataclass
class EligibleRole:
    """A role the candidate IS qualified for."""
    title: str
    match_reason: str          # Why this role fits
    experience_level: str      # "entry" | "mid" | "senior" | "lead"
    skills_matched: List[str]
    growth_path: Optional[str] = None  # How this leads to target role


@dataclass
class RoleFitAssessment:
    """Complete role fit assessment."""
    verdict: RoleFitVerdict
    verdict_label: str
    verdict_explanation: str
    
    # Gap analysis
    structural_gaps: List[StructuralGap]
    expressive_gaps: List[str]  # These CAN be fixed with rewording
    
    # Counts
    structural_gap_count: int
    expressive_gap_count: int
    
    # When mismatch detected
    show_mismatch_section: bool
    mismatch_message: Optional[str]
    dignity_statement: Optional[str]
    
    # Eligible roles (the upsell)
    eligible_roles: List[EligibleRole]
    show_eligible_roles_teaser: bool
    
    # Metadata
    target_role_level: str     # Detected level of target role
    resume_level: str          # Detected level of resume
    level_gap: int             # 0 = match, positive = stretch


# ═══════════════════════════════════════════════════════════════════════════
# ROLE LEVEL DETECTION
# ═══════════════════════════════════════════════════════════════════════════

ROLE_LEVEL_PATTERNS = {
    "executive": [
        r"\b(ceo|cto|cfo|coo|cmo|chief|president|vp|vice president)\b",
        r"\b(evp|svp|executive)\b",
    ],
    "director": [
        r"\b(director|head of)\b",
    ],
    "senior": [
        r"\b(senior|sr\.?|lead|principal|staff)\b",
        r"\b(manager|team lead)\b",
    ],
    "mid": [
        r"\b(specialist|analyst|engineer|developer|coordinator)\b",
        r"\b(associate|consultant)\b",
    ],
    "entry": [
        r"\b(junior|jr\.?|entry|intern|trainee|assistant)\b",
    ],
}

LEVEL_HIERARCHY = ["entry", "mid", "senior", "director", "executive"]


def detect_role_level(title: str) -> str:
    """Detect the seniority level of a role from its title."""
    title_lower = title.lower()
    
    for level, patterns in ROLE_LEVEL_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, title_lower):
                return level
    
    # Default to mid-level if unclear
    return "mid"


def calculate_level_gap(target_level: str, resume_level: str) -> int:
    """
    Calculate gap between target role level and resume level.
    Positive = stretch/reach, Negative = overqualified, 0 = match
    """
    try:
        target_idx = LEVEL_HIERARCHY.index(target_level)
        resume_idx = LEVEL_HIERARCHY.index(resume_level)
        return target_idx - resume_idx
    except ValueError:
        return 0


# ═══════════════════════════════════════════════════════════════════════════
# STRUCTURAL GAP DETECTION
# ═══════════════════════════════════════════════════════════════════════════

def detect_years_gap(
    required_years: Optional[int],
    resume_years: Optional[int]
) -> Optional[StructuralGap]:
    """Detect years of experience gap."""
    if required_years is None or resume_years is None:
        return None
    
    gap = required_years - resume_years
    
    if gap <= 1:
        return None  # Within acceptable range
    
    severity = "critical" if gap >= 4 else "significant" if gap >= 2 else "moderate"
    
    return StructuralGap(
        category=GapCategory.YEARS_EXPERIENCE,
        requirement=f"{required_years}+ years of experience",
        current_state=f"~{resume_years} years demonstrated",
        severity=severity,
        explanation=f"This role requires {gap} more years of experience than currently shown."
    )


def detect_leadership_gap(
    requires_leadership: bool,
    has_leadership: bool,
    leadership_scope: Optional[str] = None
) -> Optional[StructuralGap]:
    """Detect leadership/management experience gap."""
    if not requires_leadership or has_leadership:
        return None
    
    return StructuralGap(
        category=GapCategory.LEADERSHIP,
        requirement=leadership_scope or "Team leadership experience",
        current_state="No leadership experience demonstrated",
        severity="critical",
        explanation="This role requires managing or leading teams, which isn't reflected in the resume."
    )


def detect_budget_gap(
    requires_budget: bool,
    has_budget: bool,
    required_amount: Optional[str] = None
) -> Optional[StructuralGap]:
    """Detect budget ownership gap."""
    if not requires_budget or has_budget:
        return None
    
    return StructuralGap(
        category=GapCategory.BUDGET_OWNERSHIP,
        requirement=f"Budget ownership{f' ({required_amount})' if required_amount else ''}",
        current_state="No budget ownership demonstrated",
        severity="significant",
        explanation="This role requires managing significant budgets, which isn't reflected in the resume."
    )


def detect_scope_gap(
    target_level: str,
    resume_level: str,
    level_gap: int
) -> Optional[StructuralGap]:
    """Detect scope/seniority level gap."""
    if level_gap <= 1:
        return None  # One level stretch is acceptable
    
    severity = "critical" if level_gap >= 3 else "significant"
    
    return StructuralGap(
        category=GapCategory.SCOPE_LEVEL,
        requirement=f"{target_level.title()}-level responsibilities and scope",
        current_state=f"{resume_level.title()}-level experience demonstrated",
        severity=severity,
        explanation=f"This role is {level_gap} levels above current demonstrated experience."
    )


def detect_domain_gap(
    required_domains: List[str],
    resume_domains: List[str]
) -> Optional[StructuralGap]:
    """Detect industry/domain expertise gap."""
    missing_domains = [d for d in required_domains if d.lower() not in [r.lower() for r in resume_domains]]
    
    if not missing_domains:
        return None
    
    # Only flag if critical domains are missing
    critical_domains = ["b2b", "enterprise", "saas", "healthcare", "fintech", "e-commerce"]
    critical_missing = [d for d in missing_domains if d.lower() in critical_domains]
    
    if not critical_missing and len(missing_domains) < 2:
        return None
    
    return StructuralGap(
        category=GapCategory.DOMAIN_EXPERTISE,
        requirement=f"Experience in: {', '.join(missing_domains[:3])}",
        current_state="Domain experience not demonstrated",
        severity="significant" if critical_missing else "moderate",
        explanation="This role requires specific industry or domain expertise not reflected in the resume."
    )


def detect_technical_depth_gap(
    required_advanced_skills: List[str],
    resume_skills: List[str],
    skill_context: Dict[str, str]  # skill -> context shown in resume
) -> Optional[StructuralGap]:
    """Detect advanced technical skill gaps."""
    # Skills that require deep expertise, not just mention
    advanced_skill_indicators = [
        "architect", "advanced", "expert", "deep experience",
        "hands-on", "production", "at scale", "enterprise-grade"
    ]
    
    missing_advanced = []
    for skill in required_advanced_skills:
        skill_lower = skill.lower()
        # Check if skill is present with depth
        context = skill_context.get(skill_lower, "")
        has_depth = any(ind in context.lower() for ind in advanced_skill_indicators)
        
        if skill_lower not in [s.lower() for s in resume_skills] or not has_depth:
            missing_advanced.append(skill)
    
    if len(missing_advanced) < 2:
        return None
    
    return StructuralGap(
        category=GapCategory.TECHNICAL_DEPTH,
        requirement=f"Advanced expertise in: {', '.join(missing_advanced[:3])}",
        current_state="Required depth of expertise not demonstrated",
        severity="significant",
        explanation="This role requires deep, hands-on expertise in specific areas."
    )


# ═══════════════════════════════════════════════════════════════════════════
# ELIGIBLE ROLE GENERATION
# ═══════════════════════════════════════════════════════════════════════════

# Role progression paths by domain
ROLE_PROGRESSIONS = {
    "marketing": {
        "executive": ["VP Marketing", "CMO", "Chief Growth Officer"],
        "director": ["Director of Marketing", "Director of Digital Marketing", "Head of Demand Gen"],
        "senior": ["Senior Marketing Manager", "Marketing Manager", "Growth Marketing Manager"],
        "mid": ["Marketing Specialist", "Digital Marketing Specialist", "Campaign Manager", "Content Marketing Manager"],
        "entry": ["Marketing Coordinator", "Marketing Associate", "Content Specialist"],
    },
    "engineering": {
        "executive": ["VP Engineering", "CTO", "Chief Architect"],
        "director": ["Engineering Director", "Head of Engineering", "Principal Architect"],
        "senior": ["Senior Software Engineer", "Staff Engineer", "Tech Lead", "Engineering Manager"],
        "mid": ["Software Engineer", "Developer", "Full Stack Developer"],
        "entry": ["Junior Developer", "Associate Engineer", "Software Engineer I"],
    },
    "product": {
        "executive": ["VP Product", "Chief Product Officer", "Head of Product"],
        "director": ["Director of Product", "Group Product Manager", "Principal PM"],
        "senior": ["Senior Product Manager", "Product Manager", "Product Lead"],
        "mid": ["Product Manager", "Associate Product Manager", "Product Analyst"],
        "entry": ["Product Analyst", "Product Coordinator", "Junior PM"],
    },
    "data": {
        "executive": ["VP Data", "Chief Data Officer", "Chief Analytics Officer"],
        "director": ["Director of Analytics", "Head of Data Science", "Director of BI"],
        "senior": ["Senior Data Scientist", "Lead Data Analyst", "Staff Data Engineer"],
        "mid": ["Data Scientist", "Data Analyst", "Data Engineer", "BI Analyst"],
        "entry": ["Junior Data Analyst", "Data Analyst I", "Analytics Associate"],
    },
    "sales": {
        "executive": ["VP Sales", "CRO", "Chief Revenue Officer"],
        "director": ["Director of Sales", "Head of Sales", "Regional Sales Director"],
        "senior": ["Senior Account Executive", "Sales Manager", "Enterprise AE"],
        "mid": ["Account Executive", "Sales Representative", "Account Manager"],
        "entry": ["SDR", "BDR", "Sales Associate", "Inside Sales Rep"],
    },
    "design": {
        "executive": ["VP Design", "Chief Design Officer", "Head of Design"],
        "director": ["Design Director", "Creative Director", "Head of UX"],
        "senior": ["Senior Product Designer", "Lead Designer", "UX Manager"],
        "mid": ["Product Designer", "UX Designer", "UI Designer"],
        "entry": ["Junior Designer", "Design Associate", "UX Researcher"],
    },
}


def detect_domain_from_resume(resume_text: str, job_title: str) -> str:
    """Detect the primary domain/function from resume content."""
    domain_keywords = {
        "marketing": ["marketing", "campaign", "brand", "content", "seo", "demand gen", "growth"],
        "engineering": ["software", "developer", "engineer", "code", "programming", "technical"],
        "product": ["product manager", "product management", "roadmap", "user stories", "agile"],
        "data": ["data scientist", "analytics", "machine learning", "sql", "python", "statistics"],
        "sales": ["sales", "revenue", "account", "quota", "pipeline", "deals", "crm"],
        "design": ["design", "ux", "ui", "user experience", "figma", "prototype", "wireframe"],
    }
    
    text_lower = resume_text.lower() + " " + job_title.lower()
    
    scores = {}
    for domain, keywords in domain_keywords.items():
        scores[domain] = sum(1 for kw in keywords if kw in text_lower)
    
    return max(scores, key=scores.get) if scores else "marketing"


def generate_eligible_roles(
    domain: str,
    resume_level: str,
    target_level: str,
    matched_skills: List[str],
    target_job_title: str
) -> List[EligibleRole]:
    """Generate list of roles the candidate is actually qualified for."""
    roles = []
    
    # Get roles at their level and one below (safe matches)
    level_idx = LEVEL_HIERARCHY.index(resume_level) if resume_level in LEVEL_HIERARCHY else 1
    
    # Get domain roles
    domain_roles = ROLE_PROGRESSIONS.get(domain, ROLE_PROGRESSIONS["marketing"])
    
    # Add roles at current level
    current_level_roles = domain_roles.get(resume_level, [])
    for title in current_level_roles[:3]:
        roles.append(EligibleRole(
            title=title,
            match_reason="Matches your current experience level and skills",
            experience_level=resume_level,
            skills_matched=matched_skills[:5],
            growth_path=f"Strong foundation for progressing to {target_level}-level roles"
        ))
    
    # Add one level up (stretch but achievable)
    if level_idx < len(LEVEL_HIERARCHY) - 1:
        next_level = LEVEL_HIERARCHY[level_idx + 1]
        next_level_roles = domain_roles.get(next_level, [])
        for title in next_level_roles[:2]:
            roles.append(EligibleRole(
                title=title,
                match_reason="Achievable stretch role based on your trajectory",
                experience_level=next_level,
                skills_matched=matched_skills[:4],
                growth_path=f"Stepping stone toward {target_job_title}"
            ))
    
    return roles[:6]  # Limit to 6 suggestions


# ═══════════════════════════════════════════════════════════════════════════
# MAIN ANALYZER
# ═══════════════════════════════════════════════════════════════════════════

def analyze_role_fit(
    # From AI extraction
    job_title: str,
    required_years: Optional[int],
    required_skills: List[str],
    required_experience: List[str],  # Leadership, budget, etc.
    
    # From resume
    resume_text: str,
    resume_years: Optional[int],
    resume_skills: List[str],
    resume_experience: List[str],
    
    # From scoring engine
    ats_status: str,  # "PASS" or "FAIL"
    search_visibility: str,  # "HIGH", "MEDIUM", "LOW"
    alignment_score: int,  # 0-100
    missing_keywords: List[Dict],  # From gap analysis
    
    # Optional context
    skill_context: Optional[Dict[str, str]] = None
) -> RoleFitAssessment:
    """
    Analyze whether gaps are structural or expressive.
    Returns honest assessment with eligible role suggestions when appropriate.
    """
    
    structural_gaps: List[StructuralGap] = []
    expressive_gaps: List[str] = []
    
    # Detect levels
    target_level = detect_role_level(job_title)
    resume_level = detect_role_level(resume_text[:500])  # Check recent titles
    level_gap = calculate_level_gap(target_level, resume_level)
    
    # Detect domain
    domain = detect_domain_from_resume(resume_text, job_title)
    
    # ═══════════════════════════════════════════════════════════════════
    # STRUCTURAL GAP DETECTION
    # ═══════════════════════════════════════════════════════════════════
    
    # 1. Years of experience
    years_gap = detect_years_gap(required_years, resume_years)
    if years_gap:
        structural_gaps.append(years_gap)
    
    # 2. Leadership experience
    requires_leadership = any(
        kw in " ".join(required_experience).lower() 
        for kw in ["lead", "manage", "team", "direct report", "leadership"]
    )
    has_leadership = any(
        kw in resume_text.lower() 
        for kw in ["led", "managed", "supervised", "team of", "direct reports"]
    )
    leadership_gap = detect_leadership_gap(requires_leadership, has_leadership)
    if leadership_gap:
        structural_gaps.append(leadership_gap)
    
    # 3. Budget ownership
    requires_budget = any(
        kw in " ".join(required_experience).lower() 
        for kw in ["budget", "p&l", "revenue responsibility", "cost center"]
    )
    has_budget = any(
        kw in resume_text.lower() 
        for kw in ["budget", "p&l", "$", "million", "revenue"]
    )
    budget_gap = detect_budget_gap(requires_budget, has_budget)
    if budget_gap:
        structural_gaps.append(budget_gap)
    
    # 4. Scope/level gap
    scope_gap = detect_scope_gap(target_level, resume_level, level_gap)
    if scope_gap:
        structural_gaps.append(scope_gap)
    
    # ═══════════════════════════════════════════════════════════════════
    # EXPRESSIVE GAP DETECTION (from missing keywords)
    # ═══════════════════════════════════════════════════════════════════
    
    for keyword_gap in missing_keywords:
        keyword = keyword_gap.get("keyword", "")
        # Check if this is fixable with rewording
        is_structural = any([
            "years" in keyword.lower(),
            "experience" in keyword.lower() and "senior" in keyword.lower(),
            "leadership" in keyword.lower(),
            "director" in keyword.lower(),
            "manager" in keyword.lower() and "team" in keyword.lower(),
        ])
        
        if not is_structural:
            expressive_gaps.append(keyword)
    
    # ═══════════════════════════════════════════════════════════════════
    # DETERMINE VERDICT
    # ═══════════════════════════════════════════════════════════════════
    
    critical_structural = [g for g in structural_gaps if g.severity == "critical"]
    significant_structural = [g for g in structural_gaps if g.severity == "significant"]
    
    # Determine if this is a role mismatch
    is_mismatch = (
        ats_status == "FAIL" and 
        search_visibility == "LOW" and
        alignment_score < 40 and
        len(critical_structural) >= 1
    ) or (
        len(critical_structural) >= 2
    ) or (
        level_gap >= 3
    )
    
    is_stretch = (
        len(critical_structural) == 1 or
        len(significant_structural) >= 2 or
        level_gap == 2
    ) and not is_mismatch
    
    is_moderate = (
        len(structural_gaps) > 0 and
        not is_mismatch and
        not is_stretch
    )
    
    # Set verdict
    if is_mismatch:
        verdict = RoleFitVerdict.ROLE_MISMATCH
        verdict_label = "Role Mismatch Detected"
        verdict_explanation = (
            "This role requires experience that isn't currently demonstrated in your resume. "
            "Even with optimization, these core requirements cannot be addressed through rewording."
        )
    elif is_stretch:
        verdict = RoleFitVerdict.STRETCH_ROLE
        verdict_label = "Stretch Role"
        verdict_explanation = (
            "This role is above your current demonstrated experience level. "
            "You may be competitive with strong positioning, but should have backup options."
        )
    elif is_moderate:
        verdict = RoleFitVerdict.MODERATE_FIT
        verdict_label = "Moderate Fit"
        verdict_explanation = (
            "You meet most requirements but have some gaps. "
            "Resume optimization can help, combined with strategic positioning."
        )
    else:
        verdict = RoleFitVerdict.STRONG_FIT
        verdict_label = "Strong Fit"
        verdict_explanation = (
            "Your experience aligns well with this role. "
            "Focus on optimization to maximize your competitiveness."
        )
    
    # ═══════════════════════════════════════════════════════════════════
    # GENERATE ELIGIBLE ROLES (for mismatch/stretch cases)
    # ═══════════════════════════════════════════════════════════════════
    
    eligible_roles = []
    show_eligible_roles_teaser = is_mismatch or is_stretch
    
    if show_eligible_roles_teaser:
        eligible_roles = generate_eligible_roles(
            domain=domain,
            resume_level=resume_level,
            target_level=target_level,
            matched_skills=resume_skills[:10],
            target_job_title=job_title
        )
    
    # ═══════════════════════════════════════════════════════════════════
    # BUILD RESPONSE
    # ═══════════════════════════════════════════════════════════════════
    
    mismatch_message = None
    dignity_statement = None
    
    if is_mismatch:
        gap_descriptions = [g.requirement for g in structural_gaps[:4]]
        mismatch_message = (
            f"Based on the job requirements and your resume, several core qualifications "
            f"for this role are not yet present, including: {', '.join(gap_descriptions)}."
        )
        dignity_statement = (
            "This does not reflect negatively on your background — it indicates that "
            "the role is designed for a more senior profile. Your experience is valuable "
            "for roles that match your current level."
        )
    
    return RoleFitAssessment(
        verdict=verdict,
        verdict_label=verdict_label,
        verdict_explanation=verdict_explanation,
        
        structural_gaps=structural_gaps,
        expressive_gaps=expressive_gaps[:10],
        
        structural_gap_count=len(structural_gaps),
        expressive_gap_count=len(expressive_gaps),
        
        show_mismatch_section=is_mismatch,
        mismatch_message=mismatch_message,
        dignity_statement=dignity_statement,
        
        eligible_roles=eligible_roles,
        show_eligible_roles_teaser=show_eligible_roles_teaser,
        
        target_role_level=target_level,
        resume_level=resume_level,
        level_gap=level_gap,
    )


def format_role_fit_response(assessment: RoleFitAssessment) -> Dict:
    """Format assessment for API response."""
    return {
        "verdict": assessment.verdict.value,
        "verdict_label": assessment.verdict_label,
        "verdict_explanation": assessment.verdict_explanation,
        
        "structural_gaps": [
            {
                "category": g.category.value,
                "requirement": g.requirement,
                "current_state": g.current_state,
                "severity": g.severity,
                "explanation": g.explanation,
            }
            for g in assessment.structural_gaps
        ],
        
        "expressive_gaps": assessment.expressive_gaps,
        "structural_gap_count": assessment.structural_gap_count,
        "expressive_gap_count": assessment.expressive_gap_count,
        
        "show_mismatch_section": assessment.show_mismatch_section,
        "mismatch_message": assessment.mismatch_message,
        "dignity_statement": assessment.dignity_statement,
        
        "eligible_roles_preview": [
            {
                "title": r.title,
                "match_reason": r.match_reason,
                "experience_level": r.experience_level,
            }
            for r in assessment.eligible_roles[:3]  # Preview only
        ],
        "eligible_roles_count": len(assessment.eligible_roles),
        "show_eligible_roles_teaser": assessment.show_eligible_roles_teaser,
        
        "target_role_level": assessment.target_role_level,
        "resume_level": assessment.resume_level,
        "level_gap": assessment.level_gap,
    }


def format_eligible_roles_full(assessment: RoleFitAssessment) -> Dict:
    """Format full eligible roles for Pro users."""
    return {
        "eligible_roles": [
            {
                "title": r.title,
                "match_reason": r.match_reason,
                "experience_level": r.experience_level,
                "skills_matched": r.skills_matched,
                "growth_path": r.growth_path,
            }
            for r in assessment.eligible_roles
        ],
        "recommended_search_terms": [r.title for r in assessment.eligible_roles],
        "career_level_assessment": {
            "current_level": assessment.resume_level,
            "target_level": assessment.target_role_level,
            "gap": assessment.level_gap,
            "recommendation": _get_level_recommendation(assessment.level_gap),
        },
    }


def _get_level_recommendation(level_gap: int) -> str:
    """Get career level recommendation based on gap."""
    if level_gap <= 0:
        return "You're at or above this role's level. Consider targeting roles that match your seniority."
    elif level_gap == 1:
        return "This is a reasonable stretch. Focus on demonstrating readiness for the next level."
    elif level_gap == 2:
        return "This is a significant stretch. Consider intermediate roles to build experience."
    else:
        return "This role is significantly above your current level. Focus on roles 1-2 levels up first."


# ═══════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════

__all__ = [
    "analyze_role_fit",
    "format_role_fit_response",
    "format_eligible_roles_full",
    "RoleFitAssessment",
    "RoleFitVerdict",
    "StructuralGap",
    "EligibleRole",
    "GapType",
    "GapCategory",
]