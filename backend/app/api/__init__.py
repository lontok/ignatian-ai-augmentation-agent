from .auth import router as auth_router
from .documents import router as documents_router
from .analysis import router as analysis_router
from .questionnaire import router as questionnaire_router

__all__ = ["auth_router", "documents_router", "analysis_router", "questionnaire_router"]