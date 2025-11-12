"""
Test script for AI-powered resume analysis
"""

import json
import logging
from ai_engine import analyze_resume

# Configure logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Sample resume
SAMPLE_RESUME = """
John Doe
Software Engineer

SUMMARY
Experienced Python developer with 5 years of experience building web applications and APIs.
Skilled in Flask, Django, and React.js. Strong problem-solving abilities and team collaboration.

EXPERIENCE
Senior Software Engineer, TechCorp Inc.
2020 - Present
- Developed and maintained multiple Flask microservices handling 1M+ daily requests
- Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 40%
- Mentored junior developers and conducted code reviews
- Optimized database queries, improving application performance by 30%

Web Developer, StartUp Solutions
2018 - 2020
- Built responsive web applications using React.js and Redux
- Created RESTful APIs using Django REST framework
- Worked with PostgreSQL and MongoDB databases

SKILLS
- Languages: Python, JavaScript, HTML, CSS, SQL
- Frameworks: Flask, Django, React.js, Redux
- Tools: Git, Docker, GitHub Actions, Jira
- Databases: PostgreSQL, MongoDB
- Other: RESTful APIs, Microservices, Agile methodology

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2018
"""

# Sample job description
SAMPLE_JOB = """
Senior Backend Engineer (Python)

About the Role:
We are seeking an experienced Senior Backend Engineer to join our growing team. The ideal candidate will have strong Python skills and experience with cloud infrastructure.

Responsibilities:
- Design, develop, and maintain scalable backend services and APIs
- Work with product managers to define requirements and deliver features
- Optimize application performance and ensure high availability
- Mentor junior developers and conduct code reviews
- Participate in architectural discussions and technical planning

Requirements:
- 5+ years of experience in backend development
- Strong proficiency in Python and web frameworks (Django preferred)
- Experience with AWS or other cloud platforms
- Knowledge of containerization technologies (Docker, Kubernetes)
- Experience with SQL and NoSQL databases
- Strong understanding of RESTful API design
- Familiarity with CI/CD pipelines and DevOps practices
- Excellent problem-solving and communication skills

Nice to Have:
- Experience with microservices architecture
- Knowledge of message queuing systems (RabbitMQ, Kafka)
- Experience with GraphQL
- Contributions to open-source projects

Benefits:
- Competitive salary and equity
- Health, dental, and vision insurance
- Flexible work hours and remote work options
- Professional development budget
- Modern equipment and tools
"""

def main():
    """Run a test analysis"""
    logger.info("Starting test analysis")
    
    # Run the analysis
    result = analyze_resume(SAMPLE_RESUME, SAMPLE_JOB)
    
    # Print the result
    print("\n" + "="*80)
    print("ANALYSIS RESULT:")
    print("="*80)
    print(json.dumps(result, indent=2))
    print("="*80)
    
    # Verify the result structure
    assert "match_score" in result, "Result missing match_score"
    assert "score_breakdown" in result, "Result missing score_breakdown"
    assert "missing_keywords" in result, "Result missing missing_keywords"
    
    logger.info("Test completed successfully")
    
    # Return the result for further inspection if needed
    return result

if __name__ == "__main__":
    main()
