from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database.connection import get_db
from app.core.schemas import (
    BackgroundQuestionnaireCreate,
    BackgroundQuestionnaireUpdate,
    BackgroundQuestionnaireResponse,
    MessageResponse
)
from app.models.user import User
from app.models.questionnaire import UserBackgroundQuestionnaire
from app.auth.dependencies import get_current_active_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/questionnaire",
    tags=["questionnaire"]
)

@router.post("/background", response_model=BackgroundQuestionnaireResponse)
async def create_background_questionnaire(
    questionnaire_data: BackgroundQuestionnaireCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new background questionnaire for the current user"""
    try:
        # Check if user already has a completed questionnaire
        existing = db.query(UserBackgroundQuestionnaire).filter(
            UserBackgroundQuestionnaire.user_id == current_user.id,
            UserBackgroundQuestionnaire.completed_at.isnot(None)
        ).first()
        
        if existing:
            # Update existing questionnaire instead of creating new one
            existing.responses = questionnaire_data.responses
            existing.updated_at = datetime.utcnow()
            if questionnaire_data.is_complete:
                existing.completed_at = datetime.utcnow()
            db.commit()
            db.refresh(existing)
            
            return BackgroundQuestionnaireResponse(
                id=existing.id,
                user_id=existing.user_id,
                responses=existing.responses,
                created_at=existing.created_at,
                updated_at=existing.updated_at,
                completed_at=existing.completed_at
            )
        
        # Create new questionnaire
        questionnaire = UserBackgroundQuestionnaire(
            user_id=current_user.id,
            responses=questionnaire_data.responses,
            completed_at=datetime.utcnow() if questionnaire_data.is_complete else None
        )
        
        db.add(questionnaire)
        db.commit()
        db.refresh(questionnaire)
        
        logger.info(f"Created background questionnaire {questionnaire.id} for user {current_user.id}")
        
        return BackgroundQuestionnaireResponse(
            id=questionnaire.id,
            user_id=questionnaire.user_id,
            responses=questionnaire.responses,
            created_at=questionnaire.created_at,
            updated_at=questionnaire.updated_at,
            completed_at=questionnaire.completed_at
        )
        
    except Exception as e:
        logger.error(f"Failed to create background questionnaire: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save questionnaire"
        )

@router.get("/background/latest", response_model=Optional[BackgroundQuestionnaireResponse])
async def get_latest_background_questionnaire(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the user's latest background questionnaire"""
    try:
        questionnaire = db.query(UserBackgroundQuestionnaire).filter(
            UserBackgroundQuestionnaire.user_id == current_user.id
        ).order_by(UserBackgroundQuestionnaire.created_at.desc()).first()
        
        if not questionnaire:
            return None
            
        return BackgroundQuestionnaireResponse(
            id=questionnaire.id,
            user_id=questionnaire.user_id,
            responses=questionnaire.responses,
            created_at=questionnaire.created_at,
            updated_at=questionnaire.updated_at,
            completed_at=questionnaire.completed_at
        )
        
    except Exception as e:
        logger.error(f"Failed to fetch background questionnaire: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch questionnaire"
        )

@router.put("/background/{questionnaire_id}", response_model=BackgroundQuestionnaireResponse)
async def update_background_questionnaire(
    questionnaire_id: int,
    questionnaire_data: BackgroundQuestionnaireUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an existing background questionnaire"""
    try:
        questionnaire = db.query(UserBackgroundQuestionnaire).filter(
            UserBackgroundQuestionnaire.id == questionnaire_id,
            UserBackgroundQuestionnaire.user_id == current_user.id
        ).first()
        
        if not questionnaire:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Questionnaire not found"
            )
        
        # Update questionnaire
        questionnaire.responses = questionnaire_data.responses
        questionnaire.updated_at = datetime.utcnow()
        
        if questionnaire_data.is_complete:
            questionnaire.completed_at = datetime.utcnow()
        
        db.commit()
        db.refresh(questionnaire)
        
        logger.info(f"Updated background questionnaire {questionnaire.id} for user {current_user.id}")
        
        return BackgroundQuestionnaireResponse(
            id=questionnaire.id,
            user_id=questionnaire.user_id,
            responses=questionnaire.responses,
            created_at=questionnaire.created_at,
            updated_at=questionnaire.updated_at,
            completed_at=questionnaire.completed_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update background questionnaire: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update questionnaire"
        )