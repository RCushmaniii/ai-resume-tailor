"""
compute_match.py - Module for computing the match score between a resume and job description
"""
import logging
import re
import time
from typing import Dict, List, Tuple, Any
import numpy as np
from openai import OpenAI
import os
from dotenv import load_dotenv

# Import local modules
from .extract_keywords import extract_keywords, find_missing_keywords

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = None
try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    logger.info("OpenAI client initialized")
except Exception as e:
    logger.error(f"Error initializing OpenAI client: {str(e)}")
    logger.error("Make sure OPENAI_API_KEY is set in the .env file")

def compute_match(resume: str, jd: str) -> Dict[str, Any]:
    """
    Compute the match score between a resume and job description.
    
    Args:
        resume (str): Resume text
        jd (str): Job description text
        
    Returns:
        Dict: Match score and breakdown
    """
    start_time = time.time()
    logger.info("Computing match score...")
    
    try:
        # Validate inputs
        if not resume or not jd:
            logger.error("Empty resume or job description")
            return {
                "error": "Resume and job description are required",
                "match_score": 0,
                "score_breakdown": {
                    "keyword_overlap": 0,
                    "semantic_match": 0,
                    "structure": 0
                },
                "missing_keywords": []
            }
        
        # Extract keywords
        logger.info("Extracting keywords from resume and job description")
        resume_keywords = extract_keywords(resume)
        jd_keywords = extract_keywords(jd)
        
        # Find missing keywords
        missing_keywords = find_missing_keywords(resume_keywords, jd_keywords)
        
        # Calculate keyword overlap score
        keyword_score = calculate_keyword_overlap(resume_keywords, jd_keywords)
        logger.info(f"Keyword overlap score: {keyword_score}")
        
        # Calculate semantic similarity score
        semantic_score = calculate_semantic_similarity(resume, jd)
        logger.info(f"Semantic similarity score: {semantic_score}")
        
        # Calculate structure score
        structure_score = calculate_structure_score(resume)
        logger.info(f"Structure score: {structure_score}")
        
        # Calculate final score (weighted average)
        # Weights: 40% keyword overlap, 50% semantic similarity, 10% structure
        final_score = int(0.4 * keyword_score + 0.5 * semantic_score + 0.1 * structure_score)
        
        # Ensure score is between 0 and 100
        final_score = max(0, min(100, final_score))
        
        elapsed_time = time.time() - start_time
        logger.info(f"Match score computation completed in {elapsed_time:.2f} seconds")
        
        return {
            "match_score": final_score,
            "score_breakdown": {
                "keyword_overlap": keyword_score,
                "semantic_match": semantic_score,
                "structure": structure_score
            },
            "missing_keywords": missing_keywords[:10]  # Limit to top 10 missing keywords
        }
        
    except Exception as e:
        logger.error(f"Error computing match score: {str(e)}")
        return {
            "error": str(e),
            "match_score": 0,
            "score_breakdown": {
                "keyword_overlap": 0,
                "semantic_match": 0,
                "structure": 0
            },
            "missing_keywords": []
        }


def calculate_keyword_overlap(resume_keywords: List[str], jd_keywords: List[str]) -> int:
    """
    Calculate keyword overlap score between resume and job description keywords.
    
    Args:
        resume_keywords (List[str]): Keywords from the resume
        jd_keywords (List[str]): Keywords from the job description
        
    Returns:
        int: Keyword overlap score (0-100)
    """
    if not jd_keywords:
        return 0
    
    # Count matching keywords
    matches = sum(1 for kw in jd_keywords if kw in resume_keywords)
    
    # Calculate percentage of JD keywords found in resume
    overlap_percentage = (matches / len(jd_keywords)) * 100
    
    # Apply a curve to the score to make it more meaningful
    # This makes it harder to get a perfect 100 but easier to get a decent score
    if overlap_percentage > 80:
        score = 90 + (overlap_percentage - 80) / 2  # 90-100 range for >80% overlap
    elif overlap_percentage > 60:
        score = 75 + (overlap_percentage - 60) / 4  # 75-90 range for 60-80% overlap
    elif overlap_percentage > 40:
        score = 60 + (overlap_percentage - 40) / 4  # 60-75 range for 40-60% overlap
    elif overlap_percentage > 20:
        score = 40 + (overlap_percentage - 20) / 2  # 40-60 range for 20-40% overlap
    else:
        score = overlap_percentage * 2  # 0-40 range for 0-20% overlap
    
    return int(score)


def calculate_semantic_similarity(resume: str, jd: str) -> int:
    """
    Calculate semantic similarity between resume and job description using OpenAI embeddings.
    
    Args:
        resume (str): Resume text
        jd (str): Job description text
        
    Returns:
        int: Semantic similarity score (0-100)
    """
    if not client:
        logger.warning("OpenAI client not initialized, using fallback similarity calculation")
        return calculate_fallback_similarity(resume, jd)
    
    try:
        # Truncate texts if they're too long (API limits)
        max_length = 8000
        resume = resume[:max_length]
        jd = jd[:max_length]
        
        # Get embeddings for both texts
        resume_embedding = get_embedding(resume)
        jd_embedding = get_embedding(jd)
        
        if resume_embedding is None or jd_embedding is None:
            logger.warning("Failed to get embeddings, using fallback similarity calculation")
            return calculate_fallback_similarity(resume, jd)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(resume_embedding, jd_embedding)
        
        # Convert similarity (-1 to 1) to score (0 to 100)
        # Typical embedding similarities are in the 0.7-0.9 range for related content
        # Apply a curve to make the score more meaningful
        if similarity > 0.9:
            score = 90 + (similarity - 0.9) * 100  # 90-100 range for >0.9 similarity
        elif similarity > 0.8:
            score = 75 + (similarity - 0.8) * 150  # 75-90 range for 0.8-0.9 similarity
        elif similarity > 0.7:
            score = 60 + (similarity - 0.7) * 150  # 60-75 range for 0.7-0.8 similarity
        elif similarity > 0.6:
            score = 40 + (similarity - 0.6) * 200  # 40-60 range for 0.6-0.7 similarity
        else:
            score = max(0, similarity * 100)  # 0-60 range for <0.6 similarity
        
        return int(score)
        
    except Exception as e:
        logger.error(f"Error calculating semantic similarity: {str(e)}")
        return calculate_fallback_similarity(resume, jd)


