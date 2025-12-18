from flask import Flask

# This module registers all route blueprints on the Flask app.

def register_routes(app: Flask):
    # Import route modules here so they register their blueprints
    from . import (
        spell_check,
        autocomplete,
        translation,
        lemmatization,
        sentiment,
        phonotactic,
        ner,
        semantic,
        tts,
        chatbot,
    )

    modules = [
        spell_check,
        autocomplete,
        translation,
        lemmatization,
        sentiment,
        phonotactic,
        ner,
        semantic,
        tts,
        chatbot,
    ]

    for mod in modules:
        if hasattr(mod, "bp"):
            app.register_blueprint(mod.bp, url_prefix="/api")
