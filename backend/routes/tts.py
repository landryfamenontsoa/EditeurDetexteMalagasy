from flask import Blueprint, request, jsonify

bp = Blueprint("tts", __name__)

@bp.route("/text-to-speech", methods=["POST"])
def tts():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    return jsonify({"audio_base64": ""})
