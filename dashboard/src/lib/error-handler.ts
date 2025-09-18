/**
 * Comprehensive Error Handling System for ProfitWi$e Dashboard
 * Handles API errors, network issues, and user-friendly error messages
 */

export interface ApiError {
  error: boolean;
  message: string;
  error_code: string;
  details?: any;
  timestamp: string;
  status_code?: number;
}

export interface ErrorContext {
  component: string;
  action: string;
  user_id?: string;
  timestamp: string;
}

export class ProfitWiseError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;
  public readonly details: any;
  public readonly context: ErrorContext;

  constructor(
    message: string,
    errorCode: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    details: any = {},
    context: ErrorContext
  ) {
    super(message);
    this.name = 'ProfitWiseError';
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
    this.context = context;
  }
}

export class ValidationError extends ProfitWiseError {
  constructor(message: string, field?: string, context: ErrorContext) {
    super(
      message,
      'VALIDATION_ERROR',
      400,
      { field },
      context
    );
  }
}

export class AuthenticationError extends ProfitWiseError {
  constructor(message: string = 'Authentication failed', context: ErrorContext) {
    super(
      message,
      'AUTH_ERROR',
      401,
      {},
      context
    );
  }
}

export class NetworkError extends ProfitWiseError {
  constructor(message: string, context: ErrorContext) {
    super(
      message,
      'NETWORK_ERROR',
      0,
      {},
      context
    );
  }
}

export class ApiError extends ProfitWiseError {
  constructor(apiError: ApiError, context: ErrorContext) {
    super(
      apiError.message,
      apiError.error_code,
      apiError.status_code || 500,
      apiError.details,
      context
    );
  }
}

export class DataNotFoundError extends ProfitWiseError {
  constructor(resource: string, context: ErrorContext) {
    super(
      `${resource} not found`,
      'NOT_FOUND',
      404,
      { resource },
      context
    );
  }
}

export class RateLimitError extends ProfitWiseError {
  constructor(retryAfter?: number, context?: ErrorContext) {
    super(
      'Too many requests. Please wait before trying again.',
      'RATE_LIMIT_ERROR',
      429,
      { retryAfter },
      context || { component: 'unknown', action: 'unknown', timestamp: new Date().toISOString() }
    );
  }
}

// Error logging and monitoring
class ErrorLogger {
  private errors: Array<{
    error: ProfitWiseError;
    timestamp: string;
    userAgent: string;
    url: string;
  }> = [];

  log(error: ProfitWiseError): void {
    const errorLog = {
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(errorLog);

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ProfitWi$e Error:', error);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorLog);
    }
  }

