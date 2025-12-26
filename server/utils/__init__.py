"""
Utils Package

Shared utilities for text analysis and processing.
"""

from .text_analysis import (
    # Data classes
    MetricMatch,
    VerbAnalysis,
    TextStats,
    
    # Constants
    POWER_VERBS,
    ALL_POWER_VERBS,
    WEAK_VERBS,
    METRIC_PATTERNS,
    
    # Extraction functions
    extract_metrics,
    extract_metrics_simple,
    analyze_action_verbs,
    get_text_stats,
    split_into_sentences,
    extract_years_of_experience,
    extract_email,
    extract_phone,
    extract_name,
    extract_skills_section,
    
    # Comparison utilities
    find_keyword_in_text,
    calculate_keyword_density,
    
    # Formatting
    clean_text,
    truncate_text,
)

__all__ = [
    "MetricMatch",
    "VerbAnalysis", 
    "TextStats",
    "POWER_VERBS",
    "ALL_POWER_VERBS",
    "WEAK_VERBS",
    "METRIC_PATTERNS",
    "extract_metrics",
    "extract_metrics_simple",
    "analyze_action_verbs",
    "get_text_stats",
    "split_into_sentences",
    "extract_years_of_experience",
    "extract_email",
    "extract_phone",
    "extract_name",
    "extract_skills_section",
    "find_keyword_in_text",
    "calculate_keyword_density",
    "clean_text",
    "truncate_text",
]
