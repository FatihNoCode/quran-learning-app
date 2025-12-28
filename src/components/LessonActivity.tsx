import { useState } from 'react';
import { placeholderLessons, PlaceholderLesson } from '../data/placeholderLessons';
import { StudentProgress, Badge, checkAndAwardBadges, updateSkillMastery, updateReviewQueue, calculatePoints } from '../utils/masterySystem';
import { QuizComponent } from './QuizComponent';
import { filterValidQuizzes } from '../utils/quizFilters';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Brain, Trophy, ArrowRight } from 'lucide-react';
import BookIcon from './icons/BookIcon';

interface LessonActivityProps {
  lesson: PlaceholderLesson;
  language: 'tr' | 'nl';
  progress: StudentProgress;
  onComplete: (updatedProgress: StudentProgress, earnedBadges: Badge[]) => void;
}

type Phase = 'explanation' | 'quiz' | 'summary';

export function LessonActivity({ lesson, language, progress, onComplete }: LessonActivityProps) {
  const [phase, setPhase] = useState<Phase>('explanation');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [correctAnswerStreak, setCorrectAnswerStreak] = useState(0);
  const [updatedProgress, setUpdatedProgress] = useState<StudentProgress>(progress);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

  // Filter valid quizzes
  const validQuizzes = filterValidQuizzes(lesson.quizzes);
  const currentQuiz = validQuizzes[currentQuizIndex];
  const totalQuizzes = validQuizzes.length;
  const quizzesCompleted = quizResults.length;
  const progressPercentage = (quizzesCompleted / totalQuizzes) * 100;

  const handleQuizAnswer = (isCorrect: boolean) => {
    // Update quiz results
    const newResults = [...quizResults, isCorrect];
    setQuizResults(newResults);

    // Update streak
    const newStreak = isCorrect ? correctAnswerStreak + 1 : 0;
    setCorrectAnswerStreak(newStreak);

    // Update skill mastery
    const skillId = currentQuiz.skill;
    const currentMastery = updatedProgress.skillMastery[skillId];
    const previousMasteryLevel = currentMastery?.level || 0;
    
    const newMastery = updateSkillMastery(currentMastery, skillId, isCorrect);
    
    // Update review queue
    const newReviewQueue = updateReviewQueue(
      updatedProgress.reviewQueue,
      currentQuiz.id,
      skillId,
      isCorrect
    );

    // Calculate points
    const pointsEarned = calculatePoints(isCorrect, newMastery, previousMasteryLevel);

    // Update progress
    const newProgress: StudentProgress = {
      ...updatedProgress,
      skillMastery: {
        ...updatedProgress.skillMastery,
        [skillId]: newMastery
      },
      reviewQueue: newReviewQueue,
      totalPoints: updatedProgress.totalPoints + pointsEarned,
      stats: {
        ...updatedProgress.stats,
        totalQuizzesCompleted: updatedProgress.stats.totalQuizzesCompleted + 1,
        averageAccuracy: 
          (updatedProgress.stats.averageAccuracy * updatedProgress.stats.totalQuizzesCompleted + (isCorrect ? 100 : 0)) /
          (updatedProgress.stats.totalQuizzesCompleted + 1)
      }
    };

    setUpdatedProgress(newProgress);

    // Check for new badges
    const newBadges = checkAndAwardBadges(newProgress, newStreak);
    if (newBadges.length > 0) {
      setEarnedBadges([...earnedBadges, ...newBadges]);
      newProgress.badges = [...newProgress.badges, ...newBadges];
    }

    // Move to next quiz or summary
    if (currentQuizIndex < totalQuizzes - 1) {
      setTimeout(() => {
        setCurrentQuizIndex(currentQuizIndex + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        setPhase('summary');
      }, 2000);
    }
  };

  const handleStartQuiz = () => {
    setPhase('quiz');
  };

  const handleComplete = () => {
    // Mark lesson as completed (without regressing progress)
    const finalProgress: StudentProgress = {
      ...updatedProgress,
      completedLessons: Array.from(new Set([...updatedProgress.completedLessons, lesson.id])),
      currentLessonOrder: Math.max(updatedProgress.currentLessonOrder || 1, lesson.order + 1)
    };

    onComplete(finalProgress, earnedBadges);
  };

  // Explanation Phase
  if (phase === 'explanation') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200">
          <h1 className="text-3xl text-purple-800 mb-3 text-center">
            {lesson.title[language]}
          </h1>
          <p className="text-gray-700 text-center">
            {language === 'tr'
              ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
              : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </p>
        </Card>

        {/* Removed legacy gradient card */}

        
      </div>
    );
  }

  // Quiz Phase
  if (phase === 'quiz') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg">
              {language === 'tr' 
                ? `Soru ${quizzesCompleted + 1} / ${totalQuizzes}` 
                : `Vraag ${quizzesCompleted + 1} / ${totalQuizzes}`
              }
            </span>
            <span className="text-lg">
              {language === 'tr' ? 'Puan' : 'Punten'}: {updatedProgress.totalPoints}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </Card>

        {/* Quiz */}
        <Card className="p-8">
          <QuizComponent
            key={currentQuiz.id}
            quiz={currentQuiz}
            language={language}
            onAnswer={handleQuizAnswer}
          />
        </Card>

        {/* Streak Indicator */}
        {correctAnswerStreak >= 3 && (
          <div className="text-center p-4 bg-orange-100 rounded-xl border-2 border-orange-400 animate-pulse">
            <span className="text-2xl">🔥</span>
            <span className="ml-2 text-orange-800">
              {language === 'tr' 
                ? `${correctAnswerStreak} doğru cevap serisi!` 
                : `${correctAnswerStreak} antwoorden correct op rij!`
              }
            </span>
          </div>
        )}
      </div>
    );
  }

  // Summary Phase
  if (phase === 'summary') {
    const correctAnswers = quizResults.filter(r => r).length;
    const accuracy = Math.round((correctAnswers / totalQuizzes) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center mb-6">
            <div className="bg-green-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="text-white" size={40} />
            </div>
            <h2 className="text-3xl mb-2">
              {language === 'tr' ? 'Tebrikler!' : 'Gefeliciteerd!'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr' ? 'Dersi tamamladın!' : 'Je hebt de les voltooid!'}
            </p>
          </div>

          {/* Summary Content */}
          <div className="prose max-w-none mb-8 p-6 bg-white rounded-xl">
            <div className="whitespace-pre-line">
              {lesson.summary[language]}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl text-center">
              <div className="text-3xl mb-2">{accuracy}%</div>
              <div className="text-sm text-gray-600">
                {language === 'tr' ? 'Doğruluk' : 'Nauwkeurigheid'}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl text-center">
              <div className="text-3xl mb-2">{correctAnswers}/{totalQuizzes}</div>
              <div className="text-sm text-gray-600">
                {language === 'tr' ? 'Doğru cevaplar' : 'Juiste antwoorden'}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl text-center">
              <div className="text-3xl mb-2">
                +{updatedProgress.totalPoints - progress.totalPoints}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'tr' ? 'Kazanılan puan' : 'Verdiende punten'}
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="p-6 bg-yellow-50 rounded-xl mb-6 border-2 border-yellow-400">
              <h3 className="text-xl mb-4 text-center">
                {language === 'tr' ? '🎉 Yeni rozet kazandın!' : '🎉 Nieuwe badge verdiend!'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="p-4 bg-white rounded-xl flex items-center gap-3">
                    <span className="text-4xl">{badge.icon}</span>
                    <div>
                      <div className="font-bold">{badge.name[language]}</div>
                      <div className="text-sm text-gray-600">{badge.description[language]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-xl px-8 py-6"
            >
              {language === 'tr' ? 'Devam et' : 'Ga verder'}
              <ArrowRight className="ml-2" size={24} />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
