"""
Cover Letter Generator

Auto-generates tailored cover letters based on:
- Resume content and strengths
- Job requirements
- Identified matches and gaps
- Professional tone variations

File: server/analyzers/cover_letter.py
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum
import re


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

class ToneStyle(str, Enum):
    PROFESSIONAL = "professional"  # Traditional, formal
    CONFIDENT = "confident"        # Strong, assertive
    CONVERSATIONAL = "conversational"  # Friendly, approachable
    EXECUTIVE = "executive"        # C-suite level


# Paragraph templates by section
OPENING_TEMPLATES = {
    ToneStyle.PROFESSIONAL: [
        "I am writing to express my strong interest in the {job_title} position at {company}. With {years} years of experience in {domain}, I am confident in my ability to contribute meaningfully to your team.",
        "I am excited to apply for the {job_title} role at {company}. My background in {domain} aligns well with the requirements outlined in your job posting.",
    ],
    ToneStyle.CONFIDENT: [
        "When I saw the {job_title} position at {company}, I knew it was the perfect next step in my career. My {years} years of delivering results in {domain} have prepared me to make an immediate impact on your team.",
        "I am eager to bring my proven track record in {domain} to the {job_title} role at {company}. My experience directly addresses what you're looking for.",
    ],
    ToneStyle.CONVERSATIONAL: [
        "I'm thrilled to apply for the {job_title} position at {company}. Having spent {years} years working in {domain}, I've developed skills that I believe would be valuable to your team.",
        "The {job_title} role at {company} caught my attention immediately. I'd love to bring my {domain} experience to your organization.",
    ],
    ToneStyle.EXECUTIVE: [
        "I am writing to express my interest in the {job_title} opportunity at {company}. Throughout my {years}-year career leading {domain} initiatives, I have consistently delivered transformational results.",
        "As an accomplished {domain} leader with {years} years of experience, I am well-positioned to drive {company}'s strategic objectives as your next {job_title}.",
    ],
}

BODY_ACHIEVEMENT_TEMPLATES = {
    ToneStyle.PROFESSIONAL: "In my current role at {company}, I {achievement}. This experience has strengthened my ability to {skill_application}.",
    ToneStyle.CONFIDENT: "At {company}, I {achievement}, demonstrating my ability to deliver measurable results. I am ready to replicate this success at your organization.",
    ToneStyle.CONVERSATIONAL: "One accomplishment I'm particularly proud of is when I {achievement}. It taught me {skill_application}.",
    ToneStyle.EXECUTIVE: "During my tenure at {company}, I spearheaded initiatives that {achievement}, generating significant value for the organization.",
}

SKILLS_BRIDGE_TEMPLATES = {
    ToneStyle.PROFESSIONAL: "Your requirement for {skill} aligns directly with my experience. I have {evidence}, which I am eager to leverage in this role.",
    ToneStyle.CONFIDENT: "You're looking for someone with {skill} expertise—that's exactly what I bring. {evidence}.",
    ToneStyle.CONVERSATIONAL: "I noticed you need someone skilled in {skill}. That's right in my wheelhouse—{evidence}.",
    ToneStyle.EXECUTIVE: "My expertise in {skill} positions me to address your immediate needs. {evidence}.",
}

GAP_ACKNOWLEDGMENT_TEMPLATES = {
    ToneStyle.PROFESSIONAL: "While I am still developing my expertise in {skill}, I have demonstrated rapid learning ability and have {related_experience}.",
    ToneStyle.CONFIDENT: "Although {skill} is an area where I'm continuing to grow, my track record shows I master new technologies quickly. {related_experience}.",
    ToneStyle.CONVERSATIONAL: "I'll be honest—{skill} is an area where I'm still learning, but I'm a quick study. {related_experience}.",
    ToneStyle.EXECUTIVE: "I recognize the importance of {skill} to this role and am committed to rapidly building this competency, complementing my existing expertise in {related_experience}.",
}

CLOSING_TEMPLATES = {
    ToneStyle.PROFESSIONAL: [
        "I would welcome the opportunity to discuss how my background and skills would benefit {company}. Thank you for considering my application.",
        "I am enthusiastic about the possibility of contributing to {company}'s success. I look forward to the opportunity to discuss my qualifications further.",
    ],
    ToneStyle.CONFIDENT: [
        "I am confident I can make an immediate impact at {company}. I'd welcome the chance to discuss how my experience aligns with your needs.",
        "Let's connect to discuss how I can help {company} achieve its goals. I'm ready to hit the ground running.",
    ],
    ToneStyle.CONVERSATIONAL: [
        "I'd love the chance to chat about how I could contribute to {company}. Thanks so much for considering my application!",
        "I'm really excited about this opportunity and would be thrilled to discuss it further. Thanks for your time!",
    ],
    ToneStyle.EXECUTIVE: [
        "I am prepared to bring strategic leadership and operational excellence to {company}. I welcome the opportunity to discuss my vision for this role.",
        "I look forward to exploring how my leadership experience can drive value for {company}. Please feel free to contact me at your convenience.",
    ],
}


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class CoverLetterSection:
    """A section of the cover letter."""
    type: str  # opening, body, skills, closing
    content: str
    word_count: int


@dataclass
class CoverLetterResult:
    """Generated cover letter with metadata."""
    full_text: str
    sections: List[CoverLetterSection]
    word_count: int
    tone: str
    personalization_score: int  # 0-100, how tailored it is
    skills_highlighted: List[str]
    achievements_included: List[str]
    customization_notes: List[str]


# ═══════════════════════════════════════════════════════════════════════════
# MAIN GENERATION FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def generate_cover_letter(
    job_title: str,
    company_name: str,
    requirements: List[Dict[str, Any]],
    resume_data: Dict[str, Any],
    gaps: Optional[List[Dict[str, Any]]] = None,
    tone: ToneStyle = ToneStyle.PROFESSIONAL,
    include_gap_acknowledgment: bool = False,
    target_length: str = "medium",  # short, medium, long
) -> CoverLetterResult:
    """
    Generate a tailored cover letter.
    
    Args:
        job_title: Target job title
        company_name: Company name
        requirements: Job requirements with match info
        resume_data: Extracted resume information
        gaps: Optional skill gaps to address
        tone: Writing tone style
        include_gap_acknowledgment: Whether to proactively address gaps
        target_length: Desired length (short=150w, medium=250w, long=350w)
        
    Returns:
        CoverLetterResult with full text and metadata
    """
    sections = []
    skills_highlighted = []
    achievements_included = []
    customization_notes = []
    
    # Extract resume info
    years_exp = resume_data.get("years_experience", 5)
    domain = _extract_domain(job_title, requirements)
    candidate_name = resume_data.get("name", "")
    current_company = resume_data.get("current_company", "my current company")
    achievements = resume_data.get("achievements", [])
    
    # Get matched skills with evidence
    strong_matches = [
        r for r in requirements 
        if r.get("match_type") in ["EXACT", "VARIANT"] and r.get("tier") == 1
    ]
    
    # ─────────────────────────────────────────────────────────────────────
    # SECTION 1: Opening Paragraph
    # ─────────────────────────────────────────────────────────────────────
    
    opening = _generate_opening(
        job_title=job_title,
        company=company_name,
        years=years_exp,
        domain=domain,
        tone=tone,
    )
    sections.append(CoverLetterSection(
        type="opening",
        content=opening,
        word_count=len(opening.split()),
    ))
    customization_notes.append("Opening customized with job title and company name")
    
    # ─────────────────────────────────────────────────────────────────────
    # SECTION 2: Achievement/Value Paragraph
    # ─────────────────────────────────────────────────────────────────────
    
    if achievements:
        body_para = _generate_achievement_paragraph(
            achievements=achievements,
            current_company=current_company,
            domain=domain,
            tone=tone,
        )
        sections.append(CoverLetterSection(
            type="body",
            content=body_para,
            word_count=len(body_para.split()),
        ))
        achievements_included.extend(achievements[:2])
        customization_notes.append("Included quantified achievements from resume")
    
    # ─────────────────────────────────────────────────────────────────────
    # SECTION 3: Skills Match Paragraph
    # ─────────────────────────────────────────────────────────────────────
    
    if strong_matches and target_length != "short":
        skills_para = _generate_skills_paragraph(
            matches=strong_matches,
            tone=tone,
        )
        sections.append(CoverLetterSection(
            type="skills",
            content=skills_para,
            word_count=len(skills_para.split()),
        ))
        skills_highlighted.extend([m.get("text", "") for m in strong_matches[:3]])
        customization_notes.append("Highlighted skills that match job requirements")
    
    # ─────────────────────────────────────────────────────────────────────
    # SECTION 4: Gap Acknowledgment (Optional)
    # ─────────────────────────────────────────────────────────────────────
    
    if include_gap_acknowledgment and gaps and target_length == "long":
        gap_para = _generate_gap_paragraph(
            gaps=gaps[:1],  # Address only top gap
            strong_skills=strong_matches,
            tone=tone,
        )
        sections.append(CoverLetterSection(
            type="gap_acknowledgment",
            content=gap_para,
            word_count=len(gap_para.split()),
        ))
        customization_notes.append("Proactively addressed skill gap with growth mindset")
    
    # ─────────────────────────────────────────────────────────────────────
    # SECTION 5: Closing Paragraph
    # ─────────────────────────────────────────────────────────────────────
    
    closing = _generate_closing(
        company=company_name,
        tone=tone,
    )
    sections.append(CoverLetterSection(
        type="closing",
        content=closing,
        word_count=len(closing.split()),
    ))
    
    # ─────────────────────────────────────────────────────────────────────
    # Assemble Full Letter
    # ─────────────────────────────────────────────────────────────────────
    
    full_text = "\n\n".join(section.content for section in sections)
    word_count = sum(section.word_count for section in sections)
    
    # Calculate personalization score
    personalization_score = _calculate_personalization_score(
        company_mentioned=company_name.lower() in full_text.lower(),
        job_title_mentioned=job_title.lower() in full_text.lower(),
        skills_count=len(skills_highlighted),
        achievements_count=len(achievements_included),
        gaps_addressed=include_gap_acknowledgment and gaps,
    )
    
    return CoverLetterResult(
        full_text=full_text,
        sections=sections,
        word_count=word_count,
        tone=tone.value,
        personalization_score=personalization_score,
        skills_highlighted=skills_highlighted,
        achievements_included=achievements_included,
        customization_notes=customization_notes,
    )


# ═══════════════════════════════════════════════════════════════════════════
# SECTION GENERATORS
# ═══════════════════════════════════════════════════════════════════════════

def _generate_opening(
    job_title: str,
    company: str,
    years: int,
    domain: str,
    tone: ToneStyle,
) -> str:
    """Generate opening paragraph."""
    templates = OPENING_TEMPLATES.get(tone, OPENING_TEMPLATES[ToneStyle.PROFESSIONAL])
    template = templates[0]  # Use first template
    
    return template.format(
        job_title=job_title,
        company=company,
        years=years,
        domain=domain,
    )


def _generate_achievement_paragraph(
    achievements: List[str],
    current_company: str,
    domain: str,
    tone: ToneStyle,
) -> str:
    """Generate paragraph highlighting achievements."""
    
    if not achievements:
        return ""
    
    # Use first 1-2 achievements
    achievement_text = achievements[0]
    
    # Clean up achievement text
    achievement_text = achievement_text.strip("•-* ").strip()
    
    # Determine skill application based on achievement
    skill_applications = [
        "drive results",
        "lead initiatives",
        "solve complex problems",
        "deliver measurable impact",
    ]
    skill_app = skill_applications[hash(achievement_text) % len(skill_applications)]
    
    template = BODY_ACHIEVEMENT_TEMPLATES.get(tone, BODY_ACHIEVEMENT_TEMPLATES[ToneStyle.PROFESSIONAL])
    
    base = template.format(
        company=current_company,
        achievement=achievement_text.lower() if achievement_text[0].isupper() else achievement_text,
        skill_application=skill_app,
    )
    
    # Add second achievement if available
    if len(achievements) > 1:
        second = achievements[1].strip("•-* ").strip()
        base += f" Additionally, I {second.lower() if second[0].isupper() else second}."
    
    return base


def _generate_skills_paragraph(
    matches: List[Dict[str, Any]],
    tone: ToneStyle,
) -> str:
    """Generate paragraph bridging skills to requirements."""
    
    if not matches:
        return ""
    
    paragraphs = []
    template = SKILLS_BRIDGE_TEMPLATES.get(tone, SKILLS_BRIDGE_TEMPLATES[ToneStyle.PROFESSIONAL])
    
    # Highlight top 2-3 matches
    for match in matches[:2]:
        skill = match.get("text", "")
        evidence = match.get("evidence", "extensive experience in this area")
        
        # Clean up evidence
        if evidence:
            evidence = evidence.strip("•-* ").strip()
            if len(evidence) > 100:
                evidence = evidence[:100] + "..."
        
        para = template.format(skill=skill, evidence=evidence)
        paragraphs.append(para)
    
    return " ".join(paragraphs)


def _generate_gap_paragraph(
    gaps: List[Dict[str, Any]],
    strong_skills: List[Dict[str, Any]],
    tone: ToneStyle,
) -> str:
    """Generate paragraph acknowledging and addressing gaps."""
    
    if not gaps:
        return ""
    
    gap = gaps[0]
    skill = gap.get("requirement", gap.get("skill", "this area"))
    
    # Find related strong skill
    related = "transferable skills" if not strong_skills else strong_skills[0].get("text", "related areas")
    related_experience = f"I have strong experience with {related}"
    
    template = GAP_ACKNOWLEDGMENT_TEMPLATES.get(tone, GAP_ACKNOWLEDGMENT_TEMPLATES[ToneStyle.PROFESSIONAL])
    
    return template.format(skill=skill, related_experience=related_experience)


def _generate_closing(company: str, tone: ToneStyle) -> str:
    """Generate closing paragraph."""
    templates = CLOSING_TEMPLATES.get(tone, CLOSING_TEMPLATES[ToneStyle.PROFESSIONAL])
    template = templates[0]
    
    return template.format(company=company)


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def _extract_domain(job_title: str, requirements: List[Dict[str, Any]]) -> str:
    """Extract domain/field from job title and requirements."""
    title_lower = job_title.lower()
    
    domains = {
        "software development": ["software", "developer", "engineer", "programming"],
        "project management": ["project manager", "program manager", "scrum master"],
        "data analytics": ["data analyst", "data scientist", "analytics"],
        "marketing": ["marketing", "brand", "content"],
        "sales": ["sales", "account", "business development"],
        "design": ["designer", "ux", "ui", "creative"],
        "finance": ["finance", "accounting", "financial"],
        "human resources": ["hr", "human resources", "recruiter", "talent"],
        "operations": ["operations", "supply chain", "logistics"],
    }
    
    for domain, keywords in domains.items():
        if any(kw in title_lower for kw in keywords):
            return domain
    
    return "professional services"


def _calculate_personalization_score(
    company_mentioned: bool,
    job_title_mentioned: bool,
    skills_count: int,
    achievements_count: int,
    gaps_addressed: bool,
) -> int:
    """Calculate how personalized the cover letter is."""
    score = 30  # Base score
    
    if company_mentioned:
        score += 15
    if job_title_mentioned:
        score += 15
    if skills_count >= 2:
        score += 20
    elif skills_count >= 1:
        score += 10
    if achievements_count >= 2:
        score += 15
    elif achievements_count >= 1:
        score += 8
    if gaps_addressed:
        score += 5
    
    return min(100, score)


def extract_resume_data_for_cover_letter(
    resume_text: str,
    scoring_result: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Extract data from resume needed for cover letter generation.
    
    Args:
        resume_text: Raw resume text
        scoring_result: Optional scoring result for additional context
        
    Returns:
        Dict with extracted resume data
    """
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    from utils.text_analysis import (
        extract_name,
        extract_years_of_experience,
        extract_metrics,
    )
    
    # Extract basic info
    name = extract_name(resume_text)
    years = extract_years_of_experience(resume_text) or 5
    
    # Extract achievements (lines with metrics)
    metrics = extract_metrics(resume_text)
    achievements = [m.context for m in metrics[:5]]
    
    # Try to find current company
    current_company = "my current organization"
    company_patterns = [
        r'(?:at|@)\s+([A-Z][A-Za-z\s]+?)(?:\s*\||,|\(|$)',
        r'([A-Z][A-Za-z\s]+?)\s*\|\s*\d{4}',
    ]
    for pattern in company_patterns:
        match = re.search(pattern, resume_text)
        if match:
            current_company = match.group(1).strip()
            break
    
    return {
        "name": name,
        "years_experience": years,
        "current_company": current_company,
        "achievements": achievements,
    }


