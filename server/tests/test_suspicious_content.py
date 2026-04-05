"""Tests for suspicious content detection."""

from app import contains_suspicious_content


def test_script_tag_detected():
    assert contains_suspicious_content("<script>alert('xss')</script>") is True


def test_event_handler_detected():
    assert contains_suspicious_content('onclick=evil()') is True


def test_iframe_detected():
    assert contains_suspicious_content('<iframe src="http://evil.com">') is True


def test_eval_detected():
    assert contains_suspicious_content('eval("malicious code")') is True


def test_clean_text_passes():
    resume = (
        "Software Engineer with 5 years of experience in Python, React, and AWS. "
        "Led a team of 8 engineers to deliver a microservices platform."
    )
    assert contains_suspicious_content(resume) is False
