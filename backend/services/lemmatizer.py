# services/lemmatizer.py

# Exemple de dictionnaire de lemmes (très simple)
LEMMAS = {
    "manges": "manger",
    "mangeons": "manger",
    "mangé": "manger",
    "fais": "faire",
    "fait": "faire",
    "faisons": "faire"
}

def lemmatize(word):
    """
    Retourne la forme canonique (lemme) d'un mot.
    Si le mot n'est pas trouvé, retourne le mot lui-même.
    """
    if not word:
        return {"word": word, "lemma": None}
    
    lemma = LEMMAS.get(word, word)  # Si pas trouvé, retourne le mot original
    return {"word": word, "lemma": lemma}
