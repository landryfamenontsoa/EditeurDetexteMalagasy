from flask import Blueprint, request, jsonify

from services.knowledge_graph import find_related, detect_entities, reload_graph

bp = Blueprint("semantic", __name__)


@bp.route("/semantic-suggest", methods=["POST"])
def semantic_suggest():
    """POST /api/semantic-suggest

    Request body JSON:
      { "text": "...", "concept": "...", "depth": 1, "limit": 8 }

    If `text` is provided, server will try to detect entities and suggest related concepts.
    If `concept` is provided, it directly suggests related concepts.
    """
    data = request.get_json(silent=True) or {}
    text = data.get('text')
    concept = data.get('concept')
    depth = int(data.get('depth', 1))
    limit = int(data.get('limit', 8))

    if text:
        entities = detect_entities(text)
        if entities:
            # take first entity
            target = entities[0]['id']
        else:
            # fallback to text token
            target = text.strip().split()[0].lower() if text.strip() else ''
    elif concept:
        target = concept.lower()
    else:
        return jsonify({'error': 'text or concept required'}), 400

    suggestions = find_related(target, depth=depth, limit=limit)

    return jsonify({'target': target, 'suggestions': suggestions})


@bp.route("/semantic-reload", methods=["POST"])
def semantic_reload():
    """POST /api/semantic-reload — clear ontology cache and reload from disk (dev only)."""
    g = reload_graph()
    return jsonify({'nodes': len(g['nodes']), 'adj': len(g['adj'])})
 
