import { useState, useEffect } from 'react';
import { projectId } from '../utils/supabase/info';
import { AppContextType } from '../App';
import { LESSON_LEVELS } from '../data/lessons';
import { placeholderLessons } from '../data/placeholderLessons';
import { Users, TrendingUp, Clock, Award, BookOpen, BarChart, Trash2, Unlock, Eye, EyeOff, Shield, Brain, Target } from 'lucide-react';
import StudentManagement from './StudentManagement';
import { StudentDetailView } from './StudentDetailView';
import { ClassAnalytics } from './ClassAnalytics';

interface TeacherDashboardProps {
  context: AppContextType;
}

interface StudentProgress {
  userId: string;
  username: string;
  name: string;
  currentLevel: string;
  currentLessonIndex: number;
  completedLessons: string[];
  reviewItems: any[];
  lastActive: string;
  password?: string;
}

interface TeacherData {
  id: string;
  username: string;
  name: string;
  role: string;
  isMasterTeacher?: boolean;
  createdAt: string;
}

const translations = {
  tr: {
    dashboard: 'Öğretmen Paneli',
    students: 'Öğrenciler',
    teachers: 'Öğretmenler',
    overview: 'Genel Bakış',
    totalStudents: 'Toplam Öğrenci',
    avgProgress: 'Ortalama İlerleme',
    activeToday: 'Bugün Aktif',
    studentList: 'Öğrenci Listesi',
    teacherList: 'Öğretmen Listesi',
    name: 'İsim',
    level: 'Seviye',
    progress: 'İlerleme',
    lastActive: 'Son Aktif',
    completed: 'Tamamlanan',
    lessons: 'Ders',
    loading: 'Yükleniyor...',
    noStudents: 'Henüz öğrenci yok',
    noTeachers: 'Başka öğretmen yok',
    today: 'Bugün',
    yesterday: 'Dün',
    daysAgo: 'gün önce',
    actions: 'İşlemler',
    masterTeacher: 'Ana Öğretmen',
    regularTeacher: 'Öğretmen',
    deleteTeacher: 'Öğretmeni Sil',
    confirmDeleteTeacher: 'Bu öğretmeni silmek istediğinizden emin misiniz?',
    username: 'Kullanıcı Adı',
    type: 'Tip'
  },
  nl: {
    dashboard: 'Leraar Dashboard',
    students: 'Studenten',
    teachers: 'Leraren',
    overview: 'Overzicht',
    totalStudents: 'Totaal Studenten',
    avgProgress: 'Gemiddelde Voortgang',
    activeToday: 'Actief Vandaag',
    studentList: 'Studentenlijst',
    teacherList: 'Lerarenlijst',
    name: 'Naam',
    level: 'Niveau',
    progress: 'Voortgang',
    lastActive: 'Laatst Actief',
    completed: 'Voltooid',
    lessons: 'Lessen',
    loading: 'Laden...',
    noStudents: 'Nog geen studenten',
    noTeachers: 'Geen andere leraren',
    today: 'Vandaag',
    yesterday: 'Gisteren',
    daysAgo: 'dagen geleden',
    actions: 'Acties',
    masterTeacher: 'Hoofdleraar',
    regularTeacher: 'Leraar',
    deleteTeacher: 'Leraar Verwijderen',
    confirmDeleteTeacher: 'Weet je zeker dat je deze leraar wilt verwijderen?',
    username: 'Gebruikersnaam',
    type: 'Type'
  }
};

