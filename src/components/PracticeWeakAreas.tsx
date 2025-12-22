import { useState } from 'react';
import { placeholderLessons } from '../data/placeholderLessons';
import { QuizComponent } from './QuizComponent';
import { filterValidQuizzes } from '../utils/quizFilters';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Brain, ArrowLeft, Trophy } from 'lucide-react';
import {
  StudentProgress,
  getWeakSkills,
  getDueReviewItems,
  updateSkillMastery,
  updateReviewQueue,
  calculatePoints,
  Badge,
  checkAndAwardBadges
} from '../utils/masterySystem';

interface PracticeWeakAreasProps {
  progress: StudentProgress;
  language: 'tr' | 'nl';
  onComplete: (updatedProgress: StudentProgress, earnedBadges: Badge[]) => void;
  onBack: () => void;
}

export function PracticeWeakAreas({ progress, language, onComplete, onBack }: PracticeWeakAreasProps) {
  // Get weak skills and due review items with defensive checks
  const weakSkillIds = getWeakSkills(progress.skillMastery || {}, progress.reviewQueue || []);
  const dueReviewItems = getDueReviewItems(progress.reviewQueue || []);
  
  // Find quizzes for weak skills or due review, and filter valid ones
  const practiceQuizzes = placeholderLessons
    .flatMap(lesson => filterValidQuizzes(lesson.quizzes))
    .filter(quiz => {
      // Include if skill is weak
      if (weakSkillIds.includes(quiz.skill)) return true;
      
      // Include if quiz is due for review
      if (dueReviewItems.some(item => item.questionId === quiz.id)) return true;
      
      return false;
    })
    .slice(0, 10); // Limit to 10 questions

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [correctAnswerStreak, setCorrectAnswerStreak] = useState(0);
  const [updatedProgress, setUpdatedProgress] = useState<StudentProgress>(progress);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  if (practiceQuizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl mb-4">
            {language === 'tr' ? 'Harika İş!' : 'Geweldig Werk!'}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {language === 'tr' 
              ? 'Şu an pratik yapman gereken zayıf alan yok! Tüm becerilerinde çok iyisin.' 
              : 'Je hebt momenteel geen zwakke punten om te oefenen! Je bent heel goed in alle vaardigheden.'
            }
          </p>
          <Button onClick={onBack} className="bg-purple-500 hover:bg-purple-600">
            <ArrowLeft className="mr-2" size={20} />
            {language === 'tr' ? 'Geri Dön' : 'Ga Terug'}
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuiz = practiceQuizzes[currentQuizIndex];
  const totalQuizzes = practiceQuizzes.length;
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

    // Move to next quiz or complete
    if (currentQuizIndex < totalQuizzes - 1) {
      setTimeout(() => {
        setCurrentQuizIndex(currentQuizIndex + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        setIsComplete(true);
      }, 2000);
    }
  };

  const handleComplete = () => {
    onComplete(updatedProgress, earnedBadges);
  };

  // Completion screen
  if (isComplete) {
    const correctAnswers = quizResults.filter(r => r).length;
    const accuracy = Math.round((correctAnswers / totalQuizzes) * 100);

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center mb-6">
            <div className="bg-green-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="text-white" size={40} />
            </div>
            <h2 className="text-3xl mb-2">
              {language === 'tr' ? 'Harika Pratik!' : 'Geweldige Oefening!'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr' 
                ? 'Zayıf alanlarını geliştirdin!' 
                : 'Je hebt je zwakke punten verbeterd!'
              }
            </p>
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
                {language === 'tr' ? 'Doğru Cevaplar' : 'Juiste Antwoorden'}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl text-center">
              <div className="text-3xl mb-2">
                +{updatedProgress.totalPoints - progress.totalPoints}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'tr' ? 'Kazanılan Puan' : 'Verdiende Punten'}
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="p-6 bg-yellow-50 rounded-xl mb-6 border-2 border-yellow-400">
              <h3 className="text-xl mb-4 text-center">
                {language === 'tr' ? '🎉 Yeni Rozet Kazandın!' : '🎉 Nieuwe Badge Verdiend!'}
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
              {language === 'tr' ? 'Tamamla' : 'Voltooien'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Practice screen
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="text-purple-500" size={28} />
              <h2 className="text-2xl">
                {language === 'tr' ? 'Zayıf Alanları Geliştir' : 'Oefen Zwakke Punten'}
              </h2>
            </div>
          </div>
          <span className="text-lg">
            {language === 'tr' ? 'Puan' : 'Punten'}: {updatedProgress.totalPoints}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">
            {language === 'tr' 
              ? `Soru ${quizzesCompleted + 1} / ${totalQuizzes}` 
              : `Vraag ${quizzesCompleted + 1} / ${totalQuizzes}`
            }
          </span>
          <span className="text-sm">{Math.round(progressPercentage)}%</span>
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