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
import { Globe, Palette, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  },
  de: {
    settings: 'Einstellungen',
    pleaseLogIn: 'Bitte melden Sie sich an',
    signIn: 'Anmelden',
    language: 'Sprache',
    theme: 'Design',
    account: 'Konto',
    email: 'E-Mail',
    accountId: 'Konto-ID',
    memberSince: 'Mitglied seit',
    saveSettings: 'Einstellungen speichern',
    saving: 'Speichern...',
    settingsSaved: 'Einstellungen gespeichert',
    settingsSavedDesc: 'Ihre Einstellungen wurden erfolgreich aktualisiert.',
    errorSavingSettings: 'Fehler beim Speichern der Einstellungen',
    errorLoadingSettings: 'Fehler beim Laden der Einstellungen',
    chooseLanguage: 'Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche.',
    chooseTheme: 'Wählen Sie Ihr bevorzugtes Design für die Anwendung.',
    accountInfo: 'Ihre Kontoinformationen und Einstellungen.',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
    needToBeLoggedIn: 'Sie müssen angemeldet sein, um auf die Einstellungen zuzugreifen.',
    yourPreferencesUpdated: 'Ihre Einstellungen wurden erfolgreich aktualisiert.'
  },
  it: {
    settings: 'Impostazioni',
    pleaseLogIn: 'Effettua l\'accesso',
    signIn: 'Accedi',
    language: 'Lingua',
    theme: 'Tema',
    account: 'Account',
    email: 'Email',
    accountId: 'ID Account',
    memberSince: 'Membro dal',
    saveSettings: 'Salva Impostazioni',
    saving: 'Salvataggio...',
    settingsSaved: 'Impostazioni salvate',
    settingsSavedDesc: 'Le tue preferenze sono state aggiornate con successo.',
    errorSavingSettings: 'Errore nel salvare le impostazioni',
    errorLoadingSettings: 'Errore nel caricare le impostazioni',
    chooseLanguage: 'Scegli la tua lingua preferita per l\'interfaccia.',
    chooseTheme: 'Scegli il tuo tema preferito per l\'applicazione.',
    accountInfo: 'Le tue informazioni account e impostazioni.',
    light: 'Chiaro',
    dark: 'Scuro',
    system: 'Sistema',
    needToBeLoggedIn: 'Devi essere connesso per accedere alle impostazioni.',
    yourPreferencesUpdated: 'Le tue preferenze sono state aggiornate con successo.'
  },
  pt: {
    settings: 'Configurações',
    pleaseLogIn: 'Por favor, faça login',
    signIn: 'Entrar',
    language: 'Idioma',
    theme: 'Tema',
    account: 'Conta',
    email: 'E-mail',
    accountId: 'ID da Conta',
    memberSince: 'Membro desde',
    saveSettings: 'Salvar Configurações',
    saving: 'Salvando...',
    settingsSaved: 'Configurações salvas',
    settingsSavedDesc: 'Suas preferências foram atualizadas com sucesso.',
    errorSavingSettings: 'Erro ao salvar configurações',
    errorLoadingSettings: 'Erro ao carregar configurações',
    chooseLanguage: 'Escolha seu idioma preferido para a interface.',
    chooseTheme: 'Escolha seu tema preferido para a aplicação.',
    accountInfo: 'Suas informações de conta e configurações.',
    light: 'Claro',
    dark: 'Escuro',
    system: 'Sistema',
    needToBeLoggedIn: 'Você precisa estar logado para acessar as configurações.',
    yourPreferencesUpdated: 'Suas preferências foram atualizadas com sucesso.'
  },
  ja: {
    settings: '設定',
    pleaseLogIn: 'ログインしてください',
    signIn: 'ログイン',
    language: '言語',
    theme: 'テーマ',
    account: 'アカウント',
    email: 'メール',
    accountId: 'アカウントID',
    memberSince: 'メンバー登録日',
    saveSettings: '設定を保存',
    saving: '保存中...',
    settingsSaved: '設定が保存されました',
    settingsSavedDesc: '設定が正常に更新されました。',
    errorSavingSettings: '設定の保存に失敗しました',
    errorLoadingSettings: '設定の読み込みに失敗しました',
    chooseLanguage: 'インターフェースの言語を選択してください。',
    chooseTheme: 'アプリケーションのテーマを選択してください。',
    accountInfo: 'アカウント情報と設定。',
    light: 'ライト',
    dark: 'ダーク',
    system: 'システム',
    needToBeLoggedIn: '設定にアクセスするにはログインが必要です。',
    yourPreferencesUpdated: '設定が正常に更新されました。'
  },
  ko: {
    settings: '설정',
    pleaseLogIn: '로그인해 주세요',
    signIn: '로그인',
    language: '언어',
    theme: '테마',
    account: '계정',
    email: '이메일',
    accountId: '계정 ID',
    memberSince: '가입일',
    saveSettings: '설정 저장',
    saving: '저장 중...',
    settingsSaved: '설정이 저장되었습니다',
    settingsSavedDesc: '설정이 성공적으로 업데이트되었습니다.',
    errorSavingSettings: '설정 저장 오류',
    errorLoadingSettings: '설정 로드 오류',
    chooseLanguage: '인터페이스의 언어를 선택하세요.',
    chooseTheme: '애플리케이션의 테마를 선택하세요.',
    accountInfo: '계정 정보 및 설정.',
    light: '라이트',
    dark: '다크',
    system: '시스템',
    needToBeLoggedIn: '설정에 액세스하려면 로그인이 필요합니다.',
    yourPreferencesUpdated: '설정이 성공적으로 업데이트되었습니다.'
  },
  zh: {
    settings: '设置',
    pleaseLogIn: '请登录',
    signIn: '登录',
    language: '语言',
    theme: '主题',
    account: '账户',
    email: '邮箱',
    accountId: '账户ID',
    memberSince: '注册时间',
    saveSettings: '保存设置',
    saving: '保存中...',
    settingsSaved: '设置已保存',
    settingsSavedDesc: '您的偏好设置已成功更新。',
    errorSavingSettings: '保存设置时出错',
    errorLoadingSettings: '加载设置时出错',
    chooseLanguage: '选择您偏好的界面语言。',
    chooseTheme: '选择您偏好的应用程序主题。',
    accountInfo: '您的账户信息和设置。',
    light: '浅色',
    dark: '深色',
    system: '系统',
    needToBeLoggedIn: '您需要登录才能访问设置。',
    yourPreferencesUpdated: '您的偏好设置已成功更新。'
  },
  hi: {
    settings: 'सेटिंग्स',
    pleaseLogIn: 'कृपया लॉगिन करें',
    signIn: 'लॉगिन',
    language: 'भाषा',
    theme: 'थीम',
    account: 'खाता',
    email: 'ईमेल',
    accountId: 'खाता ID',
    memberSince: 'सदस्यता तिथि',
    saveSettings: 'सेटिंग्स सहेजें',
    saving: 'सहेज रहा है...',
    settingsSaved: 'सेटिंग्स सहेजी गईं',
    settingsSavedDesc: 'आपकी प्राथमिकताएं सफलतापूर्वक अपडेट की गई हैं।',
    errorSavingSettings: 'सेटिंग्स सहेजने में त्रुटि',
    errorLoadingSettings: 'सेटिंग्स लोड करने में त्रुटि',
    chooseLanguage: 'इंटरफेस के लिए अपनी पसंदीदा भाषा चुनें।',
    chooseTheme: 'एप्लिकेशन के लिए अपनी पसंदीदा थीम चुनें।',
    accountInfo: 'आपकी खाता जानकारी और सेटिंग्स।',
    light: 'हल्का',
    dark: 'गहरा',
    system: 'सिस्टम',
    needToBeLoggedIn: 'सेटिंग्स तक पहुंचने के लिए आपको लॉगिन करना होगा।',
    yourPreferencesUpdated: 'आपकी प्राथमिकताएं सफलतापूर्वक अपडेट की गई हैं।'
  }
};

const Settings = () => {
  const [userCreatedAt, setUserCreatedAt] = useState<string>('');
  const { user } = useAuth();
  const { settings, setSettings, saveSettings, loading, saving } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated!",
          description: "Your password has been changed successfully.",
        });
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
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

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Set a New Password</CardTitle>
                <CardDescription>
                  Change your account password. Make sure to use a strong password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="new-password">New Password</Label>
                    <Lock className="absolute left-3 top-10 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="pl-10 mt-1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Lock className="absolute left-3 top-10 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="confirm-new-password"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      className="pl-10 mt-1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
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
