from flask import Blueprint, request, jsonify

bp = Blueprint("phonotactic", __name__)

@bp.route("/phonotactic-check", methods=["POST"])
def phonotactic_check():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    return jsonify({"valid": True, "issues": []})
