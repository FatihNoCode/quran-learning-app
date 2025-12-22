import { useState, useEffect } from 'react';
import { AppContextType } from '../App';
import { lessons as notionLessons, getLessonByOrder } from '../data/notionLessons';
import { placeholderLessons } from '../data/placeholderLessons';
import { LessonActivity } from './LessonActivity';
import IslamicTrivia from './IslamicTrivia';
import { PracticeWeakAreas } from './PracticeWeakAreas';
import { StudentProfile } from './StudentProfile';
import { Leaderboard } from './Leaderboard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { BookOpen, Brain, User, Star, Award, TrendingUp, Flame, Sparkles } from 'lucide-react';
import { StudentProgress, Badge, getDueReviewItems, updateStreak } from '../utils/masterySystem';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import homeIcon from 'figma:asset/b064a1b5a53d37f1101ede8d5dc76112da50bd5a.png';
import NewLessonViewer from './NewLessonViewer';

type ActivityView = 'dashboard' | 'lesson' | 'practice' | 'profile' | 'trivia';

interface NewStudentDashboardProps {
  context: AppContextType;
  onViewChange?: (view: ActivityView) => void;
}

export default function NewStudentDashboard({ context, onViewChange }: NewStudentDashboardProps) {
  const [currentView, setCurrentView] = useState<ActivityView>('dashboard');
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, accessToken, language } = context;

  // Notify parent when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);

  // Fetch progress from backend
  useEffect(() => {
    fetchProgress();
  }, [user?.id]);

  const fetchProgress = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/progress/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }

      const data = await response.json();
      
      // Ensure all required fields exist with defaults
      const progressData = data.progress || {};
      const normalizedProgress: StudentProgress = {
        userId: progressData.userId || user.id,
        username: progressData.username || user.username,
        name: progressData.name || user.name,
        currentLessonOrder: progressData.currentLessonOrder || 1,
        completedLessons: progressData.completedLessons || [],
        skillMastery: progressData.skillMastery || {},
        reviewQueue: progressData.reviewQueue || [],
        totalPoints: progressData.totalPoints || 0,
        badges: progressData.badges || [],
        stats: {
          totalQuizzesCompleted: progressData.stats?.totalQuizzesCompleted || 0,
          averageAccuracy: progressData.stats?.averageAccuracy || 0,
          currentStreak: progressData.stats?.currentStreak || 0,
          bestStreak: progressData.stats?.bestStreak || 0,
          lastActive: progressData.stats?.lastActive || new Date().toISOString()
        }
      };
      
      // Update streak
      if (normalizedProgress.stats.lastActive) {
        const streakUpdate = updateStreak(normalizedProgress.stats.lastActive);
        if (streakUpdate.shouldReset) {
          normalizedProgress.stats.currentStreak = 1;
        } else if (streakUpdate.currentStreak > 0) {
          normalizedProgress.stats.currentStreak += streakUpdate.currentStreak;
          normalizedProgress.stats.bestStreak = Math.max(
            normalizedProgress.stats.bestStreak || 0,
            normalizedProgress.stats.currentStreak
          );
        }
      }
      
      setProgress(normalizedProgress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error(language === 'tr' ? 'İlerleme yüklenemedi' : 'Kon voortgang niet laden');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (updatedProgress: StudentProgress) => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/progress/${user.id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProgress)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      setProgress(updatedProgress);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error(language === 'tr' ? 'İlerleme kaydedilemedi' : 'Kon voortgang niet opslaan');
      return false;
    }
  };

  const handleLessonComplete = async (updatedProgress: StudentProgress, earnedBadges: Badge[]) => {
    const saved = await saveProgress(updatedProgress);
    
    if (saved && earnedBadges.length > 0) {
      toast.success(
        language === 'tr' 
          ? `🎉 ${earnedBadges.length} yeni rozet kazandın!` 
          : `🎉 Je hebt ${earnedBadges.length} nieuwe badge(s) verdiend!`
      );
    }
    
    setCurrentView('dashboard');
  };

  const handlePracticeComplete = async (updatedProgress: StudentProgress, earnedBadges: Badge[]) => {
    const saved = await saveProgress(updatedProgress);
    
    if (saved && earnedBadges.length > 0) {
      toast.success(
        language === 'tr' 
          ? `🎉 ${earnedBadges.length} yeni rozet kazandın!` 
          : `🎉 Je hebt ${earnedBadges.length} nieuwe badge(s) verdiend!`
      );
    }
    
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">
            {language === 'tr' ? 'Yükleniyor...' : 'Laden...'}
          </p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {language === 'tr' ? 'İlerleme bulunamadı' : 'Geen voortgang gevonden'}
        </p>
      </div>
    );
  }

  // Show lesson activity
  if (currentView === 'lesson') {
    // Check if it's lesson 1 (Arabic Alphabet) from notionLessons
    if (progress.currentLessonOrder === 1) {
      const alphabetLesson = getLessonByOrder(1);
      if (alphabetLesson) {
        return (
          <NewLessonViewer
            lesson={alphabetLesson}
            language={language}
            onBack={() => setCurrentView('dashboard')}
            onComplete={() => {
              // Update progress for alphabet lesson completion
              const updatedProgress: StudentProgress = {
                ...progress,
                currentLessonOrder: 2,
                completedLessons: [...progress.completedLessons, alphabetLesson.id],
                totalPoints: progress.totalPoints + 100,
                stats: {
                  ...progress.stats,
                  totalQuizzesCompleted: progress.stats.totalQuizzesCompleted + 1,
                  lastActive: new Date().toISOString()
                }
              };
              handleLessonComplete(updatedProgress, []);
            }}
          />
        );
      }
    }
    
    // For other lessons, use the placeholder lessons
    const currentLesson = placeholderLessons.find(l => l.order === progress.currentLessonOrder);
    if (!currentLesson) {
      setCurrentView('dashboard');
      return null;
    }

    return (
      <LessonActivity
        lesson={currentLesson}
        language={language}
        progress={progress}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Show practice weak areas
  if (currentView === 'practice') {
    return (
      <PracticeWeakAreas
        progress={progress}
        language={language}
        onComplete={handlePracticeComplete}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  // Show profile
  if (currentView === 'profile') {
    return (
      <StudentProfile
        progress={progress}
        language={language}
        onClose={() => setCurrentView('dashboard')}
        userId={user.id}
        accessToken={accessToken}
        onProgressReset={fetchProgress}
      />
    );
  }

  // Show trivia
  if (currentView === 'trivia') {
    return (
      <div className="space-y-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            {language === 'tr' ? 'Geri Dön' : 'Terug'}
          </button>
        </div>
        <IslamicTrivia language={language} />
      </div>
    );
  }

  // Dashboard view
  // Get the current lesson - check if it's lesson 1 from notionLessons
  let currentLessonTitle = '';
  if (progress.currentLessonOrder === 1) {
    const alphabetLesson = getLessonByOrder(1);
    currentLessonTitle = alphabetLesson 
      ? (language === 'tr' ? 'Arap Alfabesi - Kuran Harfleri' : 'Arabisch Alfabet - Koran Letters')
      : '';
  } else {
    const currentLesson = placeholderLessons.find(l => l.order === progress.currentLessonOrder);
    currentLessonTitle = currentLesson?.title[language] || '';
  }
  
  const dueReviewItems = getDueReviewItems(progress.reviewQueue);
  const totalLessons = placeholderLessons.length;
  const completedLessons = progress.completedLessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <Star className="text-purple-600" size={28} />
            <div>
              <div className="text-2xl">{progress.totalPoints}</div>
              <div className="text-sm text-purple-700">
                {language === 'tr' ? 'Puan' : 'Punten'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={28} />
            <div>
              <div className="text-2xl">{Math.round(progress.stats.averageAccuracy)}%</div>
              <div className="text-sm text-blue-700">
                {language === 'tr' ? 'Doğruluk' : 'Nauwkeurigheid'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center gap-3">
            <Flame className="text-orange-600" size={28} />
            <div>
              <div className="text-2xl">{progress.stats.currentStreak}</div>
              <div className="text-sm text-orange-700">
                {language === 'tr' ? 'Gün Serisi' : 'Dag Streak'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <Award className="text-green-600" size={28} />
            <div>
              <div className="text-2xl">{progress.badges.length}</div>
              <div className="text-sm text-green-700">
                {language === 'tr' ? 'Rozet' : 'Badges'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="p-6">
        <h3 className="text-xl mb-4">
          {language === 'tr' ? 'Genel İlerleme' : 'Totale Voortgang'}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span>{completedLessons} / {totalLessons} {language === 'tr' ? 'ders tamamlandı' : 'lessen voltooid'}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-4" />
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-4 gap-4">
        {completedLessons < totalLessons && (
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('lesson')}>
            <div className="flex flex-col items-center text-center gap-3">
              <BookOpen className="text-purple-600" size={48} />
              <h3 className="text-xl">
                {language === 'tr' ? 'Ders Çalış' : 'Studeer Les'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'tr' ? 'Yeni konular öğren' : 'Leer nieuwe onderwerpen'}
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('practice')}>
          <div className="flex flex-col items-center text-center gap-3">
            <Brain className="text-blue-600" size={48} />
            <h3 className="text-xl">
              {language === 'tr' ? 'Zayıf Alanları Geliştir' : 'Oefen Zwakke Punten'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'tr' 
                ? `${dueReviewItems.length} soru hazır` 
                : `${dueReviewItems.length} vragen klaar`
              }
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('trivia')}>
          <div className="flex flex-col items-center text-center gap-3">
            <Sparkles className="text-purple-600" size={48} />
            <h3 className="text-xl">
              {language === 'tr' ? 'Bilgi Yarışması' : 'Trivia'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'tr' ? 'Bilgini test et' : 'Test je kennis'}
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('profile')}>
          <div className="flex flex-col items-center text-center gap-3">
            <User className="text-green-600" size={48} />
            <h3 className="text-xl">
              {language === 'tr' ? 'Profilim' : 'Mijn Profiel'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'tr' ? 'İlerlemeni gör' : 'Bekijk je voortgang'}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Badges */}
      {progress.badges.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl mb-4">
            {language === 'tr' ? 'Son Kazanılan Rozetler' : 'Recent Verdiende Badges'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {progress.badges.slice(-3).reverse().map(badge => (
              <div key={badge.id} className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl flex items-center gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <div className="font-bold text-sm">{badge.name[language]}</div>
                  <div className="text-xs text-gray-600">{badge.description[language]}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Leaderboard */}
      <Leaderboard
        currentUserId={user.id}
        accessToken={accessToken}
        language={language}
      />
    </div>
  );
}
