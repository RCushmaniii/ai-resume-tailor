"""
Text Analysis Utilities

Shared utilities for extracting metrics, analyzing action verbs,
and processing resume/job description text.

File: server/utils/text_analysis.py
"""

import re
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class MetricMatch:
    """A quantified achievement found in text."""
    text: str           # The matched text (e.g., "35%")
    type: str           # Type of metric (percentage, dollar, number, etc.)
    context: str        # Surrounding sentence/context
    value: Optional[float] = None  # Extracted numeric value


@dataclass
class VerbAnalysis:
    """Analysis of action verbs in text."""
    power_verbs: List[str]
    weak_verbs: List[str]
    power_verb_count: int
    weak_verb_count: int
    verb_categories: Dict[str, int] = field(default_factory=dict)


@dataclass
class TextStats:
    """Basic text statistics."""
    word_count: int
    sentence_count: int
    bullet_count: int
    section_count: int
    avg_sentence_length: float


# ═══════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

POWER_VERBS = {
    "achievement": ["achieved", "accomplished", "exceeded", "delivered", "attained", "earned"],
    "leadership": ["led", "managed", "directed", "coordinated", "supervised", "mentored", "guided"],
    "creation": ["developed", "created", "designed", "built", "established", "launched", "initiated"],
    "improvement": ["improved", "increased", "enhanced", "optimized", "streamlined", "accelerated"],
    "analysis": ["analyzed", "evaluated", "assessed", "identified", "diagnosed", "investigated"],
    "communication": ["presented", "negotiated", "collaborated", "influenced", "persuaded"],
    "technical": ["implemented", "engineered", "architected", "automated", "integrated", "deployed"],
}

ALL_POWER_VERBS = [verb for category in POWER_VERBS.values() for verb in category]

WEAK_VERBS = [
    "helped", "assisted", "worked on", "was responsible for", "handled",
    "dealt with", "participated in", "involved in", "did", "made",
]

METRIC_PATTERNS = [
    (r'\d+%', "percentage"),
    (r'\$[\d,]+(?:\.\d{2})?(?:[KMB])?', "dollar_amount"),
    (r'[\d,]+\+?\s*(?:users?|customers?|clients?|employees?|members?|people)', "people_count"),
    (r'[\d,]+\+?\s*(?:projects?|applications?|systems?|products?)', "project_count"),
    (r'\d+[xX]\s*(?:increase|growth|improvement|faster|more)', "multiplier"),
    (r'(?:top|first|#1|\d+(?:st|nd|rd|th))\s*(?:in|out of|among)', "ranking"),
    (r'\d+\+?\s*(?:years?|months?|weeks?)', "time_period"),
]


# ═══════════════════════════════════════════════════════════════════════════
# METRIC EXTRACTION
# ═══════════════════════════════════════════════════════════════════════════

def extract_metrics(text: str) -> List[MetricMatch]:
    """
    Extract all quantified achievements from text.
    
    Args:
        text: Resume or job description text
        
    Returns:
        List of MetricMatch objects with context
    """
    metrics = []
    sentences = split_into_sentences(text)
    
    for sentence in sentences:
        for pattern, metric_type in METRIC_PATTERNS:
            matches = re.finditer(pattern, sentence, re.IGNORECASE)
            for match in matches:
                # Extract numeric value if possible
                value = None
                num_match = re.search(r'[\d,]+(?:\.\d+)?', match.group())
                if num_match:
                    try:
                        value = float(num_match.group().replace(',', ''))
                    except ValueError:
                        pass
                
                metrics.append(MetricMatch(
                    text=match.group(),
                    type=metric_type,
                    context=sentence.strip(),
                    value=value,
                ))
    
    # Deduplicate by text
    seen = set()
    unique_metrics = []
    for m in metrics:
        if m.text not in seen:
            seen.add(m.text)
            unique_metrics.append(m)
    
    return unique_metrics


def extract_metrics_simple(text: str) -> Dict[str, List[str]]:
    """
    Extract metrics grouped by type (simpler interface).
    
    Args:
        text: Resume or job description text
        
    Returns:
        Dict mapping metric type to list of matched strings
    """
    result: Dict[str, List[str]] = {}
    
    for pattern, metric_type in METRIC_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            result[metric_type] = list(set(matches))
    
    return result


# ═══════════════════════════════════════════════════════════════════════════
# ACTION VERB ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════

def analyze_action_verbs(text: str) -> VerbAnalysis:
    """
    Analyze action verb usage in text.
    
    Args:
        text: Resume text
        
    Returns:
        VerbAnalysis with power/weak verb breakdown
    """
    text_lower = text.lower()
    
    power_found = []
    categories: Dict[str, int] = {}
    
    for category, verbs in POWER_VERBS.items():
        category_count = 0
        for verb in verbs:
            if verb in text_lower:
                power_found.append(verb)
                category_count += 1
        categories[category] = category_count
    
    weak_found = [verb for verb in WEAK_VERBS if verb in text_lower]
    
    return VerbAnalysis(
        power_verbs=list(set(power_found)),
        weak_verbs=list(set(weak_found)),
        power_verb_count=len(set(power_found)),
        weak_verb_count=len(set(weak_found)),
        verb_categories=categories,
    )


