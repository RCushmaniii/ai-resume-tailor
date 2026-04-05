"""Tests for /api/analyze input validation.

These test the validation logic BEFORE the OpenAI call, so no mocking needed.
"""

import json


def test_analyze_no_data(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({}),
        content_type="application/json",
    )
    assert response.status_code == 400
    data = response.get_json()
    assert data["error_code"] == "ANALYZE_NO_DATA"


def test_analyze_empty_resume(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({"resume": "", "job_description": "Software engineer role"}),
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["error_code"] == "ANALYZE_RESUME_REQUIRED"


def test_analyze_empty_job(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({"resume": "A" * 200, "job_description": ""}),
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["error_code"] == "ANALYZE_JOB_REQUIRED"


def test_analyze_resume_too_short(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({"resume": "short", "job_description": "A" * 100}),
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["error_code"] == "ANALYZE_RESUME_TOO_SHORT"


def test_analyze_job_too_short(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({"resume": "A" * 200, "job_description": "short"}),
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["error_code"] == "ANALYZE_JOB_TOO_SHORT"


def test_analyze_resume_too_long(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({"resume": "A" * 16000, "job_description": "A" * 100}),
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["error_code"] == "ANALYZE_RESUME_TOO_LONG"


def test_analyze_suspicious_content(client):
    response = client.post(
        "/api/analyze",
        data=json.dumps({
            "resume": "<script>alert('xss')</script>" + "A" * 200,
            "job_description": "A" * 100,
        }),
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["error_code"] == "ANALYZE_RESUME_SUSPICIOUS"
