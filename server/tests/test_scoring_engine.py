"""Tests for the deterministic scoring engine.

These are the highest-value tests — pure logic with no network calls.
"""

from scoring_engine import calculate_score, ScoreInterpretation


def _make_req(text, tier, match_type, evidence=None):
    return {"text": text, "tier": tier, "match_type": match_type, "evidence": evidence}


def test_perfect_score_all_exact():
    reqs = [
        _make_req("Python", 1, "EXACT", "5 years Python"),
        _make_req("React", 1, "EXACT", "Built React apps"),
        _make_req("SQL", 2, "EXACT", "PostgreSQL"),
        _make_req("Docker", 3, "EXACT", "Docker containers"),
    ]
    result = calculate_score(reqs, required_years=5, candidate_years=5)
    assert result.score >= 85, f"Perfect matches should score high, got {result.score}"


def test_zero_score_no_matches():
    reqs = [
        _make_req("Python", 1, "NONE"),
        _make_req("React", 1, "NONE"),
        _make_req("SQL", 2, "NONE"),
    ]
    result = calculate_score(reqs, required_years=5, candidate_years=5)
    assert result.score <= 30, f"No matches should score very low, got {result.score}"


def test_hard_cap_missing_1_tier1():
    reqs = [
        _make_req("Python", 1, "EXACT", "5 years"),
        _make_req("React", 1, "NONE"),  # 1 missing critical
        _make_req("SQL", 2, "EXACT", "PostgreSQL"),
        _make_req("Docker", 2, "EXACT", "Docker"),
        _make_req("AWS", 3, "EXACT", "AWS"),
    ]
    result = calculate_score(reqs, required_years=5, candidate_years=5)
    assert result.score <= 75, f"Missing 1 tier-1 should cap at 75, got {result.score}"


def test_hard_cap_missing_2_tier1():
    reqs = [
        _make_req("Python", 1, "NONE"),
        _make_req("React", 1, "NONE"),
        _make_req("SQL", 2, "EXACT", "PostgreSQL"),
        _make_req("Docker", 2, "EXACT", "Docker"),
        _make_req("AWS", 3, "EXACT", "AWS"),
    ]
    result = calculate_score(reqs, required_years=5, candidate_years=5)
    assert result.score <= 60, f"Missing 2 tier-1 should cap at 60, got {result.score}"


def test_variant_match_gets_90_percent_credit():
    reqs_exact = [_make_req("JavaScript", 1, "EXACT", "JavaScript")]
    reqs_variant = [_make_req("JavaScript", 1, "VARIANT", "JS")]

    result_exact = calculate_score(reqs_exact, required_years=3, candidate_years=3)
    result_variant = calculate_score(reqs_variant, required_years=3, candidate_years=3)

    # VARIANT should earn 90% of what EXACT earns
    assert result_variant.tier1.earned == result_exact.tier1.earned * 0.9


def test_contextual_match_gets_75_percent_credit():
    reqs_exact = [_make_req("Python", 1, "EXACT", "Python")]
    reqs_ctx = [_make_req("Python", 1, "CONTEXTUAL", "scripting experience")]

    result_exact = calculate_score(reqs_exact, required_years=3, candidate_years=3)
    result_ctx = calculate_score(reqs_ctx, required_years=3, candidate_years=3)

    # Points are rounded to 1 decimal internally, so compare with tolerance
    expected = round(result_exact.tier1.earned * 0.75, 1)
    assert result_ctx.tier1.earned == expected


def test_experience_penalty_below_50_percent():
    reqs = [_make_req("Python", 1, "EXACT", "Python")]
    result = calculate_score(reqs, required_years=10, candidate_years=3)
    assert result.experience_adjustment < 0, "Should have negative adjustment"


def test_experience_bonus_exceeds_requirement():
    reqs = [_make_req("Python", 1, "EXACT", "Python")]
    result = calculate_score(reqs, required_years=5, candidate_years=10)
    assert result.experience_adjustment > 0, "Should have positive adjustment"


def test_score_is_deterministic():
    reqs = [
        _make_req("Python", 1, "EXACT", "5 years"),
        _make_req("React", 2, "VARIANT", "React.js"),
        _make_req("AWS", 3, "NONE"),
    ]
    result1 = calculate_score(reqs, required_years=5, candidate_years=4)
    result2 = calculate_score(reqs, required_years=5, candidate_years=4)
    assert result1.score == result2.score
    assert result1.raw_score == result2.raw_score


def test_score_interpretation_bands():
    # Strong match (85+)
    reqs = [_make_req("Python", 1, "EXACT", "yes") for _ in range(5)]
    result = calculate_score(reqs, required_years=5, candidate_years=5)
    assert result.interpretation == ScoreInterpretation.STRONG_MATCH.value

    # Poor fit (all NONE)
    reqs_none = [_make_req("X", 1, "NONE") for _ in range(5)]
    result_none = calculate_score(reqs_none, required_years=5, candidate_years=5)
    assert result_none.interpretation == ScoreInterpretation.POOR_FIT.value
