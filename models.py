from sqlalchemy import Column, String
from database import Base

class Document(Base):

    __tablename__ = "documents"

    doc_id = Column(String, primary_key=True)
    filename = Column(String)
    file_hash = Column(String, unique=True)