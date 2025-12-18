from flask import Blueprint, request, jsonify

bp = Blueprint("translation", __name__)

@bp.route("/translate", methods=["POST"])
def translate():
    """POST /api/translate
    Expects JSON {"text": "...", "target_lang": "fr"}
    """
    data = request.get_json(silent=True) or {}
    return jsonify({"translated": "", "source": data})
