from flask import Blueprint, request, jsonify

bp = Blueprint("sentiment", __name__)

@bp.route("/sentiment", methods=["POST"])
def sentiment():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    return jsonify({"polarity": 0.0, "score": 0.0, "text": text})
