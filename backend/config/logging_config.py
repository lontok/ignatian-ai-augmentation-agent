import logging
import logging.config
import os
from pathlib import Path

def setup_logging(environment: str = "development"):
    """
    Configure logging based on environment
    
    In production, logs should go to:
    - stdout/stderr for cloud platforms (AWS CloudWatch, Google Cloud Logging, etc.)
    - Structured JSON format for better parsing
    - Different log levels based on environment
    """
    
    # Base configuration
    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            },
            "json": {
                "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
                "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "default",
                "stream": "ext://sys.stdout"
            }
        },
        "root": {
            "level": "INFO",
            "handlers": ["console"]
        },
        "loggers": {
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False
            },
            "uvicorn.error": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False
            }
        }
    }
    
    # Environment-specific configurations
    if environment == "development":
        # In development, also write to file
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        config["handlers"]["file"] = {
            "class": "logging.handlers.RotatingFileHandler",
            "level": "DEBUG",
            "formatter": "default",
            "filename": "logs/app.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5
        }
        config["root"]["handlers"].append("file")
        config["root"]["level"] = "DEBUG"
        
    elif environment in ["qa", "production"]:
        # In production, use JSON formatter for better parsing
        config["handlers"]["console"]["formatter"] = "json"
        
        # In production, you might want ERROR level only
        if environment == "production":
            config["root"]["level"] = "WARNING"
            config["loggers"]["uvicorn"]["level"] = "WARNING"
    
    # Apply configuration
    logging.config.dictConfig(config)
    
    # Return logger
    return logging.getLogger(__name__)

# Create a logger instance that can be imported
logger = setup_logging(os.getenv("DB_SCHEMA", "development"))