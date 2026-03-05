import { Component } from 'react';

/**
 * ErrorBoundary
 * Catches unexpected render-time errors in the chart subtree.
 * Renders a styled fallback that matches the dashboard design system.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    // In production you'd send to an error tracking service here
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen" role="alert">
          <div className="error-screen__border" aria-hidden="true">⚠</div>
          <p className="error-screen__code">Render error</p>
          <p className="error-screen__title">Something went wrong</p>
          <p className="error-screen__message">{this.state.message}</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 'var(--space-5)' }}
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}