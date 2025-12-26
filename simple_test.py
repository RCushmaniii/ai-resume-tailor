import requests
import json

url = "http://localhost:5000/api/analyze"
data = {
    "resume": "John Doe\nSenior Software Engineer with 5 years of experience building web applications. Expert in Python and Django frameworks. Developed multiple RESTful APIs and microservices. Implemented database designs using PostgreSQL and MongoDB. Worked with frontend technologies including React and Vue.js. Led a team of 3 junior developers. Conducted code reviews and implemented best practices. Experienced in agile development methodologies. Proficient with version control using Git. Deployed applications using Docker and Kubernetes. Monitored system performance and optimized bottlenecks.",
    "job_description": "Senior Developer\n\nWe are seeking a Senior Software Engineer to join our growing team. This role requires expertise in modern web technologies and the ability to lead development projects.\n\nRequired:\n- Python\n- Django\n- TypeScript\n- 5+ years experience\n- RESTful APIs\n- Database design\n\nResponsibilities include developing scalable applications, mentoring junior developers, and collaborating with cross-functional teams.",
}

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")

if response.status_code == 200:
    result = response.json()
    print(f"\nScore: {result.get('score')}")
    
    # Print the critical gaps
    print("\nCritical gaps:")
    gaps = result.get('critical_gaps', [])
    print(f"Number of gaps: {len(gaps)}")
    
    for i, gap in enumerate(gaps):
        print(f"\nGap {i+1}:")
        print(f"  missing_skill: '{gap.get('missing_skill')}'")
        print(f"  impact: {gap.get('impact')}")
        print(f"  recommendation: {gap.get('recommendation')}")
        
        # Check if it's a variable
        skill = gap.get('missing_skill', '')
        if '<' in skill or skill.startswith('missing_skill') or skill == '<term>':
            print(f"  ❌ ERROR: This is a variable!")
        else:
            print(f"  ✅ GOOD: Real skill name")
else:
    print(f"Error: {response.text}")
