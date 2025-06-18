import asyncio
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.document import Document
from app.models.analysis import DocumentAnalysis, IPPStageProgress
from app.services.llm_service import llm_service

class AnalysisService:
    
    async def start_document_analysis(
        self, 
        db: Session, 
        user: User, 
        resume_document_id: int, 
        job_document_id: int
    ) -> DocumentAnalysis:
        """Start analysis of uploaded documents"""
        
        # Verify documents exist and belong to user
        resume_doc = db.query(Document).filter(
            Document.id == resume_document_id,
            Document.user_id == user.id,
            Document.document_type == "resume"
        ).first()
        
        job_doc = db.query(Document).filter(
            Document.id == job_document_id,
            Document.user_id == user.id,
            Document.document_type == "job_description"
        ).first()
        
        if not resume_doc or not job_doc:
            raise ValueError("Documents not found or don't belong to user")
        
        if not resume_doc.content_text or not job_doc.content_text:
            raise ValueError("Document text content not available")
        
        # Create analysis record
        analysis = DocumentAnalysis(
            user_id=user.id,
            resume_document_id=resume_document_id,
            job_document_id=job_document_id,
            status="pending"
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        # Start async analysis
        asyncio.create_task(self._perform_analysis(analysis.id, resume_doc.content_text, job_doc.content_text))
        
        return analysis
    
    async def _perform_analysis(self, analysis_id: int, resume_text: str, job_text: str):
        """Perform the actual LLM analysis (runs asynchronously)"""
        
        # Get a new database session for the background task
        from database.connection import get_db
        db = next(get_db())
        
        try:
            # Update status to processing
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if not analysis:
                return
            
            analysis.status = "processing"
            db.commit()
            
            # Step 1: Analyze resume
            print(f"Analyzing resume for analysis {analysis_id}")
            resume_analysis = await llm_service.analyze_resume(resume_text)
            
            analysis.resume_analysis = resume_analysis
            db.commit()
            
            # Step 2: Analyze job description
            print(f"Analyzing job description for analysis {analysis_id}")
            job_analysis = await llm_service.analyze_job_description(job_text)
            
            analysis.job_analysis = job_analysis
            db.commit()
            
            # Step 3: Find connections
            print(f"Finding connections for analysis {analysis_id}")
            connections = await llm_service.find_connections(resume_analysis, job_analysis)
            
            analysis.connections_analysis = connections
            db.commit()
            
            # Step 4: Generate context summary
            print(f"Generating context summary for analysis {analysis_id}")
            context_summary = await llm_service.generate_context_summary(
                resume_analysis, job_analysis, connections
            )
            
            analysis.context_summary = context_summary
            analysis.status = "completed"
            analysis.completed_at = datetime.utcnow()
            db.commit()
            
            # Create IPP progress record
            ipp_progress = IPPStageProgress(
                user_id=analysis.user_id,
                analysis_id=analysis.id,
                context_completed=True,
                context_completed_at=datetime.utcnow()
            )
            db.add(ipp_progress)
            db.commit()
            
            print(f"Analysis {analysis_id} completed successfully")
            
        except Exception as e:
            print(f"Analysis {analysis_id} failed: {str(e)}")
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if analysis:
                analysis.status = "failed"
                analysis.error_message = str(e)
                db.commit()
        
        finally:
            db.close()
    
    def get_user_analysis(self, db: Session, user: User, analysis_id: int) -> Optional[DocumentAnalysis]:
        """Get analysis by ID for a specific user"""
        return db.query(DocumentAnalysis).filter(
            DocumentAnalysis.id == analysis_id,
            DocumentAnalysis.user_id == user.id
        ).first()
    
    def get_latest_user_analysis(self, db: Session, user: User) -> Optional[DocumentAnalysis]:
        """Get the most recent analysis for a user"""
        return db.query(DocumentAnalysis).filter(
            DocumentAnalysis.user_id == user.id
        ).order_by(DocumentAnalysis.created_at.desc()).first()
    
    def get_user_analyses(self, db: Session, user: User) -> list[DocumentAnalysis]:
        """Get all analyses for a user"""
        return db.query(DocumentAnalysis).filter(
            DocumentAnalysis.user_id == user.id
        ).order_by(DocumentAnalysis.created_at.desc()).all()

# Global instance
analysis_service = AnalysisService()