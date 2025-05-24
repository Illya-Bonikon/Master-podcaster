import React, { createContext } from 'react';

export const UserContext = createContext({ isModerator: false });

export const UserProvider = ({ children }) => {
	const isModerator = false; 
	return (
		<UserContext.Provider value={{ isModerator }}>
			{children}
		</UserContext.Provider>
	);
}; 