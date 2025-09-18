"""
Comprehensive Error Handling System for ProfitWi$e Platform
Handles all types of errors with proper logging, user feedback, and recovery mechanisms
"""

import logging
import traceback
import json
import functools
from datetime import datetime
from typing import Dict, Any, Optional, Callable
from flask import jsonify, request, session
import openai
import requests
from werkzeug.exceptions import HTTPException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('profitwise_errors.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ProfitWiseError(Exception):
    """Base exception class for ProfitWi$e platform"""
    def __init__(self, message: str, error_code: str = "GENERIC_ERROR", status_code: int = 500, details: Dict = None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        self.timestamp = datetime.now().isoformat()
        super().__init__(self.message)

class ValidationError(ProfitWiseError):
    """Raised when input validation fails"""
    def __init__(self, message: str, field: str = None, details: Dict = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=400,
            details={"field": field, **(details or {})}
        )

class AuthenticationError(ProfitWiseError):
    """Raised when authentication fails"""
    def __init__(self, message: str = "Authentication failed", details: Dict = None):
        super().__init__(
            message=message,
            error_code="AUTH_ERROR",
            status_code=401,
            details=details or {}
        )

class AuthorizationError(ProfitWiseError):
    """Raised when user lacks permission"""
    def __init__(self, message: str = "Access denied", details: Dict = None):
        super().__init__(
            message=message,
            error_code="AUTHZ_ERROR",
            status_code=403,
            details=details or {}
        )

class DataNotFoundError(ProfitWiseError):
    """Raised when requested data is not found"""
    def __init__(self, message: str = "Data not found", resource: str = None, details: Dict = None):
        super().__init__(
            message=message,
            error_code="NOT_FOUND",
            status_code=404,
            details={"resource": resource, **(details or {})}
        )

class ExternalServiceError(ProfitWiseError):
    """Raised when external service calls fail"""
    def __init__(self, service: str, message: str, details: Dict = None):
        super().__init__(
            message=f"External service error ({service}): {message}",
            error_code="EXTERNAL_SERVICE_ERROR",
            status_code=502,
            details={"service": service, **(details or {})}
        )

class DatabaseError(ProfitWiseError):
    """Raised when database operations fail"""
    def __init__(self, message: str, operation: str = None, details: Dict = None):
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=500,
            details={"operation": operation, **(details or {})}
        )

class AIAnalysisError(ProfitWiseError):
    """Raised when AI analysis fails"""
    def __init__(self, message: str, analysis_type: str = None, details: Dict = None):
        super().__init__(
            message=message,
            error_code="AI_ANALYSIS_ERROR",
            status_code=500,
            details={"analysis_type": analysis_type, **(details or {})}
        )

class RateLimitError(ProfitWiseError):
    """Raised when rate limits are exceeded"""
    def __init__(self, message: str = "Rate limit exceeded", retry_after: int = None, details: Dict = None):
        super().__init__(
            message=message,
            error_code="RATE_LIMIT_ERROR",
            status_code=429,
            details={"retry_after": retry_after, **(details or {})}
        )

def handle_errors(func: Callable) -> Callable:
    """Decorator to handle errors in Flask routes"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ProfitWiseError as e:
            logger.error(f"ProfitWi$e Error in {func.__name__}: {e.message}", extra={
                "error_code": e.error_code,
                "status_code": e.status_code,
                "details": e.details,
                "user_id": session.get('user_id'),
                "endpoint": request.endpoint,
                "method": request.method
            })
            return jsonify({
                "error": True,
                "message": e.message,
                "error_code": e.error_code,
                "details": e.details,
                "timestamp": e.timestamp
            }), e.status_code
        except openai.error.OpenAIError as e:
            logger.error(f"OpenAI Error in {func.__name__}: {str(e)}", extra={
                "user_id": session.get('user_id'),
                "endpoint": request.endpoint
            })
            return jsonify({
                "error": True,
                "message": "AI service temporarily unavailable. Please try again later.",
                "error_code": "AI_SERVICE_ERROR",
                "details": {"service": "openai", "retry_after": 60},
                "timestamp": datetime.now().isoformat()
            }), 503
        except requests.RequestException as e:
            logger.error(f"Request Error in {func.__name__}: {str(e)}", extra={
                "user_id": session.get('user_id'),
                "endpoint": request.endpoint
            })
            return jsonify({
                "error": True,
                "message": "External service temporarily unavailable. Please try again later.",
                "error_code": "EXTERNAL_SERVICE_ERROR",
                "details": {"retry_after": 30},
                "timestamp": datetime.now().isoformat()
            }), 503
        except HTTPException as e:
            logger.warning(f"HTTP Error in {func.__name__}: {str(e)}", extra={
                "user_id": session.get('user_id'),
                "endpoint": request.endpoint,
                "status_code": e.code
            })
            return jsonify({
                "error": True,
                "message": e.description,
                "error_code": "HTTP_ERROR",
                "status_code": e.code,
                "timestamp": datetime.now().isoformat()
            }), e.code
        except Exception as e:
            logger.critical(f"Unexpected Error in {func.__name__}: {str(e)}", extra={
                "user_id": session.get('user_id'),
                "endpoint": request.endpoint,
                "traceback": traceback.format_exc()
            })
            return jsonify({
                "error": True,
                "message": "An unexpected error occurred. Our team has been notified.",
                "error_code": "INTERNAL_ERROR",
                "timestamp": datetime.now().isoformat()
            }), 500
    return wrapper

def validate_required_fields(data: Dict, required_fields: list) -> None:
    """Validate that required fields are present in data"""
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        raise ValidationError(
            message=f"Missing required fields: {', '.join(missing_fields)}",
            details={"missing_fields": missing_fields}
        )

def validate_user_authentication() -> str:
    """Validate user authentication and return user_id"""
    if not session.get('user_authenticated'):
        raise AuthenticationError("User not authenticated")
    
    user_id = session.get('user_id')
    if not user_id:
        raise AuthenticationError("Invalid session")
    
    return user_id

def validate_admin_authentication() -> None:
    """Validate admin authentication"""
    if not session.get('admin_authenticated'):
        raise AuthorizationError("Admin access required")

def safe_json_loads(json_string: str, default: Any = None) -> Any:
    """Safely parse JSON string with error handling"""
    try:
        return json.loads(json_string)
    except (json.JSONDecodeError, TypeError) as e:
        logger.warning(f"JSON parsing error: {str(e)}")
        return default

def safe_file_operation(operation: Callable, *args, **kwargs) -> Any:
    """Safely perform file operations with error handling"""
    try:
        return operation(*args, **kwargs)
    except FileNotFoundError as e:
        raise DataNotFoundError(f"File not found: {str(e)}")
    except PermissionError as e:
        raise AuthorizationError(f"Permission denied: {str(e)}")
    except OSError as e:
        raise DatabaseError(f"File system error: {str(e)}")

def retry_on_failure(max_retries: int = 3, delay: float = 1.0):
    """Decorator to retry operations on failure"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except (requests.RequestException, openai.error.OpenAIError) as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        logger.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {str(e)}. Retrying...")
                        import time
                        time.sleep(delay * (2 ** attempt))  # Exponential backoff
                    else:
                        logger.error(f"All {max_retries} attempts failed for {func.__name__}")
                        raise ExternalServiceError(
                            service="external_api",
                            message=f"Service unavailable after {max_retries} attempts",
                            details={"last_error": str(last_exception)}
                        )
                except Exception as e:
                    # Don't retry on non-retryable errors
                    raise e
            raise last_exception
        return wrapper
    return decorator

