with open("data/positif.txt", encoding="utf-8") as f:
    POS = set(f.read().split())

with open("data/negatif.txt", encoding="utf-8") as f:
    NEG = set(f.read().split())

def analyze(text):
    score = 0
    for w in text.lower().split():
        if w in POS:
            score += 1
        elif w in NEG:
            score -= 1

    if score > 0:
        sentiment = "Positif"
    elif score < 0:
        sentiment = "Négatif"
    else:
        sentiment = "Neutre"

    return {"sentiment": sentiment, "score": score}
