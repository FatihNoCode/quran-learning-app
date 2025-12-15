import { useState, useEffect } from 'react';
import { projectId } from '../utils/supabase/info';
import { AppContextType } from '../App';
import { lessons, getLessonByOrder, getTotalLessons, getLessonsByLevel } from '../data/notionLessons';
import NewLessonViewer from './NewLessonViewer';
import ReviewSession from './ReviewSession';
import IslamicTrivia from './IslamicTrivia';
import { BookOpen, Award, Clock, TrendingUp, Brain, RotateCcw, AlertTriangle, Trophy, Medal, User } from 'lucide-react';

interface StudentDashboardProps {
  context: AppContextType;
}

interface Progress {
  userId: string;
  username: string;
  name: string;
  currentLevel: string;
  currentLessonIndex: number;
  completedLessons: string[];
  currentLessonOrder: number; // New field for sequential lessons
  reviewItems: ReviewItem[];
  lastActive: string;
}

interface ReviewItem {
  lessonId: string;
  nextReview: string;
  interval: number;
  easeFactor: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  name: string;
  completedLessons: number;
  currentLessonOrder: number;
}

const translations = {
  tr: {
    progress: 'İlerleme',
    currentLevel: 'Mevcut Seviye',
    completed: 'Tamamlanan',
    lessons: 'Ders',
    nextLesson: 'Sonraki Ders',
    review: 'Tekrar',
    reviewReady: 'Tekrar Edilecek',
    items: 'Öğe',
    startReview: 'Tekrarı Başlat',
    continueLesson: 'Derse Devam Et',
    levelProgress: 'Seviye İlerlemesi',
    stats: 'İstatistikler',
    totalCompleted: 'Toplam Tamamlanan',
    streak: 'Art Arda',
    days: 'Gün',
    resetProgress: 'İlerlemeyi Sıfırla',
    resetToLesson: 'Derse Geri Dön',
    confirmReset: 'İlerlemenizi sıfırlamak istediğinizden emin misiniz?',
    resetWarning: 'Bu dersten sonraki tüm ilerlemeniz silinecek.',
    cancel: 'İptal',
    reset: 'Sıfırla',
    selectLesson: 'Ders Seç',
    resetting: 'Sıfırlanıyor...',
    lesson: 'Ders',
    leaderboard: 'Lider Tablosu',
    account: 'Hesabım',
    badges: 'Rozetler',
    rank: 'Sıralama',
    you: 'Sen',
    viewAccount: 'Hesap Bilgileri',
    badgeLessonStarter: 'Ders Başlangıcı',
    badgeLessonStarterDesc: 'İlk dersi tamamladın.',
    badgeLessonExplorer: 'Ders Keşifçisi',
    badgeLessonExplorerDesc: '5 dersi tamamladın.',
    badgeLessonPro: 'Ders Ustası',
    badgeLessonProDesc: '10+ dersi tamamladın.',
    badgeReviewHero: 'Tekrar Kahramanı',
    badgeReviewHeroDesc: 'İlk tekrarı tamamladın.',
    badgeConsistency: 'Düzenli Öğrenen',
    badgeConsistencyDesc: '7 dersi tamamladın.'
  },
  nl: {
    progress: 'Voortgang',
    currentLevel: 'Huidig Niveau',
    completed: 'Voltooid',
    lessons: 'Lessen',
    nextLesson: 'Volgende Les',
    review: 'Herhaling',
    reviewReady: 'Klaar voor Herhaling',
    items: 'Items',
    startReview: 'Start Herhaling',
    continueLesson: 'Ga door met Les',
    levelProgress: 'Niveau Voortgang',
    stats: 'Statistieken',
    totalCompleted: 'Totaal Voltooid',
    streak: 'Reeks',
    days: 'Dagen',
    resetProgress: 'Voortgang Resetten',
    resetToLesson: 'Terug naar Les',
    confirmReset: 'Weet je zeker dat je je voortgang wilt resetten?',
    resetWarning: 'Alle voortgang na deze les wordt gewist.',
    cancel: 'Annuleren',
    reset: 'Reset',
    selectLesson: 'Selecteer Les',
    resetting: 'Resetten...',
    lesson: 'Les',
    leaderboard: 'Klassement',
    account: 'Mijn account',
    badges: 'Badges',
    rank: 'Rang',
    you: 'Jij',
    viewAccount: 'Accountgegevens',
    badgeLessonStarter: 'Les Starter',
    badgeLessonStarterDesc: 'Je hebt je eerste les voltooid.',
    badgeLessonExplorer: 'Les Verkenner',
    badgeLessonExplorerDesc: 'Je hebt 5 lessen voltooid.',
    badgeLessonPro: 'Les Pro',
    badgeLessonProDesc: 'Je hebt 10+ lessen voltooid.',
    badgeReviewHero: 'Herhaal Held',
    badgeReviewHeroDesc: 'Je hebt je eerste herhaling gedaan.',
    badgeConsistency: 'Consistente Leerling',
    badgeConsistencyDesc: 'Je hebt 7 lessen voltooid.'
  }
};

