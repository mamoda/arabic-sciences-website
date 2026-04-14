import chromadb
from chromadb.utils import embedding_functions
import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

chroma_client = chromadb.Client()

embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=GROQ_API_KEY,
    model_name="text-embedding-3-small"
)

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=embedding_function
)

# =========================
# 🧩 Chunking
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
# 📥 Load Data + Metadata
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
# ⚡ Hybrid Search
# =========================
def keyword_score(text, question):
    text = text.lower()
    question = question.lower()
    return sum(1 for w in question.split() if w in text)


def hybrid_search(question, top_k=5, topic=None):
    results = collection.query(
        query_texts=[question],
        n_results=top_k,
        where={"topic": topic} if topic else None
    )

    docs = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    scored = []

    for doc, meta, dist in zip(docs, metadatas, distances):
        semantic = 1 / (1 + dist)
        keyword = keyword_score(doc, question)

        score = (semantic * 0.7) + (keyword * 0.3)

        scored.append({
            "text": doc,
            "meta": meta,
            "score": score
        })

    scored.sort(key=lambda x: x["score"], reverse=True)

    return scored


# =========================
# 🧠 Agent Decision Layer
# =========================
def agent_router(question):
    q = question.lower()

    # 🟢 RAG cases
    if any(x in q for x in ["شرح", "ما هو", "اذكر", "تعريف", "فقه", "حديث"]):
        return "rag"

    # 🔵 general AI
    if any(x in q for x in ["فكر", "رأي", "لماذا", "كيف"]):
        return "ai"

    # 🟡 fallback hybrid
    return "hybrid"


# =========================
# 🧾 AI Call
# =========================
def call_ai(prompt):
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-70b-8192",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3
        }
    )

    return response.json()["choices"][0]["message"]["content"]


# =========================
# 🧠 MAIN AGENT SYSTEM
# =========================
def smart_answer(question):
    route = agent_router(question)

    # ================= RAG =================
    if route == "rag":
        docs = hybrid_search(question)

        context = "\n".join([d["text"] for d in docs[:3]])

        prompt = f"""
أنت مساعد متخصص في العلوم الشرعية.

السياق:
{context}

السؤال:
{question}

اذكر المصدر: data.txt
"""

        answer = call_ai(prompt)

        return {
            "answer": answer,
            "mode": "RAG",
            "citations": [d["meta"] for d in docs[:3]]
        }

    # ================= AI ONLY =================
    if route == "ai":
        answer = call_ai(question)

        return {
            "answer": answer,
            "mode": "AI",
            "citations": ["groq-llama3"]
        }

    # ================= HYBRID =================
    docs = hybrid_search(question)

    context = "\n".join([d["text"] for d in docs[:3]])

    prompt = f"""
أجب اعتمادًا على السياق + معرفتك.

السياق:
{context}

السؤال:
{question}

اذكر المصدر في النهاية.
"""

    answer = call_ai(prompt)

    return {
        "answer": answer,
        "mode": "HYBRID",
        "citations": [d["meta"] for d in docs[:3]]
    }


# =========================
# 🧪 Debug
# =========================
def debug(question):
    return hybrid_search(question)