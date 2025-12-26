"""
Interview Question Generator

Generates likely interview questions based on:
- Job requirements
- Resume gaps
- Experience level
- Industry patterns

File: server/analyzers/interview_prep.py
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum
import random


# ═══════════════════════════════════════════════════════════════════════════
# QUESTION TEMPLATES BY CATEGORY
# ═══════════════════════════════════════════════════════════════════════════

class QuestionCategory(str, Enum):
    BEHAVIORAL = "behavioral"
    TECHNICAL = "technical"
    EXPERIENCE = "experience"
    GAP_BASED = "gap_based"
    SITUATIONAL = "situational"
    CULTURE_FIT = "culture_fit"


# Behavioral questions (STAR method)
BEHAVIORAL_TEMPLATES = [
    {
        "template": "Tell me about a time when you {scenario}.",
        "scenarios": [
            "had to meet a tight deadline",
            "dealt with a difficult team member",
            "had to learn a new technology quickly",
            "made a mistake and how you handled it",
            "went above and beyond for a project",
            "had to convince others of your idea",
            "faced a major setback on a project",
            "had to prioritize multiple urgent tasks",
            "received critical feedback",
            "led a team through a challenging situation",
        ],
        "tip": "Use the STAR method: Situation, Task, Action, Result",
    },
    {
        "template": "Describe a situation where you {scenario}.",
        "scenarios": [
            "had to work with limited resources",
            "disagreed with your manager",
            "improved a process or system",
            "mentored or trained someone",
            "had to adapt to significant change",
        ],
        "tip": "Focus on your specific actions and quantify results",
    },
]

# Technical question patterns by domain
TECHNICAL_PATTERNS = {
    "software_engineering": [
        "Explain the difference between {tech_a} and {tech_b}.",
        "How would you optimize a slow {component}?",
        "Walk me through how you would design a {system}.",
        "What's your experience with {technology}?",
        "How do you ensure code quality in your projects?",
        "Describe your approach to debugging complex issues.",
        "How do you handle technical debt?",
        "Explain your experience with {methodology}.",
    ],
    "project_management": [
        "How do you handle scope creep?",
        "Describe your approach to stakeholder management.",
        "How do you prioritize competing demands?",
        "What tools do you use for project tracking?",
        "How do you handle underperforming team members?",
        "Describe your risk management process.",
        "How do you communicate project status to executives?",
    ],
    "data_analytics": [
        "How do you approach a new dataset?",
        "Explain a complex analysis you've performed.",
        "How do you communicate findings to non-technical stakeholders?",
        "What's your experience with {tool}?",
        "How do you ensure data quality?",
    ],
    "marketing": [
        "How do you measure campaign success?",
        "Describe your experience with {channel}.",
        "How do you approach audience segmentation?",
        "What's your process for A/B testing?",
    ],
    "sales": [
        "Walk me through your sales process.",
        "How do you handle objections?",
        "Describe your largest deal.",
        "How do you build long-term client relationships?",
    ],
    "general": [
        "What interests you about this role?",
        "Why are you leaving your current position?",
        "Where do you see yourself in 5 years?",
        "What's your greatest professional achievement?",
        "What are your salary expectations?",
    ],
}

# Gap-based question templates
GAP_QUESTION_TEMPLATES = [
    {
        "template": "I notice you don't have experience with {skill}. How would you approach learning it?",
        "followup": "What resources would you use?",
    },
    {
        "template": "This role requires {skill}, which isn't on your resume. Tell me about any related experience.",
        "followup": "How quickly can you get up to speed?",
    },
    {
        "template": "We use {skill} extensively. What's your familiarity with it or similar technologies?",
        "followup": "Can you describe a time you learned something similar?",
    },
    {
        "template": "How would you handle projects involving {skill} given your current experience?",
        "followup": "What support would you need?",
    },
]

# Experience verification questions
EXPERIENCE_TEMPLATES = [
    "Tell me more about your role at {company}.",
    "What was your biggest accomplishment at {company}?",
    "Why did you leave {company}?",
    "You mentioned {achievement}. Can you elaborate on your specific contribution?",
    "How did you measure success in your {role} position?",
    "What would your manager at {company} say about you?",
]

# Culture fit questions
CULTURE_FIT_TEMPLATES = [
    "What type of work environment do you thrive in?",
    "How do you handle feedback?",
    "Describe your ideal manager.",
    "How do you balance work and personal life?",
    "What motivates you professionally?",
    "How do you handle stress and pressure?",
    "What's your approach to collaboration vs. independent work?",
]


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class InterviewQuestion:
    """A generated interview question with metadata."""
    question: str
    category: str
    difficulty: str  # easy, medium, hard
    why_asked: str
    tip: str
    followup: Optional[str] = None
    related_skill: Optional[str] = None


@dataclass
class InterviewPrepResult:
    """Complete interview prep package."""
    questions: List[InterviewQuestion]
    question_count: int
    categories_covered: List[str]
    key_areas_to_prepare: List[str]
    general_tips: List[str]


# ═══════════════════════════════════════════════════════════════════════════
# MAIN GENERATION FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def generate_interview_questions(
    job_title: str,
    requirements: List[Dict[str, Any]],
    gaps: List[Dict[str, Any]],
    resume_summary: Optional[str] = None,
    company_info: Optional[Dict[str, Any]] = None,
    num_questions: int = 15,
) -> InterviewPrepResult:
    """
    Generate likely interview questions based on job and resume analysis.
    
    Args:
        job_title: The job title
        requirements: List of job requirements with match info
        gaps: List of skill gaps identified
        resume_summary: Optional summary of candidate background
        company_info: Optional company details for customization
        num_questions: Number of questions to generate
        
    Returns:
        InterviewPrepResult with categorized questions and tips
    """
    questions = []
    
    # Detect job domain for relevant technical questions
    domain = _detect_job_domain(job_title, requirements)
    
    # 1. Generate gap-based questions (highest priority)
    gap_questions = _generate_gap_questions(gaps)
    questions.extend(gap_questions[:4])  # Limit to 4
    
    # 2. Generate technical questions based on requirements
    tech_questions = _generate_technical_questions(requirements, domain)
    questions.extend(tech_questions[:4])
    
    # 3. Generate behavioral questions
    behavioral_questions = _generate_behavioral_questions(job_title, domain)
    questions.extend(behavioral_questions[:4])
    
    # 4. Generate experience verification questions
    if requirements:
        exp_questions = _generate_experience_questions(requirements)
        questions.extend(exp_questions[:2])
    
    # 5. Add culture fit questions
    culture_questions = _generate_culture_questions()
    questions.extend(culture_questions[:2])
    
    # Ensure we have enough questions
    while len(questions) < num_questions:
        questions.extend(_generate_general_questions())
        questions = questions[:num_questions]
    
    # Trim to requested number
    questions = questions[:num_questions]
    
    # Collect categories covered
    categories = list(set(q.category for q in questions))
    
    # Identify key areas to prepare
    key_areas = _identify_key_areas(gaps, requirements, domain)
    
    # General tips
    general_tips = _get_general_tips(job_title, domain)
    
    return InterviewPrepResult(
        questions=questions,
        question_count=len(questions),
        categories_covered=categories,
        key_areas_to_prepare=key_areas,
        general_tips=general_tips,
    )


# ═══════════════════════════════════════════════════════════════════════════
# QUESTION GENERATORS
# ═══════════════════════════════════════════════════════════════════════════

def _generate_gap_questions(gaps: List[Dict[str, Any]]) -> List[InterviewQuestion]:
    """Generate questions about skill gaps."""
    questions = []
    
    for gap in gaps:
        skill = gap.get("requirement", gap.get("skill", "this skill"))
        
        # Select a random template
        template_data = random.choice(GAP_QUESTION_TEMPLATES)
        question_text = template_data["template"].format(skill=skill)
        
        questions.append(InterviewQuestion(
            question=question_text,
            category=QuestionCategory.GAP_BASED.value,
            difficulty="medium",
            why_asked=f"They'll want to know how you'll handle not having direct {skill} experience",
            tip=f"Research {skill} basics before the interview. Highlight transferable skills and learning ability.",
            followup=template_data.get("followup"),
            related_skill=skill,
        ))
    
    return questions


def _generate_technical_questions(
    requirements: List[Dict[str, Any]], 
    domain: str
) -> List[InterviewQuestion]:
    """Generate technical questions based on requirements."""
    questions = []
    
    # Get domain-specific patterns
    patterns = TECHNICAL_PATTERNS.get(domain, TECHNICAL_PATTERNS["general"])
    
    # Extract matched skills for technical questions
    matched_skills = [
        r.get("text", "") 
        for r in requirements 
        if r.get("match_type") in ["EXACT", "VARIANT"]
    ]
    
    for skill in matched_skills[:5]:
        # Generate skill-specific question
        pattern = random.choice(patterns)
        
        if "{technology}" in pattern or "{tool}" in pattern:
            question_text = pattern.replace("{technology}", skill).replace("{tool}", skill)
        elif "{skill}" in pattern:
            question_text = pattern.format(skill=skill)
        else:
            question_text = f"Tell me about your experience with {skill}."
        
        questions.append(InterviewQuestion(
            question=question_text,
            category=QuestionCategory.TECHNICAL.value,
            difficulty="medium",
            why_asked=f"You listed {skill} on your resume, so they'll want to verify depth",
            tip=f"Prepare specific examples of projects where you used {skill}",
            related_skill=skill,
        ))
    
    # Add general domain questions
    for pattern in patterns[:2]:
        if not any(placeholder in pattern for placeholder in ["{", "}"]):
            questions.append(InterviewQuestion(
                question=pattern,
                category=QuestionCategory.TECHNICAL.value,
                difficulty="medium",
                why_asked="Standard technical question for this role type",
                tip="Have concrete examples ready",
            ))
    
    return questions


def _generate_behavioral_questions(job_title: str, domain: str) -> List[InterviewQuestion]:
    """Generate behavioral interview questions."""
    questions = []
    
    # Determine relevant scenarios based on job level
    is_senior = any(word in job_title.lower() for word in ["senior", "lead", "manager", "director", "principal"])
    is_management = any(word in job_title.lower() for word in ["manager", "director", "head", "vp"])
    
    for template_group in BEHAVIORAL_TEMPLATES:
        template = template_group["template"]
        scenarios = template_group["scenarios"]
        tip = template_group["tip"]
        
        # Select scenarios appropriate for level
        selected_scenarios = scenarios[:3] if not is_senior else scenarios[3:7]
        
        for scenario in selected_scenarios[:2]:
            question_text = template.format(scenario=scenario)
            
            difficulty = "hard" if is_senior else "medium"
            
            questions.append(InterviewQuestion(
                question=question_text,
                category=QuestionCategory.BEHAVIORAL.value,
                difficulty=difficulty,
                why_asked="Behavioral questions assess how you've handled real situations",
                tip=tip,
                followup="What would you do differently if you faced this situation again?",
            ))
    
    # Add leadership questions for senior roles
    if is_senior or is_management:
        questions.append(InterviewQuestion(
            question="Describe your leadership style.",
            category=QuestionCategory.BEHAVIORAL.value,
            difficulty="medium",
            why_asked="Senior roles require strong leadership capabilities",
            tip="Give examples of how your style has driven results",
        ))
        
        questions.append(InterviewQuestion(
            question="Tell me about a time you had to make a difficult decision with limited information.",
            category=QuestionCategory.BEHAVIORAL.value,
            difficulty="hard",
            why_asked="Tests decision-making under uncertainty",
            tip="Focus on your thought process and the outcome",
        ))
    
    return questions


def _generate_experience_questions(requirements: List[Dict[str, Any]]) -> List[InterviewQuestion]:
    """Generate questions verifying experience claims."""
    questions = []
    
    # Find requirements with evidence to verify
    verified_skills = [
        r for r in requirements 
        if r.get("match_type") == "EXACT" and r.get("evidence")
    ]
    
    for req in verified_skills[:3]:
        skill = req.get("text", "")
        evidence = req.get("evidence", "")
        
        questions.append(InterviewQuestion(
            question=f"You mentioned '{evidence[:50]}...' - can you tell me more about that experience?",
            category=QuestionCategory.EXPERIENCE.value,
            difficulty="easy",
            why_asked="Interviewers verify resume claims with follow-up questions",
            tip="Be ready to discuss any bullet point in detail",
            related_skill=skill,
        ))
    
    return questions


def _generate_culture_questions() -> List[InterviewQuestion]:
    """Generate culture fit questions."""
    questions = []
    
    for template in random.sample(CULTURE_FIT_TEMPLATES, min(3, len(CULTURE_FIT_TEMPLATES))):
        questions.append(InterviewQuestion(
            question=template,
            category=QuestionCategory.CULTURE_FIT.value,
            difficulty="easy",
            why_asked="Assesses alignment with team and company culture",
            tip="Be authentic while showing adaptability",
        ))
    
    return questions


def _generate_general_questions() -> List[InterviewQuestion]:
    """Generate general interview questions."""
    questions = []
    
    general = TECHNICAL_PATTERNS["general"]
    for template in random.sample(general, min(3, len(general))):
        questions.append(InterviewQuestion(
            question=template,
            category=QuestionCategory.SITUATIONAL.value,
            difficulty="easy",
            why_asked="Standard interview question",
            tip="Prepare thoughtful, specific answers",
        ))
    
    return questions


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def _detect_job_domain(job_title: str, requirements: List[Dict[str, Any]]) -> str:
    """Detect the job domain for relevant questions."""
    title_lower = job_title.lower()
    all_text = title_lower + " " + " ".join(r.get("text", "").lower() for r in requirements)
    
    # Domain detection keywords
    domains = {
        "software_engineering": ["software", "developer", "engineer", "programming", "code", "backend", "frontend", "full stack", "devops"],
        "project_management": ["project manager", "program manager", "scrum", "agile", "pmp", "delivery"],
        "data_analytics": ["data analyst", "data scientist", "analytics", "bi ", "business intelligence", "sql", "tableau"],
        "marketing": ["marketing", "brand", "campaign", "content", "seo", "social media"],
        "sales": ["sales", "account executive", "business development", "revenue"],
    }
    
    for domain, keywords in domains.items():
        if any(kw in all_text for kw in keywords):
            return domain
    
    return "general"


def _identify_key_areas(
    gaps: List[Dict[str, Any]], 
    requirements: List[Dict[str, Any]], 
    domain: str
) -> List[str]:
    """Identify key areas to prepare for."""
    areas = []
    
    # Add gap areas
    for gap in gaps[:3]:
        skill = gap.get("requirement", gap.get("skill", ""))
        if skill:
            areas.append(f"Prepare to discuss how you'd learn {skill}")
    
    # Add strong skill areas
    strong_skills = [
        r.get("text", "") 
        for r in requirements 
        if r.get("match_type") == "EXACT" and r.get("tier") == 1
    ][:3]
    
    for skill in strong_skills:
        areas.append(f"Prepare detailed examples using {skill}")
    
    # Add domain-specific areas
    domain_areas = {
        "software_engineering": ["System design fundamentals", "Coding problem-solving approach"],
        "project_management": ["Project failure recovery stories", "Stakeholder conflict resolution"],
        "data_analytics": ["Complex analysis case studies", "Data presentation strategies"],
        "marketing": ["Campaign metrics and ROI", "Brand strategy examples"],
        "sales": ["Pipeline and quota achievements", "Objection handling scenarios"],
    }
    
    areas.extend(domain_areas.get(domain, ["General problem-solving examples"])[:2])
    
    return areas[:7]


def _get_general_tips(job_title: str, domain: str) -> List[str]:
    """Get general interview preparation tips."""
    tips = [
        "Research the company thoroughly - know their products, competitors, and recent news",
        "Prepare 3-5 STAR stories that showcase different competencies",
        "Have specific questions ready to ask the interviewer",
        "Practice your answers out loud, but don't memorize scripts",
        "Review your resume - be ready to discuss any item in detail",
    ]
    
    # Add domain-specific tips
    if domain == "software_engineering":
        tips.append("Be ready for coding challenges - practice on LeetCode or similar")
        tips.append("Prepare to whiteboard or discuss system design")
    elif domain == "project_management":
        tips.append("Bring examples of project artifacts if appropriate")
        tips.append("Be ready to discuss methodology preferences and flexibility")
    elif domain == "data_analytics":
        tips.append("Prepare to discuss a complex analysis end-to-end")
        tips.append("Be ready for potential case study exercises")
    
    return tips[:7]


# ═══════════════════════════════════════════════════════════════════════════
# OUTPUT FORMATTER
# ═══════════════════════════════════════════════════════════════════════════

def format_interview_prep(result: InterviewPrepResult) -> Dict[str, Any]:
    """
    Format interview prep for API response.
    
    Args:
        result: InterviewPrepResult from generate_interview_questions()
        
    Returns:
        Dict ready for JSON serialization
    """
    # Group questions by category
    questions_by_category = {}
    for q in result.questions:
        if q.category not in questions_by_category:
            questions_by_category[q.category] = []
        questions_by_category[q.category].append({
            "question": q.question,
            "difficulty": q.difficulty,
            "why_asked": q.why_asked,
            "tip": q.tip,
            "followup": q.followup,
            "related_skill": q.related_skill,
        })
    
    return {
        "question_count": result.question_count,
        "categories_covered": result.categories_covered,
        
        "questions_by_category": questions_by_category,
        
        "all_questions": [
            {
                "question": q.question,
                "category": q.category,
                "difficulty": q.difficulty,
                "why_asked": q.why_asked,
                "tip": q.tip,
                "followup": q.followup,
                "related_skill": q.related_skill,
            }
            for q in result.questions
        ],
        
        "key_areas_to_prepare": result.key_areas_to_prepare,
        "general_tips": result.general_tips,
        
        "difficulty_breakdown": {
            "easy": len([q for q in result.questions if q.difficulty == "easy"]),
            "medium": len([q for q in result.questions if q.difficulty == "medium"]),
            "hard": len([q for q in result.questions if q.difficulty == "hard"]),
        },
    }


# ═══════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import json
    
    # Sample data simulating scoring engine output
    sample_requirements = [
        {"text": "Python", "tier": 1, "match_type": "EXACT", "evidence": "Expert in Python, Django"},
        {"text": "AWS", "tier": 1, "match_type": "NONE", "evidence": None},
        {"text": "Docker", "tier": 1, "match_type": "CONTEXTUAL", "evidence": "containerized apps"},
        {"text": "5+ years experience", "tier": 1, "match_type": "EXACT", "evidence": "6 years"},
        {"text": "Team leadership", "tier": 2, "match_type": "EXACT", "evidence": "Led team of 5"},
    ]
    
    sample_gaps = [
        {"requirement": "AWS", "suggestion": "Add AWS certifications or experience"},
        {"requirement": "Kubernetes", "suggestion": "Add container orchestration experience"},
    ]
    
    print("=== Interview Question Generator Test ===\n")
    
    result = generate_interview_questions(
        job_title="Senior Software Engineer",
        requirements=sample_requirements,
        gaps=sample_gaps,
        num_questions=12,
    )
    
    formatted = format_interview_prep(result)
    
    print(f"Generated {formatted['question_count']} questions")
    print(f"Categories: {formatted['categories_covered']}")
    print(f"\nDifficulty breakdown: {formatted['difficulty_breakdown']}")
    
    print(f"\n=== Questions by Category ===")
    for category, questions in formatted['questions_by_category'].items():
        print(f"\n{category.upper()} ({len(questions)} questions):")
        for q in questions[:2]:  # Show first 2 of each category
            print(f"  Q: {q['question']}")
            print(f"     Tip: {q['tip']}")
    
    print(f"\n=== Key Areas to Prepare ===")
    for area in formatted['key_areas_to_prepare']:
        print(f"  • {area}")
    
    print(f"\n=== General Tips ===")
    for tip in formatted['general_tips'][:3]:
        print(f"  • {tip}")