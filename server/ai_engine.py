"""
AI Engine for Resume Analysis

This module handles the OpenAI API integration for analyzing resumes against job descriptions.
It uses GPT-4 to extract keywords, calculate match scores, and provide improvement suggestions.
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
from openai import OpenAI
from dotenv import load_dotenv
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define the system prompt template
SYSTEM_PROMPT = """
You are an expert resume analyzer and career coach. Your task is to analyze a resume against a job description and provide:
1. A match score (0-100)
2. A breakdown of the match score by categories
3. A list of missing keywords/skills from the resume that are important for the job
4. Improvement suggestions for the resume

Provide your analysis in a structured JSON format with the following schema:
{
  "match_score": int,  // Overall match score (0-100)
  "score_breakdown": {
    "keyword_overlap": int,  // Score based on matching keywords (0-100)
    "semantic_match": int,   // Score based on overall relevance (0-100)
    "structure": int         // Score based on resume structure and completeness (0-100)
  },
  "missing_keywords": [
    {
      "keyword": string,     // Missing skill or keyword
      "priority": string     // "high", "medium", or "low" based on importance
    }
  ],
  "improvement_suggestions": [
    string  // 3-5 specific suggestions to improve the resume for this job
  ]
}

Be objective and analytical in your assessment. Focus on technical skills, experience, and qualifications.
"""

# Define the user prompt template
USER_PROMPT_TEMPLATE = """
## Resume:
{resume_text}

## Job Description:
{job_text}

Analyze the resume against the job description and provide a detailed assessment in the JSON format specified.
"""


def analyze_resume(resume_text: str, job_text: str) -> Dict[str, Any]:
    """
    Analyze a resume against a job description using OpenAI's GPT-4.
    
    Args:
        resume_text (str): The resume text
        job_text (str): The job description text
        
    Returns:
        Dict[str, Any]: Analysis results including match score, breakdown, and suggestions
    """
    start_time = time.time()
    logger.info("Starting AI-powered resume analysis")
    
    try:
        # Prepare the prompt
        user_prompt = USER_PROMPT_TEMPLATE.format(
            resume_text=resume_text,
            job_text=job_text
        )
        
        # Log the prompt in debug mode
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug(f"Prompt to OpenAI:\n{user_prompt}")
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,  # Lower temperature for more consistent results
            max_tokens=2000   # Limit response size
        )
        
        # Log the raw response in debug mode
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug(f"Raw OpenAI response:\n{response}")
        
        # Extract and parse the JSON response
        result = parse_openai_response(response)
        
        elapsed_time = time.time() - start_time
        logger.info(f"AI analysis completed in {elapsed_time:.2f} seconds")
        
        # Add processing time to result
        result["processing_time_seconds"] = round(elapsed_time, 2)
        
        return result
        
    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}")
        return {
            "error": f"AI analysis failed: {str(e)}",
            "match_score": 0,
            "score_breakdown": {
                "keyword_overlap": 0,
                "semantic_match": 0,
                "structure": 0
            },
            "missing_keywords": [],
            "improvement_suggestions": [
                "Analysis could not be completed. Please try again later."
            ]
        }


def parse_openai_response(response) -> Dict[str, Any]:
    """
    Parse the OpenAI API response and extract the analysis results.
    
    Args:
        response: The OpenAI API response
        
    Returns:
        Dict[str, Any]: Parsed analysis results
    """
    try:
        # Extract the content from the response
        content = response.choices[0].message.content
        
        # Parse the JSON
        result = json.loads(content)
        
        # Validate the required fields
        validate_response(result)
        
        return result
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse OpenAI response as JSON: {str(e)}")
        raise ValueError(f"Invalid JSON response from OpenAI: {str(e)}")
        
    except KeyError as e:
        logger.error(f"Missing key in OpenAI response: {str(e)}")
        raise ValueError(f"Incomplete response from OpenAI: missing {str(e)}")


def validate_response(result: Dict[str, Any]) -> None:
    """
    Validate that the OpenAI response contains all required fields.
    
    Args:
        result (Dict[str, Any]): The parsed response
        
    Raises:
        ValueError: If the response is missing required fields
    """
    # Check for required top-level fields
    required_fields = ["match_score", "score_breakdown", "missing_keywords"]
    for field in required_fields:
        if field not in result:
            raise ValueError(f"Response missing required field: {field}")
    
    # Check score_breakdown fields
    required_breakdown = ["keyword_overlap", "semantic_match", "structure"]
    for field in required_breakdown:
        if field not in result["score_breakdown"]:
            raise ValueError(f"Score breakdown missing required field: {field}")
    
    # Ensure match_score is within range
    if not (0 <= result["match_score"] <= 100):
        logger.warning(f"Match score out of range: {result['match_score']}, clamping to 0-100")
        result["match_score"] = max(0, min(100, result["match_score"]))
    
    # Ensure score breakdown values are within range
    for field in required_breakdown:
        score = result["score_breakdown"][field]
        if not (0 <= score <= 100):
            logger.warning(f"{field} score out of range: {score}, clamping to 0-100")
            result["score_breakdown"][field] = max(0, min(100, score))
    
    # Ensure missing_keywords is a list
    if not isinstance(result["missing_keywords"], list):
        raise ValueError("missing_keywords must be a list")
    
    # Ensure improvement_suggestions exists and is a list
    if "improvement_suggestions" not in result:
        result["improvement_suggestions"] = []
    elif not isinstance(result["improvement_suggestions"], list):
        raise ValueError("improvement_suggestions must be a list")


if __name__ == "__main__":
    # Enable debug logging for testing
    logger.setLevel(logging.DEBUG)
    
    # Test with sample data
    sample_resume = """
    John Doe
    Software Engineer
    
    Experience:
    - Senior Developer at Tech Corp (2018-Present)
      * Developed and maintained Python web applications using Flask
      * Implemented RESTful APIs and integrated with third-party services
      * Led a team of 3 junior developers
    
    - Junior Developer at StartUp Inc (2016-2018)
      * Built frontend components with React.js
      * Worked with PostgreSQL databases
    
    Skills:
    Python, Flask, JavaScript, React, SQL, Git, Agile methodology
    
    Education:
    Bachelor of Science in Computer Science, University of Technology (2016)
    """
    
    sample_job = """
    Senior Software Engineer
    
    We are looking for a Senior Software Engineer to join our team. The ideal candidate will have:
    
    - 5+ years of experience in software development
    - Strong knowledge of Python and web frameworks (Django preferred)
    - Experience with AWS cloud infrastructure
    - Familiarity with Docker and Kubernetes
    - Strong SQL and database design skills
    - Experience leading small development teams
    
    Responsibilities:
    - Design and implement new features for our SaaS platform
    - Mentor junior developers
    - Collaborate with product managers to define requirements
    - Ensure code quality through testing and code reviews
    """
    
    # Run the analysis
    result = analyze_resume(sample_resume, sample_job)
    
    # Print the result
    print(json.dumps(result, indent=2))
