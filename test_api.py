import requests
import json

# Test the API
url = "http://localhost:5000/api/analyze"
data = {
    "resume": "John Doe\nSoftware Engineer with 5 years of experience in React, JavaScript, and CSS. Led a team of 3 developers. Developed multiple web applications using modern JavaScript frameworks. Implemented responsive designs and optimized user interfaces. Worked closely with product managers and designers to deliver high-quality features. Mentored junior developers and conducted code reviews. Experienced in agile development methodologies and continuous integration. Proficient in version control using Git and collaborative development workflows.",
    "job_description": "Senior Frontend Developer\n\nRequired:\n- React\n- TypeScript\n- 5+ years experience\n\nWe are looking for a senior frontend developer to join our team."
}

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    result = response.json()
    print("\n=== Critical Gaps (Suggestions) ===")
    for gap in result.get('critical_gaps', []):
        print(f"Missing Skill: {gap.get('missing_skill')}")
        print(f"Impact: {gap.get('impact')}")
        print(f"Recommendation: {gap.get('recommendation')}")
        print("---")
    
    print("\n=== Quick Wins ===")
    for win in result.get('quick_wins', []):
        print(f"Current: {win.get('current_text')}")
        print(f"Suggested: {win.get('suggested_text')}")
        print(f"Rationale: {win.get('rationale')}")
        print("---")
