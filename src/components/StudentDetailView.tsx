import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, Star, Brain, TrendingUp, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { StudentProgress } from '../utils/masterySystem';
import { placeholderLessons } from '../data/placeholderLessons';
import { projectId } from '../utils/supabase/info';

interface StudentDetailViewProps {
  studentId: string;
  accessToken: string;
  language: 'tr' | 'nl';
  onBack: () => void;
}

const translations = {
  tr: {
    loading: 'Yükleniyor...',
    studentDetails: 'Öğrenci Detayları',
    backToList: 'Listeye Dön',
    overview: 'Genel Bakış',
    totalPoints: 'Toplam Puan',
    accuracy: 'Doğruluk Oranı',
    completedLessons: 'Tamamlanan Dersler',
    totalQuizzes: 'Toplam Alıştırma',
    currentStreak: 'Mevcut Seri',
    bestStreak: 'En İyi Seri',
    badges: 'Rozetler',
    skillMastery: 'Beceri Hakimiyeti',
    weakSkills: 'Zayıf Alanlar',
    strongSkills: 'Güçlü Alanlar',
    reviewQueue: 'Tekrar Kuyruğu',
    itemsDue: 'Tekrar Edilecek',
    lastActive: 'Son Aktif',
    noBadges: 'Henüz rozet yok',
    noWeakSkills: 'Harika! Zayıf alan yok.',
    masteryLevel: 'Seviye',
    attempts: 'Deneme',
    correctAnswers: 'Doğru',
    skill: 'Beceri',
    level: 'Seviye',
    beginner: 'Başlangıç',
    developing: 'Gelişiyor',
    proficient: 'Yetkin',
    mastered: 'Uzman',
    expert: 'Profesyonel',
    progressResets: 'İlerleme Sıfırlamaları',
    resetCount: 'Sıfırlama Sayısı',
    lastReset: 'Son Sıfırlama',
    noResets: 'Hiç sıfırlanmadı',
    times: 'kez'
  },
  nl: {
    loading: 'Laden...',
    studentDetails: 'Student Details',
    backToList: 'Terug naar Lijst',
    overview: 'Overzicht',
    totalPoints: 'Totaal Punten',
    accuracy: 'Nauwkeurigheid',
    completedLessons: 'Voltooide Lessen',
    totalQuizzes: 'Totaal Oefeningen',
    currentStreak: 'Huidige Reeks',
    bestStreak: 'Beste Reeks',
    badges: 'Badges',
    skillMastery: 'Vaardigheidsbeheersing',
    weakSkills: 'Zwakke Punten',
    strongSkills: 'Sterke Punten',
    reviewQueue: 'Review Wachtrij',
    itemsDue: 'Te Herhalen',
    lastActive: 'Laatst Actief',
    noBadges: 'Nog geen badges',
    noWeakSkills: 'Geweldig! Geen zwakke punten.',
    masteryLevel: 'Niveau',
    attempts: 'Pogingen',
    correctAnswers: 'Correct',
    skill: 'Vaardigheid',
    level: 'Niveau',
    beginner: 'Beginner',
    developing: 'Ontwikkelend',
    proficient: 'Bekwaam',
    mastered: 'Beheerst',
    expert: 'Expert',
    progressResets: 'Voortgangsresetten',
    resetCount: 'Aantal Resets',
    lastReset: 'Laatste Reset',
    noResets: 'Nooit gereset',
    times: 'keer'
  }
};

