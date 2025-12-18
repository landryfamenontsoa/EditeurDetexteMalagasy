import re

FORBIDDEN = r"(nb|mk|dt|bp|sz)"

def validate_word(word):
    if re.search(FORBIDDEN, word):
        return {
            "word": word,
            "valid": False,
            "reason": "Combinaison interdite en malagasy"
        }
    return {"word": word, "valid": True}
