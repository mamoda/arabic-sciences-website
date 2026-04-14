from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.utils import embedding_functions
from collections import Counter
import math

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

# ========== التحسين 1: استخدام PersistentClient بدلاً من Client() ==========
chroma_client = chromadb.PersistentClient(path="./chroma_db")  # حفظ البيانات

# ========== التحسين 2: نموذج Embedding مجاني وقوي (بدون مفتاح OpenAI) ==========
# استخدام نموذج محلي بدلاً من OpenAI
class LocalEmbeddingFunction:
    def __init__(self):
        # سيتم تحميل النموذج مرة واحدة فقط
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    
    def __call__(self, input):
        return self.model.encode(input, normalize_embeddings=True).tolist()

# استخدم النموذج المحلي (مجاني ولا يحتاج مفتاح)
embedding_function = LocalEmbeddingFunction()

# إذا أردت الاستمرار مع OpenAI (اختياري)
embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=GROQ_API_KEY,
    model_name="text-embedding-3-small"
)

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=embedding_function
)

# ========== التحسين 3: تقسيم ذكي لا يقطع الكلمات ==========
def split_text(text, chunk_size=500, overlap=100):
    """تقسيم ذكي على أساس الجمل بدلاً من الحروف"""
    # تقسيم على النقاط وعلامات الترقيم
    sentences = text.replace('.\n', '. ').replace('؟\n', '؟ ').split('. ')
    
    chunks = []
    current_chunk = []
    current_len = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        sentence_len = len(sentence)
        
        # إذا كانت الجملة طويلة جداً، قسّمها بالقوة
        if sentence_len > chunk_size:
            if current_chunk:
                chunks.append('. '.join(current_chunk))
                current_chunk = []
                current_len = 0
            # قسم الجملة الطويلة
            for i in range(0, sentence_len, chunk_size):
                chunks.append(sentence[i:i+chunk_size])
            continue
        
        # أضف الجملة للـ chunk الحالي
        if current_len + sentence_len > chunk_size and current_chunk:
            chunks.append('. '.join(current_chunk))
            # احتفظ بآخر جملتين للـ overlap
            overlap_sentences = current_chunk[-2:] if len(current_chunk) > 2 else current_chunk
            current_chunk = overlap_sentences
            current_len = sum(len(s) for s in overlap_sentences)
        
        current_chunk.append(sentence)
        current_len += sentence_len
    
    if current_chunk:
        chunks.append('. '.join(current_chunk))
    
    return chunks

# ========== التحسين 4: BM25 للبحث النصي (بدون مكتبات إضافية) ==========
class SimpleBM25:
    def __init__(self, documents):
        self.documents = documents
        self.doc_lengths = [len(doc.split()) for doc in documents]
        self.avgdl = sum(self.doc_lengths) / len(self.doc_lengths) if self.doc_lengths else 1
        self.idf = self._calculate_idf()
    
    def _calculate_idf(self):
        """حساب IDF لكل كلمة"""
        N = len(self.documents)
        doc_freq = Counter()
        for doc in self.documents:
            words = set(doc.split())
            doc_freq.update(words)
        
        idf = {}
        for word, freq in doc_freq.items():
            idf[word] = math.log((N - freq + 0.5) / (freq + 0.5) + 1)
        return idf
    
    def score(self, query, doc_idx):
        """حساب درجة BM25 لمستند معين"""
        query_words = query.split()
        doc = self.documents[doc_idx]
        doc_len = self.doc_lengths[doc_idx]
        score = 0
        k1 = 1.5
        b = 0.75
        
        for word in query_words:
            if word not in self.idf:
                continue
            tf = doc.split().count(word)
            numerator = tf * (k1 + 1)
            denominator = tf + k1 * (1 - b + b * doc_len / self.avgdl)
            score += self.idf[word] * (numerator / denominator)
        
        return score

bm25_cache = None

def get_bm25(docs):
    global bm25_cache
    if bm25_cache is None:
        bm25_cache = SimpleBM25(docs)
    return bm25_cache

