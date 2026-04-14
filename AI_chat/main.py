from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# 🔥 RAG
import chromadb
from chromadb.utils import embedding_functions

# =========================
# ⚙️ إعدادات أساسية
# =========================
load_dotenv()

app = FastAPI()

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

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class Question(BaseModel):
    question: str


embedding_function = embedding_functions.DefaultEmbeddingFunction()

chroma_client = chromadb.Client()

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=embedding_function
)

def load_data():
    with open("data.txt", "r", encoding="utf-8") as f:
        text = f.read()

    chunks = text.split("\n\n")  

    for i, chunk in enumerate(chunks):
        if chunk.strip():
            collection.add(
                documents=[chunk.strip()],
                ids=[str(i)]
            )

def query_rag(question):
    results = collection.query(
        query_texts=[question],
        n_results=5
    )

    documents = results["documents"][0]
    top_docs = documents[:3]

    return "\n\n".join(top_docs)

load_data()


@app.post("/chat")
def chat(q: Question):
    try:
        if not GROQ_API_KEY:
            return {"answer": "❌ API KEY غير موجود"}

        context = query_rag(q.question)

        prompt = f"""
أنت مساعد متخصص في العلوم الشرعية.

اعتمد فقط على المعلومات التالية:
{context}

إذا لم تجد الإجابة بوضوح قل: "لا أعلم من المصادر المتاحة"

السؤال:
{q.question}

الإجابة:
"""

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت مساعد دقيق ولا تجيب إلا من المعلومات المعطاة"
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.3
            },
            timeout=30
        )

        if response.status_code != 200:
            return {
                "answer": "❌ خطأ من API",
                "details": response.text
            }

        data = response.json()

        return {
            "answer": data["choices"][0]["message"]["content"]
        }

    except Exception as e:
        return {"answer": f"❌ خطأ: {str(e)}"}