import asyncio
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
import time
import logging

from app.models.user import User
from app.models.document import Document
from app.models.analysis import DocumentAnalysis, IPPStageProgress
from app.models.questionnaire import UserBackgroundQuestionnaire
from app.services.llm_service import llm_service

logger = logging.getLogger(__name__)

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
            analysis.progress_step = "initializing"
            analysis.progress_message = "Starting document analysis..."
            db.commit()
            
            # Add small delay to show initial progress
            await asyncio.sleep(0.5)
            
            # Step 1: Analyze resume
            logger.info(f"Analyzing resume for analysis {analysis_id}")
            analysis.progress_step = "analyzing_resume"
            analysis.progress_message = "Analyzing your resume to extract skills, experience, and qualifications..."
            db.commit()
            
            resume_analysis = await llm_service.analyze_resume(resume_text)
            
            analysis.resume_analysis = resume_analysis
            db.commit()
            
            # Small delay after resume analysis
            await asyncio.sleep(0.3)
            
            # Step 2: Analyze job description
            logger.info(f"Analyzing job description for analysis {analysis_id}")
            analysis.progress_step = "analyzing_job"
            analysis.progress_message = "Analyzing the job description to understand requirements and expectations..."
            db.commit()
            
            job_analysis = await llm_service.analyze_job_description(job_text)
            
            analysis.job_analysis = job_analysis
            db.commit()
            
            # Small delay after job analysis
            await asyncio.sleep(0.3)
            
            # Step 3: Find connections
            logger.info(f"Finding connections for analysis {analysis_id}")
            analysis.progress_step = "finding_connections"
            analysis.progress_message = "Identifying connections between your background and the job requirements..."
            db.commit()
            
            connections = await llm_service.find_connections(resume_analysis, job_analysis)
            
            # Small delay before evidence extraction
            await asyncio.sleep(0.3)
            
            # Step 3b: Extract detailed evidence with quotes
            logger.info(f"Extracting detailed evidence for analysis {analysis_id}")
            analysis.progress_step = "extracting_evidence"
            analysis.progress_message = "Extracting specific evidence and quotes from your documents..."
            db.commit()
            
            detailed_evidence = await llm_service.extract_detailed_evidence(resume_text, job_text)
            
            # Merge detailed evidence into connections if successful
            if detailed_evidence and "skill_alignment" in detailed_evidence:
                connections["skill_alignment"] = detailed_evidence["skill_alignment"]
            
            analysis.connections_analysis = connections
            db.commit()
            
            # Small delay before summary generation
            await asyncio.sleep(0.3)
            
            # Step 4: Generate context summary
            logger.info(f"Generating context summary for analysis {analysis_id}")
            analysis.progress_step = "generating_summary"
            analysis.progress_message = "Creating your personalized context summary and recommendations..."
            db.commit()
            
            summary_result = await llm_service.generate_context_summary(
                resume_analysis, job_analysis, connections
            )
            
            # Log the result for debugging
            logger.debug(f"Context summary result keys: {summary_result.keys()}")
            logger.debug(f"Role fit narrative: {summary_result.get('role_fit_narrative', '')[:100]}...")
            logger.debug(f"Strengths count: {len(summary_result.get('strengths', []))}")
            logger.debug(f"Gaps count: {len(summary_result.get('gaps', []))}")
            
            # Save all the structured fields
            analysis.context_summary = summary_result.get("context_summary", "")
            analysis.role_fit_narrative = summary_result.get("role_fit_narrative", "")
            analysis.strengths = summary_result.get("strengths", [])
            analysis.gaps = summary_result.get("gaps", [])
            analysis.status = "completed"
            analysis.completed_at = datetime.utcnow()
            analysis.progress_step = "completed"
            analysis.progress_message = "Analysis complete!"
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
            
            logger.info(f"Analysis {analysis_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Analysis {analysis_id} failed: {str(e)}", exc_info=True)
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if analysis:
                analysis.status = "failed"
                analysis.error_message = str(e)
                analysis.progress_step = "failed"
                analysis.progress_message = f"Analysis failed: {str(e)}"
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
    
    async def start_resume_analysis(
        self, 
        db: Session, 
        user: User, 
        resume_document_id: int
    ) -> DocumentAnalysis:
        """Start analysis of resume only (for Context stage)"""
        
        # Verify resume document exists and belongs to user
        resume_doc = db.query(Document).filter(
            Document.id == resume_document_id,
            Document.user_id == user.id,
            Document.document_type == "resume"
        ).first()
        
        if not resume_doc:
            raise ValueError("Resume document not found or doesn't belong to user")
        
        if not resume_doc.content_text:
            raise ValueError("Resume text content not available")
        
        # Check if user has completed questionnaire
        questionnaire = db.query(UserBackgroundQuestionnaire).filter(
            UserBackgroundQuestionnaire.user_id == user.id,
            UserBackgroundQuestionnaire.completed_at.isnot(None)
        ).order_by(UserBackgroundQuestionnaire.created_at.desc()).first()
        
        # Create analysis record with only resume
        analysis = DocumentAnalysis(
            user_id=user.id,
            resume_document_id=resume_document_id,
            job_document_id=None,  # No job document for resume-only analysis
            background_questionnaire_id=questionnaire.id if questionnaire else None,
            status="pending"
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        # Start asynchronous analysis
        asyncio.create_task(self._perform_resume_only_analysis(
            analysis_id=analysis.id,
            resume_text=resume_doc.content_text,
            questionnaire_data=questionnaire.responses if questionnaire else None
        ))
        
        return analysis
    
    async def _perform_resume_only_analysis(self, analysis_id: int, resume_text: str, questionnaire_data: dict = None):
        """Perform resume-only LLM analysis with Ignatian focus"""
        
        # Get a new database session for the background task
        from database.connection import get_db
        db = next(get_db())
        
        try:
            # Update status to processing
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if not analysis:
                return
            
            analysis.status = "processing"
            analysis.progress_step = "initializing"
            analysis.progress_message = "Starting enhanced Ignatian analysis of your resume..."
            db.commit()
            
            # Add small delay to show initial progress
            await asyncio.sleep(0.5)
            
            # Analyze resume with enhanced Ignatian prompts
            logger.info(f"Analyzing resume with Ignatian focus for analysis {analysis_id}")
            analysis.progress_step = "analyzing_resume"
            analysis.progress_message = "Extracting skills, values, character strengths, and growth indicators from your resume..."
            db.commit()
            
            # Build user context with questionnaire data if available
            user_context = {}
            if questionnaire_data:
                logger.info(f"Including questionnaire data in resume analysis for enhanced personalization")
                user_context = {
                    'has_questionnaire': True,
                    'career_values': questionnaire_data.get('career_values', ''),
                    'mission_alignment': questionnaire_data.get('mission_alignment', ''),
                    'service_experience': questionnaire_data.get('service_experience', ''),
                    'helping_others': questionnaire_data.get('helping_others', ''),
                    'learning_style': questionnaire_data.get('learning_style', ''),
                    'work_environment': questionnaire_data.get('work_environment', ''),
                    'collaboration_style': questionnaire_data.get('collaboration_style', ''),
                    'values_focus': 'deep personal context available'
                }
            
            resume_analysis = await llm_service.analyze_resume(resume_text, user_context)
            
            # Log to verify new fields are present
            logger.info(f"Resume analysis keys: {resume_analysis.keys()}")
            if 'character_strengths' in resume_analysis:
                logger.info(f"Found character_strengths in analysis")
            if 'values_indicators' in resume_analysis:
                logger.info(f"Found values_indicators in analysis")
            
            analysis.resume_analysis = resume_analysis
            analysis.status = "completed"
            analysis.completed_at = datetime.utcnow()
            analysis.progress_step = "completed"
            analysis.progress_message = "Resume analysis complete with Ignatian insights!"
            db.commit()
            
            logger.info(f"Resume-only analysis {analysis_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Resume analysis {analysis_id} failed: {str(e)}", exc_info=True)
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if analysis:
                analysis.status = "failed"
                analysis.error_message = str(e)
                analysis.progress_step = "failed"
                analysis.progress_message = f"Analysis failed: {str(e)}"
                db.commit()
        
        finally:
            db.close()
    
    async def start_job_analysis(
        self,
        db: Session,
        user: User,
        existing_analysis_id: int,
        job_document_id: int
    ) -> DocumentAnalysis:
        """Start job analysis using existing resume analysis"""
        
        # Get existing analysis
        existing_analysis = db.query(DocumentAnalysis).filter(
            DocumentAnalysis.id == existing_analysis_id,
            DocumentAnalysis.user_id == user.id
        ).first()
        
        if not existing_analysis:
            raise ValueError("Existing analysis not found")
        
        if not existing_analysis.resume_analysis:
            raise ValueError("Existing analysis does not have resume data")
        
        # Verify job document exists and belongs to user
        job_doc = db.query(Document).filter(
            Document.id == job_document_id,
            Document.user_id == user.id,
            Document.document_type == "job_description"
        ).first()
        
        if not job_doc:
            raise ValueError("Job document not found or doesn't belong to user")
        
        if not job_doc.content_text:
            raise ValueError("Job document text content not available")
        
        # Update the existing analysis with job document
        existing_analysis.job_document_id = job_document_id
        existing_analysis.status = "pending"
        existing_analysis.progress_step = "initializing"
        existing_analysis.progress_message = "Starting job analysis..."
        db.commit()
        
        # Start async job analysis
        asyncio.create_task(self._perform_job_analysis(
            analysis_id=existing_analysis.id,
            resume_analysis=existing_analysis.resume_analysis,
            job_text=job_doc.content_text
        ))
        
        return existing_analysis
    
    async def _perform_job_analysis(self, analysis_id: int, resume_analysis: dict, job_text: str):
        """Perform job analysis and matching with existing resume data"""
        
        # Get a new database session for the background task
        from database.connection import get_db
        db = next(get_db())
        
        try:
            # Update status to processing
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if not analysis:
                return
            
            analysis.status = "processing"
            analysis.progress_step = "analyzing_job"
            analysis.progress_message = "Analyzing the job description to understand requirements..."
            db.commit()
            
            # Analyze job description
            logger.info(f"Analyzing job description for analysis {analysis_id}")
            job_analysis = await llm_service.analyze_job_description(job_text)
            
            analysis.job_analysis = job_analysis
            db.commit()
            
            await asyncio.sleep(0.3)
            
            # Find connections using existing resume analysis
            logger.info(f"Finding connections for analysis {analysis_id}")
            analysis.progress_step = "finding_connections"
            analysis.progress_message = "Identifying connections between your background and the job..."
            db.commit()
            
            connections = await llm_service.find_connections(resume_analysis, job_analysis)
            
            await asyncio.sleep(0.3)
            
            # Extract detailed evidence
            logger.info(f"Extracting detailed evidence for analysis {analysis_id}")
            analysis.progress_step = "extracting_evidence"
            analysis.progress_message = "Finding specific evidence from your experience..."
            db.commit()
            
            # Get resume text for evidence extraction
            resume_doc = db.query(Document).filter(
                Document.id == analysis.resume_document_id
            ).first()
            
            if resume_doc and resume_doc.content_text:
                detailed_evidence = await llm_service.extract_detailed_evidence(
                    resume_doc.content_text, job_text
                )
                
                if detailed_evidence and "skill_alignment" in detailed_evidence:
                    connections["skill_alignment"] = detailed_evidence["skill_alignment"]
            
            analysis.connections_analysis = connections
            db.commit()
            
            await asyncio.sleep(0.3)
            
            # Generate summary
            logger.info(f"Generating summary for analysis {analysis_id}")
            analysis.progress_step = "generating_summary"
            analysis.progress_message = "Creating your personalized insights..."
            db.commit()
            
            summary_result = await llm_service.generate_context_summary(
                resume_analysis, job_analysis, connections
            )
            
            if "context_summary" in summary_result:
                analysis.context_summary = summary_result["context_summary"]
            if "role_fit_narrative" in summary_result:
                analysis.role_fit_narrative = summary_result["role_fit_narrative"]
            if "strengths" in summary_result:
                analysis.strengths = summary_result["strengths"]
            if "gaps" in summary_result:
                analysis.gaps = summary_result["gaps"]
            
            analysis.status = "completed"
            analysis.completed_at = datetime.utcnow()
            analysis.progress_step = "completed"
            analysis.progress_message = "Analysis complete!"
            db.commit()
            
            logger.info(f"Job analysis {analysis_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Job analysis {analysis_id} failed: {str(e)}", exc_info=True)
            analysis = db.query(DocumentAnalysis).filter(DocumentAnalysis.id == analysis_id).first()
            if analysis:
                analysis.status = "failed"
                analysis.error_message = str(e)
                analysis.progress_step = "failed"
                analysis.progress_message = f"Analysis failed: {str(e)}"
                db.commit()
        
        finally:
            db.close()

# Global instance
analysis_service = AnalysisService()