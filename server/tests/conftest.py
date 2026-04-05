import pytest
import os

# Set test env vars before importing app — these prevent validate_env() from exiting
os.environ.setdefault("OPENAI_API_KEY", "sk-test-fake-key")
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost/test")
os.environ.setdefault("FLASK_ENV", "development")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")

from app import app as flask_app, limiter


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Disable rate limiting during tests to avoid false 429s."""
    limiter.enabled = False
    yield
    limiter.enabled = True


@pytest.fixture
def app():
    flask_app.config["TESTING"] = True
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()
