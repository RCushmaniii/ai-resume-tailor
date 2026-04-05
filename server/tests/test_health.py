"""Tests for /api/health endpoint."""


def test_health_returns_200(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"


def test_health_includes_version(client):
    response = client.get("/api/health")
    data = response.get_json()
    assert "version" in data
    assert isinstance(data["version"], str)
