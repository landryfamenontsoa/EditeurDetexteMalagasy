# organize.py
import shutil
import os

# Structure cible
folders = [
    "dataset/corpus",
    "dataset/lexiques", 
    "dataset/rules",
    "dataset/stats"
]

# Créer dossiers
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"📁 Créé: {folder}")

# Déplacer fichiers
moves = [
    # Corpus
    ("articles_raw.json", "dataset/corpus/"),
    ("articles_clean.json", "dataset/corpus/"),
    ("sentences.txt", "dataset/corpus/"),
    
    # Lexiques
    ("dictionnaire_mg.json", "dataset/lexiques/"),
    ("stopwords_mg.txt", "dataset/lexiques/"),
    ("sentiment.json", "dataset/lexiques/"),
    ("ner_gazetteer.json", "dataset/lexiques/"),
    ("lemmatizer_rules.json", "dataset/lexiques/"),
    
    # Rules
    ("phonotactics.json", "dataset/rules/"),
    
    # Stats
    ("word_frequencies.json", "dataset/stats/"),
    ("ngrams.json", "dataset/stats/"),
]

print("\n📦 Déplacement des fichiers...")

for src, dest in moves:
    if os.path.exists(src):
        shutil.move(src, dest + src)
        print(f"  ✓ {src} → {dest}")
    else:
        print(f"  ✗ {src} (non trouvé)")

print("\n✅ Organisation terminée!")
print("""
📁 dataset/
├── corpus/
│   ├── articles_raw.json
│   ├── articles_clean.json
│   └── sentences.txt
├── lexiques/
│   ├── dictionnaire_mg.json
│   ├── stopwords_mg.txt
│   ├── sentiment.json
│   ├── ner_gazetteer.json
│   └── lemmatizer_rules.json
├── rules/
│   └── phonotactics.json
└── stats/
    ├── word_frequencies.json
    └── ngrams.json
""")