import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModeContext = createContext({ mode: 'anime', setMode: (mode: string) => {} });

export function useMode() {
  return useContext(ModeContext);
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('anime');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('mode');
        if (savedMode) {
          setMode(savedMode);
        }
      } catch (error) {
        console.error('Failed to load mode from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMode();
  }, []);

  const handleSetMode = async (newMode: string) => {
    try {
      await AsyncStorage.setItem('mode', newMode);
      setMode(newMode);
    } catch (error) {
      console.error('Failed to save mode to storage', error);
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode: handleSetMode, isLoading }}>
      {children}
    </ModeContext.Provider>
  );
}