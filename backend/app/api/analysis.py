from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from app.core.schemas import (
    StartAnalysisRequest, 
    StartAnalysisResponse, 
    DocumentAnalysisResponse,
    MessageResponse
)
from app.auth.dependencies import get_current_active_user
from app.models.user import User
from app.services.analysis_service import analysis_service

router = APIRouter(prefix="/analysis", tags=["Document Analysis"])

@router.post("/start", response_model=StartAnalysisResponse)
async def start_document_analysis(
    request: StartAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Start LLM analysis of uploaded resume and job description
    """
    try:
        analysis = await analysis_service.start_document_analysis(
            db=db,
            user=current_user,
            resume_document_id=request.resume_document_id,
            job_document_id=request.job_document_id
        )
        
        return StartAnalysisResponse(
            analysis_id=analysis.id,
            message="Document analysis started. This may take 1-2 minutes to complete.",
            status=analysis.status
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start analysis: {str(e)}"
        )

@router.get("/{analysis_id}", response_model=DocumentAnalysisResponse)
async def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get analysis results by ID
    """
    analysis = analysis_service.get_user_analysis(db, current_user, analysis_id)
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return DocumentAnalysisResponse.model_validate(analysis)

@router.get("/", response_model=List[DocumentAnalysisResponse])
async def get_user_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all analyses for the current user
    """
    analyses = analysis_service.get_user_analyses(db, current_user)
    return [DocumentAnalysisResponse.model_validate(analysis) for analysis in analyses]

@router.get("/latest/status", response_model=DocumentAnalysisResponse)
async def get_latest_analysis_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get the status of the most recent analysis
    """
    analysis = analysis_service.get_latest_user_analysis(db, current_user)
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No analyses found"
        )
    
    return DocumentAnalysisResponse.model_validate(analysis)