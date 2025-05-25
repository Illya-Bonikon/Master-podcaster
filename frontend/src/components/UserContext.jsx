import React, { createContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext({ isModerator: false });

export const UserProvider = ({ children }) => {
	const token = localStorage.getItem('token');

	let decoded = {};
	try {
		if (token) decoded = jwtDecode(token);
	} catch (e) {
		decoded = {};
	}
	
	const isModerator = decoded.role === "moderator";
	console.log(decoded);
	console.log(isModerator);
	
	return (
		<UserContext.Provider value={{ isModerator }}>
			{children}
		</UserContext.Provider>
	);
};