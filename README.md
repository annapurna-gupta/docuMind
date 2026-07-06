# 📄 AI Document Intelligence

An AI-powered document intelligence application that lets users upload PDF documents and chat with them using natural language.

Instead of manually searching through long documents, users can ask questions like:

- *"What is the main objective of this research paper?"*
- *"Summarize this document in 5 points."*
- *"What are the eligibility criteria?"*
- *"Explain page 12 in simple terms."*

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve the most relevant parts of the document before generating accurate, context-aware responses.

---

## ✨ Features

- 📂 Upload PDF documents
- 📖 Extract and process document text
- ✂️ Intelligent text chunking with overlap
- 🧠 Semantic search using vector embeddings
- 💬 Chat with your documents in natural language
- ⚡ Fast and scalable FastAPI backend
- 🎨 Modern React frontend

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Backend | FastAPI |
| Frontend | React + Vite |
| Database | PostgreSQL |
| Vector Database | ChromaDB |
| PDF Processing | pypdf |
| AI Framework | LangChain |
| Embeddings | Sentence Transformers |
| LLM | Claude API |
| Deployment | Render + Vercel |

---

## 🏗️ Project Architecture

```text
                User
                 │
                 ▼
          React Frontend
                 │
                 ▼
          FastAPI Backend
                 │
     ┌───────────┼───────────┐
     │           │           │
     ▼           ▼           ▼
 PostgreSQL   ChromaDB     Claude API
     │           ▲
     │           │
     └──── PDF Processing ───┘
```

---

## 🚀 Workflow

```text
Upload PDF
     │
     ▼
Extract Text
     │
     ▼
Clean & Chunk Text
     │
     ▼
Generate Embeddings
     │
     ▼
Store in ChromaDB
     │
     ▼
Ask Questions
     │
     ▼
Retrieve Relevant Chunks
     │
     ▼
Claude Generates Answer
```

---

## 🎯 Goals

- Build a production-ready AI application using modern backend technologies.
- Learn Retrieval-Augmented Generation (RAG) from the ground up.
- Apply software engineering best practices in architecture and system design.
- Create a scalable, maintainable, and real-world portfolio project.

---

## 🚧 Project Status

Currently under development.

Features and documentation will be added as development progresses.

---
