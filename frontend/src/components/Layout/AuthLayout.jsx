import React from 'react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
	return (
		<div className={styles.authBg}>
		<div className={styles.centered}>{children}</div>
		</div>
	);
};

export default AuthLayout; 