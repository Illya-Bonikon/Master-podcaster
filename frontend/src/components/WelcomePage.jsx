import React from 'react';
import { Link } from 'react-router-dom';
import common from './common.module.css';

const WelcomePage = () => {
	return (
		<div className={common.wrapper}>
			<div className={common.logoBox}>
				<div className={common.logo}>🎙️</div>
				<h1 className={common.title}>Master Podcaster</h1>
			</div>
			
			<div className={common.desc}>
				<p>Платформа для створення, прослуховування та обміну подкастами українською мовою!</p>
			</div>
			
			<div className={common.btns}>
				<Link className={common.login} to="/login">Увійти</Link>
				<Link className={common.register} to="/register">Реєстрація</Link>
			</div>
		</div>
	);
};

export default WelcomePage; 