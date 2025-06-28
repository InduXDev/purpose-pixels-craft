import React, { createContext, useContext, ReactNode } from 'react';
import useSettings from '@/hooks/useSettings';

interface SettingsContextType {
  settings: {
    language: string;
    theme: string;
  };
  setSettings: (settings: { language: string; theme: string }) => void;
  saveSettings: (settings: { language: string; theme: string }) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const settingsData = useSettings();

  return (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
  );
}; 