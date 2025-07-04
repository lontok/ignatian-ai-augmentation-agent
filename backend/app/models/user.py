from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from config.settings import settings

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": settings.db_schema}
    
    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    given_name = Column(String)
    family_name = Column(String)
    picture = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    documents = relationship("Document", back_populates="user")
    analyses = relationship("DocumentAnalysis", back_populates="user")
    ipp_progress = relationship("IPPStageProgress", back_populates="user")
    background_questionnaires = relationship("UserBackgroundQuestionnaire", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"