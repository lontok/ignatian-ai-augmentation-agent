from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.user import Base
from config.settings import settings

class DocumentAnalysis(Base):
    __tablename__ = "document_analyses"
    __table_args__ = {"schema": settings.db_schema}
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(f"{settings.db_schema}.users.id"), nullable=False)
    
    # Document references
    resume_document_id = Column(Integer, ForeignKey(f"{settings.db_schema}.documents.id"), nullable=True)
    job_document_id = Column(Integer, ForeignKey(f"{settings.db_schema}.documents.id"), nullable=True)
    
    # Analysis results (stored as JSON)
    resume_analysis = Column(JSON, nullable=True)
    job_analysis = Column(JSON, nullable=True)
    connections_analysis = Column(JSON, nullable=True)
    context_summary = Column(Text, nullable=True)
    
    # Analysis status
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    resume_document = relationship("Document", foreign_keys=[resume_document_id])
    job_document = relationship("Document", foreign_keys=[job_document_id])

class IPPStageProgress(Base):
    __tablename__ = "ipp_stage_progress"
    __table_args__ = {"schema": settings.db_schema}
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(f"{settings.db_schema}.users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey(f"{settings.db_schema}.document_analyses.id"), nullable=False)
    
    # IPP Stage tracking
    context_completed = Column(Boolean, default=False)
    context_completed_at = Column(DateTime, nullable=True)
    
    experience_completed = Column(Boolean, default=False)
    experience_completed_at = Column(DateTime, nullable=True)
    
    reflection_completed = Column(Boolean, default=False)
    reflection_completed_at = Column(DateTime, nullable=True)
    
    action_completed = Column(Boolean, default=False)
    action_completed_at = Column(DateTime, nullable=True)
    
    evaluation_completed = Column(Boolean, default=False)
    evaluation_completed_at = Column(DateTime, nullable=True)
    
    # Stage-specific data
    experience_data = Column(JSON, nullable=True)
    reflection_data = Column(JSON, nullable=True)
    action_data = Column(JSON, nullable=True)
    evaluation_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ipp_progress")
    analysis = relationship("DocumentAnalysis")