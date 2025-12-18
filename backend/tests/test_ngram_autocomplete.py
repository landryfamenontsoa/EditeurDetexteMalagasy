import pytest
from models.ngram_model import get_default_model, normalized_tokens
from services.autocompleter import suggest


def test_tokenization():
    assert normalized_tokens("Salama tontolo") == ["salama", "tontolo"]


def test_model_predict_basic():
    model = get_default_model()
    # basic predict with empty context should return something
    preds = model.predict(tuple(), prefix="ny", limit=3)
    assert isinstance(preds, list)


def test_service_suggest():
    # provide a short text prefix and expect suggestions list
    res = suggest("ny f", limit=5)
    assert isinstance(res, list)
    # Each item must have word and score
    if res:
        assert "word" in res[0] and "score" in res[0]
