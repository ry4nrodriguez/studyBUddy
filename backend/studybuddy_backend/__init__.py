from flask import Flask, jsonify
from dotenv import load_dotenv
import logging

from .config import Config
from .extensions import cors, limiter
from .routes.health import health_bp
from .routes.open_classrooms import open_classrooms_bp


def create_app() -> Flask:
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(Config())

    logging.basicConfig(level=app.config["LOG_LEVEL"])

    if app.config["CORS_ORIGINS"]:
        cors.init_app(app, origins=app.config["CORS_ORIGINS"])

    limiter.init_app(app)

    app.register_blueprint(open_classrooms_bp)
    app.register_blueprint(health_bp)

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app
