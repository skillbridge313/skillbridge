from flask import Blueprint, request, jsonify
import os

from config import ALLOWED_EXTENSIONS
from services.resume_parser import extract_resume_text
from services.openai_skill_extractor import extract_skills_with_openai
from services.openai_gap_analyzer import analyze_skill_gap_with_openai

resume_bp = Blueprint("resume", __name__)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@resume_bp.route("/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file format"}), 400

    save_path = os.path.join("uploads", file.filename)
    file.save(save_path)

    # Extract text
    resume_text = extract_resume_text(save_path)

    # Extract skills (OpenAI)
    skills = extract_skills_with_openai(resume_text)

    return jsonify({
        "message": "Resume uploaded and skills extracted",
        "filename": file.filename,
        "skills": skills
    }), 200


@resume_bp.route("/analyze-gap", methods=["POST"])
def analyze_gap():
    data = request.json

    if not data or "skills" not in data or "target_role" not in data:
        return jsonify({"error": "skills and target_role are required"}), 400

    skills_json = data["skills"]
    target_role = data["target_role"]

    gap_result = analyze_skill_gap_with_openai(skills_json, target_role)

    return jsonify({
        "gap_analysis": gap_result
    }), 200