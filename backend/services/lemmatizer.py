# lemmatizer.py
import json
import os

class MalagasyLemmatizer:
    
    def __init__(self):
        base_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'dataset')
        dict_path = os.path.join(base_path, 'lexiques', 'dictionnaire_mg.json')
        
        with open(dict_path, 'r', encoding='utf-8') as f:
            self.dictionary = set(json.load(f))
    
    def in_dict(self, word):
        return word in self.dictionary
    
    def lemmatize(self, word):
        word = word.lower().strip()
        original = word
        candidates = []
        
        if word.startswith('mp'):
            reste = word[2:]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('mamp'):
            reste = word[4:]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('maha'):
            reste = word[4:]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('mi') and len(word) > 4:
            reste = word[2:]
            if self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('mam') and len(word) > 5:
            reste = word[3:]
            if self.in_dict(reste):
                candidates.append((reste, 95))
        
        if word.startswith('voa'):
            reste = word[3:]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('tafa'):
            reste = word[4:]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('fi') and word.endswith('vana'):
            reste = word[2:-4]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('fi') and word.endswith('ana'):
            reste = word[2:-3]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 95))
        
        if word.startswith('fan') and word.endswith('ana'):
            reste = word[3:-3]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('fan') and word.endswith('na'):
            reste = word[3:-2]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 95))
        
        if word.startswith('faha') and word.endswith('na'):
            reste = word[4:-2]
            if len(reste) >= 2 and self.in_dict(reste):
                candidates.append((reste, 100))
        
        if word.startswith('man'):
            reste = word[3:]
            for lettre in ['s', 't', 'k', 'h', 'f', 'p']:
                test = lettre + reste
                if self.in_dict(test):
                    candidates.append((test, 100))
                for suf in ['ana', 'ina', 'na', 'tra']:
                    if test.endswith(suf):
                        test2 = test[:-len(suf)]
                        if len(test2) >= 2 and self.in_dict(test2):
                            candidates.append((test2, 90))
        
        if word.startswith('man') and len(word) > 5:
            reste = word[3:]
            if self.in_dict(reste):
                candidates.append((reste, 85))
        
        if word.endswith('ana') and len(word) > 5:
            reste = word[:-3]
            if self.in_dict(reste):
                candidates.append((reste, 80))
        
        if word.endswith('ina') and len(word) > 5:
            reste = word[:-3]
            if self.in_dict(reste):
                candidates.append((reste, 80))
        
        if word.endswith('tra') and len(word) > 5:
            reste = word[:-3]
            if self.in_dict(reste):
                candidates.append((reste, 80))
        
        if candidates:
            candidates.sort(key=lambda x: x[1], reverse=True)
            return {"word": original, "lemma": candidates[0][0], "found": True}
        
        return {"word": original, "lemma": original, "found": self.in_dict(word)}


# === INSTANCE GLOBALE ===
_lem = MalagasyLemmatizer()

def get_racine(mot):
    """Retourne la racine d'un mot"""
    return _lem.lemmatize(mot)["lemma"]

def mot_existe(mot):
    """Vérifie si mot existe dans dictionnaire"""
    return _lem.in_dict(mot.lower())

def analyser_phrase(phrase):
    """Analyse tous les mots d'une phrase"""
    resultats = []
    for mot in phrase.split():
        r = _lem.lemmatize(mot)
        resultats.append(r)
    return resultats


# === TEST ===
if __name__ == "__main__":
    print("=== Test racines ===")
    mots = ["manoratra", "miasa", "fitiavana", "mpianatra", "tsara"]
    for m in mots:
        print(f"  {m} → {get_racine(m)}")
    
    print("\n=== Test existence ===")
    for m in ["tsara", "xyz", "teny"]:
        print(f"  {m}: {'✓' if mot_existe(m) else '✗'}")
    
    print("\n=== Test phrase ===")
    for r in analyser_phrase("Ny mpianatra dia miasa"):
        print(f"  {r['word']} → {r['lemma']}")
