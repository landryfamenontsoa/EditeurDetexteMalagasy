from flask import Blueprint, request, jsonify

bp = Blueprint("semantic", __name__)

@bp.route("/semantic-suggest", methods=["POST"])
def semantic_suggest():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    return jsonify({"suggestions": []})
