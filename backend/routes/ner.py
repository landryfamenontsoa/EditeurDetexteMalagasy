from flask import Blueprint, request, jsonify

bp = Blueprint("ner", __name__)

@bp.route("/ner", methods=["POST"])
def ner():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    return jsonify({"entities": []})
