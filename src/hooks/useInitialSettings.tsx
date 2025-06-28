import { useEffect } from 'react';

const STORAGE_KEY = 'user-settings';

const useInitialSettings = () => {
  useEffect(() => {
    // Load settings from localStorage on app startup
    const loadInitialSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const settings = JSON.parse(stored);
          
          // Apply theme immediately
          if (settings.theme) {
            if (settings.theme === 'dark') {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
            } else if (settings.theme === 'light') {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
            } else if (settings.theme === 'system') {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (prefersDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
              }
            }
          }
          
          // Apply language
          if (settings.language) {
            document.documentElement.setAttribute('lang', settings.language);
          }
        } else {
          // Default settings - English language and system theme
          const defaultSettings = {
            language: 'en',
            theme: 'system'
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
          
          // Apply system theme by default
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          }
          
          document.documentElement.setAttribute('lang', 'en');
        }
      } catch (error) {
        console.error('Error loading initial settings:', error);
        
        // Fallback to default settings
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
        
        document.documentElement.setAttribute('lang', 'en');
      }
    };

    loadInitialSettings();
  }, []);
};

export default useInitialSettings; 