# routes/spell_check.py
from flask import Blueprint, request, jsonify
from services.spell_checker import SpellChecker
from rapidfuzz import process, fuzz

# Instance globale
spell_checker = SpellChecker()

bp = Blueprint("spell_check", __name__)

@bp.route("/spell-check", methods=["POST"])
def spell_check_route():
    data = request.get_json() or {}
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "Texte vide", "corrections": []}), 400

    corrections = spell_checker.check_text(text)

    return jsonify({
        "original": text,
        "corrections": corrections,
        "word_count": len(text.split()),
        "error_count": len(corrections)
    })