def detect_topic(text):
    text = text.lower()
    topics = []
    
    if any(w in text for w in ["فقه", "طهارة", "صلاة", "زكاة"]):
        topics.append("fiqh")
    if any(w in text for w in ["حديث", "روى", "عن النبي"]):
        topics.append("hadith")
    if any(w in text for w in ["لغة", "نحو", "صرف"]):
        topics.append("language")
    if any(w in text for w in ["تفسير", "آية", "سورة"]):
        topics.append("tafsir")
    
    return ",".join(topics) if topics else "general"

def load_data():
    """تحميل البيانات مع تجنب إعادة التحميل"""
    if collection.count() > 0:
        print(f"✅ البيانات موجودة بالفعل ({collection.count()} قطعة)")
        return
    
    with open("data.txt", "r", encoding="utf-8") as f:
        text = f.read()
    
    chunks = split_text(text)
    print(f"📦 تم التقسيم إلى {len(chunks)} قطعة")
    
    # إضافة على دفعات
    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch_chunks = chunks[i:i+batch_size]
        for j, chunk in enumerate(batch_chunks):
            if chunk.strip():
                collection.add(
                    documents=[chunk.strip()],
                    ids=[f"chunk_{i+j}"],
                    metadatas=[{
                        "chunk_id": i+j,
                        "topic": detect_topic(chunk),
                        "source": "data.txt"
                    }]
                )
        print(f"✅ تمت إضافة {len(batch_chunks)} قطعة")
    
    print(f"🎉 اكتمل التحميل! المجموع: {collection.count()}")

# ========== التحسين 5: البحث الهجين المتطور ==========
def hybrid_search(question, top_k=5, topic=None):
    """بحث هجين (متجهي + نصي)"""
    # البحث المتجهي
    where_filter = {"topic": topic} if topic else None
    results = collection.query(
        query_texts=[question],
        n_results=top_k * 2,  # اجلب ضعف العدد للفلترة
        where=where_filter
    )
    
    if not results["documents"][0]:
        return []
    
    docs = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]
    
    # BM25 للبحث النصي
    bm25 = get_bm25(docs)
    bm25_scores = [bm25.score(question, i) for i in range(len(docs))]
    
    # دمج الدرجات (RRF - Reciprocal Rank Fusion)
    scored = []
    for i, (doc, meta, dist) in enumerate(zip(docs, metadatas, distances)):
        # الدرجة المتجهية
        vector_score = 1 / (1 + dist)
        # الدرجة النصية (تطبيع)
        bm25_score = bm25_scores[i] / (max(bm25_scores) + 0.01) if bm25_scores else 0
        # دمج
        final_score = (vector_score * 0.6) + (bm25_score * 0.4)
        
        scored.append({
            "text": doc,
            "meta": meta,
            "score": final_score
        })
    
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]

# ========== التحسين 6: Agent Router أذكى ==========
def agent_router(question):
    q = question.lower()
    
    # كلمات تحتاج معلومات دقيقة من المصادر
    if any(x in q for x in ["ما هو", "اذكر", "تعريف", "فقه", "حديث", "حكم", "دليل", "شرح"]):
        return "rag"
    
    # كلمات تحتاج تحليل أو رأي
    if any(x in q for x in ["لماذا", "كيف", "فكر", "رأي", "تحليل", "قارن"]):
        return "ai"
    
    # الباقي: هجين
    return "hybrid"

def call_ai(prompt, model="llama3-70b-8192"):
    """استدعاء Groq API مع إعادة محاولة"""
    for attempt in range(2):
        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 1000
                },
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
        except:
            continue
    
    return "عذراً، حدث خطأ في الاتصال"