# ═══════════════════════════════════════════════════════════════════════════
# OUTPUT FORMATTER
# ═══════════════════════════════════════════════════════════════════════════

def format_cover_letter_response(result: CoverLetterResult) -> Dict[str, Any]:
    """
    Format cover letter for API response.
    
    Args:
        result: CoverLetterResult from generate_cover_letter()
        
    Returns:
        Dict ready for JSON serialization
    """
    return {
        "cover_letter": result.full_text,
        "word_count": result.word_count,
        "tone": result.tone,
        "personalization_score": result.personalization_score,
        
        "sections": [
            {
                "type": section.type,
                "content": section.content,
                "word_count": section.word_count,
            }
            for section in result.sections
        ],
        
        "metadata": {
            "skills_highlighted": result.skills_highlighted,
            "achievements_included": result.achievements_included,
            "customization_notes": result.customization_notes,
        },
        
        "copy_ready_text": result.full_text,  # For easy copy/paste
    }


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import json
    
    # Sample data
    sample_requirements = [
        {"text": "Python", "tier": 1, "match_type": "EXACT", "evidence": "Expert in Python, Django, Flask frameworks"},
        {"text": "AWS", "tier": 1, "match_type": "NONE", "evidence": None},
        {"text": "5+ years experience", "tier": 1, "match_type": "EXACT", "evidence": "8 years of software development experience"},
        {"text": "Team leadership", "tier": 2, "match_type": "EXACT", "evidence": "Led a team of 5 engineers"},
    ]
    
    sample_gaps = [
        {"requirement": "AWS", "suggestion": "Add cloud experience"},
    ]
    
    sample_resume_data = {
        "name": "John Doe",
        "years_experience": 8,
        "current_company": "Tech Corp",
        "achievements": [
            "Reduced deployment time by 60% through CI/CD automation",
            "Led team of 5 engineers to deliver $2M project on time",
            "Increased test coverage from 45% to 90%",
        ],
    }
    
    print("=== Cover Letter Generator Test ===\n")
    
    # Test different tones
    for tone in [ToneStyle.PROFESSIONAL, ToneStyle.CONFIDENT]:
        print(f"\n{'='*60}")
        print(f"TONE: {tone.value.upper()}")
        print('='*60)
        
        result = generate_cover_letter(
            job_title="Senior Software Engineer",
            company_name="Acme Technologies",
            requirements=sample_requirements,
            resume_data=sample_resume_data,
            gaps=sample_gaps,
            tone=tone,
            include_gap_acknowledgment=False,
            target_length="medium",
        )
        
        formatted = format_cover_letter_response(result)
        
        print(f"\n{formatted['cover_letter']}")
        print(f"\n--- Metadata ---")
        print(f"Word count: {formatted['word_count']}")
        print(f"Personalization: {formatted['personalization_score']}%")
        print(f"Skills highlighted: {formatted['metadata']['skills_highlighted']}")