export default function TeacherDashboard({ context }: TeacherDashboardProps) {
  const { user, accessToken, language } = context;
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [view, setView] = useState<'dashboard' | 'student-detail' | 'analytics'>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const t = translations[language];
  const isMasterTeacher = user.isMasterTeacher || false;

  useEffect(() => {
    fetchStudents();
    if (isMasterTeacher) {
      fetchTeachers();
    }
  }, [accessToken, isMasterTeacher]);

  const fetchStudents = async () => {
    try {
      if (!accessToken) {
        console.error('No access token available');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/students`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStudents(data.students || []);
      } else {
        console.error('Error fetching students - Status:', response.status, 'Data:', data);
        if (response.status === 401) {
          console.error('Authentication failed. Token may be expired. Please log out and log in again.');
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      if (!accessToken) {
        console.error('No access token available');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/teachers`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTeachers(data.teachers || []);
      } else {
        console.error('Error fetching teachers - Status:', response.status, 'Data:', data);
        if (response.status === 401) {
          console.error('Authentication failed. Token may be expired. Please log out and log in again.');
        }
      }
    } catch (error) {
      console.error('Error fetching teachers:', error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/teachers/${teacherId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Refresh teachers list
        fetchTeachers();
      } else {
        console.error('Error deleting teacher:', data.error);
        alert(data.error || 'Error deleting teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Error deleting teacher');
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return t.today;
    if (diffInDays === 1) return t.yesterday;
    return `${diffInDays} ${t.daysAgo}`;
  };

  // Show specific views
  if (view === 'student-detail' && selectedStudentId) {
    return (
      <StudentDetailView
        studentId={selectedStudentId}
        accessToken={accessToken}
        language={language}
        onBack={() => {
          setView('dashboard');
          setSelectedStudentId(null);
        }}
      />
    );
  }

  if (view === 'analytics') {
    return (
      <ClassAnalytics
        accessToken={accessToken}
        language={language}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  const totalStudents = students.length;
  const avgProgress = students.length > 0
    ? students.reduce((sum, s) => sum + s.completedLessons.length, 0) / students.length
    : 0;
  const activeToday = students.filter(s => {
    const lastActive = new Date(s.lastActive);
    const today = new Date();
    return lastActive.toDateString() === today.toDateString();
  }).length;

  const avgProgressPercent = (avgProgress / placeholderLessons.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Users className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className="text-blue-800">{t.dashboard}</h1>
            <p className="text-gray-600">{t.overview}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setView('analytics')}
          className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-2xl shadow-lg border-4 border-blue-300 transition-all flex items-center gap-4"
        >
          <div className="bg-white/20 p-3 rounded-xl">
            <Brain size={32} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold">
              {language === 'tr' ? 'Sınıf Analitiği' : 'Klas Analyse'}
            </h3>
            <p className="text-sm opacity-90">
              {language === 'tr' ? 'Zor beceriler & top öğrenciler' : 'Moeilijke vaardigheden & top studenten'}
            </p>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Users className="text-purple-600" size={24} />
            </div>
            <h2 className="text-purple-800">{t.totalStudents}</h2>
          </div>
          <p className="text-purple-800">{totalStudents}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h2 className="text-green-800">{t.avgProgress}</h2>
          </div>
          <div className="space-y-2">
            <p className="text-green-800">
              {avgProgress.toFixed(1)} / {placeholderLessons.length} {t.lessons}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                style={{ width: `${avgProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Clock className="text-orange-600" size={24} />
            </div>
            <h2 className="text-orange-800">{t.activeToday}</h2>
          </div>
          <p className="text-orange-800">{activeToday}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-200">
        <div className="flex items-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'students' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setActiveTab('students')}
          >
            {t.students}
          </button>
          {isMasterTeacher && (
            <button
              className={`px-4 py-2 rounded-full ${activeTab === 'teachers' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              onClick={() => setActiveTab('teachers')}
            >
              {t.teachers}
            </button>
          )}
        </div>

        {/* Students Table */}
        {activeTab === 'students' && (
          <div>
            {students.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.noStudents}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-purple-800">{t.name}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.level}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.progress}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.lastActive}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => {
                      const progressPercent = (student.completedLessons.length / placeholderLessons.length) * 100;
                      
                      return (
                        <tr key={student.userId} className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-purple-400 to-pink-400 w-10 h-10 rounded-full flex items-center justify-center text-white">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-gray-800">{student.name}</p>
                                <p className="text-sm text-gray-500">@{student.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="text-purple-600" size={16} />
                              <span className="text-gray-700">
                                {LESSON_LEVELS[student.currentLevel as keyof typeof LESSON_LEVELS]?.[language] || student.currentLevel}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {student.completedLessons.length} / {placeholderLessons.length}
                                </span>
                                <span className="text-purple-600">
                                  {progressPercent.toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} />
                              <span className="text-sm">
                                {getRelativeTime(student.lastActive)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedStudentId(student.userId);
                                  setView('student-detail');
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                              >
                                {language === 'tr' ? 'Detay' : 'Details'}
                              </button>
                              <StudentManagement 
                                student={student} 
                                accessToken={accessToken}
                                language={language}
                                onUpdate={fetchStudents}
                                isMasterTeacher={isMasterTeacher}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Teachers Table */}
        {activeTab === 'teachers' && (
          <div>
            {teachers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.noTeachers}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-purple-800">{t.name}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.username}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.type}</th>
                      <th className="px-6 py-4 text-left text-purple-800">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teachers.map((teacher) => {
                      return (
                        <tr key={teacher.id} className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-purple-400 to-pink-400 w-10 h-10 rounded-full flex items-center justify-center text-white">
                                {teacher.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-gray-800">{teacher.name}</p>
                                <p className="text-sm text-gray-500">@{teacher.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">{teacher.username}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">
                              {teacher.isMasterTeacher ? t.masterTeacher : t.regularTeacher}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="bg-red-500 text-white px-3 py-1 rounded-full"
                                onClick={() => handleDeleteTeacher(teacher.id)}
                              >
                                {t.deleteTeacher}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Level Distribution Chart */}
      {students.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <BarChart className="text-blue-600" size={24} />
            </div>
            <h2 className="text-blue-800">
              {language === 'tr' ? 'Seviye Dağılımı' : 'Niveau Verdeling'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(LESSON_LEVELS).map(([key, value]) => {
              const count = students.filter(s => s.currentLevel === key).length;
              const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;

              return (
                <div key={key} className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="text-center mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-2">
                      <BookOpen className="text-white" size={20} />
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      {value[language]}
                    </p>
                    <p className="text-blue-800">{count}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}