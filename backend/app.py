from flask import Flask
from config.config import Config
from config.cors import init_cors
from routes import register_routes


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS
    init_cors(app)

    # Register routes (blueprints)
    register_routes(app)

    @app.route("/")
    def index():
        return {"service": "TP_clinique backend", "status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