export default function StudentDashboard({ context }: StudentDashboardProps) {
  const { user, accessToken, language } = context;
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLesson, setShowLesson] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'trivia'>('lessons');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedResetLesson, setSelectedResetLesson] = useState<number>(1);
  const [resetting, setResetting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const t = translations[language];
  const getTitle = (lessonObj: any) =>
    language === 'nl'
      ? (lessonObj?.content?.titleNl || lessonObj?.content?.title || '')
      : (lessonObj?.content?.title || '');
  const getInstruction = (lessonObj: any) =>
    language === 'nl'
      ? (lessonObj?.content?.instructionNl || lessonObj?.content?.instruction || '')
      : (lessonObj?.content?.instruction || '');

  useEffect(() => {
    fetchProgress();
  }, [user.id, accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchLeaderboard();
    }
  }, [accessToken]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/progress/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Ensure currentLessonOrder exists for new lesson system
        const progressData = {
          ...data.progress,
          currentLessonOrder: data.progress.currentLessonOrder || 1
        };
        setProgress(progressData);
      } else {
        console.error('Error fetching progress:', data.error || data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
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
        const entries: LeaderboardEntry[] = (data.students || []).map((s: any) => ({
          userId: s.userId,
          username: s.username,
          name: s.name,
          completedLessons: (s.completedLessons || []).length,
          currentLessonOrder: s.currentLessonOrder || s.currentLessonIndex || 1
        }));

        const sorted = entries.sort((a, b) => b.completedLessons - a.completedLessons);
        setLeaderboard(sorted.slice(0, 10));
      } else {
        setLeaderboard([{
          userId: user.id,
          username: user.username,
          name: user.name,
          completedLessons: progress?.completedLessons.length || 0,
          currentLessonOrder: progress?.currentLessonOrder || 1
        }]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error instanceof Error ? error.message : error);
      setLeaderboard([{
        userId: user.id,
        username: user.username,
        name: user.name,
        completedLessons: progress?.completedLessons.length || 0,
        currentLessonOrder: progress?.currentLessonOrder || 1
      }]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<Progress>) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/progress/${user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(updates)
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProgress(data.progress);
      } else {
        console.error('Error updating progress:', data.error);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLessonComplete = () => {
    if (!progress) return;

    // Get current lesson from new system
    const currentLesson = getLessonByOrder(progress.currentLessonOrder || 1);
    if (!currentLesson) return;

    const completedLessons = [...progress.completedLessons, currentLesson.id];
    
    // Move to next lesson in sequence
    const nextLessonOrder = (progress.currentLessonOrder || 1) + 1;

    let updates: Partial<Progress> = {
      completedLessons,
      currentLessonOrder: nextLessonOrder
    };

    // Add to review items (spaced repetition) only for non-image lessons
    if (currentLesson.content.type !== 'image-lesson') {
      const reviewItems = [...(progress.reviewItems || [])];
      const existingReviewIndex = reviewItems.findIndex(item => item.lessonId === currentLesson.id);
      
      if (existingReviewIndex >= 0) {
        const item = reviewItems[existingReviewIndex];
        reviewItems[existingReviewIndex] = {
          ...item,
          interval: item.interval * item.easeFactor,
          nextReview: new Date(Date.now() + item.interval * item.easeFactor * 24 * 60 * 60 * 1000).toISOString()
        };
      } else {
        reviewItems.push({
          lessonId: currentLesson.id,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          interval: 1,
          easeFactor: 2.5
        });
      }

      updates.reviewItems = reviewItems;
    }

    updateProgress(updates);
    setShowLesson(false);
  };

  const handleResetProgress = async () => {
    setResetting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/students/${user.id}/reset-to-lesson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ lessonOrder: selectedResetLesson })
        }
      );

      if (response.ok) {
        setShowResetDialog(false);
        await fetchProgress(); // Reload progress
      } else {
        const data = await response.json();
        console.error('Error resetting progress:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert('Failed to reset progress');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">{language === 'tr' ? 'Yükleniyor...' : 'Laden...'}</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{language === 'tr' ? 'İlerleme yüklenemedi' : 'Voortgang kon niet worden geladen'}</p>
      </div>
    );
  }

  if (showLesson) {
    // Use NEW lesson system - sequential lessons
    const currentLesson = getLessonByOrder(progress.currentLessonOrder || 1);
    
    if (!currentLesson) {
      return (
        <div className="text-center py-20">
          <p className="text-green-600">{language === 'tr' ? 'Tüm dersler tamamlandı!' : 'Alle lessen voltooid!'}</p>
          <button
            onClick={() => setShowLesson(false)}
            className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl"
          >
            {language === 'tr' ? 'Geri Dön' : 'Ga Terug'}
          </button>
        </div>
      );
    }
    
    return (
      <NewLessonViewer
        lesson={currentLesson}
        language={language}
        onComplete={handleLessonComplete}
        onBack={() => setShowLesson(false)}
      />
    );
  }

  if (showReview) {
    const reviewLessons = progress.reviewItems
      .filter(item => new Date(item.nextReview) <= new Date())
      .map(item => lessons.find(l => l.id === item.lessonId))
      .filter((lesson): lesson is typeof lessons[number] => Boolean(lesson && lesson.content.type !== 'image-lesson'));

    return (
      <ReviewSession
        lessons={reviewLessons as any}
        language={language}
        onComplete={() => setShowReview(false)}
        onBack={() => setShowReview(false)}
      />
    );
  }

  // Count items ready for review
  const reviewItemsReady = progress.reviewItems?.filter(
    item => new Date(item.nextReview) <= new Date()
  ).length || 0;

  // Calculate level progress
  const currentLevelLessons = getLessonsByLevel(progress.currentLevel);
  const levelCompletedCount = currentLevelLessons.filter(
    lesson => progress.completedLessons.includes(lesson.id)
  ).length;
  const levelProgressPercent = currentLevelLessons.length
    ? (levelCompletedCount / currentLevelLessons.length) * 100
    : 0;

  const currentLesson = currentLevelLessons[progress.currentLessonIndex];

  const badgeDefinitions = [
    {
      id: 'lesson-starter',
      title: t.badgeLessonStarter,
      description: t.badgeLessonStarterDesc,
      unlocked: progress.completedLessons.length >= 1
    },
    {
      id: 'lesson-explorer',
      title: t.badgeLessonExplorer,
      description: t.badgeLessonExplorerDesc,
      unlocked: progress.completedLessons.length >= 5
    },
    {
      id: 'lesson-pro',
      title: t.badgeLessonPro,
      description: t.badgeLessonProDesc,
      unlocked: progress.completedLessons.length >= 10
    },
    {
      id: 'review-hero',
      title: t.badgeReviewHero,
      description: t.badgeReviewHeroDesc,
      unlocked: (progress.reviewItems || []).length > 0
    },
    {
      id: 'consistency',
      title: t.badgeConsistency,
      description: t.badgeConsistencyDesc,
      unlocked: progress.completedLessons.length >= 7
    }
  ];

  const myRank =
    leaderboard.findIndex(entry => entry.userId === user.id) >= 0
      ? leaderboard.findIndex(entry => entry.userId === user.id) + 1
      : null;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2 border-4 border-purple-200 flex gap-2">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${
            activeTab === 'lessons'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen size={24} />
          <span>{language === 'tr' ? 'Dersler' : 'Lessen'}</span>
        </button>
        <button
          onClick={() => setActiveTab('trivia')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${
            activeTab === 'trivia'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Brain size={24} />
          <span>{language === 'tr' ? 'İslami Bilgi' : 'Islamitische Kennis'}</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'trivia' ? (
        <IslamicTrivia language={language} />
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <h2 className="text-purple-800">{t.progress}</h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">{t.totalCompleted}</p>
            <p className="text-purple-800">
              {progress.completedLessons.length} / {getTotalLessons()} {t.lessons}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${(progress.completedLessons.length / getTotalLessons()) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Lesson Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <h2 className="text-green-800">{t.nextLesson}</h2>
          </div>
          <div className="space-y-2">
            <p className="text-green-800">
              {language === 'tr' ? `Ders ${progress.currentLessonOrder || 1}` : `Les ${progress.currentLessonOrder || 1}`}
            </p>
            <p className="text-sm text-gray-600">
              {getTitle(getLessonByOrder(progress.currentLessonOrder || 1))}
            </p>
          </div>
        </div>

        {/* Review Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Clock className="text-orange-600" size={24} />
            </div>
            <h2 className="text-orange-800">{t.review}</h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">{t.reviewReady}</p>
            <p className="text-orange-800">
              {reviewItemsReady} {t.items}
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <div className="md:col-span-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowLesson(true)}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <h2>{t.nextLesson}</h2>
              <p className="text-purple-100">
                {getTitle(getLessonByOrder(progress.currentLessonOrder || 1))}
              </p>
            </div>
          </div>
          <button className="w-full bg-white text-purple-600 py-4 rounded-xl hover:bg-purple-50 transition-colors">
            {t.continueLesson}
          </button>
        </div>

        {/* Review */}
        {reviewItemsReady > 0 && (
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setShowReview(true)}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Award className="text-white" size={36} />
              </div>
              <div>
                <h2>{t.review}</h2>
                <p className="text-orange-100">
                  {reviewItemsReady} {t.items} {t.reviewReady}
                </p>
              </div>
            </div>
            <button className="w-full bg-white text-orange-600 py-4 rounded-xl hover:bg-orange-50 transition-colors">
              {t.startReview}
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard, Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border-4 border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Trophy className="text-yellow-600" size={22} />
            </div>
            <div>
              <h2 className="text-yellow-800">{t.leaderboard}</h2>
              <p className="text-xs text-yellow-700">
                {language === 'tr' ? 'En çok ders tamamlayanlar' : 'Top leerlingen op basis van voltooide lessen'}
              </p>
            </div>
          </div>
          {leaderboardLoading ? (
            <p className="text-gray-500">{language === 'tr' ? 'Yükleniyor...' : 'Laden...'}</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => {
                const isYou = entry.userId === user.id;
                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      isYou ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-300 text-gray-800' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">
                          {entry.name} {isYou ? `(${t.you})` : ''}
                        </p>
                        <p className="text-sm text-gray-500">@{entry.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-700 font-semibold">
                        {entry.completedLessons} / {getTotalLessons()}
                      </p>
                      <p className="text-xs text-gray-500">{language === 'tr' ? 'Ders' : 'Les'}</p>
                    </div>
                  </div>
                );
              })}
              {myRank && myRank > 5 && (
                <p className="text-sm text-gray-600">
                  {language === 'tr' ? 'Senin sıralaman:' : 'Jouw rang:'} #{myRank}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-4 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Medal className="text-green-600" size={22} />
            </div>
            <h2 className="text-green-800">{t.badges}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badgeDefinitions.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border ${
                  badge.unlocked ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Medal className={badge.unlocked ? 'text-green-600' : 'text-gray-400'} size={18} />
                  <p className="font-semibold text-gray-800">{badge.title}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Progress Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setSelectedResetLesson(progress.currentLessonOrder || 1);
            setShowResetDialog(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-300"
        >
          <RotateCcw size={20} />
          {t.resetProgress}
        </button>
      </div>

      {/* Reset Progress Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border-4 border-gray-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 p-3 rounded-xl">
                <AlertTriangle className="text-gray-600" size={24} />
              </div>
              <h3 className="text-gray-800">{t.confirmReset}</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">{t.selectLesson}</label>
              <select
                value={selectedResetLesson}
                onChange={(e) => setSelectedResetLesson(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              >
                {Array.from({ length: progress.currentLessonOrder || 1 }, (_, i) => i + 1).map(lessonNum => {
                  const lesson = getLessonByOrder(lessonNum);
                  return (
                    <option key={lessonNum} value={lessonNum}>
                      {t.lesson} {lessonNum}: {getTitle(lesson)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
              <p className="text-gray-700 text-sm">{t.resetWarning}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetDialog(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                disabled={resetting}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleResetProgress}
                disabled={resetting}
                className="flex-1 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetting ? t.resetting : t.reset}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
