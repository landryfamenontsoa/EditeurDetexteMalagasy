from flask import Blueprint, request, jsonify

bp = Blueprint("lemmatization", __name__)

@bp.route("/lemmatize", methods=["POST"])
def lemmatize():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    return jsonify({"lemmas": [], "original": text})
