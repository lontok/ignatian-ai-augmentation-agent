from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.models.user import Base
from config.settings import settings

class DocumentType(enum.Enum):
    RESUME = "resume"
    JOB_DESCRIPTION = "job_description"

class Document(Base):
    __tablename__ = "documents"
    __table_args__ = {"schema": settings.db_schema}
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(f"{settings.db_schema}.users.id"), nullable=False)
    document_type = Column(String(50), nullable=False)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    content_text = Column(Text, nullable=True)  # Extracted text content
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to user
    user = relationship("User", back_populates="documents")