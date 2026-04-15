import chromadb
from chromadb.utils import embedding_functions
import os
import requests
import re

# =========================
# 🔐 API KEY
# =========================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# =========================
# 🧠 Chroma Setup
# =========================
chroma_client = chromadb.Client()

embedding_function = embedding_functions.DefaultEmbeddingFunction()

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=embedding_function
)

# =========================
# ✂️ Chunking (محسن)
# =========================
def split_text(text, chunk_size=500, overlap=100):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap

    return chunks

# =========================
# 📥 Load Data
# =========================
def load_data():
    try:
        if collection.count() > 0:
            print("✅ Data already loaded")
            return

        with open("data.txt", "r", encoding="utf-8") as f:
            text = f.read()

        chunks = split_text(text)

        for i, chunk in enumerate(chunks):
            collection.add(
                documents=[chunk],
                ids=[f"chunk_{i}"]
            )

        print(f"✅ Loaded {len(chunks)} chunks")

    except Exception as e:
        print(f"❌ Load error: {e}")

# =========================
# 🧹 تنظيف النص
# =========================
def clean_text(text):
    return re.sub(r'[^\w\s]', '', text.lower())

# =========================
# 🔍 Keyword Score (أقوى)
# =========================
def keyword_score(text, question):
    text = clean_text(text)
    question = clean_text(question)

    words = question.split()
    return sum(2 if w in text else 0 for w in words)

# =========================
# 🔍 Hybrid Search (محسن)
# =========================
def hybrid_search(question, top_k=5):
    try:
        results = collection.query(
            query_texts=[question],
            n_results=top_k * 2
        )

        docs = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]

        scored = []

        for doc, dist in zip(docs, distances):
            semantic = 1 / (1 + (dist or 1))
            keyword = keyword_score(doc, question)

            score = (semantic * 0.6) + (keyword * 0.4)

            scored.append({
                "text": doc,
                "score": score
            })

        scored.sort(key=lambda x: x["score"], reverse=True)

        return scored[:top_k]

    except Exception as e:
        print(f"❌ Search error: {e}")
        return []

# =========================
# 🌐 Hadith API (dorar)
# =========================
def search_hadith(query):
    try:
        url = f"https://dorar.net/dorar_api.json?skey={query}"
        res = requests.get(url, timeout=10)
        data = res.json()

        return [h["th"] for h in data.get("ahadith", [])[:3]]

    except Exception as e:
        print(f"❌ Hadith API error: {e}")
        return []

# =========================
# 🤖 AI (Groq)
# =========================
def call_ai(prompt):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3
            },
            timeout=20
        )

        return response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"❌ AI error: {e}")
        return "❌ حدث خطأ في الاتصال بالذكاء الاصطناعي"

# =========================
# 🧠 Smart Answer (🔥 قوي جدًا)
# =========================
def smart_answer(question):

    # 🟢 لو السؤال عن حديث → API مباشر
    if "حديث" in question:
        hadiths = search_hadith(question)

        if hadiths:
            return {
                "answer": "\n\n".join(hadiths),
                "mode": "HADITH_API",
                "citations": ["dorar.net"]
            }

    # 🔍 بحث في الداتا
    docs = hybrid_search(question)

    # 🔥 fallback لو مفيش نتائج
    if not docs:
        return {
            "answer": call_ai(question),
            "mode": "AI_FALLBACK",
            "citations": ["AI"]
        }

    # 🧠 بناء السياق
    context = "\n".join([d["text"] for d in docs])

    prompt = f"""
أجب باستخدام المعلومات التالية:

{context}

السؤال:
{question}
"""

    answer = call_ai(prompt)

    return {
        "answer": answer,
        "mode": "HYBRID",
        "citations": ["data.txt"]
    }

# =========================
# 🧪 Debug
# =========================
def debug(question):
    return hybrid_search(question)