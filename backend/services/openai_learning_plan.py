from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_learning_plan(missing_skills):

    prompt = f"""
Create a short 4-6 week learning plan to learn these skills:

{missing_skills}

Provide a weekly plan.
Keep it concise.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You create structured learning plans."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content