  private async sendToErrorService(errorLog: any): Promise<void> {
    try {
      await fetch('/api/error-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (e) {
      // Silently fail to avoid infinite loops
      console.warn('Failed to send error to tracking service:', e);
    }
  }

  getErrorStats(): { total: number; recent: any[] } {
    return {
      total: this.errors.length,
      recent: this.errors.slice(-10)
    };
  }
}

export const errorLogger = new ErrorLogger();

// Error handling utilities
export function createErrorContext(component: string, action: string, user_id?: string): ErrorContext {
  return {
    component,
    action,
    user_id,
    timestamp: new Date().toISOString()
  };
}

export function handleApiError(response: Response, context: ErrorContext): Promise<never> {
  return response.json().then((apiError: ApiError) => {
    const error = new ApiError(apiError, context);
    errorLogger.log(error);
    throw error;
  }).catch(() => {
    const error = new NetworkError(
      `HTTP ${response.status}: ${response.statusText}`,
      context
    );
    errorLogger.log(error);
    throw error;
  });
}

export function handleNetworkError(error: any, context: ErrorContext): never {
  const networkError = new NetworkError(
    error.message || 'Network request failed',
    context
  );
  errorLogger.log(networkError);
  throw networkError;
}

export function getUserFriendlyMessage(error: ProfitWiseError): string {
  switch (error.errorCode) {
    case 'VALIDATION_ERROR':
      return `Please check your input: ${error.message}`;
    case 'AUTH_ERROR':
      return 'Please log in to continue.';
    case 'AUTHZ_ERROR':
      return "You don't have permission to perform this action.";
    case 'NOT_FOUND':
      return 'The requested information could not be found.';
    case 'NETWORK_ERROR':
      return 'Network connection issue. Please check your internet connection.';
    case 'RATE_LIMIT_ERROR':
      return 'Too many requests. Please wait a moment before trying again.';
    case 'AI_ANALYSIS_ERROR':
      return 'AI analysis is temporarily unavailable. Please try again later.';
    case 'EXTERNAL_SERVICE_ERROR':
      return 'A service is temporarily unavailable. Please try again in a few minutes.';
    case 'DATABASE_ERROR':
      return 'There was a problem saving your data. Please try again.';
    default:
      return 'Something went wrong. Please try again or contact support if the problem persists.';
  }
}

// Retry mechanism for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context: ErrorContext
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain error types
      if (error instanceof ProfitWiseError) {
        if (error.errorCode === 'AUTH_ERROR' || 
            error.errorCode === 'AUTHZ_ERROR' || 
            error.errorCode === 'VALIDATION_ERROR') {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // Log the final error
  if (lastError instanceof ProfitWiseError) {
    errorLogger.log(lastError);
  } else {
    const networkError = new NetworkError(
      lastError?.message || 'Request failed after all retries',
      context
    );
    errorLogger.log(networkError);
    throw networkError;
  }

  throw lastError;
}

// Safe API call wrapper
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  context: ErrorContext,
  maxRetries: number = 3
): Promise<T> {
  try {
    return await retryRequest(apiCall, maxRetries, 1000, context);
  } catch (error) {
    if (error instanceof ProfitWiseError) {
      throw error;
    }
    
    const networkError = new NetworkError(
      error?.message || 'API call failed',
      context
    );
    errorLogger.log(networkError);
    throw networkError;
  }
}

// Error boundary for React components
export interface ErrorBoundaryState {
  hasError: boolean;
  error: ProfitWiseError | null;
  errorInfo: any;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: ProfitWiseError }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: any): Partial<ErrorBoundaryState> {
    const context = createErrorContext('ErrorBoundary', 'component_error');
    const profitWiseError = error instanceof ProfitWiseError 
      ? error 
      : new ProfitWiseError(
          error?.message || 'Component error',
          'COMPONENT_ERROR',
          500,
          { originalError: error },
          context
        );

    errorLogger.log(profitWiseError);

    return {
      hasError: true,
      error: profitWiseError
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      errorInfo
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: ProfitWiseError }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-4">
          {getUserFriendlyMessage(error)}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

// Hook for error handling in components
export function useErrorHandler() {
  const handleError = (error: any, context: ErrorContext) => {
    if (error instanceof ProfitWiseError) {
      errorLogger.log(error);
      return error;
    }

    const profitWiseError = new ProfitWiseError(
      error?.message || 'Unknown error',
      'UNKNOWN_ERROR',
      500,
      { originalError: error },
      context
    );
    errorLogger.log(profitWiseError);
    return profitWiseError;
  };

  const handleApiError = (response: Response, context: ErrorContext) => {
    return handleApiError(response, context);
  };

  const handleNetworkError = (error: any, context: ErrorContext) => {
    return handleNetworkError(error, context);
  };

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    getUserFriendlyMessage
  };
}

// Toast notification for errors
export function showErrorToast(error: ProfitWiseError) {
  // This would integrate with your toast notification system
  const message = getUserFriendlyMessage(error);
  
  // Example implementation - replace with your toast system
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(message);
  }
}

// Global error handler for unhandled errors
export function setupGlobalErrorHandling() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      const context = createErrorContext('Global', 'unhandled_error');
      const error = new ProfitWiseError(
        event.error?.message || 'Unhandled error',
        'UNHANDLED_ERROR',
        500,
        { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          originalError: event.error
        },
        context
      );
      errorLogger.log(error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const context = createErrorContext('Global', 'unhandled_promise_rejection');
      const error = new ProfitWiseError(
        event.reason?.message || 'Unhandled promise rejection',
        'UNHANDLED_PROMISE_REJECTION',
        500,
        { originalError: event.reason },
        context
      );
      errorLogger.log(error);
    });
  }
}