# ========== التحسين 7: إعادة صياغة السؤال ==========
def enhance_question(question):
    """تحسين صياغة السؤال لبحث أفضل"""
    # إزالة كلمات زائدة
    stop_words = ["من فضلك", "لو سمحت", "أريد أن أعرف"]
    for word in stop_words:
        question = question.replace(word, "")
    
    # إضافة كلمات مفتاحية للفقه إذا كان السؤال دينياً
    if any(x in question.lower() for x in ["صلاة", "زكاة", "صوم", "حج"]):
        if "فقه" not in question.lower():
            question += " (فقه)"
    
    return question.strip()

def smart_answer(question):
    """الإجابة الذكية مع تحسين الأداء"""
    # تحسين السؤال
    enhanced_q = enhance_question(question)
    
    route = agent_router(enhanced_q)
    
    if route == "rag":
        docs = hybrid_search(enhanced_q, top_k=4)
        
        if not docs:
            return {
                "answer": "لم أجد معلومات كافية في قاعدة المعرفة.",
                "mode": "RAG",
                "citations": []
            }
        
        context = "\n\n---\n\n".join([d["text"] for d in docs[:3]])
        
        prompt = f"""أنت مساعد متخصص في العلوم الشرعية.

السياق المتاح:
{context}

السؤال: {question}

تعليمات:
1. أجب فقط من السياق المقدم
2. إذا لم تكن المعلومة في السياق، قل "لا أعلم من المصادر المتاحة"
3. لا تختلق معلومات من عندك

الإجابة:"""
        
        answer = call_ai(prompt)
        
        return {
            "answer": answer,
            "mode": "📚 RAG",
            "citations": [d["meta"] for d in docs[:3]]
        }
    
    elif route == "ai":
        prompt = f"""السؤال: {question}

أجب على هذا السؤال بتحليل ذكي ومنطقي، مع ذكر الأدلة العامة إذا أمكن. كن مفيداً ودقيقاً."""
        
        answer = call_ai(prompt)
        
        return {
            "answer": answer,
            "mode": "🧠 AI",
            "citations": ["groq-llama3-70b"]
        }
    
    else:  # hybrid
        docs = hybrid_search(enhanced_q, top_k=4)
        
        if not docs:
            prompt = f"""السؤال: {question}

أجب بناءً على معرفتك العامة مع الحرص على الدقة."""
            answer = call_ai(prompt)
            return {
                "answer": answer,
                "mode": "🔄 HYBRID",
                "citations": []
            }
        
        context = "\n\n---\n\n".join([d["text"] for d in docs[:3]])
        
        prompt = f"""السياق المتاح:
{context}

السؤال: {question}

أجب باستخدام السياق أولاً، ثم أضف من معرفتك إذا لزم الأمر. وضح أي جزء من الإجابة من السياق.

الإجابة:"""
        
        answer = call_ai(prompt)
        
        return {
            "answer": answer,
            "mode": "🔄 HYBRID",
            "citations": [d["meta"] for d in docs[:3]]
        }

# ========== تحميل البيانات عند بدء التشغيل ==========
print("🚀 جاري تحميل قاعدة المعرفة...")
load_data()
print("✅ النظام جاهز!")

# ========== نقاط النهاية API ==========
@app.post("/chat")
def chat(q: Question):
    """نقطة النهاية الرئيسية للإجابة على الأسئلة"""
    try:
        if not GROQ_API_KEY:
            return {"answer": "❌ API KEY غير موجود"}
        
        result = smart_answer(q.question)
        return result
        
    except Exception as e:
        return {"answer": f"❌ خطأ: {str(e)}"}

@app.get("/stats")
def get_stats():
    """إحصائيات عن قاعدة المعرفة"""
    return {
        "total_chunks": collection.count(),
        "status": "active"
    }

@app.post("/reload")
def reload_data():
    """إعادة تحميل البيانات (للصيانة)"""
    global bm25_cache
    bm25_cache = None
    
    # حذف المجموعة وإعادة إنشائها
    chroma_client.delete_collection("knowledge_base")
    
    global collection
    collection = chroma_client.get_or_create_collection(
        name="knowledge_base",
        embedding_function=embedding_function
    )
    
    load_data()
    return {"message": "تم إعادة تحميل البيانات بنجاح"}