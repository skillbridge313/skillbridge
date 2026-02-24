from openai import OpenAI
import os
import json
import re

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_json_from_text(text):
    """
    Extract JSON object from model output even if wrapped in markdown.
    """
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return match.group(0)
    return None

def extract_skills_with_openai(resume_text: str):
    prompt = f"""
Extract skills from the resume text below.

Return ONLY valid JSON in this exact format (no explanations, no markdown):

{{
  "technical_skills": ["..."],
  "soft_skills": ["..."],
  "tools": ["..."]
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You extract skills and return only JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1
    )

    content = response.choices[0].message.content.strip()

    json_text = extract_json_from_text(content)

    if not json_text:
        return {
            "technical_skills": [],
            "soft_skills": [],
            "tools": [],
            "raw_output": content
        }

    try:
        skills_json = json.loads(json_text)
    except json.JSONDecodeError:
        skills_json = {
            "technical_skills": [],
            "soft_skills": [],
            "tools": [],
            "raw_output": content
        }

    return skills_json
