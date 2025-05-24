import React, { useContext } from 'react';
import Header from './Header';
import Player from './Player';
import styles from './MainLayout.module.css';
import { UserContext } from '../UserContext.jsx';

const MainLayout = ({ children }) => {
	const { isModerator } = useContext(UserContext);
	return (
		<div className={styles.layout}>
			<Header />
			<main className={styles.main}>{children}</main>
			{!isModerator && <Player />}
		</div>
	);
};

export default MainLayout; 