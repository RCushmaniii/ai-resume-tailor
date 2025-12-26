import re

# Find all t('...') patterns in analyze components
import os

def find_translation_keys():
    keys = set()
    
    # Search in all component files
    component_dir = "client/src/components/analyze"
    for filename in os.listdir(component_dir):
        if filename.endswith('.tsx'):
            filepath = os.path.join(component_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Find all t('analyze.x') patterns
                matches = re.findall(r"t\('([^']+)'\)", content)
                for match in matches:
                    if match.startswith('analyze.'):
                        keys.add(match)
    
    return sorted(keys)

def check_keys_in_translations(keys):
    # Check English translations
    with open('client/src/i18n/en.ts', 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    # Check Spanish translations  
    with open('client/src/i18n/es.ts', 'r', encoding='utf-8') as f:
        es_content = f.read()
    
    missing_en = []
    missing_es = []
    
    for key in keys:
        # Convert key to path format
        path = key.split('.')
        
        # Check if key exists in translations
        # For analyze.results.noMissing, we need to check if "noMissing" exists under analyze.results
        if key not in en_content:
            missing_en.append(key)
        if key not in es_content:
            missing_es.append(key)
    
    return missing_en, missing_es

if __name__ == "__main__":
    keys = find_translation_keys()
    print(f"Found {len(keys)} translation keys:")
    for key in keys:
        print(f"  - {key}")
    
    missing_en, missing_es = check_keys_in_translations(keys)
    
    if missing_en:
        print(f"\nMissing from English translations:")
        for key in missing_en:
            print(f"  - {key}")
    
    if missing_es:
        print(f"\nMissing from Spanish translations:")
        for key in missing_es:
            print(f"  - {key}")
    
    if not missing_en and not missing_es:
        print("\n✅ All keys are present in both translation files!")
