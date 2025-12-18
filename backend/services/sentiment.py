import os
import json
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sentiment_path = os.path.join(
    BASE_DIR, "..", "data", "dataset", "lexiques", "sentiment.json"
)

POS = set()
NEG = set()

# Charger le fichier JSON correctement
if os.path.exists(sentiment_path):
    with open(sentiment_path, encoding="utf-8") as f:
        data = json.load(f)
        POS = set(data.get("positive", []))
        NEG = set(data.get("negative", []))
        INTENSIFIERS = set(data["intensifiers"])
        NEGATORS = set(data["negators"])
else:
    print(f"⚠️ Fichier introuvable : {sentiment_path}")


def analyze(text):
    if not text:
        return {"sentiment": "Neutre", "score": 0}

    text_lower = text.lower()
    score = 0

    # d'abord les expressions positives
    for phrase in POS:
        if phrase in text_lower:
            score += 1

    # expressions négatives
    for phrase in NEG:
        if phrase in text_lower:
            score -= 1

    # gérer les intensificateurs simples (facultatif)
    words = re.findall(r"[a-zà-ÿ]+", text_lower)
    last_sentiment = 0
    for w in words:
        if w in INTENSIFIERS:
            score += last_sentiment  # renforce le mot précédent

    if score > 0:
        sentiment = "Positif"
    elif score < 0:
        sentiment = "Négatif"
    else:
        sentiment = "Neutre"

    return {"sentiment": sentiment, "score": score}
