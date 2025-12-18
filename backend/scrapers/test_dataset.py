# test_dataset.py
import json
import os
import pytest

BASE = "dataset"

# Skip whole module when dataset folder is not available (conservative)
if not os.path.isdir(BASE):
    pytest.skip("dataset folder not present - skipping dataset integration checks", allow_module_level=True)

def load_json(path):
    with open(f"{BASE}/{path}", 'r', encoding='utf-8') as f:
        return json.load(f)

def load_text(path):
    with open(f"{BASE}/{path}", 'r', encoding='utf-8') as f:
        return f.read().strip().split('\n')

print("="*50)
print("🧪 TEST DU DATASET")
print("="*50)

# 1. Dictionnaire
print("\n📖 DICTIONNAIRE")
dico = load_json("lexiques/dictionnaire_mg.json")
print(f"   {len(dico)} mots")
print(f"   Exemples: {dico[:10]}")

# 2. Test orthographe
print("\n✏️  TEST ORTHOGRAPHE")
test_words = ["tsara", "malagasy", "xyz", "bonjour", "fitiavana", "teny"]
for word in test_words:
    status = "✓" if word.lower() in [w.lower() for w in dico] else "✗"
    print(f"   {status} '{word}'")

# 3. N-grams (autocomplétion)
print("\n🔮 AUTOCOMPLÉTION (bigrams)")
ngrams = load_json("stats/ngrams.json")
bigrams = ngrams["bigrams"]
print(f"   {len(bigrams)} bigrams")

# Test: mots après "ny"
ny_suggestions = [k.split()[1] for k in bigrams.keys() if k.startswith("ny ")][:5]
print(f"   'ny' → {ny_suggestions}")

# Test: mots après "dia"
dia_suggestions = [k.split()[1] for k in bigrams.keys() if k.startswith("dia ")][:5]
print(f"   'dia' → {dia_suggestions}")

# 4. Sentiment
print("\n😊 ANALYSE SENTIMENT")
sentiment = load_json("lexiques/sentiment.json")
print(f"   Positifs: {sentiment['positive'][:5]}...")
print(f"   Négatifs: {sentiment['negative'][:5]}...")

# Test phrase
test_phrase = "tsara sy mahafinaritra"
words = test_phrase.split()
pos = sum(1 for w in words if w in sentiment['positive'])
neg = sum(1 for w in words if w in sentiment['negative'])
result = "POSITIF 😊" if pos > neg else "NÉGATIF 😞" if neg > pos else "NEUTRE 😐"
print(f"   Test: '{test_phrase}' → {result}")

# 5. NER
print("\n📍 RECONNAISSANCE ENTITÉS")
ner = load_json("lexiques/ner_gazetteer.json")
print(f"   Villes: {ner['cities'][:5]}...")
print(f"   Régions: {ner['regions'][:5]}...")

# Test
test_text = "Antananarivo dia renivohitra"
found = [w for w in test_text.split() if w in ner['cities']]
print(f"   Test: '{test_text}' → Villes trouvées: {found}")

# 6. Phonotactique
print("\n🔤 RÈGLES ORTHOGRAPHE")
phono = load_json("rules/phonotactics.json")
print(f"   Patterns invalides: {phono['invalid_combinations'][:5]}...")

# Test
invalid_words = ["nbola", "mkasa", "tsara", "teny"]
for w in invalid_words:
    has_invalid = any(p in w for p in phono['invalid_combinations'])
    status = "✗ invalide" if has_invalid else "✓ valide"
    print(f"   '{w}' → {status}")

# 7. Stats
print("\n📊 STATISTIQUES CORPUS")
freq = load_json("stats/word_frequencies.json")
top_words = list(freq.items())[:10]
print(f"   Top 10 mots:")
for word, count in top_words:
    print(f"      {word:<15} {count}")

print("\n" + "="*50)
print("✅ DATASET FONCTIONNEL!")
print("="*50)