def log_performance(func: Callable) -> Callable:
    """Decorator to log function performance"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = datetime.now()
        try:
            result = func(*args, **kwargs)
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Function {func.__name__} completed in {execution_time:.2f}s")
            return result
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Function {func.__name__} failed after {execution_time:.2f}s: {str(e)}")
            raise
    return wrapper

class ErrorMonitor:
    """Monitor and track errors for analytics"""
    
    def __init__(self):
        self.error_counts = {}
        self.error_history = []
    
    def record_error(self, error: Exception, context: Dict = None):
        """Record an error for monitoring"""
        error_type = type(error).__name__
        self.error_counts[error_type] = self.error_counts.get(error_type, 0) + 1
        
        self.error_history.append({
            "timestamp": datetime.now().isoformat(),
            "error_type": error_type,
            "message": str(error),
            "context": context or {},
            "user_id": session.get('user_id'),
            "endpoint": request.endpoint if request else None
        })
        
        # Keep only last 1000 errors
        if len(self.error_history) > 1000:
            self.error_history = self.error_history[-1000:]
    
    def get_error_stats(self) -> Dict:
        """Get error statistics"""
        return {
            "error_counts": self.error_counts,
            "total_errors": sum(self.error_counts.values()),
            "recent_errors": self.error_history[-10:] if self.error_history else []
        }

# Global error monitor instance
error_monitor = ErrorMonitor()

def get_user_friendly_message(error: Exception) -> str:
    """Convert technical errors to user-friendly messages"""
    if isinstance(error, ValidationError):
        return f"Please check your input: {error.message}"
    elif isinstance(error, AuthenticationError):
        return "Please log in to continue."
    elif isinstance(error, AuthorizationError):
        return "You don't have permission to perform this action."
    elif isinstance(error, DataNotFoundError):
        return "The requested information could not be found."
    elif isinstance(error, ExternalServiceError):
        return "A service is temporarily unavailable. Please try again in a few minutes."
    elif isinstance(error, DatabaseError):
        return "There was a problem saving your data. Please try again."
    elif isinstance(error, AIAnalysisError):
        return "AI analysis is temporarily unavailable. Please try again later."
    elif isinstance(error, RateLimitError):
        return "Too many requests. Please wait a moment before trying again."
    else:
        return "Something went wrong. Please try again or contact support if the problem persists."

# Flask error handlers
def register_error_handlers(app):
    """Register global error handlers for Flask app"""
    
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            "error": True,
            "message": "The requested resource was not found",
            "error_code": "NOT_FOUND",
            "timestamp": datetime.now().isoformat()
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({
            "error": True,
            "message": "Method not allowed for this endpoint",
            "error_code": "METHOD_NOT_ALLOWED",
            "timestamp": datetime.now().isoformat()
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.critical(f"Internal server error: {str(error)}", extra={
            "traceback": traceback.format_exc()
        })
        return jsonify({
            "error": True,
            "message": "An internal server error occurred. Our team has been notified.",
            "error_code": "INTERNAL_ERROR",
            "timestamp": datetime.now().isoformat()
        }), 500
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        error_monitor.record_error(error)
        logger.critical(f"Unexpected error: {str(error)}", extra={
            "traceback": traceback.format_exc()
        })
        return jsonify({
            "error": True,
            "message": get_user_friendly_message(error),
            "error_code": "UNEXPECTED_ERROR",
            "timestamp": datetime.now().isoformat()
        }), 500
