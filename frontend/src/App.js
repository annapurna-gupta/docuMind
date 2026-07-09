import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8000";

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);

  // upload a PDF
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/upload`, formData);
      const newDoc = {
        doc_id: res.data.doc_id,
        filename: res.data.filename,
        pages: res.data.pages,
        total_chunks: res.data.total_chunks,
      };
      setDocuments((prev) => [...prev, newDoc]);
      setSelectedDoc(newDoc);
      setMessages([]);
      alert(`✅ Uploaded! ${res.data.total_chunks} chunks indexed.`);
    } catch (err) {
      alert("Upload failed. Make sure your backend is running.");
    }
    setUploading(false);
  };

  // ask a question
  const handleAsk = async () => {
    if (!selectedDoc) return alert("Please upload or select a document first.");
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await axios.post(
        `${API}/ask?doc_id=${selectedDoc.doc_id}&question=${encodeURIComponent(question)}`
      );
      const botMessage = { role: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Try again." },
      ]);
    }
    setAsking(false);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="logo">📄 DocuMind</h1>
        <p className="tagline">Chat with your documents</p>

        <label className="upload-btn">
          {uploading ? "Uploading..." : "+ Upload PDF"}
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>

        <div className="doc-list">
          <p className="doc-list-title">Your Documents</p>
          {documents.length === 0 && (
            <p className="no-docs">No documents yet</p>
          )}
          {documents.map((doc) => (
            <div
              key={doc.doc_id}
              className={`doc-item ${selectedDoc?.doc_id === doc.doc_id ? "active" : ""}`}
              onClick={() => {
                setSelectedDoc(doc);
                setMessages([]);
              }}
            >
              <span className="doc-name">{doc.filename}</span>
              <span className="doc-meta">{doc.pages} pages · {doc.total_chunks} chunks</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="main">
        {!selectedDoc ? (
          <div className="empty-state">
            <h2>Upload a PDF to get started</h2>
            <p>Ask any question and get answers with citations</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <span>💬 Chatting with: <strong>{selectedDoc.filename}</strong></span>
            </div>

            <div className="messages">
              {messages.length === 0 && (
                <p className="no-messages">Ask anything about this document...</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <span className="bubble">{msg.text}</span>
                </div>
              ))}
              {asking && (
                <div className="message bot">
                  <span className="bubble thinking">Thinking...</span>
                </div>
              )}
            </div>

            <div className="input-area">
              <input
                type="text"
                placeholder="Ask a question about your document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <button onClick={handleAsk} disabled={asking}>
                {asking ? "..." : "Ask"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}