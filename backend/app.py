from flask import Flask
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

    # CORS
    init_cors(app)

    # Register routes (blueprints)
    register_routes(app)

    @app.route("/spellcheck", methods=["GET"])
    def spellcheck():
        word = request.args.get("word")
        return jsonify(check_word(word))


    @app.route("/rules", methods=["GET"])
    def rules():
        word = request.args.get("word")
        return jsonify(validate_word(word))


    @app.route("/lemmatize", methods=["GET"])
    def lemma():
        word = request.args.get("word")
        return jsonify(lemmatize(word))


    @app.route("/autocomplete", methods=["GET"])
    def autocomplete():
        word = request.args.get("word")
        return jsonify({
            "word": word,
            "suggestions": predict_next(word)
        })


    @app.route("/sentiment", methods=["POST"])
    def sentiment():
        text = request.json.get("text")
        return jsonify(analyze(text))


    @app.route("/tts", methods=["POST"])
    def tts():
        text = request.json.get("text")
        filename = generate_audio(text)
        return jsonify({"audio": filename})

    @app.route("/")
    def index():
        return {"service": "TP_clinique backend", "status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
