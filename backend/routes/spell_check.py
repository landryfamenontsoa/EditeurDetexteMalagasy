# routes/spell_check.py
from flask import Blueprint, request, jsonify
from services.spellchecker import check_word

bp = Blueprint("spell_check", __name__)

@bp.route("/spellcheck", methods=["GET"])
def spell_check_route():
    word = request.args.get("word")

    if not word:
        return jsonify({"error": "Texte vide", "corrections": []}), 400

    return jsonify(check_word(word))
