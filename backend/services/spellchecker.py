import os
from rapidfuzz import process

# Construire le chemin absolu du fichier dictionary.txt
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dictionary_path = os.path.join(BASE_DIR, "..", "data", "dictionary.txt")

# Charger le dictionnaire
try:
    with open(dictionary_path, encoding="utf-8") as f:
        DICTIONARY = [w.strip() for w in f if w.strip()]
except FileNotFoundError:
    print(f"Erreur : le fichier {dictionary_path} n'existe pas !")
    DICTIONARY = []

def check_word(word):
    if not word:  # vérifie si word est None ou vide
        return {"word": word, "correct": False, "suggestion": None, "confidence": 0}

    if word in DICTIONARY:
        return {"word": word, "correct": True}

    result = process.extractOne(word, DICTIONARY)
    if result is None:  # aucun mot trouvé
        return {"word": word, "correct": False, "suggestion": None, "confidence": 0}

    suggestion, score, _ = result
    return {
        "word": word,
        "correct": False,
        "suggestion": suggestion,
        "confidence": score
    }
