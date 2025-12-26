"""
Analyzers Package

Modular analysis components for the AI Resume Tailor.

Available modules:
- resume_quality: Analyze resume quality independent of job matching
- interview_prep: Generate likely interview questions
- cover_letter: Auto-generate tailored cover letters
"""

from .resume_quality import (
    analyze_resume_quality,
    format_quality_report,
    ResumeQualityResult,
    QualityDimension,
)

from .interview_prep import (
    generate_interview_questions,
    format_interview_prep,
    InterviewPrepResult,
    InterviewQuestion,
    QuestionCategory,
)

from .cover_letter import (
    generate_cover_letter,
    format_cover_letter_response,
    extract_resume_data_for_cover_letter,
    CoverLetterResult,
    ToneStyle,
)

__all__ = [
    # Resume Quality
    "analyze_resume_quality",
    "format_quality_report",
    "ResumeQualityResult",
    "QualityDimension",
    
    # Interview Prep
    "generate_interview_questions",
    "format_interview_prep",
    "InterviewPrepResult",
    "InterviewQuestion",
    "QuestionCategory",
    
    # Cover Letter
    "generate_cover_letter",
    "format_cover_letter_response",
    "extract_resume_data_for_cover_letter",
    "CoverLetterResult",
    "ToneStyle",
]