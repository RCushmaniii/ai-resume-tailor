import requests
import json

# Test with multiple skills to ensure all titles display correctly
url = "http://localhost:5000/api/analyze"

test_cases = [
    {
        "name": "Tech Skills Test",
        "data": {
            "resume": "Sarah Johnson\nSenior Full Stack Developer with 6 years of experience. Expert in React, Node.js, and MongoDB. Built scalable microservices. Led team of 4 developers. Implemented CI/CD pipelines. Worked with AWS and Docker. Experienced in agile methodologies.",
            "job_description": "Principal Full Stack Developer\n\nWe are looking for a Principal Full Stack Developer to lead our engineering team.\n\nRequired Skills:\n- React\n- Node.js\n- TypeScript\n- Python\n- AWS\n- Docker\n- Kubernetes\n- MongoDB\n- GraphQL\n\nThe ideal candidate will have 8+ years of experience and strong leadership skills."
        }
    },
    {
        "name": "Marketing Skills Test", 
        "data": {
            "resume": "Michael Chen\nDigital Marketing Manager with 5 years of experience. Managed PPC campaigns on Google Ads and Facebook. Developed SEO strategies that increased organic traffic by 150%. Created content marketing plans and email campaigns. Analyzed data using Google Analytics.",
            "job_description": "Senior Digital Marketing Manager\n\nWe need a Senior Digital Marketing Manager to drive our digital growth initiatives.\n\nRequirements:\n- Google Analytics\n- Google Ads\n- Facebook Ads\n- SEO/SEM\n- Content marketing\n- Email marketing\n- Marketing automation tools\n- HubSpot\n- Marketo\n\nMust have 5+ years of experience in digital marketing."
        }
    }
]

for test in test_cases:
    print(f"\n{'='*60}")
    print(f"TEST: {test['name']}")
    print('='*60)
    
    response = requests.post(url, json=test['data'])
    
    if response.status_code == 200:
        result = response.json()
        print(f"\nScore: {result.get('score')}")
        
        gaps = result.get('critical_gaps', [])
        print(f"\nFound {len(gaps)} critical gaps:")
        
        all_real_skills = True
        for i, gap in enumerate(gaps, 1):
            skill = gap.get('missing_skill', '')
            print(f"\n{i}. Missing Skill: '{skill}'")
            print(f"   Impact: {gap.get('impact')}")
            print(f"   Recommendation: {gap.get('recommendation')}")
            
            # Check if it's a real skill
            if '<' in skill or skill.startswith('missing_skill') or skill == '<term>' or skill == '':
                print(f"   ❌ ERROR: This is NOT a real skill!")
                all_real_skills = False
            else:
                print(f"   ✅ CONFIRMED: Real skill name")
        
        print(f"\n{'='*60}")
        if all_real_skills:
            print("✅ ALL SKILLS ARE REAL - NO VARIABLES FOUND!")
        else:
            print("❌ SOME SKILLS ARE VARIABLES - FIX NEEDED!")
        print('='*60)
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