def get_embedding(text: str) -> List[float]:
    """
    Get embedding for text using OpenAI API.
    
    Args:
        text (str): Input text
        
    Returns:
        List[float] or None: Embedding vector or None if failed
    """
    try:
        response = client.embeddings.create(
            model="text-embedding-3-large",
            input=text,
            encoding_format="float"
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error getting embedding: {str(e)}")
        return None


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Calculate cosine similarity between two vectors.
    
    Args:
        vec1 (List[float]): First vector
        vec2 (List[float]): Second vector
        
    Returns:
        float: Cosine similarity (-1 to 1)
    """
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0
    
    return dot_product / (norm1 * norm2)


def calculate_fallback_similarity(resume: str, jd: str) -> int:
    """
    Calculate a fallback similarity score when OpenAI API is not available.
    Uses simple word overlap and length-based heuristics.
    
    Args:
        resume (str): Resume text
        jd (str): Job description text
        
    Returns:
        int: Similarity score (0-100)
    """
    # Convert to lowercase and split into words
    resume_words = set(re.findall(r'\b\w+\b', resume.lower()))
    jd_words = set(re.findall(r'\b\w+\b', jd.lower()))
    
    # Calculate word overlap
    common_words = resume_words.intersection(jd_words)
    
    if not jd_words:
        return 0
    
    # Calculate percentage of JD words found in resume
    overlap_percentage = (len(common_words) / len(jd_words)) * 100
    
    # Apply a curve similar to keyword overlap
    if overlap_percentage > 80:
        score = 85 + (overlap_percentage - 80) / 4  # 85-90 range for >80% overlap
    elif overlap_percentage > 60:
        score = 70 + (overlap_percentage - 60) / 4  # 70-85 range for 60-80% overlap
    elif overlap_percentage > 40:
        score = 55 + (overlap_percentage - 40) / 4  # 55-70 range for 40-60% overlap
    elif overlap_percentage > 20:
        score = 35 + (overlap_percentage - 20) / 2  # 35-55 range for 20-40% overlap
    else:
        score = overlap_percentage * 1.75  # 0-35 range for 0-20% overlap
    
    # Cap at 90 since this is a fallback method
    return min(90, int(score))


def calculate_structure_score(resume: str) -> int:
    """
    Calculate structure score based on resume formatting and content.
    
    Args:
        resume (str): Resume text
        
    Returns:
        int: Structure score (0-100)
    """
    score = 70  # Start with a base score
    
    # Check for presence of sections
    sections = [
        r'experience|work|employment',
        r'education|academic|degree',
        r'skills|technologies|tools',
        r'projects|portfolio',
        r'contact|email|phone'
    ]
    
    # Add points for each section found
    resume_lower = resume.lower()
    for section in sections:
        if re.search(section, resume_lower):
            score += 5
    
    # Check for bullet points
    bullet_patterns = [r'•', r'-', r'\*', r'·']
    bullet_count = 0
    for pattern in bullet_patterns:
        bullet_count += len(re.findall(pattern, resume))
    
    # Add points based on bullet points (up to 10)
    if bullet_count > 15:
        score += 10
    elif bullet_count > 10:
        score += 7
    elif bullet_count > 5:
        score += 5
    elif bullet_count > 0:
        score += 3
    
    # Check for metrics and numbers (indicates quantified achievements)
    metrics_count = len(re.findall(r'\d+%|\$\d+|\d+ [a-zA-Z]+', resume))
    
    # Add points based on metrics (up to 5)
    if metrics_count > 5:
        score += 5
    elif metrics_count > 3:
        score += 3
    elif metrics_count > 0:
        score += 1
    
    # Ensure score is between 0 and 100
    return max(0, min(100, score))


if __name__ == "__main__":
    # Example usage
    test_resume = """
    John Doe
    Software Engineer
    
    Experience:
    - Developed Python applications using Flask and Django
    - Worked with PostgreSQL databases
    - Frontend development with HTML, CSS, and JavaScript
    
    Skills:
    Python, Flask, Django, SQL, HTML, CSS, JavaScript
    """
    
    test_jd = """
    We are looking for a Python developer with experience in Flask and Django.
    The ideal candidate should have knowledge of React.js, PostgreSQL, and AWS.
    Experience with Docker and Kubernetes is a plus.
    """
    
    result = compute_match(test_resume, test_jd)
    print(f"Match Score: {result['match_score']}")
    print(f"Score Breakdown: {result['score_breakdown']}")
    print("Missing Keywords:")
    for kw in result['missing_keywords']:
        print(f"- {kw['keyword']} ({kw['priority']})")
