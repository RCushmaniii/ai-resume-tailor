# Role Fit Assessment - Integration Guide

## Overview

This feature detects when resume gaps are **structural** (role mismatch) vs **expressive** (fixable with rewording), and pivots to honest guidance when optimization won't help.

### The Philosophy

```
❌ "Your resume is bad" → wrong, discouraging
❌ "You just need better wording" → misleading
✅ "This role requires experience that isn't present yet" → truthful, respectful
```

When we detect a mismatch, we:

1. Tell the truth with dignity
2. Stop suggesting futile optimization
3. Redirect to roles they ARE qualified for (the upsell)

---

## Files Created

### Backend

```
server/analyzers/role_fit.py     # Role fit analyzer
```

### Frontend

```
client/src/components/analyze/
├── RoleFitAssessment.tsx        # Main assessment display
├── EligibleRoles.tsx            # Pro feature - full roles list
└── index.ts                     # Exports
```

---

## Backend Integration

### Add to ai_engine.py

```python
from analyzers.role_fit import analyze_role_fit, format_role_fit_response

def analyze_resume(resume_text, job_text, ...):
    # ... existing code ...

    # After scoring, add role fit analysis
    role_fit = analyze_role_fit(
        job_title=extracted_data.get("job_title", ""),
        required_years=extracted_data.get("years_required"),
        required_skills=extracted_data.get("required_skills", []),
        required_experience=extracted_data.get("required_experience", []),

        resume_text=resume_text,
        resume_years=extracted_data.get("resume_years"),
        resume_skills=extracted_data.get("resume_skills", []),
        resume_experience=extracted_data.get("resume_experience", []),

        ats_status=result.get("ats_status", "PASS"),
        search_visibility=result.get("search_visibility", "MEDIUM"),
        alignment_score=result.get("score", 50),
        missing_keywords=result.get("missing_keywords", []),
    )

    result["role_fit"] = format_role_fit_response(role_fit)

    return result
```

### Add API Endpoint for Full Eligible Roles (Pro)

```python
@app.route('/api/eligible-roles', methods=['POST'])
@require_pro  # Your auth decorator
def get_eligible_roles():
    data = request.json
    # ... extract resume/job data ...

    role_fit = analyze_role_fit(...)
    return jsonify(format_eligible_roles_full(role_fit))
```

---

## Frontend Integration

### In Results Page

```tsx
import { RoleFitAssessment, RoleFitBadge } from '@/components/analyze';

function ResultsPage({ data }) {
  return (
    <div>
      {/* Show badge in header */}
      {data.role_fit && <RoleFitBadge verdict={data.role_fit.verdict} />}

      {/* Show full assessment after score */}
      {data.role_fit && <RoleFitAssessment data={data.role_fit} jobTitle={data.job_title} />}

      {/* Rest of results... */}
    </div>
  );
}
```

### For Pro Users - Full Eligible Roles

```tsx
import { EligibleRoles } from '@/components/analyze';
import { useFeatureAccess } from '@/contexts/SubscriptionContext';

function EligibleRolesSection({ analysisId }) {
  const { hasAccess } = useFeatureAccess('fullOptimizationPlan');
  const [data, setData] = useState(null);

  useEffect(() => {
    if (hasAccess) {
      fetch(`/api/eligible-roles/${analysisId}`)
        .then(res => res.json())
        .then(setData);
    }
  }, [hasAccess, analysisId]);

  if (!hasAccess || !data) return null;

  return <EligibleRoles data={data} targetJobTitle={targetTitle} />;
}
```

---

## Trigger Conditions

The mismatch assessment triggers when:

```python
is_mismatch = (
    ats_status == "FAIL" and
    search_visibility == "LOW" and
    alignment_score < 40 and
    len(critical_structural_gaps) >= 1
) or (
    len(critical_structural_gaps) >= 2
) or (
    level_gap >= 3  # e.g., Entry applying for Director
)
```

---

## Structural Gap Categories

| Category           | Example                           | Fixable? |
| ------------------ | --------------------------------- | -------- |
| `years_experience` | "7+ years required, 3 shown"      | ❌ No    |
| `leadership`       | "Team management required"        | ❌ No    |
| `budget_ownership` | "$1M+ budget required"            | ❌ No    |
| `scope_level`      | "Director scope, mid-level shown" | ❌ No    |
| `domain_expertise` | "B2B SaaS required"               | ❌ No    |
| `technical_depth`  | "Advanced ML required"            | ❌ No    |

---

## The Upsell Flow

```
1. User runs analysis
2. System detects role mismatch
3. Show honest assessment + dignity statement
4. Show 2 eligible role previews (free)
5. "See all X roles" → /pricing (Pro upsell)
6. Pro users see full list + growth paths + search terms
```

This is ethical because:

- We're not selling false hope
- We're providing genuine value (career guidance)
- The upsell is helpful, not salesy

---

## Verdicts Explained

| Verdict         | When                     | Action                      |
| --------------- | ------------------------ | --------------------------- |
| `strong_fit`    | Gaps are expressive only | Normal optimization flow    |
| `moderate_fit`  | Minor structural gaps    | Optimize + acknowledge gaps |
| `stretch_role`  | Significant stretch      | Warn + show backup roles    |
| `role_mismatch` | Structural mismatch      | Stop optimization, redirect |

---

## UI States

### Strong Fit (score 75+, no structural gaps)

- Don't show RoleFitAssessment
- Normal optimization flow

### Moderate Fit (some gaps, achievable)

- Blue info banner
- Show what's achievable with optimization

### Stretch Role (significant gaps)

- Amber warning banner
- Show eligible roles as backup
- Still show optimization tips

### Role Mismatch (structural mismatch)

- Red alert banner
- Dignity statement
- Focus on eligible roles (the pivot)
- Minimal/no optimization suggestions

---

## Copy/Messaging

### Dignity Statement (critical)

> "This does not reflect negatively on your background — it indicates that the role is designed for a more senior profile. Your experience is valuable for roles that match your current level."

### Upsell CTA

> "See all [X] eligible roles" + "Plus skills matched and career growth paths"

### Growth Path Framing

> "These roles position you for progression toward [Target Role] in 1-2 years."

---

## Testing Scenarios

1. **Entry → Senior Manager**: Should trigger mismatch
2. **Mid → Senior**: Should trigger stretch, show as achievable
3. **Senior → Senior (different domain)**: Should show domain gap
4. **Strong match**: Should not show RoleFitAssessment at all

---

## Why This Matters

Most tools avoid honesty. They keep suggesting optimization because:

- It drives engagement
- It feels helpful
- It avoids uncomfortable truths

This approach is different:

- Builds genuine trust
- Creates loyal users ("finally, honesty!")
- Converts on value, not anxiety
- Differentiates from competitors

**The insight:** When the answer isn't "optimize," the answer is "redirect." That's rare — and powerful.
