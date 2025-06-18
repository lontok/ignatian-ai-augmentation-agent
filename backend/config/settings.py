from pydantic_settings import BaseSettings
from typing import List, Union
import os

class Settings(BaseSettings):
    # Database
    database_url: str
    db_schema: str = "dev"
    
    # Google OAuth2
    google_client_id: str
    google_client_secret: str
    
    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # OpenAI
    openai_api_key: str
    
    # Application
    environment: str = "development"
    debug: bool = True
    allowed_origins: Union[str, List[str]] = "http://localhost:3000,http://127.0.0.1:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert allowed_origins to list if it's a string"""
        if isinstance(self.allowed_origins, str):
            return [origin.strip() for origin in self.allowed_origins.split(",")]
        return self.allowed_origins

settings = Settings()