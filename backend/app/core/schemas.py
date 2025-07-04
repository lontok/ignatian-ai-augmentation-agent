from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class GoogleTokenRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserProfile"

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserProfile(BaseModel):
    id: int
    email: EmailStr
    name: str
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    picture: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str

# Document schemas
class DocumentTypeEnum(str, Enum):
    RESUME = "resume"
    JOB_DESCRIPTION = "job_description"

class DocumentUploadResponse(BaseModel):
    id: int
    document_type: DocumentTypeEnum
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    created_at: datetime
    content_text: Optional[str] = None
    
    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    document_type: DocumentTypeEnum
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    created_at: datetime
    updated_at: datetime
    content_text: Optional[str] = None
    
    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]

# Analysis schemas
class AnalysisStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class DocumentAnalysisResponse(BaseModel):
    id: int
    status: AnalysisStatusEnum
    resume_document_id: Optional[int] = None
    job_document_id: Optional[int] = None
    background_questionnaire_id: Optional[int] = None
    resume_analysis: Optional[dict] = None
    job_analysis: Optional[dict] = None
    connections_analysis: Optional[dict] = None
    context_summary: Optional[str] = None
    role_fit_narrative: Optional[str] = None
    strengths: Optional[List[str]] = None
    gaps: Optional[List[str]] = None
    progress_step: Optional[str] = None
    progress_message: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class StartAnalysisRequest(BaseModel):
    resume_document_id: int
    job_document_id: int

class StartResumeAnalysisRequest(BaseModel):
    resume_document_id: int

class StartJobAnalysisRequest(BaseModel):
    existing_analysis_id: int
    job_document_id: int

class StartAnalysisResponse(BaseModel):
    analysis_id: int
    message: str
    status: AnalysisStatusEnum

# Questionnaire schemas
class BackgroundQuestionnaireCreate(BaseModel):
    responses: Dict[str, Any]  # Flexible JSON object for responses
    is_complete: bool = False
    
class BackgroundQuestionnaireUpdate(BaseModel):
    responses: Dict[str, Any]  # Flexible JSON object for responses
    is_complete: bool = False

class BackgroundQuestionnaireResponse(BaseModel):
    id: int
    user_id: int
    responses: Dict[str, Any]  # Flexible JSON object for responses
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Forward reference resolution
TokenResponse.model_rebuild()