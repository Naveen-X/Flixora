import { createContext, useContext, useState } from 'react';

const ModeContext = createContext({ mode: null, setMode: (mode: string) => {} });

export function useMode() {
  return useContext(ModeContext);
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
