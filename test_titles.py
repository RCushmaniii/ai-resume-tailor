import requests
import json

# Test with a job description that has specific technical skills
url = "http://localhost:5000/api/analyze"

test_data = {
    "resume": "Jane Smith\nSenior Software Engineer with 7 years of experience. Expert in Python, Django, PostgreSQL, and AWS. Led development of microservices architecture. Implemented CI/CD pipelines. Managed team of 5 engineers. Built RESTful APIs and real-time data processing systems. Experience with Docker, Kubernetes, and Redis. Conducted code reviews and mentored junior developers.",
    "job_description": "Principal Software Engineer\n\nRequired:\n- Python\n- Django\n- PostgreSQL\n- AWS\n- Docker\n- Kubernetes\n- Redis\n- 7+ years experience\n- Microservices\n\nPreferred:\n- GraphQL\n- Elasticsearch\n- Terraform\n\nWe are seeking a Principal Software Engineer to lead our backend team."
}

print("=== Testing API Response for Specific Skills ===")
response = requests.post(url, json=test_data)
print(f"Status: {response.status_code}")

if response.status_code == 200:
    result = response.json()
    print(f"\nScore: {result.get('score')}")
    
    print("\n=== Critical Gaps (Missing Skills) ===")
    gaps = result.get('critical_gaps', [])
    for i, gap in enumerate(gaps):
        print(f"\nGap {i+1}:")
        print(f"  missing_skill: '{gap.get('missing_skill')}'")
        print(f"  impact: {gap.get('impact')}")
        print(f"  recommendation: {gap.get('recommendation')}")
        
        # Check if it's a variable/template
        skill = gap.get('missing_skill', '')
        if skill.startswith('<') or skill.startswith('missing_skill') or skill == '<term>':
            print(f"  ❌ ERROR: This is a variable, not a real skill!")
        else:
            print(f"  ✅ GOOD: This is a real skill name")
    
    print("\n=== Quick Wins ===")
    wins = result.get('quick_wins', [])
    for win in wins:
        print(f"\nCurrent: {win.get('current_text')}")
        print(f"Suggested: {win.get('suggested_text')}")
        print(f"Rationale: {win.get('rationale')}")
        
else:
    print(f"Error: {response.text}")
