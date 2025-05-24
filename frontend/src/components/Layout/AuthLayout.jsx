import React from 'react';
import styles from '../common.module.css';

const AuthLayout = ({ children }) => {
	return (
		<div className={styles.centered}>{children}</div>
	);
};

export default AuthLayout; 