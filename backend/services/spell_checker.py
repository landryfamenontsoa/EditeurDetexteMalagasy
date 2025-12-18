# /services/spell_checker.py

import json
# from rapidfuzz import fuzz, process

class SpellChecker:
    def __init__(self, dict_path="data/malagasy_dict.json"):
        self.valid_words = set()
        self.load_dictionary(dict_path)
    
    def load_dictionary(self, path):
        """Charger le dictionnaire"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.valid_words = set(data.get('words', []))
            print(f"✓ Dictionnaire chargé: {len(self.valid_words)} mots")
        except FileNotFoundError:
            print("⚠ Dictionnaire non trouvé - utilisation mode minimal")
            self.valid_words = {"ny", "dia", "ary", "izaho", "ianao"}
    
    def check_word(self, word):
        """Vérifier si un mot est valide"""
        return word.lower() in self.valid_words
    
    def get_suggestions(self, word, limit=5):
        """Obtenir des suggestions pour un mot incorrect"""
        if not self.valid_words:
            return []
        
        # Utiliser rapidfuzz pour trouver les mots similaires
        matches = process.extract(
            word.lower(), 
            list(self.valid_words), 
            scorer=fuzz.ratio,
            limit=limit
        )
        return [match[0] for match in matches if match[1] > 60]
    
    def check_text(self, text):
        """Vérifier un texte complet"""
        import re
        words = re.findall(r'\b[a-zàâäéèêëïîôùûüÿñ]+\b', text.lower())
        corrections = []
        
        for word in words:
            if len(word) > 1 and not self.check_word(word):
                suggestions = self.get_suggestions(word)
                if suggestions:  # Seulement si on a des suggestions
                    corrections.append({
                        "word": word,
                        "suggestions": suggestions,
                        "position": text.lower().find(word)
                    })
        
        return corrections

# Instance globale
spell_checker = SpellChecker()