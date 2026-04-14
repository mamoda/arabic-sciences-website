import chromadb
from chromadb.utils import embedding_functions
import os

# ❗ الأفضل تجيب المفتاح من env مش من main
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

chroma_client = chromadb.Client()

# ⚠️ ملاحظة: ده Embedding من OpenAI API model name فقط
embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=GROQ_API_KEY,
    model_name="text-embedding-3-small"
)

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=embedding_function
)

# =========================
# 🧩 1. Chunking أقوى
# =========================
def split_text(text, chunk_size=400, overlap=50):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap  # overlap بسيط عشان المعنى ما يتكسرش

    return chunks


# =========================
# 📥 2. تحميل البيانات
# =========================
def load_data():
    with open("data.txt", "r", encoding="utf-8") as f:
        text = f.read()

    chunks = split_text(text)

    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            ids=[f"chunk_{i}"]
        )


# =========================
# 🧠 3. RAG Query محسّن
# =========================
def query_rag(question, top_k=5):
    results = collection.query(
        query_texts=[question],
        n_results=top_k
    )

    docs = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]

    # 🔥 فلترة النتائج الضعيفة
    filtered_docs = []
    for doc, dist in zip(docs, distances):
        if dist is None or dist < 1.5:  # threshold قابل للتعديل
            filtered_docs.append(doc)

    return filtered_docs


# =========================
# 🧪 4. Debug مساعد (اختياري)
# =========================
def debug_query(question):
    results = collection.query(
        query_texts=[question],
        n_results=5
    )

    return {
        "question": question,
        "docs": results.get("documents"),
        "distances": results.get("distances")
    }