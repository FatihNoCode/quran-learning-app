import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { BookOpen, UserPlus, LogIn, Sparkles, Info } from 'lucide-react';
import type { User } from '../App';
import { DEMO_INFO } from '../utils/demoAccounts';

interface AuthProps {
  onLogin: (user: User, token: string) => void;
  language: 'tr' | 'nl';
  onLanguageChange: (lang: 'tr' | 'nl') => void;
}

const translations = {
  tr: {
    title: 'Arapça Okuma Öğreniyorum',
    subtitle: 'Kuran okumak için Arapça harfleri öğren',
    login: 'Giriş Yap',
    signup: 'Kayıt Ol',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    name: 'İsim',
    role: 'Rol',
    student: 'Öğrenci',
    teacher: 'Öğretmen',
    teacherCode: 'Öğretmen Kodu',
    teacherCodePlaceholder: 'Öğretmen kayıt kodu girin',
    switchToSignup: 'Hesabın yok mu? Kayıt ol',
    switchToLogin: 'Zaten hesabın var mı? Giriş yap',
    loggingIn: 'Giriş yapılıyor...',
    signingUp: 'Kayıt olunuyor...',
    error: 'Hata',
    usernameExists: 'Bu kullanıcı adı zaten kullanılıyor',
    invalidCredentials: 'Kullanıcı adı veya şifre hatalı',
    invalidTeacherCode: 'Geçersiz öğretmen kodu',
    missingFields: 'Lütfen tüm alanları doldurun'
  },
  nl: {
    title: 'Arabisch Lezen Leren',
    subtitle: 'Leer Arabische letters om de Koran te lezen',
    login: 'Inloggen',
    signup: 'Registreren',
    username: 'Gebruikersnaam',
    password: 'Wachtwoord',
    name: 'Naam',
    role: 'Rol',
    student: 'Student',
    teacher: 'Leraar',
    teacherCode: 'Leraarcode',
    teacherCodePlaceholder: 'Voer leraar registratiecode in',
    switchToSignup: 'Nog geen account? Registreer',
    switchToLogin: 'Al een account? Log in',
    loggingIn: 'Inloggen...',
    signingUp: 'Registreren...',
    error: 'Fout',
    usernameExists: 'Deze gebruikersnaam is al in gebruik',
    invalidCredentials: 'Gebruikersnaam of wachtwoord is onjuist',
    invalidTeacherCode: 'Ongeldige leraarcode',
    missingFields: 'Vul alle velden in'
  }
};

export default function Auth({ onLogin, language, onLanguageChange }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [teacherCode, setTeacherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const t = translations[language];
  const demoInfo = DEMO_INFO[language];

  const translateError = (errorMsg: string): string => {
    const errorMap: {[key: string]: {tr: string, nl: string}} = {
      'Username already exists': { tr: t.usernameExists, nl: t.usernameExists },
      'Invalid username or password': { tr: t.invalidCredentials, nl: t.invalidCredentials },
      'Authentication failed': { tr: t.invalidCredentials, nl: t.invalidCredentials },
      'Invalid teacher registration code': { tr: t.invalidTeacherCode, nl: t.invalidTeacherCode },
      'Teacher code is required': { tr: t.invalidTeacherCode, nl: t.invalidTeacherCode },
      'Missing required fields': { tr: t.missingFields, nl: t.missingFields }
    };

    // Check if we have a translation for this error
    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMsg.includes(key)) {
        return value[language];
      }
    }

    // Return original error if no translation found
    return errorMsg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'signin' : 'signup';
      const body = isLogin
        ? { username, password }
        : { username, password, name, role, teacherCode };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (response.ok && data.requiresManualLogin) {
        // User was created but auto-login failed, switch to login mode
        setIsLogin(true);
        setError(translateError('User created successfully. Please login with your credentials.'));
        setLoading(false);
        return;
      }

      if (response.ok && data.accessToken) {
        onLogin({
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          role: data.user.role,
          isMasterTeacher: data.user.isMasterTeacher || false
        }, data.accessToken);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(translateError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
      {/* Language Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="flex bg-white border-2 border-purple-300 rounded-lg overflow-hidden shadow-lg">
          <button
            onClick={() => onLanguageChange('tr')}
            className={`px-6 py-3 transition-colors ${
              language === 'tr'
                ? 'bg-purple-500 text-white'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            Türkçe
          </button>
          <button
            onClick={() => onLanguageChange('nl')}
            className={`px-6 py-3 transition-colors ${
              language === 'nl'
                ? 'bg-purple-500 text-white'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            Nederlands
          </button>
        </div>
      </div>

      <div className="max-w-md w-full">
        {/* Header with Islamic Pattern */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-3xl mb-4 shadow-2xl transform hover:scale-105 transition-transform">
            <BookOpen className="text-white" size={48} />
          </div>
          <h1 className="text-purple-800 mb-2 flex items-center justify-center gap-2">
            {t.title}
            <Sparkles className="text-yellow-500" size={24} />
          </h1>
          <p className="text-purple-600">{t.subtitle}</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              <LogIn className="inline mr-2" size={20} />
              {t.login}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              <UserPlus className="inline mr-2" size={20} />
              {t.signup}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-purple-700 mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  required
                  placeholder={language === 'tr' ? 'Adın' : 'Jouw naam'}
                />
              </div>
            )}

            <div>
              <label className="block text-purple-700 mb-2">
                {t.username}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                required
                placeholder={language === 'tr' ? 'kullaniciadi' : 'gebruikersnaam'}
              />
            </div>

            <div>
              <label className="block text-purple-700 mb-2">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                required
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-purple-700 mb-2">
                  {t.role}
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                      className="sr-only"
                    />
                    <div className={`py-3 px-4 rounded-xl text-center transition-all ${
                      role === 'student'
                        ? 'bg-green-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {t.student}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={role === 'teacher'}
                      onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                      className="sr-only"
                    />
                    <div className={`py-3 px-4 rounded-xl text-center transition-all ${
                      role === 'teacher'
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {t.teacher}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {!isLogin && role === 'teacher' && (
              <div>
                <label className="block text-purple-700 mb-2">
                  {t.teacherCode}
                </label>
                <input
                  type="text"
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  required
                  placeholder={t.teacherCodePlaceholder}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl">
                <strong>{t.error}:</strong> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 active:scale-95"
            >
              {loading
                ? (isLogin ? t.loggingIn : t.signingUp)
                : (isLogin ? t.login : t.signup)}
            </button>
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-purple-600">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}