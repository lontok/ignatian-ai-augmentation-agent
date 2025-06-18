from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from app.core.schemas import DocumentUploadResponse, DocumentResponse, DocumentListResponse, DocumentTypeEnum, MessageResponse
from app.auth.dependencies import get_current_active_user
from app.models.user import User
# from app.models.document import DocumentType
from app.services.document_service import document_service

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    document_type: DocumentTypeEnum = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a document (resume or job description)
    """
    try:
        # Upload document
        document = await document_service.upload_document(
            db=db,
            user=current_user,
            file=file,
            document_type=document_type.value
        )
        
        return DocumentUploadResponse.model_validate(document)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document upload failed: {str(e)}"
        )

@router.get("/", response_model=DocumentListResponse)
async def get_user_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all documents for the current user
    """
    documents = document_service.get_user_documents(db, current_user)
    document_responses = [DocumentResponse.model_validate(doc) for doc in documents]
    return DocumentListResponse(documents=document_responses)

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific document by ID
    """
    document = document_service.get_document_by_id(db, current_user, document_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return DocumentResponse.model_validate(document)

@router.delete("/{document_id}", response_model=MessageResponse)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a document
    """
    success = document_service.delete_document(db, current_user, document_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return MessageResponse(message="Document deleted successfully")