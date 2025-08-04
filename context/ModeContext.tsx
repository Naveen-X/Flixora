import { createContext, useContext, useState } from 'react';

const ModeContext = createContext(undefined);

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(null);

  const handleSetMode = (newMode: string) => {
    setMode(newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </ModeContext.Provider>
  );
}
