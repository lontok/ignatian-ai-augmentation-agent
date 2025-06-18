from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import settings
from app.api import auth_router

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
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")

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