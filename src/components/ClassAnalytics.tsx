import { useState, useEffect } from 'react';
import { projectId } from '../utils/supabase/info';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ArrowLeft, TrendingDown, Trophy, Users, Brain, Target } from 'lucide-react';

interface ClassAnalyticsProps {
  accessToken: string;
  language: 'tr' | 'nl';
  onBack: () => void;
}

interface Analytics {
  totalStudents: number;
  averageAccuracy: number;
  totalQuizzesCompleted: number;
  difficultSkills: {
    skillId: string;
    attempts: number;
    accuracy: number;
    studentCount: number;
  }[];
  topStudents: {
    userId: string;
    name: string;
    totalPoints: number;
    accuracy: number;
    completedLessons: number;
  }[];
  skillStats: Record<string, { attempts: number; correct: number; studentCount: number }>;
}

const translations = {
  tr: {
    loading: 'Yükleniyor...',
    classAnalytics: 'Sınıf Analitiği',
    backToDashboard: 'Panele Dön',
    overview: 'Genel Bakış',
    totalStudents: 'Toplam Öğrenci',
    classAccuracy: 'Sınıf Ortalaması',
    totalQuizzes: 'Toplam Alıştırma',
    difficultSkills: 'En Zor Beceriler',
    topPerformers: 'En Başarılı Öğrenciler',
    skillName: 'Beceri',
    attempts: 'Deneme',
    accuracy: 'Doğruluk',
    students: 'Öğrenci',
    rank: 'Sıra',
    name: 'İsim',
    points: 'Puan',
    completed: 'Tamamlanan',
    noData: 'Henüz veri yok',
    needsAttention: 'Dikkat Gerektirir',
    excellent: 'Mükemmel',
    good: 'İyi',
    fair: 'Orta'
  },
  nl: {
    loading: 'Laden...',
    classAnalytics: 'Klas Analyse',
    backToDashboard: 'Terug naar Dashboard',
    overview: 'Overzicht',
    totalStudents: 'Totaal Studenten',
    classAccuracy: 'Klas Gemiddelde',
    totalQuizzes: 'Totaal Oefeningen',
    difficultSkills: 'Moeilijkste Vaardigheden',
    topPerformers: 'Top Presteerders',
    skillName: 'Vaardigheid',
    attempts: 'Pogingen',
    accuracy: 'Nauwkeurigheid',
    students: 'Studenten',
    rank: 'Rang',
    name: 'Naam',
    points: 'Punten',
    completed: 'Voltooid',
    noData: 'Nog geen data',
    needsAttention: 'Aandacht Nodig',
    excellent: 'Uitstekend',
    good: 'Goed',
    fair: 'Redelijk'
  }
};

export function ClassAnalytics({ accessToken, language, onBack }: ClassAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/class-analytics`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAnalytics(data.analytics);
      } else {
        console.error('Error fetching analytics:', data.error);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!analytics) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">{t.noData}</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2" size={20} />
          {t.backToDashboard}
        </Button>
      </div>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100 border-green-300';
    if (accuracy >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 80) return t.excellent;
    if (accuracy >= 60) return t.good;
    if (accuracy >= 40) return t.fair;
    return t.needsAttention;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-200">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Brain className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl text-blue-800">{t.classAnalytics}</h1>
              <p className="text-gray-600">{t.overview}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-4 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Users className="text-purple-600" size={24} />
            </div>
            <h2 className="text-xl text-purple-800">{t.totalStudents}</h2>
          </div>
          <p className="text-4xl text-purple-800">{analytics.totalStudents}</p>
        </Card>

        <Card className="p-6 border-4 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Target className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl text-green-800">{t.classAccuracy}</h2>
          </div>
          <p className="text-4xl text-green-800">{Math.round(analytics.averageAccuracy)}%</p>
        </Card>

        <Card className="p-6 border-4 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Brain className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl text-blue-800">{t.totalQuizzes}</h2>
          </div>
          <p className="text-4xl text-blue-800">{analytics.totalQuizzesCompleted}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Most Difficult Skills */}
        <Card className="p-6 border-4 border-red-200">
          <h2 className="text-2xl mb-6 flex items-center gap-2 text-red-800">
            <TrendingDown className="text-red-600" size={28} />
            {t.difficultSkills}
          </h2>
          {analytics.difficultSkills.length > 0 ? (
            <div className="space-y-3">
              {analytics.difficultSkills.map((skill, index) => (
                <div
                  key={skill.skillId}
                  className={`p-4 rounded-lg border-2 ${getAccuracyBg(skill.accuracy)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm">{skill.skillId}</span>
                    </div>
                    <span className={`text-sm font-bold ${getAccuracyColor(skill.accuracy)}`}>
                      {Math.round(skill.accuracy)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>{t.attempts}: {skill.attempts}</span>
                    <span>{t.students}: {skill.studentCount}</span>
                  </div>
                  <Progress value={skill.accuracy} className="h-2" />
                  <p className="text-xs mt-2 text-gray-500">{getAccuracyLabel(skill.accuracy)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t.noData}</p>
          )}
        </Card>

        {/* Top Performing Students */}
        <Card className="p-6 border-4 border-yellow-200">
          <h2 className="text-2xl mb-6 flex items-center gap-2 text-yellow-800">
            <Trophy className="text-yellow-600" size={28} />
            {t.topPerformers}
          </h2>
          {analytics.topStudents.length > 0 ? (
            <div className="space-y-3">
              {analytics.topStudents.map((student, index) => (
                <div
                  key={student.userId}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{student.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Trophy size={14} className="text-yellow-600" />
                          {student.totalPoints}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target size={14} className="text-green-600" />
                          {Math.round(student.accuracy)}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain size={14} className="text-blue-600" />
                          {student.completedLessons}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t.noData}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
