from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class Question(BaseModel):
    question: str

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/chat")
def chat(q: Question):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت مساعد متخصص في العلوم الشرعية والعربية وتجيب بإجابات واضحة ومختصرة"
                    },
                    {
                        "role": "user",
                        "content": q.question
                    }
                ],
                "temperature": 0.7
            }
        )

        data = response.json()

        return {
            "answer": data["choices"][0]["message"]["content"]
        }

    except Exception as e:
        return {"answer": "حدث خطأ في الاتصال"}