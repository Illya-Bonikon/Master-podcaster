import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext({ isModerator: false });

export const UserProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem('token'));

	useEffect(() => {
		const onStorage = () => setToken(localStorage.getItem('token'));
		window.addEventListener('storage', onStorage);
		window.addEventListener('tokenChanged', onStorage);
		return () => {
			window.removeEventListener('storage', onStorage);
			window.removeEventListener('tokenChanged', onStorage);
		};
	}, []);

	let decoded = {};
	try {
		if (token) decoded = jwtDecode(token);
	} catch (e) {
		decoded = {};
	}
	
	const isModerator = decoded.role === "moderator";
	if (decoded.role) {
		localStorage.setItem('role', decoded.role);
	} else {
		localStorage.removeItem('role');
	}
	
	console.log(decoded);
	console.log(isModerator);
	
	return (
		<UserContext.Provider value={{ isModerator }}>
			{children}
		</UserContext.Provider>
	);
};