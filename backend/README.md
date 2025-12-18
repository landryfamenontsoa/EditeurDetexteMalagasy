# TP_clinique Backend (Flask)

API backend skeleton for Malagasy NLP tools.

## Structure

- `app.py` — Flask app entrypoint
- `routes/` — API routes (blueprints)
- `services/` — business logic placeholders
- `models/` — ML/NLP model placeholders
- `data/` — dictionaries, corpora, models
- `scrapers/` — corpus scrapers
- `utils/` — helper utilities

## Quickstart

1. Create a virtualenv (recommended)
2. pip install -r requirements.txt
3. Set environment variables in `.env`
4. Run `python app.py`

Endpoints are mounted under `/api`, for example `/api/spell-check`.

## Semantic suggestions (Knowledge Graph)

You can query the semantic suggester at:

- POST `/api/semantic-suggest`

Body examples (JSON):

```
{ "text": "Antananarivo" }
{ "concept": "antananarivo", "depth": 1, "limit": 8 }
```

Returns JSON `{ "target": "antananarivo", "suggestions": [...] }` where suggestions include related nodes and relation types.

Dev helper: to reload the ontology from disk without restarting the server, POST to `/api/semantic-reload` — it clears the graph cache and returns counts: `{ "nodes": N, "adj": M }`.
