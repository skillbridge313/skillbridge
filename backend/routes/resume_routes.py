from flask import Blueprint, request, jsonify
import os

from config import ALLOWED_EXTENSIONS
from services.resume_parser import extract_resume_text
from services.openai_skill_extractor import extract_skills_with_openai
from services.openai_gap_analyzer import analyze_skill_gap_with_openai
from services.openai_course_recommender import recommend_courses
from services.openai_learning_plan import generate_learning_plan

resume_bp = Blueprint("resume", __name__)


# -----------------------------
# Utility: Check allowed files
# -----------------------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# -----------------------------
# Upload Resume + Extract Skills
# -----------------------------
@resume_bp.route("/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file format"}), 400

    try:
        save_path = os.path.join("uploads", file.filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(save_path)

        # Extract text from resume
        resume_text = extract_resume_text(save_path)

        # Extract skills using OpenAI
        skills = extract_skills_with_openai(resume_text)

        return jsonify({
            "message": "Resume uploaded and skills extracted successfully",
            "filename": file.filename,
            "skills": skills
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Skill Gap Analysis
# -----------------------------
@resume_bp.route("/analyze-gap", methods=["POST"])
def analyze_gap():
    data = request.json

    if not data:
        return jsonify({"error": "Request body missing"}), 400

    skills_json = data.get("skills")
    target_role = data.get("target_role")

    if not skills_json or not target_role:
        return jsonify({"error": "skills and target_role are required"}), 400

    try:
        gap_result = analyze_skill_gap_with_openai(skills_json, target_role)

        return jsonify({
            "message": "Gap analysis completed",
            "gap_analysis": gap_result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Course Recommendations
# -----------------------------
@resume_bp.route("/recommend-courses", methods=["POST"])
def recommend_courses_api():

    data = request.json

    if not data:
        return jsonify({"error": "Request body missing"}), 400

    missing_skills = data.get("missing_skills")

    if not missing_skills:
        return jsonify({"error": "missing_skills required"}), 400

    try:
        courses = recommend_courses(missing_skills)

        return jsonify({
            "message": "Course recommendations generated",
            "courses": courses
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Generate Learning Plan
# -----------------------------
@resume_bp.route("/generate-plan", methods=["POST"])
def generate_plan():

    data = request.json

    if not data:
        return jsonify({"error": "Request body missing"}), 400

    missing_skills = data.get("missing_skills")

    if not missing_skills:
        return jsonify({"error": "missing_skills required"}), 400

    try:
        plan = generate_learning_plan(missing_skills)

        return jsonify({
            "message": "Learning plan generated",
            "learning_plan": plan
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500