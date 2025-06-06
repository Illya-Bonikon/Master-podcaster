import React from 'react';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay = ({ isLoading = true, message = 'Будь ласка, зачекайте. Триває генерація...' }) => {
  if (!isLoading) return null;
  
  return (
    <div className={styles.overlay} data-testid="loading-overlay">
      <div className={styles.spinner}></div>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default LoadingOverlay; 