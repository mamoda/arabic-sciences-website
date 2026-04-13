from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
from rag import query_rag, load_data

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# تحميل البيانات أول مرة
load_data()

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(req: ChatRequest):
    context_docs = query_rag(req.question)

    context = "\n".join(context_docs)

    prompt = f"""
أنت مساعد متخصص في العلوم الشرعية.
أجب فقط من المعلومات التالية:

{context}

السؤال:
{req.question}

إذا لم تجد الإجابة، قل: لا أعلم.
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    answer = response["choices"][0]["message"]["content"]

    return {
        "answer": answer,
        "sources": context_docs
    }