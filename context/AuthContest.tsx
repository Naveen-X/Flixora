import { createContext, useContext, useState } from 'react';

// The context is created with a default state of not being logged in.
const AuthContext = createContext({ isLoggedIn: false, isLoading: false, setIsLoggedIn: (isLoggedIn: boolean) => {} });

// A custom hook to easily access the authentication context.
export function useAuth() {
  return useContext(AuthContext);
}

// The provider component that will wrap the application.
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading: false, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
