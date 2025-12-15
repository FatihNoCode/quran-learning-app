import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import Auth from './components/Auth';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import WelcomeGuide from './components/WelcomeGuide';
import { BookOpen, Users, User as UserIcon, LogOut } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'teacher';
  isMasterTeacher?: boolean;
}

export interface AppContextType {
  user: User | null;
  accessToken: string;
  language: 'tr' | 'nl';
  setLanguage: (lang: 'tr' | 'nl') => void;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [language, setLanguage] = useState<'tr' | 'nl'>('tr');
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    const savedLanguage = localStorage.getItem('language');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
    }

    if (savedLanguage) {
      setLanguage(savedLanguage as 'tr' | 'nl');
    }

    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);

    const hasSeenWelcome = localStorage.getItem(`welcome_${userData.id}`);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    if (user) {
      localStorage.setItem(`welcome_${user.id}`, 'true');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  const handleLanguageChange = (lang: 'tr' | 'nl') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">
            {language === 'tr' ? 'Yükleniyor...' : 'Laden...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Auth
        onLogin={handleLogin}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  const appContext: AppContextType = {
    user,
    accessToken,
    language,
    setLanguage: handleLanguageChange
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
              {user.role === 'student' ? (
                <BookOpen className="text-white" size={28} />
              ) : (
                <Users className="text-white" size={28} />
              )}
            </div>
            <div>
              <h1 className="text-purple-800">
                {language === 'tr' ? 'Arapça Okuma Öğreniyorum' : 'Arabisch Lezen Leren'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'tr' ? `Hoş geldin, ${user.name}!` : `Welkom, ${user.name}!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white border-2 border-purple-300 rounded-lg overflow-hidden">
              <button
                onClick={() => handleLanguageChange('tr')}
                className={`px-4 py-2 transition-colors ${
                  language === 'tr'
                    ? 'bg-purple-500 text-white'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => handleLanguageChange('nl')}
                className={`px-4 py-2 transition-colors ${
                  language === 'nl'
                    ? 'bg-purple-500 text-white'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                NL
              </button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                    {user.name?.[0]?.toUpperCase() || <UserIcon size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                      {user.name?.[0]?.toUpperCase() || <UserIcon size={18} />}
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                      <p className="text-xs text-purple-600">
                        {user.role === 'teacher'
                          ? (language === 'tr' ? 'Öğretmen' : 'Leraar')
                          : (language === 'tr' ? 'Öğrenci' : 'Student')}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-purple-50 border border-purple-100 rounded-xl p-3">
                    {language === 'tr'
                      ? 'Profil bilgilerinizi burada görebilirsiniz.'
                      : 'Bekijk hier je profielgegevens.'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    {language === 'tr' ? 'Çıkış Yap' : 'Uitloggen'}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {user.role === 'student' ? (
          <StudentDashboard context={appContext} />
        ) : (
          <TeacherDashboard context={appContext} />
        )}
      </main>

      {showWelcome && (
        <WelcomeGuide
          role={user.role}
          onClose={handleCloseWelcome}
          language={language}
        />
      )}
    </div>
  );
}

export default App;
