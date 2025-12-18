from flask import Blueprint, request, jsonify

bp = Blueprint("autocomplete", __name__)

@bp.route("/autocomplete", methods=["POST"])
def autocomplete():
    """POST /api/autocomplete
    Expects JSON {"prefix": "..."}
    Returns suggestions (placeholder)
    """
    data = request.get_json(silent=True) or {}
    prefix = data.get("prefix", "")
    return jsonify({"prefix": prefix, "suggestions": []})
