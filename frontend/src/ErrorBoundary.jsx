import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    
	console.log(error, errorInfo);
    console.error("ErrorBoundary caught an error", error, errorInfo);
	
  }

  render() {
    if (this.state.hasError) {
      return <h2>Щось пішло не так. Спробуйте оновити сторінку.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;