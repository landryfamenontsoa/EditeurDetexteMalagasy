from flask import Flask, request, jsonify

from config.config import Config
from config.cors import init_cors
from routes import register_routes

from services.spellchecker import check_word
from services.rules import validate_word
from services.lemmatizer import lemmatize
from services.autocomplete import predict_next
from services.sentiment import analyze
from services.tts import generate_audio


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialiser CORS
    init_cors(app)

    # Enregistrer les blueprints
    register_routes(app)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
