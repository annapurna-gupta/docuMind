from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
import io
import uuid
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
print(os.getenv("GROQ_API_KEY"))

app = FastAPI()

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")


@app.get("/")
def home():
    return {
        "message": "DOCUMIND is alive"
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        return {
            "error": "Only pdf format is supported"
        }
    
    contents = await file.read()

    pdf = PdfReader(io.BytesIO(contents))

    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text()
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " "]
    )

    chunks = splitter.split_text(extracted_text)

    doc_id = str(uuid.uuid4())
    collection = chroma_client.get_or_create_collection(name=f"doc_{doc_id}")
    
    # Convert chunks to embeddings and store in ChromaDB
    print(f"Embedding {len(chunks)} chunks...")
    embeddings = embedding_model.encode(chunks).tolist()
    
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"chunk_{i}" for i in range(len(chunks))]
    )
    print("Done embedding!")
    
    return {
        "message": "PDF uploaded and indexed successfully",
        "filename": file.filename,
        "pages": len(pdf.pages),
        "total_chunks": len(chunks),
        "doc_id": doc_id
    }

@app.post("/ask")
async def ask_question(doc_id: str, question: str):

    try:
        collection = chroma_client.get_collection(name=f"doc_{doc_id}")
    except:
        return {
            "error": "Document not found! Please upload"
        }

    question_embedding = embedding_model.encode([question]).tolist()
    
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=4
    )
    
    relevant_chunks = results["documents"][0]
    
    context = "\n\n---\n\n".join([
        f"Chunk {i+1}: {chunk}" 
        for i, chunk in enumerate(relevant_chunks)
    ])

    prompt = f"""You are a helpful assistant that answers questions about documents.
        
Use ONLY the context below to answer the question. 
If the answer is not in the context, say "I could not find this in the document."
At the end of your answer, mention which chunk number(s) you used.

Context:
{context}

Question: {question}

Answer:"""

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
    )

    answer = response.choices[0].message.content

    return {
        "question": question,
        "answer": answer,
        "chunks_used": relevant_chunks
    }
