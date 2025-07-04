from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from config.settings import settings
from config.logging_config import setup_logging
from app.api import auth_router, documents_router, analysis_router, questionnaire_router

# Setup logging based on environment
logger = setup_logging(settings.environment)

# Create FastAPI application
app = FastAPI(
    title="Ignatian AI Augmentation Agent API",
    description="Backend API for the Ignatian AI Augmentation Agent web application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(questionnaire_router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse({
        "message": "Ignatian AI Augmentation Agent API",
        "version": "1.0.0",
        "docs": "/api/docs"
    })

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({
        "status": "healthy",
        "environment": settings.environment
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )