from flask import Flask
from flask_cors import CORS
import os

from config import UPLOAD_FOLDER
from routes.resume_routes import resume_bp

app = Flask(__name__)

# Enable CORS for frontend
CORS(app)

# Configuration
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Register routes
app.register_blueprint(resume_bp)

@app.route("/")
def home():
    return "SkillBridge backend is running!"


if __name__ == "__main__":
    app.run(debug=True)
