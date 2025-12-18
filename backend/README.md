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