# ═══════════════════════════════════════════════════════════════════════════
# TEXT STATISTICS
# ═══════════════════════════════════════════════════════════════════════════

def get_text_stats(text: str) -> TextStats:
    """
    Get basic statistics about text.
    
    Args:
        text: Any text content
        
    Returns:
        TextStats with counts and averages
    """
    words = text.split()
    sentences = split_into_sentences(text)
    
    # Count bullet points
    bullet_patterns = [r'^[\•\-\*\→\►]', r'^\d+\.', r'^[a-z]\)']
    bullet_count = 0
    for line in text.split('\n'):
        line = line.strip()
        for pattern in bullet_patterns:
            if re.match(pattern, line):
                bullet_count += 1
                break
    
    # Count sections (lines that look like headers)
    section_patterns = [
        r'^[A-Z][A-Z\s]+$',  # ALL CAPS
        r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*:?\s*$',  # Title Case
        r'^#+\s+',  # Markdown headers
    ]
    section_count = 0
    for line in text.split('\n'):
        line = line.strip()
        if len(line) > 2 and len(line) < 50:
            for pattern in section_patterns:
                if re.match(pattern, line):
                    section_count += 1
                    break
    
    avg_sentence_length = len(words) / len(sentences) if sentences else 0
    
    return TextStats(
        word_count=len(words),
        sentence_count=len(sentences),
        bullet_count=bullet_count,
        section_count=section_count,
        avg_sentence_length=round(avg_sentence_length, 1),
    )


def split_into_sentences(text: str) -> List[str]:
    """Split text into sentences."""
    # Simple sentence splitting
    sentences = re.split(r'[.!?]+', text)
    return [s.strip() for s in sentences if s.strip()]


# ═══════════════════════════════════════════════════════════════════════════
# CONTACT INFO EXTRACTION
# ═══════════════════════════════════════════════════════════════════════════

def extract_email(text: str) -> Optional[str]:
    """Extract email address from text."""
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(pattern, text)
    return match.group() if match else None


def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text."""
    patterns = [
        r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\+\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group()
    return None


def extract_name(text: str) -> Optional[str]:
    """Extract candidate name from resume (usually first line)."""
    lines = text.strip().split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        # Skip empty lines, emails, phone numbers
        if not line or '@' in line or re.search(r'\d{3}[-.\s]?\d{3}', line):
            continue
        # Name is usually short, title case or all caps
        if 2 <= len(line.split()) <= 4 and len(line) < 50:
            if line.istitle() or line.isupper():
                return line
    return None


def extract_years_of_experience(text: str) -> Optional[int]:
    """Extract years of experience from text."""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s+)?experience',
        r'(\d+)\+?\s*years?\s*(?:in|of)',
        r'experience:\s*(\d+)\+?\s*years?',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return None


def extract_skills_section(text: str) -> List[str]:
    """Extract skills from a skills section."""
    skills = []
    
    # Find skills section
    skills_pattern = r'(?:SKILLS|TECHNOLOGIES|TECHNICAL SKILLS|CORE COMPETENCIES)[:\s]*\n?(.*?)(?:\n\n|\n[A-Z]|$)'
    match = re.search(skills_pattern, text, re.IGNORECASE | re.DOTALL)
    
    if match:
        skills_text = match.group(1)
        # Split by common delimiters
        items = re.split(r'[,|•\n]+', skills_text)
        skills = [s.strip() for s in items if s.strip() and len(s.strip()) < 50]
    
    return skills[:20]  # Limit to 20 skills


# ═══════════════════════════════════════════════════════════════════════════
# KEYWORD UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

def find_keyword_in_text(keyword: str, text: str) -> Tuple[bool, Optional[str]]:
    """
    Find a keyword in text and return evidence.
    
    Args:
        keyword: Keyword to search for
        text: Text to search in
        
    Returns:
        Tuple of (found, evidence_snippet)
    """
    text_lower = text.lower()
    keyword_lower = keyword.lower()
    
    if keyword_lower in text_lower:
        # Find the sentence containing the keyword
        sentences = split_into_sentences(text)
        for sentence in sentences:
            if keyword_lower in sentence.lower():
                return (True, sentence[:200])
        return (True, None)
    
    return (False, None)


def calculate_keyword_density(keywords: List[str], text: str) -> float:
    """
    Calculate what percentage of keywords are found in text.
    
    Args:
        keywords: List of keywords to check
        text: Text to search in
        
    Returns:
        Percentage (0-100) of keywords found
    """
    if not keywords:
        return 0.0
    
    text_lower = text.lower()
    found = sum(1 for kw in keywords if kw.lower() in text_lower)
    return round((found / len(keywords)) * 100, 1)


# ═══════════════════════════════════════════════════════════════════════════
# TEXT FORMATTING
# ═══════════════════════════════════════════════════════════════════════════

def clean_text(text: str) -> str:
    """Clean and normalize text."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\-\(\)\@\$\%\+\:\;]', '', text)
    return text.strip()


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate text to max length with suffix."""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)].rsplit(' ', 1)[0] + suffix