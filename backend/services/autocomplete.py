import json
import re
from collections import Counter, defaultdict
from nltk import ngrams

# Charger et nettoyer le corpus
corpus_path = "data/dataset/corpus/articles_clean.json"

with open(corpus_path, encoding="utf-8") as f:
    text = f.read().lower()
    # Supprime les caractères non alphabétiques (garde les espaces)
    text = re.sub(r"[^a-zà-ÿ\s]+", "", text)
    tokens = text.split()

# Construire les bigrammes et compter leurs occurrences
bigrams = list(ngrams(tokens, 2))
bigram_counts = Counter(bigrams)

# Construire un dictionnaire {mot: [(mot_suivant, fréquence), ...]}
next_words = defaultdict(list)
for (w1, w2), count in bigram_counts.items():
    next_words[w1].append((w2, count))

# Trier chaque liste par fréquence décroissante
for w1 in next_words:
    next_words[w1].sort(key=lambda x: x[1], reverse=True)

# Fonction de prédiction
def predict_next(word, n=5):
    word = word.lower()
    if word not in next_words:
        return []
    # Retourner les n mots les plus fréquents après le mot
    return [w for w, _ in next_words[word][:n]]
