from nltk import ngrams
from collections import Counter

with open("data/corpus.txt", encoding="utf-8") as f:
    tokens = f.read().lower().split()

bigrams = Counter(ngrams(tokens, 2))

def predict_next(word):
    return list({
        w2 for (w1, w2), _ in bigrams.items()
        if w1 == word
    })[:5]
