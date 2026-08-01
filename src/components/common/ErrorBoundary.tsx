import { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Send to Sentry or other error tracking service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
            >
              <AlertTriangle className="h-10 w-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 text-center mb-8"
            >
              We encountered an unexpected error. Our team has been notified and
              we're working to fix it.
            </motion.p>

            {/* Error details (development only) */}
            {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <p className="font-mono text-sm text-red-900 dark:text-red-300 mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700 dark:text-red-400 text-sm font-semibold">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs text-red-800 dark:text-red-300 overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Button
                onClick={this.handleReset}
                size="lg"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const handleError = (error: Error) => {
    // This will be caught by nearest ErrorBoundary
    throw error;
  };

  return handleError;
}