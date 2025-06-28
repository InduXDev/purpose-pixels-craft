import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import useSettings from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Globe, Palette, Save } from 'lucide-react';

interface LanguageStrings {
  [key: string]: {
    settings: string;
    pleaseLogIn: string;
    signIn: string;
    language: string;
    theme: string;
    account: string;
    email: string;
    accountId: string;
    memberSince: string;
    saveSettings: string;
    saving: string;
    settingsSaved: string;
    settingsSavedDesc: string;
    errorSavingSettings: string;
    errorLoadingSettings: string;
    chooseLanguage: string;
    chooseTheme: string;
    accountInfo: string;
    light: string;
    dark: string;
    system: string;
    needToBeLoggedIn: string;
    yourPreferencesUpdated: string;
  };
}

const translations: LanguageStrings = {
  en: {
    settings: 'Settings',
    pleaseLogIn: 'Please Log In',
    signIn: 'Sign In',
    language: 'Language',
    theme: 'Theme',
    account: 'Account',
    email: 'Email',
    accountId: 'Account ID',
    memberSince: 'Member Since',
    saveSettings: 'Save Settings',
    saving: 'Saving...',
    settingsSaved: 'Settings saved',
    settingsSavedDesc: 'Your preferences have been updated successfully.',
    errorSavingSettings: 'Error saving settings',
    errorLoadingSettings: 'Error loading settings',
    chooseLanguage: 'Choose your preferred language for the interface.',
    chooseTheme: 'Choose your preferred theme for the application.',
    accountInfo: 'Your account information and settings.',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    needToBeLoggedIn: 'You need to be logged in to access settings.',
    yourPreferencesUpdated: 'Your preferences have been updated successfully.'
  },
  es: {
    settings: 'Configuración',
    pleaseLogIn: 'Por favor inicie sesión',
    signIn: 'Iniciar Sesión',
    language: 'Idioma',
    theme: 'Tema',
    account: 'Cuenta',
    email: 'Correo Electrónico',
    accountId: 'ID de Cuenta',
    memberSince: 'Miembro Desde',
    saveSettings: 'Guardar Configuración',
    saving: 'Guardando...',
    settingsSaved: 'Configuración guardada',
    settingsSavedDesc: 'Sus preferencias han sido actualizadas exitosamente.',
    errorSavingSettings: 'Error al guardar la configuración',
    errorLoadingSettings: 'Error al cargar la configuración',
    chooseLanguage: 'Elija su idioma preferido para la interfaz.',
    chooseTheme: 'Elija su tema preferido para la aplicación.',
    accountInfo: 'Su información de cuenta y configuración.',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    needToBeLoggedIn: 'Necesita iniciar sesión para acceder a la configuración.',
    yourPreferencesUpdated: 'Sus preferencias han sido actualizadas exitosamente.'
  },
  fr: {
    settings: 'Paramètres',
    pleaseLogIn: 'Veuillez vous connecter',
    signIn: 'Se connecter',
    language: 'Langue',
    theme: 'Thème',
    account: 'Compte',
    email: 'E-mail',
    accountId: 'ID du compte',
    memberSince: 'Membre depuis',
    saveSettings: 'Enregistrer les paramètres',
    saving: 'Enregistrement...',
    settingsSaved: 'Paramètres enregistrés',
    settingsSavedDesc: 'Vos préférences ont été mises à jour avec succès.',
    errorSavingSettings: 'Erreur lors de l\'enregistrement des paramètres',
    errorLoadingSettings: 'Erreur lors du chargement des paramètres',
    chooseLanguage: 'Choisissez votre langue préférée pour l\'interface.',
    chooseTheme: 'Choisissez votre thème préféré pour l\'application.',
    accountInfo: 'Vos informations de compte et paramètres.',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    needToBeLoggedIn: 'Vous devez être connecté pour accéder aux paramètres.',
    yourPreferencesUpdated: 'Vos préférences ont été mises à jour avec succès.'
  }
};

const Settings = () => {
  const [userCreatedAt, setUserCreatedAt] = useState<string>('');
  const { user } = useAuth();
  const { settings, setSettings, saveSettings, loading, saving } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();

  const t = translations[settings.language] || translations.en;

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      try {
        // Get user creation date from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          setUserCreatedAt(profileData.created_at);
        }
      } catch (error: any) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleSaveSettings = async () => {
    await saveSettings(settings);
  };

  if (!user) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">{t.settings}</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t.pleaseLogIn}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t.needToBeLoggedIn}</p>
              <Button onClick={() => navigate('/auth')}>
                {t.signIn}
              </Button>
            </div>
          </div>
        </SidebarInset>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">{t.settings}</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
            </div>
          </div>
        </SidebarInset>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">{t.settings}</h1>
        </div>
        <div className="p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t.language}
                </CardTitle>
                <CardDescription>
                  {t.chooseLanguage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="language">{t.language}</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {t.theme}
                </CardTitle>
                <CardDescription>
                  {t.chooseTheme}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="theme">{t.theme}</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t.light}</SelectItem>
                      <SelectItem value="dark">{t.dark}</SelectItem>
                      <SelectItem value="system">{t.system}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.account}</CardTitle>
                <CardDescription>
                  {t.accountInfo}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>{t.email}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                  </div>
                  <div>
                    <Label>{t.accountId}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">{user.id}</p>
                  </div>
                  <div>
                    <Label>{t.memberSince}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {userCreatedAt ? new Date(userCreatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t.saveSettings}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default Settings;
