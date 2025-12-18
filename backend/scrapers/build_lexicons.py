# build_lexicons.py
import json
import re
from collections import Counter, defaultdict

# ============================================
# CHARGEMENT
# ============================================

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_text(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read()

def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 {filename}")

def save_text(lines, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"💾 {filename}")

# ============================================
# CONSTRUCTION N-GRAMS
# ============================================

def build_ngrams(sentences_file):
    """Construit bigrams et trigrams pour autocomplétion"""
    
    print("📊 Construction des n-grams...")
    
    text = load_text(sentences_file)
    sentences = text.strip().split('\n')
    
    bigrams = defaultdict(int)
    trigrams = defaultdict(int)
    
    for sentence in sentences:
        words = sentence.lower().split()
        
        # Bigrams
        for i in range(len(words) - 1):
            key = f"{words[i]} {words[i+1]}"
            bigrams[key] += 1
        
        # Trigrams
        for i in range(len(words) - 2):
            key = f"{words[i]} {words[i+1]} {words[i+2]}"
            trigrams[key] += 1
    
    # Trier par fréquence
    bigrams_sorted = dict(sorted(bigrams.items(), key=lambda x: -x[1])[:3000])
    trigrams_sorted = dict(sorted(trigrams.items(), key=lambda x: -x[1])[:2000])
    
    print(f"  ✓ {len(bigrams_sorted)} bigrams")
    print(f"  ✓ {len(trigrams_sorted)} trigrams")
    
    return {
        "bigrams": bigrams_sorted,
        "trigrams": trigrams_sorted
    }

# ============================================
# DONNÉES STATIQUES
# ============================================

STOPWORDS = [
    "ny", "sy", "dia", "ary", "fa", "izany", "izy", "amin",
    "ho", "tsy", "na", "ka", "ao", "an", "eo", "io", "ireo",
    "mba", "koa", "ve", "raha", "toy", "sady", "nefa", "aza",
    "izay", "inona", "aiza", "oviana", "iza", "nahoana", "ahoana",
    "ity", "iny", "ireto", "ireny", "izao", "no", "i", "ry",
    "tamin", "tao", "any", "eny", "hatramin", "mandritra"
]

SENTIMENT_POSITIVE = [
    "tsara", "mahafinaritra", "mahafaly", "mahagaga", "hendry",
    "tia", "fitiavana", "fiadanana", "fahasalamana", "fanantenana",
    "fahombiazana", "fahasambarana", "kanto", "soa", "marina",
    "matotra", "mahery", "mazava", "madio", "sambatra", "faly",
    "mahay", "malaza", "be", "lehibe", "tsara", "tonga lafatra"
]

SENTIMENT_NEGATIVE = [
    "ratsy", "mafy", "sarotra", "malahelo", "tezitra",
    "marary", "maty", "fahafatesana", "fahoriana", "tahotra",
    "henatra", "fahavoazana", "loza", "olana", "mahantra",
    "maloto", "haizina", "diso", "meloka", "mampalahelo",
    "fadiranovana", "mosary", "ady", "faharavana"
]

CITIES = [
    "Antananarivo", "Toamasina", "Antsirabe", "Mahajanga",
    "Fianarantsoa", "Toliara", "Antsiranana", "Manakara",
    "Ambositra", "Morondava", "Nosy Be", "Sambava", "Antalaha",
    "Ambanja", "Farafangana", "Mananjary", "Maintirano",
    "Ambatondrazaka", "Moramanga", "Tsiroanomandidy"
]

REGIONS = [
    "Analamanga", "Vakinankaratra", "Itasy", "Bongolava",
    "Boeny", "Sofia", "Betsiboka", "Melaky", "Alaotra-Mangoro",
    "Atsinanana", "Analanjirofo", "Atsimo-Andrefana", "Androy",
    "Anosy", "Menabe", "Ihorombe", "Amoron'i Mania", "Haute Matsiatra",
    "Vatovavy", "Fitovinany", "Diana", "Sava"
]

PREFIXES = [
    "mamp", "mank", "man", "mah", "mi", "mam", "mana", "manka",
    "tafa", "voa", "a", "an", "ank", "amp", "if", "faha", "famp",
    "fan", "fank", "fi", "mp"
]

SUFFIXES = [
    "ana", "ina", "aina", "na", "tra", "ka", "ny", "ntsika",
    "nareo", "ny", "ko", "nao", "ny"
]

INVALID_PATTERNS = [
    "nb", "mk", "np", "mt", "nk", "ng", "pm", "pn", "bm", "bn",
    "ck", "cz", "cx", "qw", "wx", "xz"
]

# ============================================
# MAIN
# ============================================

def main():
    print("="*50)
    print("🇲🇬 CONSTRUCTION DES LEXIQUES")
    print("="*50 + "\n")
    
    # N-grams
    ngrams = build_ngrams("sentences.txt")
    save_json(ngrams, "ngrams.json")
    
    # Stopwords
    save_text(STOPWORDS, "stopwords_mg.txt")
    
    # Sentiment
    sentiment = {
        "positive": SENTIMENT_POSITIVE,
        "negative": SENTIMENT_NEGATIVE,
        "intensifiers": ["tena", "dia", "tokoa", "mihitsy", "tanteraka"],
        "negators": ["tsy", "aza", "tsia", "sanatria"]
    }
    save_json(sentiment, "sentiment.json")
    
    # NER Gazetteer
    ner = {
        "cities": CITIES,
        "regions": REGIONS,
        "titles": ["Andriamatoa", "Ramatoa", "Ingahy", "Raiamandreny", "Tompoko"],
        "org_keywords": ["Fikambanana", "Antoko", "Orinasa", "Banky", "Sekoly", "Hopitaly"]
    }
    save_json(ner, "ner_gazetteer.json")
    
    # Règles lemmatisation
    lemma_rules = {
        "prefixes": PREFIXES,
        "suffixes": SUFFIXES,
        "rules": [
            {"pattern": "^mamp", "remove": "mamp", "type": "causatif"},
            {"pattern": "^man", "remove": "man", "type": "actif"},
            {"pattern": "^mi", "remove": "mi", "type": "actif"},
            {"pattern": "^maha", "remove": "maha", "type": "potentiel"},
            {"pattern": "^tafa", "remove": "tafa", "type": "passif"},
            {"pattern": "^voa", "remove": "voa", "type": "passif"},
            {"pattern": "ana$", "remove": "ana", "type": "suffixe"},
            {"pattern": "ina$", "remove": "ina", "type": "suffixe"}
        ]
    }
    save_json(lemma_rules, "lemmatizer_rules.json")
    
    # Règles phonotactiques
    phonotactics = {
        "invalid_combinations": INVALID_PATTERNS,
        "valid_endings": ["a", "y", "o", "e", "i", "na", "ny", "tra", "ka"],
        "invalid_endings": ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "p", "q", "r", "s", "t", "v", "w", "x", "z"],
        "vowels": ["a", "e", "i", "o"],
        "consonants": ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "z"]
    }
    save_json(phonotactics, "phonotactics.json")
    
    # Stats finales
    word_freq = load_json("word_frequencies.json")
    dictionary = load_json("dictionnaire_mg.json")
    
    print(f"\n{'='*50}")
    print("✅ LEXIQUES CRÉÉS")
    print(f"{'='*50}")
    print(f"""
📁 Fichiers générés:
  • dictionnaire_mg.json   ({len(dictionary)} mots)
  • word_frequencies.json  (fréquences)
  • ngrams.json           ({len(ngrams['bigrams'])} bigrams, {len(ngrams['trigrams'])} trigrams)
  • stopwords_mg.txt      ({len(STOPWORDS)} mots)
  • sentiment.json        (positif/négatif)
  • ner_gazetteer.json    (villes, régions)
  • lemmatizer_rules.json (préfixes/suffixes)
  • phonotactics.json     (règles orthographe)
  
🎯 Prêt pour le backend!
""")


if __name__ == "__main__":
    main()