export function StudentDetailView({ studentId, accessToken, language, onBack }: StudentDetailViewProps) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/student-detail/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProgress(data.progress);
      } else {
        console.error('Error fetching student detail:', data.error);
      }
    } catch (error) {
      console.error('Error fetching student detail:', error);
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

  if (!progress) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Student not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2" size={20} />
          {t.backToList}
        </Button>
      </div>
    );
  }

  // Calculate weak and strong skills
  const skillEntries = Object.entries(progress.skillMastery || {});
  const weakSkills = skillEntries
    .filter(([_, mastery]) => mastery.level < 2)
    .sort((a, b) => a[1].level - b[1].level)
    .slice(0, 5);
  
  const strongSkills = skillEntries
    .filter(([_, mastery]) => mastery.level >= 3)
    .sort((a, b) => b[1].level - a[1].level)
    .slice(0, 5);

  const dueReviewItems = (progress.reviewQueue || []).filter(
    item => new Date(item.nextReviewDate) <= new Date()
  );

  const getLevelColor = (level: number) => {
    if (level === 0) return 'bg-gray-400';
    if (level === 1) return 'bg-red-400';
    if (level === 2) return 'bg-yellow-400';
    if (level === 3) return 'bg-blue-400';
    if (level === 4) return 'bg-green-400';
    return 'bg-purple-400';
  };

  const getLevelText = (level: number) => {
    if (level === 0) return t.beginner;
    if (level === 1) return t.developing;
    if (level === 2) return t.proficient;
    if (level === 3) return t.mastered;
    return t.expert;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl">
                {progress.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl text-purple-800">{progress.name}</h1>
                <p className="text-gray-600">@{progress.username}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-4 border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="text-yellow-600" size={20} />
            <p className="text-sm text-gray-600">{t.totalPoints}</p>
          </div>
          <p className="text-2xl text-yellow-800">{progress.totalPoints || 0}</p>
        </Card>

        <Card className="p-4 border-4 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-green-600" size={20} />
            <p className="text-sm text-gray-600">{t.accuracy}</p>
          </div>
          <p className="text-2xl text-green-800">
            {Math.round(progress.stats?.averageAccuracy || 0)}%
          </p>
        </Card>

        <Card className="p-4 border-4 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-blue-600" size={20} />
            <p className="text-sm text-gray-600">{t.completedLessons}</p>
          </div>
          <p className="text-2xl text-blue-800">{progress.completedLessons?.length || 0}</p>
        </Card>

        <Card className="p-4 border-4 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-purple-600" size={20} />
            <p className="text-sm text-gray-600">{t.totalQuizzes}</p>
          </div>
          <p className="text-2xl text-purple-800">{progress.stats?.totalQuizzesCompleted || 0}</p>
        </Card>

        <Card className="p-4 border-4 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-orange-600" size={20} />
            <p className="text-sm text-gray-600">{t.currentStreak}</p>
          </div>
          <p className="text-2xl text-orange-800">{progress.stats?.currentStreak || 0} 🔥</p>
        </Card>

        <Card className="p-4 border-4 border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-pink-600" size={20} />
            <p className="text-sm text-gray-600">{t.itemsDue}</p>
          </div>
          <p className="text-2xl text-pink-800">{dueReviewItems.length}</p>
        </Card>
      </div>

      {/* Badges */}
      <Card className="p-6 border-4 border-yellow-200">
        <h2 className="text-2xl mb-4 flex items-center gap-2 text-yellow-800">
          <Trophy className="text-yellow-600" size={28} />
          {t.badges}
        </h2>
        {progress.badges && progress.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {progress.badges.map((badge, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300 text-center"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-bold text-sm">{badge.name[language]}</p>
                <p className="text-xs text-gray-600 mt-1">{badge.description[language]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">{t.noBadges}</p>
        )}
      </Card>

      {/* Progress Reset Information - Teacher Only */}
      {(progress.resetCount || 0) > 0 && (
        <Card className="p-6 border-4 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
          <h2 className="text-2xl mb-4 flex items-center gap-2 text-gray-800">
            <RotateCcw className="text-gray-600" size={28} />
            {t.progressResets}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{t.resetCount}:</p>
              <p className="text-3xl text-gray-800">
                {progress.resetCount} {t.times}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{t.lastReset}:</p>
              <p className="text-lg text-gray-800">
                {progress.lastResetDate 
                  ? new Date(progress.lastResetDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'nl-NL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Skills */}
        <Card className="p-6 border-4 border-red-200">
          <h2 className="text-2xl mb-4 flex items-center gap-2 text-red-800">
            <AlertCircle className="text-red-600" size={28} />
            {t.weakSkills}
          </h2>
          {weakSkills.length > 0 ? (
            <div className="space-y-3">
              {weakSkills.map(([skillId, mastery]) => (
                <div key={skillId} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{skillId}</span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getLevelColor(mastery.level)}`}>
                      {getLevelText(mastery.level)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>{t.attempts}: {mastery.attempts}</span>
                    <span>{t.correctAnswers}: {mastery.correct}</span>
                  </div>
                  <Progress
                    value={mastery.attempts > 0 ? (mastery.correct / mastery.attempts) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t.noWeakSkills}</p>
          )}
        </Card>

        {/* Strong Skills */}
        <Card className="p-6 border-4 border-green-200">
          <h2 className="text-2xl mb-4 flex items-center gap-2 text-green-800">
            <Star className="text-green-600" size={28} />
            {t.strongSkills}
          </h2>
          {strongSkills.length > 0 ? (
            <div className="space-y-3">
              {strongSkills.map(([skillId, mastery]) => (
                <div key={skillId} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{skillId}</span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getLevelColor(mastery.level)}`}>
                      {getLevelText(mastery.level)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>{t.attempts}: {mastery.attempts}</span>
                    <span>{t.correctAnswers}: {mastery.correct}</span>
                  </div>
                  <Progress
                    value={mastery.attempts > 0 ? (mastery.correct / mastery.attempts) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No skills mastered yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}