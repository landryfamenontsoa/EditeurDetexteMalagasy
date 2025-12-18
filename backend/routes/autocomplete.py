from flask import Blueprint, request, jsonify

from services.autocompleter import suggest

bp = Blueprint("autocomplete", __name__)


@bp.route("/autocomplete", methods=["POST"])
def autocomplete():
    """POST /api/autocomplete

    Accepts JSON body {"text": "...", "limit": 6} or {"prefix": "..."}.
    Returns {"text": "...", "suggestions": [{"word":...,"score":...}, ...]}
    """
    data = request.get_json(silent=True) or {}
    text = data.get("text") or data.get("prefix") or ""
    limit = int(data.get("limit", 6))

    suggestions = suggest(text, limit=limit)

    return jsonify({"text": text, "suggestions": suggestions})
