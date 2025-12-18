import re

# Consonnes et voyelles malgaches
CONSONNES = "b|d|f|g|h|j|k|l|m|n|p|r|s|t|v|z|ts|tr|dr"  # inclure clusters comme "ts"
VOYELLES = "a|e|i|o|u"

# Regex pour vérifier le mot entier : séquences syllabiques malgaches
SYLLABLE_REGEX = re.compile(
    r'^(({c})?({v})({c})?)+$'.format(c=CONSONNES, v=VOYELLES),
    re.IGNORECASE
)

def check_phonotactics(word):
    errors = []
    if not word:
        return {"valid": False, "errors": ["Mot vide"]}

    # Nettoyer le mot
    word_clean = word.lower().replace("-", "").replace("'", "")

    # Vérifier la structure syllabique
    if not SYLLABLE_REGEX.match(word_clean):
        errors.append("Structure du mot invalide (syllabes non conformes)")

    return {"valid": len(errors) == 0, "errors": errors}


# Tests rapides
if __name__ == "__main__":
    mots = ["tsara", "tonga-lafatra", "fahafatesana", "xyz"]
    for mot in mots:
        print(mot, check_phonotactics(mot))
