"""
extract_keywords.py - Module for extracting keywords from text using spaCy and TF-IDF
"""
import spacy
import re
import logging
from typing import List, Dict, Tuple
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
    logger.info("Loaded spaCy model: en_core_web_sm")
except Exception as e:
    logger.error(f"Error loading spaCy model: {str(e)}")
    logger.error("Make sure to run: python -m spacy download en_core_web_sm")
    raise

# Common tech skills and keywords for tech jobs
TECH_SKILLS = {
    # Programming Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
    # Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net',
    # Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'oracle',
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'gitlab', 'github', 'ci/cd',
    # Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    # Mobile
    'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin',
    # Other
    'agile', 'scrum', 'jira', 'git', 'rest api', 'graphql', 'microservices', 'serverless'
}

# Common tech skill synonyms and variations
TECH_SYNONYMS = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'react.js': 'react',
    'reactjs': 'react',
    'vue.js': 'vue',
    'vuejs': 'vue',
    'node': 'node.js',
    'nodejs': 'node.js',
    'postgres': 'postgresql',
    'mongo': 'mongodb',
    'k8s': 'kubernetes',
    'terraform': 'terraform',
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'dl': 'deep learning',
    'ci': 'continuous integration',
    'cd': 'continuous deployment',
    'cicd': 'ci/cd',
    'restful': 'rest api',
    'rest': 'rest api',
}

def extract_keywords(text: str, max_keywords: int = 30) -> List[str]:
    """
    Extract keywords from text using spaCy NER, noun chunks, and TF-IDF.
    
    Args:
        text (str): Input text to extract keywords from
        max_keywords (int): Maximum number of keywords to return
        
    Returns:
        List[str]: List of extracted keywords
    """
    if not text or len(text.strip()) == 0:
        logger.warning("Empty text provided for keyword extraction")
        return []
    
    try:
        logger.info(f"Extracting keywords from text ({len(text)} chars)")
        
        # Process the text with spaCy
        doc = nlp(text)
        
        # Extract noun chunks (noun phrases)
        noun_chunks = [chunk.text.lower() for chunk in doc.noun_chunks]
        
        # Extract named entities
        entities = [ent.text.lower() for ent in doc.ents]
        
        # Extract tech skills (case insensitive)
        text_lower = text.lower()
        tech_matches = []
        for skill in TECH_SKILLS:
            # Use word boundary regex to match whole words only
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                tech_matches.append(skill)
        
        # Apply TF-IDF to find important terms
        # Split text into sentences for better TF-IDF results
        sentences = [sent.text for sent in doc.sents]
        if len(sentences) < 3:
            # If too few sentences, create artificial ones
            sentences = text.split('. ')
        
        # Apply TF-IDF
        tfidf_keywords = extract_tfidf_keywords(sentences, max_keywords=max_keywords)
        
        # Combine all keyword sources
        all_keywords = tech_matches + entities + noun_chunks + tfidf_keywords
        
        # Clean and normalize keywords
        cleaned_keywords = clean_and_normalize_keywords(all_keywords)
        
        # Remove duplicates while preserving order
        unique_keywords = []
        seen = set()
        for kw in cleaned_keywords:
            if kw not in seen and len(kw) > 1:  # Ignore single-character keywords
                seen.add(kw)
                unique_keywords.append(kw)
        
        # Prioritize tech skills and longer keywords
        prioritized = prioritize_keywords(unique_keywords)
        
        # Limit to max_keywords
        result = prioritized[:max_keywords]
        
        logger.info(f"Extracted {len(result)} keywords")
        return result
        
    except Exception as e:
        logger.error(f"Error extracting keywords: {str(e)}")
        return []


