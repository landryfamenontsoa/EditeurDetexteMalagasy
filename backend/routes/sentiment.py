from flask import Blueprint, request, jsonify
from services.sentiment import analyze

bp = Blueprint("sentiment", __name__)

@bp.route("/sentiment", methods=["POST"])
def sentiment():
    data = request.get_json(silent=True) or {}
    text = data.get("text") or data.get("prefix") or ""
    print(text)

    return jsonify(analyze(text))