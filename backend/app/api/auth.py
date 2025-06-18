from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.connection import get_db
from app.core.schemas import GoogleTokenRequest, TokenResponse, UserProfile, MessageResponse
from app.auth.google_oauth import google_oauth_service
from app.auth.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login_with_google(
    request: GoogleTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user with Google OAuth2 token
    """
    try:
        # Verify Google token and get user info
        google_user_info = await google_oauth_service.verify_google_token(request.token)
        
        # Get or create user in database
        user = google_oauth_service.get_or_create_user(db, google_user_info)
        
        # Create JWT access token
        access_token = google_oauth_service.create_access_token(
            data={"sub": user.google_id, "email": user.email}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=google_oauth_service.token_expire_minutes * 60,
            user=UserProfile.from_orm(user)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/logout", response_model=MessageResponse)
async def logout(
    current_user: User = Depends(get_current_active_user)
):
    """
    Logout user (client should discard token)
    """
    return MessageResponse(message="Successfully logged out")

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile
    """
    return UserProfile.from_orm(current_user)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Refresh JWT access token
    """
    try:
        # Update last login
        from datetime import datetime
        current_user.last_login = datetime.utcnow()
        db.commit()
        
        # Create new JWT access token
        access_token = google_oauth_service.create_access_token(
            data={"sub": current_user.google_id, "email": current_user.email}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=google_oauth_service.token_expire_minutes * 60,
            user=UserProfile.from_orm(current_user)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )