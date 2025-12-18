from services.knowledge_graph import build_graph, find_related, detect_entities
from app import create_app


def test_build_graph():
    g = build_graph()
    assert 'nodes' in g and 'adj' in g
    assert isinstance(g['nodes'], dict)


def test_find_related_simple():
    # using sample ontology, antananarivo -> tanana (is_a) should be related
    res = find_related('antananarivo', depth=1, limit=5)
    assert any(r['id'] == 'tanana' for r in res)


def test_detect_entities():
    ents = detect_entities('Mivahiny eto Antananarivo aho')
    assert any(e['id'] == 'antananarivo' for e in ents)


def test_semantic_route():
    app = create_app()
    client = app.test_client()
    r = client.post('/api/semantic-suggest', json={'text': 'Antananarivo', 'depth': 1})
    assert r.status_code == 200
    data = r.get_json()
    assert 'suggestions' in data


def test_semantic_reload_route():
    app = create_app()
    client = app.test_client()
    r = client.post('/api/semantic-reload')
    assert r.status_code == 200
    data = r.get_json()
    assert 'nodes' in data and 'adj' in data

