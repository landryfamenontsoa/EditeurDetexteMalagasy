"""Lightweight N-gram model used for next-word prediction.

Loads precomputed bigrams/trigrams from data and provides a simple
back-off probability prediction for next tokens.
"""
import json
import os
from collections import defaultdict
from functools import lru_cache
from typing import List, Tuple


class NGramModel:
    def __init__(self, ngrams_path: str = None):
        # Default path inside project data
        if ngrams_path is None:
            base = os.path.join(os.path.dirname(__file__), "..", "data", "dataset", "stats")
            ngrams_path = os.path.normpath(os.path.join(base, "ngrams.json"))

        self.bigrams = defaultdict(int)
        self.trigrams = defaultdict(int)
        self.unigrams = defaultdict(int)

        try:
            with open(ngrams_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for k, v in data.get("bigrams", {}).items():
                    # bigram key: 'w1 w2'
                    parts = k.split()
                    if len(parts) >= 2:
                        w1 = parts[0]
                        w2 = " ".join(parts[1:])
                        self.bigrams[w1][w2] if hasattr(self.bigrams[w1], 'update') else None
                    self.bigrams[k] = v

                for k, v in data.get("trigrams", {}).items():
                    self.trigrams[k] = v

            # Build helper maps
            self._build_maps()
        except Exception:
            # If file missing or invalid, keep empty maps
            self.bigrams = defaultdict(int)
            self.trigrams = defaultdict(int)
            self.unigrams = defaultdict(int)

    def _build_maps(self):
        # Build maps: bigram_map[w1] -> {w2: count}
        self.bigram_map = defaultdict(lambda: defaultdict(int))
        self.trigram_map = defaultdict(lambda: defaultdict(int))
        self.unigram_counts = defaultdict(int)

        for k, v in self.bigrams.items():
            parts = k.split()
            if len(parts) >= 2:
                w1 = parts[0]
                w2 = " ".join(parts[1:])
                self.bigram_map[w1][w2] += v
                self.unigram_counts[w2] += v

        for k, v in self.trigrams.items():
            parts = k.split()
            if len(parts) >= 3:
                w1 = parts[0]
                w2 = parts[1]
                w3 = " ".join(parts[2:])
                key = f"{w1} {w2}"
                self.trigram_map[key][w3] += v
                self.unigram_counts[w3] += v

    @lru_cache(maxsize=2048)
    def predict(self, context: Tuple[str, ...], prefix: str = "", limit: int = 6):
        """Predict next words given a context tuple (last tokens) and optional prefix.

        - context is tuple of tokens (lowercased)
        - prefix filters candidate words that start with the prefix
        Returns list of tuples (word, score) sorted by score desc.
        """
        candidates = defaultdict(float)

        # Try trigram (last two words) first
        if len(context) >= 2:
            key = f"{context[-2]} {context[-1]}"
            trig = self.trigram_map.get(key, {})
            total = sum(trig.values())
            if total:
                for w, c in trig.items():
                    if not prefix or w.startswith(prefix):
                        candidates[w] += c / total

        # Back-off to bigram (last word)
        if len(context) >= 1:
            key = context[-1]
            bi = self.bigram_map.get(key, {})
            total = sum(bi.values())
            if total:
                for w, c in bi.items():
                    if not prefix or w.startswith(prefix):
                        # If already present (from trigram), add smaller weight
                        candidates[w] += 0.6 * (c / total)

        # Back-off to unigram (most frequent words)
        if not candidates:
            total = sum(self.unigram_counts.values()) or 1
            for w, c in self.unigram_counts.items():
                if not prefix or w.startswith(prefix):
                    candidates[w] += 0.4 * (c / total)

        # Sort candidates
        ranked = sorted(candidates.items(), key=lambda x: -x[1])[:limit]
        # Normalize scores to sum to 1 for returned list
        s = sum(score for _, score in ranked) or 1.0
        return [(w, float(score / s)) for w, score in ranked]


def normalized_tokens(text: str):
    """Utility: basic tokenization/lowercasing"""
    if not text:
        return []
    return [t for t in text.lower().strip().split() if t]


_default_model = None


def get_default_model():
    global _default_model
    if _default_model is None:
        _default_model = NGramModel()
    return _default_model


if __name__ == "__main__":
    m = get_default_model()
    print("Loaded N-gram model.")
