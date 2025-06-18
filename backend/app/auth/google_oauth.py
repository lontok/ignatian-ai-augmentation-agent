from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status
from typing import Optional

from config.settings import settings
from app.models.user import User

class GoogleOAuthService:
    def __init__(self):
        self.client_id = settings.google_client_id
        self.secret_key = settings.secret_key
        self.algorithm = settings.algorithm
        self.token_expire_minutes = settings.access_token_expire_minutes

    async def verify_google_token(self, token: str) -> dict:
        """Verify Google ID token and return user info"""
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                self.client_id
            )
            
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            return idinfo
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google token: {str(e)}"
            )

    def create_access_token(self, data: dict) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.token_expire_minutes)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            self.secret_key, 
            algorithm=self.algorithm
        )
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[dict]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=[self.algorithm]
            )
            return payload
        except JWTError:
            return None

    def get_or_create_user(self, db: Session, google_user_info: dict) -> User:
        """Get existing user or create new user from Google info"""
        google_id = google_user_info.get('sub')
        email = google_user_info.get('email')
        
        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Google user information"
            )
        
        # Check if user exists by Google ID
        user = db.query(User).filter(User.google_id == google_id).first()
        
        if not user:
            # Check if user exists by email (in case of account linking)
            user = db.query(User).filter(User.email == email).first()
            if user:
                # Update existing user with Google ID
                user.google_id = google_id
            else:
                # Create new user
                user = User(
                    google_id=google_id,
                    email=email,
                    name=google_user_info.get('name', ''),
                    given_name=google_user_info.get('given_name', ''),
                    family_name=google_user_info.get('family_name', ''),
                    picture=google_user_info.get('picture', ''),
                    is_active=True
                )
                db.add(user)
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)
        
        return user

# Global instance
google_oauth_service = GoogleOAuthService()