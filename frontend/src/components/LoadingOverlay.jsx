import React from 'react';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay = ({ message = 'Будь ласка, зачекайте. Триває генерація...' }) => (
  <div className={styles.overlay}>
    <div className={styles.spinner}></div>
    <div className={styles.message}>{message}</div>
  </div>
);

export default LoadingOverlay; 