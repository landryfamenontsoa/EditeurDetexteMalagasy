"""Autocompleter service.

Provides a convenient wrapper around the NGramModel and adds
simple caching and input parsing utilities.
"""
from functools import lru_cache
from typing import List, Dict, Any

from models.ngram_model import get_default_model, normalized_tokens


model = get_default_model()


def _split_prefix(text: str):
    """Return (context_tokens, current_prefix)"""
    tokens = normalized_tokens(text)
    if not text or text.endswith(" "):
        # user has completed the last token -> prefix is empty
        return tokens, ""
    # last token is prefix
    if tokens:
        prefix = tokens[-1]
        return tokens[:-1], prefix
    return [], text


@lru_cache(maxsize=4096)
def suggest(text: str, limit: int = 6) -> List[Dict[str, Any]]:
    """Return suggestions for the given input text.

    The function accepts the whole user input and returns a list of
    suggestions (word and score). It's cached for repeated prefixes.
    """
    context_tokens, prefix = _split_prefix(text or "")
    # Request model predictions. The model expects a tuple context
    results = model.predict(tuple(context_tokens[-2:]), prefix=prefix, limit=limit)

    return [{"word": w, "score": score} for w, score in results]


def suggest_sync(text: str, limit: int = 6):
    # small helper compatible with existing call sites
    return suggest(text, limit)
