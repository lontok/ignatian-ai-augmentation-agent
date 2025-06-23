from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.user import Base
from config.settings import settings

class UserBackgroundQuestionnaire(Base):
    __tablename__ = "user_background_questionnaires"
    __table_args__ = {"schema": settings.db_schema}
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(f"{settings.db_schema}.users.id"), nullable=False)
    
    # Store all questionnaire responses as JSON
    responses = Column(JSON, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="background_questionnaires")
    
    def __repr__(self):
        return f"<UserBackgroundQuestionnaire(id={self.id}, user_id={self.user_id}, completed_at={self.completed_at})>"