from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app,
         origins=["http://localhost:5173", "http://127.0.0.1:5173"],
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "Accept"],
         expose_headers=["Content-Type", "Authorization"]
         )



    from .models import db
    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    with app.app_context():
        try:
            db.create_all()
            print("Tables created successfully!")
        except Exception as e:
            print(f"Error creating tables: {e}")

    return app
