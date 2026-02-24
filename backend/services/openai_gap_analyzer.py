from openai import OpenAI
import os
import json
import re

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_json_from_text(text):
    match = re.search(r"\{[\s\S]*\}", text)
    return match.group(0) if match else None

def analyze_skill_gap_with_openai(skills_json: dict, target_role: str):
    prompt = f"""
You are an expert career advisor.

Given:
1) Candidate skills in JSON:
{json.dumps(skills_json, indent=2)}

2) Target job role: "{target_role}"

Compare the candidate's skills with the typical requirements of this role.

Return ONLY valid JSON in this exact format:

{{
  "matched_skills": [],
  "missing_skills": [],
  "readiness_score": 0
}}

Rules:
- readiness_score must be an integer between 0 and 100.
- Do not include explanations or markdown.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You perform skill gap analysis and return only JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1
    )

    content = response.choices[0].message.content.strip()
    json_text = extract_json_from_text(content)

    if not json_text:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "readiness_score": 0,
            "raw_output": content
        }

    try:
        gap_result = json.loads(json_text)
    except json.JSONDecodeError:
        gap_result = {
            "matched_skills": [],
            "missing_skills": [],
            "readiness_score": 0,
            "raw_output": content
        }

    return gap_result