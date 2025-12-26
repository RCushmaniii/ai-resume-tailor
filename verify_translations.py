import re
import json

def check_translation_structure():
    """Check if all translation keys are properly structured"""
    
    # Read the translation files
    with open('client/src/i18n/en.ts', 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    with open('client/src/i18n/es.ts', 'r', encoding='utf-8') as f:
        es_content = f.read()
    
    # List of all required keys with their expected paths
    required_keys = [
        ('analyze.analyzeMatch', 'analyze.analyzeMatch'),
        ('analyze.analyzing', 'analyze.analyzing'),
        ('analyze.characters', 'analyze.characters'),
        ('analyze.clear', 'analyze.clear'),
        ('analyze.clearText', 'analyze.clearText'),
        ('analyze.jobLabel', 'analyze.jobLabel'),
        ('analyze.jobPlaceholder', 'analyze.jobPlaceholder'),
        ('analyze.resumeLabel', 'analyze.resumeLabel'),
        ('analyze.resumePlaceholder', 'analyze.resumePlaceholder'),
        ('analyze.selectRole', 'analyze.selectRole'),
        ('analyze.results.atsScan', 'analyze.results.atsScan'),
        ('analyze.results.detailedScoring', 'analyze.results.detailedScoring'),
        ('analyze.results.foundKeywords', 'analyze.results.foundKeywords'),
        ('analyze.results.metrics.hardSkills', 'analyze.results.metrics.hardSkills'),
        ('analyze.results.metrics.semantic', 'analyze.results.metrics.semantic'),
        ('analyze.results.metrics.tone', 'analyze.results.metrics.tone'),
        ('analyze.results.missingKeywords', 'analyze.results.missingKeywords'),
        ('analyze.results.noMissing', 'analyze.results.noMissing'),
        ('analyze.results.optimizationPlan', 'analyze.results.optimizationPlan'),
        ('analyze.results.reportTitle', 'analyze.results.reportTitle'),
    ]
    
    print("Checking English translations:")
    all_good_en = True
    for key, path in required_keys:
        # Check if the exact path exists in the file
        if f'"{key.split(".")[-1]}":' in en_content and path in en_content:
            print(f"  ✅ {key}")
        else:
            print(f"  ❌ {key} - NOT FOUND")
            all_good_en = False
    
    print("\nChecking Spanish translations:")
    all_good_es = True
    for key, path in required_keys:
        # Check if the exact path exists in the file
        if f'"{key.split(".")[-1]}":' in es_content and path in es_content:
            print(f"  ✅ {key}")
        else:
            print(f"  ❌ {key} - NOT FOUND")
            all_good_es = False
    
    if all_good_en and all_good_es:
        print("\n✅ ALL TRANSLATION KEYS ARE PROPERLY CONFIGURED!")
    else:
        print("\n❌ Some translation keys are missing or incorrectly placed")

if __name__ == "__main__":
    check_translation_structure()
