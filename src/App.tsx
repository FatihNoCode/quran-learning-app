import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import Auth from './components/Auth';
import NewStudentDashboard from './components/NewStudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import WelcomeGuide from './components/WelcomeGuide';
import { BookOpen, Users, Home } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import homeIcon from 'figma:asset/b064a1b5a53d37f1101ede8d5dc76112da50bd5a.png';
import { Logo } from './components/Logo.svg';

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
  const [studentView, setStudentView] = useState<'dashboard' | 'lesson' | 'practice' | 'profile' | 'trivia'>('dashboard');

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
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
    
    // Show welcome guide on first login (check if user has seen it before)
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

  const lightBg = '#e6f4ff';

  return (
    <div className="min-h-screen" style={{ backgroundColor: lightBg }}>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="flex bg-white border-2 border-purple-300 rounded-full overflow-hidden shadow-sm">
              <button
                onClick={() => handleLanguageChange('tr')}
                className={`px-4 py-2 transition-all ${
                  language === 'tr'
                    ? 'bg-purple-500 text-white shadow-inner'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => handleLanguageChange('nl')}
                className={`px-4 py-2 transition-all ${
                  language === 'nl'
                    ? 'bg-purple-500 text-white shadow-inner'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                NL
              </button>
            </div>
          </div>

          {/* Center - Logo/Home Button (always visible) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => {
                if (user.role === 'student') {
                  setStudentView('dashboard');
                }
              }}
              className="flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 border-2 border-purple-200 p-2 px-[2px] py-[2px]"
              aria-label="Home"
            >
              <Logo size={60} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {language === 'tr' ? 'Çıkış Yap' : 'Uitloggen'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {user.role === 'student' ? (
          <NewStudentDashboard 
            context={appContext} 
            onViewChange={(view) => setStudentView(view)}
          />
        ) : (
          <TeacherDashboard context={appContext} />
        )}
      </main>

      {/* Welcome Guide */}
      {showWelcome && (
        <WelcomeGuide
          role={user.role}
          onClose={handleCloseWelcome}
          language={language}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
