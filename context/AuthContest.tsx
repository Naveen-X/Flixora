import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({ isLoggedIn: false, setIsLoggedIn: (isLoggedIn: boolean) => {} });

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider mounted. Initial state: isLoggedIn=', isLoggedIn, ', isLoading=', isLoading);

  useEffect(() => {
    const loadAuthStatus = async () => {
      console.log('Attempting to load auth status...');
      try {
        const storedStatus = await AsyncStorage.getItem('isLoggedIn');
        console.log('AsyncStorage.getItem result (raw):', storedStatus, ', type:', typeof storedStatus);

        if (typeof storedStatus === 'string' && storedStatus !== null) {
          const parsedStatus = JSON.parse(storedStatus);
          setIsLoggedIn(parsedStatus);
          console.log('Auth status loaded: isLoggedIn=', parsedStatus);
        } else if (storedStatus === null) {
          console.log('No auth status found in AsyncStorage.');
        } else {
          // This case handles the unexpected direct boolean 'false' or other non-string/non-null values
          console.warn('Unexpected non-string/non-null value from AsyncStorage.getItem. Clearing storage.', storedStatus);
          await AsyncStorage.removeItem('isLoggedIn'); // Clear the corrupted data
          setIsLoggedIn(false); // Default to false if data is corrupted
        }
      } catch (error) {
        console.error('Failed to load auth status from AsyncStorage', error);
      } finally {
        setIsLoading(false);
        console.log('Loading complete. isLoading=', false);
      }
    };

    loadAuthStatus();
  }, []);

  useEffect(() => {
    const saveAuthStatus = async () => {
      console.log('Attempting to save auth status: isLoggedIn=', isLoggedIn);
      try {
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        console.log('Auth status saved: isLoggedIn=', isLoggedIn);
      } catch (error) {
        console.error('Failed to save auth status to AsyncStorage', error);
      }
    };

    if (!isLoading) {
      saveAuthStatus();
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    console.log('AuthProvider: Still loading...');
    return null; // Or a loading spinner
  }

  console.log('AuthProvider: Rendered with isLoggedIn=', isLoggedIn);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
