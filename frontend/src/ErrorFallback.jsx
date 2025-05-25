import React from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Щось пішло не так:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Спробувати ще раз</button>
    </div>
  );
}

export default ErrorFallback; 