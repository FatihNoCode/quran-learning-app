import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import Auth from './components/Auth';
import NewStudentDashboard from './components/NewStudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import WelcomeGuide from './components/WelcomeGuide';
import { Users, Home } from 'lucide-react';
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

interface BugReport {
  id: string;
  location: string;
  description: string;
  reporter: string;
  createdAt: string;
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
  const [profileTrigger, setProfileTrigger] = useState(0);
  const [showTeacherAccount, setShowTeacherAccount] = useState(false);
  const [bugReports, setBugReports] = useState<BugReport[]>(() => {
    const stored = localStorage.getItem('bugReports');
    return stored ? JSON.parse(stored) : [];
  });
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugLocation, setBugLocation] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugStatus, setBugStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [showBugList, setShowBugList] = useState(false);

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
    setShowBugList(false);
  };

  const handleLanguageChange = (lang: 'tr' | 'nl') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const openBugModal = () => {
    setBugStatus('idle');
    setShowBugModal(true);
  };

  const handleBugSubmit = () => {
    if (!bugLocation.trim() || !bugDescription.trim()) {
      setBugStatus('error');
      return;
    }
    const reporterName = user ? user.username : 'Guest';
    const newReport: BugReport = {
      id: `${Date.now()}`,
      location: bugLocation.trim(),
      description: bugDescription.trim(),
      reporter: reporterName,
      createdAt: new Date().toISOString()
    };
    const next = [newReport, ...bugReports];
    setBugReports(next);
    localStorage.setItem('bugReports', JSON.stringify(next));
    setBugStatus('sent');
    setBugLocation('');
    setBugDescription('');
    setTimeout(() => setShowBugModal(false), 1000);
  };

  const handleDeleteReport = (id: string) => {
    const next = bugReports.filter(r => r.id !== id);
    setBugReports(next);
    localStorage.setItem('bugReports', JSON.stringify(next));
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
      <>
        <Auth
          onLogin={handleLogin}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </>
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
        <div className="max-w-6xl mx-auto py-4 px-0 flex items-center justify-between relative">
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
              className="flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 border-2 border-purple-200 p-1 px-[4px] py-[4px]"
              aria-label="Home"
            >
              <Logo size={52} />
            </button>
        </div>

        <div className="flex items-center gap-4">
            {/* Account Button (opens profile) */}
            <button
              onClick={() => {
                if (user.role === 'student') {
                  setProfileTrigger(t => t + 1);
                } else {
                  setShowTeacherAccount(true);
                }
              }}
              className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '23px', height: '23px' }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span>{user.username}</span>
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
            onLogout={handleLogout}
            profileTrigger={profileTrigger}
            onBugReport={openBugModal}
          />
        ) : (
          <TeacherDashboard context={appContext} />
        )}
      </main>

            {/* Teacher account modal */}
      {showTeacherAccount && user.role === 'teacher' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-purple-200 p-6 space-y-4"
            style={{ width: '600px' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700">
                <span className="font-semibold">{user.username}</span>
              </div>
              <button
                onClick={() => setShowTeacherAccount(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {user.isMasterTeacher && (
              <button
                onClick={() => setShowBugList(true)}
                className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-between"
              >
                <span>{language === 'tr' ? 'Hata raporlar?' : 'Bug meldingen'}</span>
                <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                  {bugReports.length}
                </span>
              </button>
            )}
            <button
              onClick={() => {
                setShowTeacherAccount(false);
                handleLogout();
              }}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {language === 'tr' ? '??k?? Yap' : 'Uitloggen'}
            </button>
          </div>
        </div>
      )}
{/* Welcome Guide */}
      {showWelcome && (
        <WelcomeGuide
          role={user.role}
          onClose={handleCloseWelcome}
          language={language}
        />
      )}
      

      {/* Bug Modal */}
      {showBugModal && user.role === 'student' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl min-w-[600px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-purple-700">
                {language === 'tr' ? 'Hata / icerik bildir' : 'Meld bug / fout'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBugSubmit}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <path
                      d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {language === 'tr' ? 'Gonder' : 'Verstuur'}
                </button>
                <button
                  onClick={() => setShowBugModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-700 block mb-1">
                  {language === 'tr' ? 'Nerede gordun?' : 'Waar vond je het?'}
                </label>
                <input
                  className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  placeholder={language === 'tr' ? 'Orn: Ders 4 - Bolum 3 soru 5' : 'Bijv: Les 4 - Deel 3 vraag 5'}
                  value={bugLocation}
                  onChange={(e) => setBugLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">
                  {language === 'tr' ? 'Ne yanlis / calismiyor?' : 'Wat klopt er niet / werkt niet?'}
                </label>
                <textarea
                  className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 min-h-[100px]"
                  placeholder={language === 'tr' ? 'Icerik veya teknik hata ayrintisi' : 'Details van de fout of inhoud'}
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  required
                />
              </div>
            </div>
            {bugStatus === 'error' && (
              <p className="text-red-600 text-sm">
                {language === 'tr' ? 'Lutfen tum alanlari doldurun.' : 'Vul beide velden in.'}
              </p>
            )}
            {bugStatus === 'sent' && (
              <p className="text-green-600 text-sm">
                {language === 'tr' ? 'Rapor gonderildi.' : 'Melding verzonden.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster />

      {/* Bug reports for master teacher */}
      {showTeacherAccount && user.role === 'teacher' && user.isMasterTeacher && showBugList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 p-6 space-y-4 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-700">
                {language === 'tr' ? 'Hata raporları' : 'Bug meldingen'}
              </h3>
              <button
                onClick={() => setShowBugList(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            {bugReports.length === 0 ? (
              <p className="text-gray-600 text-sm">
                {language === 'tr' ? 'Henüz rapor yok.' : 'Nog geen meldingen.'}
              </p>
            ) : (
              <div className="space-y-3">
                {bugReports.map((report) => (
                  <div key={report.id} className="border-2 border-purple-100 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(report.createdAt).toLocaleString()}</span>
                      <span>{language === 'tr' ? 'Gönderen' : 'Ingezonden door'}: {report.reporter}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{report.location}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.description}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-3 py-1 text-xs bg-red-100 border border-red-200 text-red-700 rounded-md hover:bg-red-200"
                      >
                        {language === 'tr' ? 'Sil' : 'Verwijder'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
