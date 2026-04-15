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
# ✂️ Chunking
# =========================
def split_text(text, chunk_size=400, overlap=50):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap

    return chunks

# =========================
# 🧠 Topic Detection
# =========================
def detect_topic(text):
    text = text.lower()

    if "فقه" in text or "طهارة" in text:
        return "fiqh"
    if "حديث" in text:
        return "hadith"
    if "لغة" in text or "نحو" in text:
        return "language"

    return "general"

# =========================
# 📥 Load Data
# =========================
def load_data():
    with open("data.txt", "r", encoding="utf-8") as f:
        text = f.read()

    chunks = split_text(text)

    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            ids=[f"chunk_{i}"],
            metadatas=[{
                "chunk_id": i,
                "topic": detect_topic(chunk),
                "source": "data.txt"
            }]
        )

# =========================
# 🧹 Clean Text (Arabic friendly)
# =========================
def clean_text(text):
    return re.sub(r'[^\w\s]', '', text.lower())

# =========================
# 🔍 Keyword Score
# =========================
def keyword_score(text, question):
    text = clean_text(text)
    question = clean_text(question)

    return sum(1 for w in question.split() if w in text)

# =========================
# 🧠 Query Expansion (🔥 مهم)
# =========================
def expand_query(question):
    prompt = f"""
أعد صياغة السؤال بطرق مختلفة للبحث:

السؤال: {question}

اكتب 3 صيغ فقط.
"""

    try:
        res = requests.post(
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
            timeout=10
        )

        text = res.json()["choices"][0]["message"]["content"]
        variants = [line.strip() for line in text.split("\n") if line.strip()]

        return [question] + variants

    except:
        return [question]

# =========================
# 🔍 Hybrid Search (Multi Query)
# =========================
def hybrid_search(question, top_k=5, topic=None):
    queries = expand_query(question)

    all_results = []

    for q in queries:
        results = collection.query(
            query_texts=[q],
            n_results=top_k,
            where={"topic": topic} if topic else None
        )

        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0]

        for doc, meta, dist in zip(docs, metas, distances):
            semantic = 1 / (1 + dist)
            keyword = keyword_score(doc, question)

            score = (semantic * 0.7) + (keyword * 0.3)

            all_results.append({
                "text": doc,
                "meta": meta,
                "score": score
            })

    # إزالة التكرار
    unique = {}
    for r in all_results:
        unique[r["text"]] = r

    final = list(unique.values())
    final.sort(key=lambda x: x["score"], reverse=True)

    return final[:top_k]

# =========================
# 🤖 Agent Router
# =========================
def agent_router(question):
    q = question.lower()

    if "حديث" in q:
        return "hadith_api"

    if any(x in q for x in ["شرح", "ما هو", "اذكر", "تعريف", "فقه" ,"ما" ,"من هو", "من", "متى"]):
        return "rag"

    if any(x in q for x in ["لماذا", "كيف", "رأي", "فكر"]):
        return "ai"

    return "hybrid"

# =========================
# 🌐 Hadith API
# =========================
def search_hadith(query):
    try:
        url = f"https://dorar.net/dorar_api.json?skey={query}"
        res = requests.get(url, timeout=10)
        data = res.json()

        return [h["th"] for h in data.get("ahadith", [])[:3]]
    except:
        return []

# =========================
# 🤖 Call AI
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

    except:
        return "❌ خطأ في الاتصال بالـ AI"

# =========================
# 🧠 Smart Answer (🔥 القلب)
# =========================
def smart_answer(question):
    route = agent_router(question)

    # 🟢 Hadith API
    if route == "hadith_api":
        hadiths = search_hadith(question)

        return {
            "answer": "\n\n".join(hadiths) if hadiths else "لا يوجد نتائج",
            "mode": "HADITH_API",
            "citations": ["dorar.net"]
        }

    # 🔍 Search
    docs = hybrid_search(question)

    # 🔥 Fallback AI
    if not docs:
        return {
            "answer": call_ai(f"أجب عن هذا السؤال:\n{question}"),
            "mode": "FALLBACK_AI",
            "citations": ["AI fallback"]
        }

    context = "\n".join([d["text"] for d in docs[:3]])

    # 🧠 RAG
    if route == "rag":
        prompt = f"""
أنت مساعد متخصص في العلوم الشرعية.

اعتمد فقط على هذا السياق:
{context}

السؤال:
{question}

اذكر المصدر: data.txt
"""

    # 🤖 AI مباشر
    elif route == "ai":
        return {
            "answer": call_ai(question),
            "mode": "AI",
            "citations": ["groq"]
        }

    # 🔀 Hybrid
    else:
        prompt = f"""
أجب باستخدام السياق + معرفتك.

السياق:
{context}

السؤال:
{question}

اذكر المصدر في النهاية.
"""

    answer = call_ai(prompt)

    return {
        "answer": answer,
        "mode": route.upper(),
        "citations": [d["meta"] for d in docs[:3]]
    }

# =========================
# 🧪 Debug
# =========================
def debug(question):
    return hybrid_search(question)