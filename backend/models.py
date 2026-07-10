from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Document(Base):

    __tablename__ = "documents"

    doc_id = Column(String, primary_key=True)
    filename = Column(String)
    file_hash = Column(String, unique=True)
    created_at = Column(DateTime, server_default=func.now())