def extract_tfidf_keywords(sentences: List[str], max_keywords: int = 20) -> List[str]:
    """
    Extract keywords using TF-IDF vectorization.
    
    Args:
        sentences (List[str]): List of sentences to analyze
        max_keywords (int): Maximum number of keywords to extract
        
    Returns:
        List[str]: List of keywords extracted via TF-IDF
    """
    try:
        # Create TF-IDF vectorizer
        vectorizer = TfidfVectorizer(
            max_df=0.85,  # Ignore terms that appear in more than 85% of documents
            min_df=1,     # Ignore terms that appear in only 1 document
            stop_words='english',
            ngram_range=(1, 2)  # Use unigrams and bigrams
        )
        
        # Fit and transform the sentences
        X = vectorizer.fit_transform(sentences)
        
        # Get feature names (terms)
        feature_names = vectorizer.get_feature_names_out()
        
        # Calculate average TF-IDF score for each term
        tfidf_scores = np.asarray(X.mean(axis=0)).flatten()
        
        # Create a list of (term, score) tuples
        term_scores = [(feature_names[i], tfidf_scores[i]) for i in range(len(feature_names))]
        
        # Sort by score in descending order
        term_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Get the top terms
        top_terms = [term for term, score in term_scores[:max_keywords]]
        
        return top_terms
        
    except Exception as e:
        logger.error(f"Error in TF-IDF extraction: {str(e)}")
        return []


def clean_and_normalize_keywords(keywords: List[str]) -> List[str]:
    """
    Clean and normalize extracted keywords.
    
    Args:
        keywords (List[str]): List of raw keywords
        
    Returns:
        List[str]: List of cleaned keywords
    """
    cleaned = []
    for kw in keywords:
        # Convert to lowercase
        kw = kw.lower()
        
        # Remove punctuation at the beginning and end
        kw = re.sub(r'^[^\w]+|[^\w]+$', '', kw)
        
        # Replace multiple spaces with a single space
        kw = re.sub(r'\s+', ' ', kw)
        
        # Check for tech synonyms
        if kw in TECH_SYNONYMS:
            kw = TECH_SYNONYMS[kw]
        
        # Skip empty strings and single characters
        if kw and len(kw) > 1:
            cleaned.append(kw)
    
    return cleaned


def prioritize_keywords(keywords: List[str]) -> List[str]:
    """
    Prioritize keywords based on tech skills and length.
    
    Args:
        keywords (List[str]): List of keywords
        
    Returns:
        List[str]: Prioritized list of keywords
    """
    # Separate tech skills from other keywords
    tech_keywords = []
    other_keywords = []
    
    for kw in keywords:
        if kw in TECH_SKILLS or any(tech in kw for tech in TECH_SKILLS):
            tech_keywords.append(kw)
        else:
            other_keywords.append(kw)
    
    # Sort other keywords by length (longer is better)
    other_keywords.sort(key=len, reverse=True)
    
    # Combine tech skills first, then other keywords
    return tech_keywords + other_keywords


def find_missing_keywords(resume_keywords: List[str], jd_keywords: List[str]) -> List[Dict[str, str]]:
    """
    Find keywords that are in the job description but not in the resume.
    
    Args:
        resume_keywords (List[str]): Keywords from the resume
        jd_keywords (List[str]): Keywords from the job description
        
    Returns:
        List[Dict[str, str]]: List of missing keywords with priority
    """
    missing = []
    
    for kw in jd_keywords:
        if kw not in resume_keywords:
            # Determine priority based on position in jd_keywords list
            # First third are high priority, second third are medium, rest are low
            position = jd_keywords.index(kw)
            third = len(jd_keywords) // 3
            
            if position < third:
                priority = "high"
            elif position < 2 * third:
                priority = "medium"
            else:
                priority = "low"
            
            # Tech skills are always high priority
            if kw in TECH_SKILLS or any(tech in kw for tech in TECH_SKILLS):
                priority = "high"
            
            missing.append({
                "keyword": kw,
                "priority": priority
            })
    
    # Sort by priority (high first)
    priority_order = {"high": 0, "medium": 1, "low": 2}
    missing.sort(key=lambda x: priority_order[x["priority"]])
    
    return missing


if __name__ == "__main__":
    # Example usage
    test_text = """
    We are looking for a Python developer with experience in Flask and Django.
    The ideal candidate should have knowledge of React.js, PostgreSQL, and AWS.
    Experience with Docker and Kubernetes is a plus.
    """
    
    keywords = extract_keywords(test_text)
    print("Extracted Keywords:")
    for i, kw in enumerate(keywords):
        print(f"{i+1}. {kw}")
