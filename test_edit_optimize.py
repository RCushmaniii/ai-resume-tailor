import requests
import json

# Test the API with updated resume text
url = "http://localhost:5000/api/analyze"

# Original resume
original_data = {
    "resume": "John Doe\nSoftware Engineer with 5 years of experience in React, JavaScript, and CSS. Led a team of 3 developers. Developed multiple web applications using modern JavaScript frameworks. Implemented responsive designs and optimized user interfaces. Worked closely with product managers and designers to deliver high-quality features. Mentored junior developers and conducted code reviews. Experienced in agile development methodologies and continuous integration. Proficient in version control using Git and collaborative development workflows.",
    "job_description": "Senior Frontend Developer\n\nRequired:\n- React\n- TypeScript\n- 5+ years experience\n\nWe are looking for a senior frontend developer to join our team."
}

# Updated resume after "Edit and Optimize"
updated_data = {
    "resume": "John Doe\nSenior Frontend Developer with 5 years of experience in React, JavaScript, TypeScript, and CSS. Led a team of 3 developers. Developed multiple web applications using modern JavaScript frameworks including TypeScript. Implemented responsive designs and optimized user interfaces. Worked closely with product managers and designers to deliver high-quality features. Mentored junior developers and conducted code reviews. Experienced in agile development methodologies and continuous integration. Proficient in version control using Git and collaborative development workflows. Built enterprise-level applications using TypeScript and React.",
    "job_description": "Senior Frontend Developer\n\nRequired:\n- React\n- TypeScript\n- 5+ years experience\n\nWe are looking for a senior frontend developer to join our team."
}

print("=== Testing Original Resume ===")
response1 = requests.post(url, json=original_data)
print(f"Status: {response1.status_code}")
if response1.status_code == 200:
    result1 = response1.json()
    print(f"Score: {result1.get('score')}")
    print("Critical Gaps:")
    for gap in result1.get('critical_gaps', []):
        print(f"  - {gap.get('missing_skill')} ({gap.get('impact')})")

print("\n=== Testing Updated Resume (After Edit & Optimize) ===")
response2 = requests.post(url, json=updated_data)
print(f"Status: {response2.status_code}")
if response2.status_code == 200:
    result2 = response2.json()
    print(f"Score: {result2.get('score')}")
    print("Critical Gaps:")
    for gap in result2.get('critical_gaps', []):
        print(f"  - {gap.get('missing_skill')} ({gap.get('impact')})")

print("\n=== Comparison ===")
if response1.status_code == 200 and response2.status_code == 200:
    print(f"Score improvement: {result2.get('score') - result1.get('score')}")
    print("TypeScript gap fixed:", len([g for g in result2.get('critical_gaps', []) if 'TypeScript' in g.get('missing_skill', '')]) == 0)
