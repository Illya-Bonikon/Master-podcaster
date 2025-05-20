import React from 'react';
import Header from './Header';
import Player from './Player';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
	return (
		<div className={styles.layout}>
			<Header />
			<main className={styles.main}>{children}</main>
			<Player />
		</div>
	);
};

export default MainLayout; 