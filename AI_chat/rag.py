import chromadb
from chromadb.utils import embedding_functions

from AI_chat.main import GROQ_API_KEY

chroma_client = chromadb.Client()

embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key= GROQ_API_KEY,
    model_name="text-embedding-3-small"
)

collection = chroma_client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=embedding_function
)

def load_data():
    with open("data.txt", "r", encoding="utf-8") as f:
        texts = f.readlines()

    for i, text in enumerate(texts):
        collection.add(
            documents=[text],
            ids=[str(i)]
        )

def query_rag(question):
    results = collection.query(
        query_texts=[question],
        n_results=3
    )
    return results["documents"][0]