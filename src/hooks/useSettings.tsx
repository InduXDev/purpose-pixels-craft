import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface UserSettings {
  language: string;
  theme: string;
}

const STORAGE_KEY = 'user-settings';

const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en', // Default to English
    theme: 'system'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    };

    loadFromStorage();
    setLoading(false);
  }, []);

  // Load settings from database when user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const newSettings = {
            language: data.language || 'en',
            theme: data.theme || 'system'
          };
          setSettings(newSettings);
          // Update localStorage with database settings
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        }
      } catch (error: any) {
        console.error('Error fetching settings from database:', error);
        // Keep using localStorage settings if database fetch fails
      }
    };

    fetchSettings();
  }, [user]);

  // Save settings to both localStorage and database
  const saveSettings = async (newSettings: UserSettings) => {
    setSaving(true);
    
    try {
      // Save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);

      // Apply theme immediately
      applyTheme(newSettings.theme);

      // Save to database if user is authenticated
      if (user) {
        // First try to update existing settings
        const { data: updateData, error: updateError } = await supabase
          .from('user_settings')
          .update({
            language: newSettings.language,
            theme: newSettings.theme,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        // If update fails (no existing record), try to insert
        if (updateError && updateError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              language: newSettings.language,
              theme: newSettings.theme,
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            throw insertError;
          }
        } else if (updateError) {
          throw updateError;
        }
      }

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Apply theme to document
  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  return {
    settings,
    setSettings,
    saveSettings,
    loading,
    saving
  };
};

export default useSettings; 