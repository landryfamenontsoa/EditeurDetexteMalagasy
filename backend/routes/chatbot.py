from flask import Blueprint, request, jsonify

bp = Blueprint("chatbot", __name__)

@bp.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    return jsonify({"reply": "", "message": message})
