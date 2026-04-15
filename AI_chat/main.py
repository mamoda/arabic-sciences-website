from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# 🔥 استدعاء الذكاء بتاعك
from ai_engine import smart_answer, load_data

load_dotenv()

app = FastAPI()

# =========================
# 🌐 CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://arabic-sciences-website-1.onrender.com",
        "https://arabic-sciences-website.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 📦 Request Model
# =========================
class Question(BaseModel):
    question: str


# =========================
# 🧠 Load DB مرة واحدة
# =========================
try:
    load_data()
    print("✅ Data loaded successfully")
except Exception as e:
    print(f"❌ Error loading data: {e}")


# =========================
# 🧠 Health Check
# =========================
@app.get("/")
def root():
    return {"status": "AI is running 🚀"}


# =========================
# 🤖 Chat Endpoint
# =========================
@app.post("/chat")
def chat(q: Question):
    try:
        if not q.question.strip():
            return {
                "answer": "❌ السؤال فاضي",
                "mode": "ERROR",
                "citations": []
            }

        result = smart_answer(q.question)

        return {
            "answer": result.get("answer"),
            "mode": result.get("mode"),
            "citations": result.get("citations")
        }

    except Exception as e:
        return {
            "answer": f"❌ حصل خطأ: {str(e)}",
            "mode": "ERROR",
            "citations": []
        }