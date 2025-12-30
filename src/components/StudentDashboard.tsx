import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { AppContextType } from '../App';
import { lessons, getLessonByOrder, getNextLesson, getTotalLessons, getLessonsByLevel } from '../data/notionLessons';
import NewLessonViewer from './NewLessonViewer';
import { updateReviewQueue } from '../utils/masterySystem';
import ReviewSession from './ReviewSession';
import IslamicTrivia from './IslamicTrivia';
import { Clock, Brain, RotateCcw, AlertTriangle } from 'lucide-react';
import StarIcon from './icons/StarIcon';
import BookIcon from './icons/BookIcon';
import BadgeIcon from './icons/BadgeIcon';
import GrowthIcon from './icons/GrowthIcon';

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
    lesson: 'Ders'
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
    lesson: 'Les'
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

  const t = translations[language];

  useEffect(() => {
    fetchProgress();
  }, [user.id, accessToken]);

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

  const applyWrongQuestionsToQueue = (
    currentQueue: any[],
    wrongQuestions: { questionId: string; skillId: string }[]
  ) => {
    return wrongQuestions.reduce((queue, item) => {
      if (!item.questionId || !item.skillId) return queue;
      return updateReviewQueue(queue, item.questionId, item.skillId, false);
    }, currentQueue || []);
  };

  const handleLessonComplete = (result?: { wrongQuestions: { questionId: string; skillId: string }[] }) => {
    if (!progress) return;

    // Get current lesson from new system
    const currentLesson = getLessonByOrder(progress.currentLessonOrder || 1);
    if (!currentLesson) return;

    const completedLessons = [...progress.completedLessons, currentLesson.id];
    
    // Move to next lesson in sequence
    const nextLessonOrder = (progress.currentLessonOrder || 1) + 1;

    let updates: Partial<Progress> = {
      completedLessons,
      currentLessonOrder: nextLessonOrder,
      reviewQueue: applyWrongQuestionsToQueue(progress.reviewQueue, result?.wrongQuestions || [])
    };

    // Add to review items (spaced repetition)
    const reviewItems = [...(progress.reviewItems || [])];
    const existingReviewIndex = reviewItems.findIndex(item => item.lessonId === currentLesson.id);
    
    if (existingReviewIndex >= 0) {
      // Update existing review item
      const item = reviewItems[existingReviewIndex];
      reviewItems[existingReviewIndex] = {
        ...item,
        interval: item.interval * item.easeFactor,
        nextReview: new Date(Date.now() + item.interval * item.easeFactor * 24 * 60 * 60 * 1000).toISOString()
      };
    } else {
      // Add new review item (review in 1 day)
      reviewItems.push({
        lessonId: currentLesson.id,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        interval: 1,
        easeFactor: 2.5
      });
    }

    updates.reviewItems = reviewItems;

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
      .filter(Boolean);

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
  const levelProgressPercent = (levelCompletedCount / currentLevelLessons.length) * 100;

  const currentLesson = currentLevelLessons[progress.currentLessonIndex];

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
          <BookIcon size={24} />
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
              <GrowthIcon className="text-purple-600" size={24} />
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
              <BookIcon className="text-green-600" size={24} />
            </div>
            <h2 className="text-green-800">{t.nextLesson}</h2>
          </div>
          <div className="space-y-2">
            <p className="text-green-800">
              {language === 'tr' ? `Ders ${progress.currentLessonOrder || 1}` : `Les ${progress.currentLessonOrder || 1}`}
            </p>
            <p className="text-sm text-gray-600">
              {getLessonByOrder(progress.currentLessonOrder || 1)?.content.title || ''}
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
                {getLessonByOrder(progress.currentLessonOrder || 1)?.content.title || ''}
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
                <BadgeIcon size={36} className="text-white" />
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
                      {t.lesson} {lessonNum}: {lesson?.content.title || ''}
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
