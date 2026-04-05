"""Tests for environment variable validation."""

import os
import pytest
from unittest.mock import patch


def test_validate_env_missing_openai_key_exits():
    env = {
        "DATABASE_URL": "postgresql://test:test@localhost/test",
        "FLASK_ENV": "development",
    }
    with patch.dict(os.environ, env, clear=True):
        with pytest.raises(SystemExit):
            # Re-import to trigger validation
            from config import validate_env
            validate_env()


def test_validate_env_missing_database_url_exits():
    env = {
        "OPENAI_API_KEY": "sk-test",
        "FLASK_ENV": "development",
    }
    with patch.dict(os.environ, env, clear=True):
        with pytest.raises(SystemExit):
            from config import validate_env
            validate_env()


def test_validate_env_all_required_present_passes():
    env = {
        "OPENAI_API_KEY": "sk-test",
        "DATABASE_URL": "postgresql://test:test@localhost/test",
        "FLASK_ENV": "development",
    }
    with patch.dict(os.environ, env, clear=True):
        from config import validate_env
        # Should not raise
        validate_env()


def test_validate_env_production_requires_frontend_url():
    env = {
        "OPENAI_API_KEY": "sk-test",
        "DATABASE_URL": "postgresql://test:test@localhost/test",
        "FLASK_ENV": "production",
        "CLERK_SECRET_KEY": "sk_test_clerk",
    }
    with patch.dict(os.environ, env, clear=True):
        with pytest.raises(SystemExit):
            from config import validate_env
            validate_env()
