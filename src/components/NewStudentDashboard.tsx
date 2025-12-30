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
import { User, CheckCircle, RefreshCcw } from 'lucide-react';
import BookIcon from './icons/BookIcon';
import BrainIcon from './icons/BrainIcon';
import ProgressIcon from './icons/ProgressIcon';
import StarIcon from './icons/StarIcon';
import BadgeIcon from './icons/BadgeIcon';
import FlameIcon from './icons/FlameIcon';
import GrowthIcon from './icons/GrowthIcon';
import { StudentProgress, Badge, updateStreak, updateReviewQueue } from '../utils/masterySystem';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import homeIcon from 'figma:asset/b064a1b5a53d37f1101ede8d5dc76112da50bd5a.png';
import NewLessonViewer from './NewLessonViewer';

// Simple Arabic letter covers for lesson cards
const arabicLessonCovers = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش',
  'ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه'
];

function LockSvg() {
  return (
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-700"
      style={{ width: '10rem', height: '10rem' }} // ~160px (40 * 4px)
      fill="currentColor"
    >
      <g strokeWidth="0" />
      <g strokeLinecap="round" strokeLinejoin="round" />
      <g>
        <path
          d="M766.879869 519.521462V353.548627c0-142.992753-114.521574-258.151183-255.343689-258.151184-140.760683 0-255.34369 115.15843-255.34369 256.683956V518.181196c-37.024717 34.791623-56.687411 83.945286-56.687411 147.908426 0 162.080023 118.224967 262.750476 308.517127 262.750476 192.404435 0 311.904139-101.372838 311.904138-264.665142 0-63.259731-17.936423-110.308285-53.046475-144.653494zM628.561153 350.963316v161.155455H392.768554V349.846257c0.143344-31.615531 12.351129-60.723567 34.549986-82.634713 22.280769-22.055514 51.993921-34.184459 83.530613-34.184459 31.615531 0 61.233462 12.128946 83.51423 34.184459 22.133329 21.911146 34.341114 51.020206 34.341114 81.981474l-0.143344 1.770298z"
          fill="#27323A"
        />
        <path
          d="M720.740525 540.047291c-29.108036-14.299582-69.754236-16.724143-69.754235-16.724143s-268.685939 0.013311-313.083655 0.01331c-11.364103 0-23.382469 6.193482-35.046571 14.906747-1.562449 3.382917-3.846737 6.432048-6.831363 8.857632-31.981058 25.405667-47.492921 64.410578-47.492921 118.989809 0 192.91433 181.484698 213.723775 259.491449 213.723775 164.635641 0 262.877438-80.562369 262.877438-215.639465 0-53.366951-14.489001-91.475963-44.237989-116.371734-2.536164-2.154255-4.435471-4.869599-5.922153-7.755931z"
          fill="#F4CE73"
        />
        <path
          d="M638.569632 526.418353c37.279665 0 72.388692 6.831363 87.262675 20.299551-4.915673-4.677108-7.978114-10.998576-7.978115-17.812533 0 0-0.065529-174.973811 0-176.823972 0-114.521574-92.564353-207.658278-206.318012-207.658278-113.756731 0-206.318012 93.136705-206.318012 209.125506v174.336954c0 7.46822-3.382917 14.492073-9.194491 19.215256 14.620059-13.740541 50.127378-20.682484 87.776665-20.682484H638.569632zM392.769578 349.846257c0.143344-31.615531 12.351129-60.723567 34.549986-82.634713 22.280769-22.055514 51.993921-34.184459 83.530613-34.184459 31.615531 0 61.233462 12.128946 83.51423 34.184459 22.133329 21.911146 34.341114 51.020206 34.341114 81.981474l-0.143344 1.771322V512.119795H392.769578V349.846257z"
          fill="#79CCBF"
        />
        <path
          d="M606.268098 257.794871c-25.486554-25.199866-59.366919-39.067368-95.434303-39.067368s-69.950822 13.867503-95.434304 39.067368c-25.568464 25.280753-39.642792 58.825284-39.642792 94.493353l-0.126962 165.959524c0 4.501 3.670629 8.170605 8.170605 8.170605H637.545747c4.501 0 8.170605-3.670629 8.170605-8.170605l0.127985-165.972835c0-35.684451-14.056922-69.232054-39.576239-94.480042z m6.781192 235.939015H408.329563l0.111604-141.413922c0-26.889276 10.628954-52.202793 29.938406-71.286992 19.325836-19.103652 45.051978-29.621002 72.454222-29.621002 27.402243 0 53.128386 10.51735 72.454221 29.621002 19.260307 19.054506 29.872878 44.365975 29.872878 71.241941l-0.111604 141.458973zM435.827027 653.705729c0 21.639816 10.913594 40.473163 27.065385 54.389812v69.198266c0 18.064409 14.620059 32.363991 32.42952 32.363991h28.726127c17.87499 0 32.363991-14.492073 32.363991-32.363991v-69.136833c16.214248-13.979106 27.130913-32.811429 27.130913-54.451245 0-40.727087-33.131905-73.858992-73.858992-73.858992s-73.856944 33.131905-73.856944 73.858992z"
          fill="#27323A"
        />
        <path
          d="M495.321932 776.974355l0.254947-83.690339-7.66071-4.784616c-12.128946-7.66071-19.404675-20.685555-19.404674-34.792647 0-22.662678 18.511847-41.175548 41.172476-41.175548 22.725135 0 41.175548 18.511847 41.175549 41.175548 0 14.106068-7.278801 27.130913-19.470204 34.792647l-7.66071 4.784616v84.010815l-28.406674-0.320476z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

type ActivityView = 'dashboard' | 'lessons' | 'lesson' | 'practice' | 'profile' | 'trivia';

interface NewStudentDashboardProps {
  context: AppContextType;
  onViewChange?: (view: ActivityView) => void;
  onLogout?: () => void;
  profileTrigger?: number;
  onBugReport?: () => void;
}

export default function NewStudentDashboard({ context, onViewChange, onLogout, profileTrigger, onBugReport }: NewStudentDashboardProps) {
  const [currentView, setCurrentView] = useState<ActivityView>('dashboard');
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLessonOrder, setSelectedLessonOrder] = useState<number | null>(null);

  const { user, accessToken, language } = context;

  // Notify parent when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);

  // External trigger to open profile
  useEffect(() => {
    if (profileTrigger && profileTrigger > 0) {
      setCurrentView('profile');
    }
  }, [profileTrigger]);

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

      if (response.status === 401) {
        // Token expired or unauthorized; log out if handler provided
        if (typeof onLogout === 'function') {
          onLogout();
          return;
        }
        toast.error(language === 'tr' ? 'Oturum geçersiz. Lütfen tekrar giriş yapın.' : 'Sessie verlopen. Log opnieuw in.');
        setLoading(false);
        return;
      }

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

  const applyWrongQuestionsToQueue = (
    currentQueue: any[],
    wrongQuestions: { questionId: string; skillId: string }[]
  ) => {
    return wrongQuestions.reduce((queue, item) => {
      if (!item.questionId || !item.skillId) return queue;
      return updateReviewQueue(queue, item.questionId, item.skillId, false);
    }, currentQueue || []);
  };

  const handleLessonComplete = async (
    updatedProgress: StudentProgress,
    earnedBadges: Badge[],
    result?: { wrongQuestions: { questionId: string; skillId: string }[] }
  ) => {
    if (!progress) return;

    const normalized: StudentProgress = {
      ...updatedProgress,
      completedLessons: Array.from(new Set(updatedProgress.completedLessons)),
      currentLessonOrder: Math.max(
        progress.currentLessonOrder || 1,
        updatedProgress.currentLessonOrder || 1
      ),
      reviewQueue: applyWrongQuestionsToQueue(
        updatedProgress.reviewQueue || progress.reviewQueue || [],
        result?.wrongQuestions || []
      )
    };

    const saved = await saveProgress(normalized);
    
    if (saved && earnedBadges.length > 0) {
      toast.success(
        language === 'tr' 
          ? `?? ${earnedBadges.length} yeni rozet kazand?n!` 
          : `?? Je hebt ${earnedBadges.length} nieuwe badge(s) verdiend!`
      );
    }
    
    setSelectedLessonOrder(null);
    setCurrentView('lessons');
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

  const reviewQueueCount = (progress.reviewQueue || []).length;
  const totalLessons = notionLessons.length;
  const completedLessons = progress.completedLessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  // Lessons overview
  if (currentView === 'lessons') {
    const lessonCards = notionLessons
      .map(l => ({
        id: l.id,
        order: l.order,
        title: l.content.titleTranslations
      }))
      .sort((a, b) => a.order - b.order);

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 border border-purple-200 rounded-full px-3 py-1 shadow-sm bg-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {language === 'tr' ? 'Geri Dön' : 'Terug'}
          </button>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-green-400 bg-white px-3 py-1 shadow-sm">
              <CheckCircle className="text-green-600" size={16} />
              {language === 'tr' ? 'Tamamlandı' : 'Voltooid'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-purple-400 bg-white px-3 py-1 shadow-sm">
              <RefreshCcw className="text-purple-600" size={16} />
              {language === 'tr' ? 'Tekrar Çalış' : 'Opnieuw doen'}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold">
          {language === 'tr' ? 'Dersler' : 'Lessen'}
        </h2>

        {/* Overall Progress on lessons page */}
        <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6">
          <h3 className="text-xl">
            {language === 'tr' ? 'Genel İlerleme' : 'Totale Voortgang'}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <span>{completedLessons} / {totalLessons} {language === 'tr' ? 'ders tamamlandı' : 'lessen voltooid'}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b, #10b981)'
              }}
            />
          </div>
        </Card>

        <p className="text-gray-600">
          {language === 'tr'
            ? 'Tamamladığın dersleri gözden geçir veya yeni derslere başla.'
            : 'Bekijk afgeronde lessen of start een nieuwe les.'}
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {lessonCards.map(lesson => {
            const completed = progress.completedLessons.includes(lesson.id);
            const isCurrent = progress.currentLessonOrder === lesson.order;
            const unlocked = lesson.order <= progress.currentLessonOrder || completed;
            const coverLetter = arabicLessonCovers[(lesson.order - 1) % arabicLessonCovers.length] || 'ا';
            const redoLabel = language === 'tr' ? 'Tekrar et' : 'Opnieuw doen';
            const baseTitle = lesson.title[language];
            const displayTitle = baseTitle;

            return (
              <Card
                key={lesson.id}
                className={`relative p-0 overflow-hidden hover:shadow-xl transition ${
                  unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                } border-2 ${
                  completed ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100' : 'border-purple-100 bg-gradient-to-br from-white to-purple-50'
                } ${unlocked ? '' : 'grayscale opacity-70'}`}
                onClick={() => {
                  if (!unlocked) return;
                  setSelectedLessonOrder(lesson.order);
                  setCurrentView('lesson');
                }}
              >
                {!unlocked && (
                  <div className="absolute inset-0 bg-gray-200/70 flex items-center justify-center z-10">
                    <div style={{ transform: 'translateY(12px)' }}>
                      <LockSvg />
                    </div>
                  </div>
                )}

                <div className="p-4 pb-2 flex items-center justify-between">
                  <div className="w-full text-center text-lg font-semibold text-gray-900">
                    {displayTitle}
                  </div>
                  {completed && <CheckCircle className="text-green-600" size={18} />}
                </div>

                <div className="px-5 pb-5 space-y-3">
                  <div className="flex items-center justify-center pt-0 pb-6">
                    <span className="arabic-text text-8xl text-purple-700" style={{ fontSize: '5rem' }}>
                      {coverLetter}
                    </span>
                  </div>
                  {completed && (
                    <div className="flex flex-col items-center gap-2 pt-2 pb-6">
                      <span className="px-4 py-1 rounded-full border-2 border-purple-400 bg-white text-purple-700 text-xs inline-flex items-center gap-2 shadow-sm">
                        <RefreshCcw size={14} />
                        {redoLabel}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Show lesson activity
  if (currentView === 'lesson') {
    const targetLessonOrder = Math.max(
      1,
      selectedLessonOrder ?? Math.min(progress.currentLessonOrder, notionLessons.length)
    );
    const goBackTo: ActivityView = selectedLessonOrder ? 'lessons' : 'dashboard';

    const alphabetLesson = getLessonByOrder(targetLessonOrder);
    if (alphabetLesson) {
      return (
        <NewLessonViewer
          lesson={alphabetLesson}
          language={language}
          onBack={() => {
            setSelectedLessonOrder(null);
            setCurrentView(goBackTo);
          }}
          onComplete={(result) => {
            const updatedProgress: StudentProgress = {
              ...progress,
              currentLessonOrder: Math.max(progress.currentLessonOrder, targetLessonOrder + 1),
              completedLessons: Array.from(new Set([...progress.completedLessons, alphabetLesson.id])),
              totalPoints: progress.totalPoints + 100,
              stats: {
                ...progress.stats,
                totalQuizzesCompleted: progress.stats.totalQuizzesCompleted + 1,
                lastActive: new Date().toISOString()
              }
            };
            handleLessonComplete(updatedProgress, [], result);
          }}
        />
      );
    }
    
    // For other lessons, use the placeholder lessons
    const currentLesson = placeholderLessons.find(l => l.order === targetLessonOrder);
    if (!currentLesson) {
      setSelectedLessonOrder(null);
      setCurrentView(goBackTo);
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
        onLogout={onLogout}
        onBugReport={onBugReport}
      />
    );
  }

  // Show trivia
  if (currentView === 'trivia') {
    return <IslamicTrivia language={language} onBack={() => setCurrentView('dashboard')} />;
  }

  // Dashboard view
  // Get the current lesson title consistently from lesson data
  let currentLessonTitle = '';
  const lessonOrderForTitle = Math.max(1, Math.min(progress.currentLessonOrder, notionLessons.length));

  if (lessonOrderForTitle === 1) {
    const alphabetLesson = getLessonByOrder(1);
    currentLessonTitle = alphabetLesson
      ? alphabetLesson.content.titleTranslations?.[language] || alphabetLesson.content.title
      : '';
  } else {
    const currentLesson = placeholderLessons.find(l => l.order === lessonOrderForTitle);
    currentLessonTitle = currentLesson?.title[language] || '';
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <StarIcon className="text-purple-600" size={28} />
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
            <GrowthIcon className="text-blue-600" size={28} />
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
            <FlameIcon size={28} className="text-orange-600" />
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
            <BadgeIcon size={28} className="text-green-600" />
            <div>
              <div className="text-2xl">{progress.badges.length}</div>
              <div className="text-sm text-green-700">
                {language === 'tr' ? 'Rozet' : 'Badges'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedLessonOrder(null);
            setCurrentView('lessons');
          }}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <BookIcon className="text-purple-600" size={48} />
            <h3 className="text-xl">
              {language === 'tr' ? 'Derslere Göz At' : 'Bekijk Lessen'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'tr' ? 'Tamamlanan veya yeni dersleri aç' : 'Open afgeronde of nieuwe lessen'}
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('practice')}>
          <div className="flex flex-col items-center text-center gap-3">
            <ProgressIcon className="text-blue-600" size={48} />
            <h3 className="text-xl">
              {language === 'tr' ? 'Tekrar edilecek sorular' : 'Vragen voor herhaling'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'tr' 
                ? `${reviewQueueCount} soru tekrar kuyruğunda` 
                : `${reviewQueueCount} vragen in de herhaalwachtrij`
              }
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('trivia')}>
          <div className="flex flex-col items-center text-center gap-3">
            <BrainIcon className="text-purple-600" size={48} />
            <h3 className="text-xl">
              {language === 'tr' ? 'Bilgi Yarışması' : 'Trivia'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'tr' ? 'Bilgini test et' : 'Test je kennis'}
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
