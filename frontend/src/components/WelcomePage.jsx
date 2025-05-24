import React from 'react';
import { useNavigate } from 'react-router-dom';
import common from './common.module.css';

const WelcomePage = () => {
	const navigate = useNavigate();
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
				<button className={common.login} onClick={() => navigate('/login')}>Увійти</button>
				<button className={common.register} onClick={() => navigate('/register')}>Реєстрація</button>
			</div>
		</div>
	);
};

export default WelcomePage; 