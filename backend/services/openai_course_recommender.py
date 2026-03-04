from openai import OpenAI
import os
import json
import re

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_json(text):
    match = re.search(r"\{[\s\S]*\}", text)
    return match.group(0) if match else None


def recommend_courses(missing_skills):

    prompt = f"""
You are a career advisor.

Given the following missing skills:
{missing_skills}

Recommend 2–3 high quality online courses for each skill.

Return ONLY JSON in this format:

{{
  "courses": [
    {{
      "skill": "skill_name",
      "recommended_courses": [
        "course 1",
        "course 2",
        "course 3"
      ]
    }}
  ]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You recommend learning resources."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    json_text = extract_json(content)

    try:
        return json.loads(json_text)
    except:
        return {"courses": [], "raw_output": content}