import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[TaskFlow error]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <div className="error-screen__icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#dc2626" strokeWidth="1.8" />
              <path d="M14 9v6M14 18v1" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="error-screen__title">Something went wrong</h2>
          <p className="error-screen__message">
            {this.state.message || 'An unexpected error occurred.'}
          </p>
          <button className="error-screen__btn" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
