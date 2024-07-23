import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Aquí puedes agregar manejo adicional de errores, como enviar errores a un servicio de registro, etc.
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar el mensaje de error que se muestra al usuario
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; // Renderiza los componentes hijos normalmente
  }
}

export default ErrorBoundary; // Exporta el componente por defecto