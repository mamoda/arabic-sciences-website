from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://arabic-sciences-website.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/chat")
def chat(q: Question):
    try:
        if not GROQ_API_KEY:
            return {"answer": "❌ GROQ_API_KEY غير موجود في ملف .env"}

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
            },
            timeout=30
        )

        # 🔍 مهم جدًا: اعرض أي خطأ من السيرفر
        print("STATUS CODE:", response.status_code)
        print("RESPONSE TEXT:", response.text)

        # لو في error من Groq
        if response.status_code != 200:
            return {
                "answer": "❌ خطأ من API",
                "status_code": response.status_code,
                "details": response.text
            }

        data = response.json()

        return {
            "answer": data["choices"][0]["message"]["content"]
        }

    except requests.exceptions.RequestException as e:
        print("REQUEST ERROR:", str(e))
        return {"answer": f"❌ خطأ في الاتصال بالشبكة: {str(e)}"}

    except Exception as e:
        print("GENERAL ERROR:", str(e))
        return {"answer": f"❌ خطأ غير متوقع: {str(e)}"}