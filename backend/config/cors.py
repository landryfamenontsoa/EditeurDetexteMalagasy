from flask_cors import CORS


def init_cors(app):
    # Configure CORS with sensible defaults; modify as needed
    CORS(app, resources={r"/api/*": {"origins": "*"}})
