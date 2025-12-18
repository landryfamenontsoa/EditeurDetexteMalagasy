from app import create_app


def test_index():
    app = create_app()
    client = app.test_client()
    r = client.get("/")
    assert r.status_code == 200
    data = r.get_json()
    assert data["status"] == "ok"


def test_spell_check_empty():
    app = create_app()
    client = app.test_client()
    r = client.post("/api/spell-check", json={"text": ""})
    assert r.status_code == 200
    data = r.get_json()
    assert "original" in data


if __name__ == "__main__":
    test_index()
    test_spell_check_empty()
    print("Smoke tests passed")
