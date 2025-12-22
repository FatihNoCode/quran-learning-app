import { useState, useMemo } from 'react';
import { Lesson } from '../data/notionLessons';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { QuizComponent } from './QuizComponent';
import { filterValidQuizzes } from '../utils/quizFilters';

interface NewLessonViewerProps {
  lesson: Lesson;
  language: 'tr' | 'nl';
  onComplete: () => void;
  onBack: () => void;
}

const translations = {
  tr: {
    continue: 'Devam Et',
    previous: 'Geri',
    next: 'İleri',
    complete: 'Dersi Tamamla',
    lessonComplete: 'Ders Tamamlandı!',
    back: 'Geri',
    item: 'Öğe',
    of: '/',
    showParts: 'Parçaları Göster',
    hideParts: 'Parçaları Gizle',
    soundItOut: 'Seslendir',
    isolated: 'Tek Başına',
    inWord: 'Kelimede',
    startQuiz: 'Sınava Başla',
    quiz: 'Sınav',
    questionOf: '/',
    finishQuestions: 'Soruları Bitir',
    goToQuestions: 'Sorulara Git',
    backToLesson: 'Derse Geri Dön',
    letter: 'Harf',
    pronunciation: 'Telaffuz',
    wordStartsWith: 'Harfle Başlayan Kelime'
  },
  nl: {
    continue: 'Doorgaan',
    previous: 'Vorige',
    next: 'Volgende',
    complete: 'Les Voltooien',
    lessonComplete: 'Les Voltooid!',
    back: 'Terug',
    item: 'Item',
    of: 'van',
    showParts: 'Toon Delen',
    hideParts: 'Verberg Delen',
    soundItOut: 'Klink het uit',
    isolated: 'Alleenstaand',
    inWord: 'In Woord',
    startQuiz: 'Start Quiz',
    quiz: 'Quiz',
    questionOf: 'van',
    finishQuestions: 'Vragen Afronden',
    goToQuestions: 'Ga naar Vragen',
    backToLesson: 'Terug naar Les',
    letter: 'Letter',
    pronunciation: 'Uitspraak',
    wordStartsWith: 'Woord begint met de letter'
  }
};

export default function NewLessonViewer({ lesson, language, onComplete, onBack }: NewLessonViewerProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showParts, setShowParts] = useState(false);
  const [phase, setPhase] = useState<'study' | 'quiz' | 'complete'>('study');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<(boolean | null)[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [viewedLetters, setViewedLetters] = useState<Set<number>>(new Set([0])); // Track viewed letters, start with first
  const [showContentWarning, setShowContentWarning] = useState(false);

  const t = translations[language];
  
  // Filter valid quizzes (remove order-sequence and empty quizzes)
  const validQuizzes = useMemo(() => {
    return lesson.quizzes ? filterValidQuizzes(lesson.quizzes) : [];
  }, [lesson.quizzes]);
  
  // Handle alphabet-detail type (new comprehensive alphabet lesson)
  if (lesson.content.type === 'alphabet-detail') {
    // Quiz phase
    if (phase === 'quiz' && validQuizzes.length > 0) {
      const currentQuiz = validQuizzes[currentQuizIndex];
      const totalQuizzes = validQuizzes.length;
      
      // Initialize results array if empty
      if (quizResults.length === 0) {
        setQuizResults(new Array(totalQuizzes).fill(null));
      }
      
      const handleQuizAnswer = (isCorrect: boolean) => {
        // Update the result for current quiz
        const newResults = [...quizResults];
        newResults[currentQuizIndex] = isCorrect;
        setQuizResults(newResults);
        
        // Auto-move to next quiz if not the last one
        if (currentQuizIndex < totalQuizzes - 1) {
          setTimeout(() => {
            setCurrentQuizIndex(currentQuizIndex + 1);
          }, 500);
        }
      };
      
      const handlePrevious = () => {
        if (currentQuizIndex > 0) {
          setCurrentQuizIndex(currentQuizIndex - 1);
        }
      };
      
      const handleNext = () => {
        if (currentQuizIndex < totalQuizzes - 1) {
          setCurrentQuizIndex(currentQuizIndex + 1);
        }
      };
      
      const handleFinish = () => {
        // Check if all questions are answered
        const unanswered = quizResults.filter(r => r === null).length;
        if (unanswered > 0) {
          // Find first unanswered question and navigate to it
          const firstUnansweredIndex = quizResults.findIndex(r => r === null);
          if (firstUnansweredIndex !== -1) {
            setCurrentQuizIndex(firstUnansweredIndex);
          }
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);
          return;
        }
        
        // All questions answered, move to complete phase
        setPhase('complete');
      };
      
      const answeredCount = quizResults.filter(r => r !== null).length;
      
      return (
        <div className="min-h-screen p-3" style={{ background: `linear-gradient(to bottom right, ${lesson.content.color}15, ${lesson.content.color}30)` }}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4" style={{ borderColor: lesson.content.color }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: lesson.content.color }}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-gray-800">{t.quiz}</h2>
                      <p className="text-gray-600 text-sm">
                        {currentQuizIndex + 1} {t.questionOf} {totalQuizzes}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%`,
                        backgroundColor: lesson.content.color
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 mb-3" style={{ borderColor: lesson.content.color }}>
              <QuizComponent
                quiz={currentQuiz}
                language={language}
                onAnswer={handleQuizAnswer}
                isAnswered={quizResults[currentQuizIndex] !== null}
              />
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-3 border-4 border-gray-200">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setPhase('study')}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToLesson}
                </button>
              </div>
              
              <div className="flex gap-2">
                {/* Previous + Next = 50% */}
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuizIndex === 0}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t.previous}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentQuizIndex === totalQuizzes - 1}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {t.next}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Finish Questions = 50% */}
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-white"
                  style={{ background: `linear-gradient(to right, ${lesson.content.color}, ${lesson.content.color}dd)` }}
                >
                  {answeredCount < totalQuizzes ? t.finishQuestions : t.complete}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {showWarning && (
                <div className="mt-2 text-red-500 text-sm text-center">
                  {language === 'tr' ? 'Tüm soruları cevapladınız mı?' : 'Heeft u alle vragen beantwoord?'}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Complete phase
    if (phase === 'complete') {
      const correctAnswers = quizResults.filter(r => r).length;
      const totalQuizzes = validQuizzes.length;
      const percentage = totalQuizzes > 0 ? Math.round((correctAnswers / totalQuizzes) * 100) : 0;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-3 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border-4 border-purple-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-purple-800 mb-3">{t.lessonComplete}</h1>
              <p className="text-gray-600 mb-3">{lesson.content.title}</p>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
                <div className="text-4xl mb-2">{percentage}%</div>
                <p className="text-gray-700">
                  {correctAnswers} {t.of} {totalQuizzes} {language === 'tr' ? 'doğru cevap' : 'goede antwoorden'}
                </p>
              </div>
              
              <p className="text-green-600 mb-6">
                {percentage >= 80 
                  ? (language === 'tr' ? '🎉 Harika iş! Sonraki derse hazırsın!' : '🎉 Geweldig werk! Je bent klaar voor de volgende les!')
                  : (language === 'tr' ? '👍 İyi iş! Pratik yapmaya devam et!' : '👍 Goed gedaan! Blijf oefenen!')
                }
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onComplete()}
                  className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg"
                >
                  {language === 'tr' ? 'Ana Sayfaya Dön' : 'Terug naar Dashboard'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Study phase - Show one letter at a time
    const totalLetters = lesson.content.alphabetLetters?.length || 0;
    const currentLetter = lesson.content.alphabetLetters?.[currentLetterIndex];
    const isFirstLetter = currentLetterIndex === 0;
    const isLastLetter = currentLetterIndex === totalLetters - 1;

    if (!currentLetter) return null;

    const letterTypeColors: {[key: string]: string} = {
      'peltek': '#EC4899', // Pink
      'heavy': '#F59E0B', // Amber
      'throat': '#8B5CF6', // Purple
      'normal': '#10B981' // Green
    };
    const bgColor = currentLetter.type ? letterTypeColors[currentLetter.type] : letterTypeColors['normal'];

    const handleLetterPrevious = () => {
      if (currentLetterIndex > 0) {
        setCurrentLetterIndex(currentLetterIndex - 1);
      }
    };

    const handleLetterNext = () => {
      if (currentLetterIndex < totalLetters - 1) {
        const nextIndex = currentLetterIndex + 1;
        setCurrentLetterIndex(nextIndex);
        // Mark the next letter as viewed
        setViewedLetters(prev => new Set([...prev, nextIndex]));
      }
    };

    const allLettersViewed = viewedLetters.size === totalLetters;

    const handleGoToQuestions = () => {
      if (!allLettersViewed) {
        setShowContentWarning(true);
        setTimeout(() => setShowContentWarning(false), 3000);
        return;
      }
      
      if (validQuizzes.length > 0) {
        setPhase('quiz');
      } else {
        setPhase('complete');
      }
    };

    return (
      <div className="min-h-screen p-3" style={{ background: `linear-gradient(to bottom right, ${lesson.content.color}15, ${lesson.content.color}30)` }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-3 border-4" style={{ borderColor: lesson.content.color }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: lesson.content.color }}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-800 text-lg">{lesson.content.title}</h2>
                    <p className="text-gray-600 text-sm">
                      {currentLetterIndex + 1} {t.of} {totalLetters}
                    </p>
                  </div>
                </div>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((currentLetterIndex + 1) / totalLetters) * 100}%`,
                      backgroundColor: lesson.content.color
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compact Letter Card Display */}
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-3 border-4" style={{ borderColor: bgColor }}>
            {/* Letter Type Badge */}
            {currentLetter.type && currentLetter.type !== 'normal' && (
              <div className="mb-3 text-center">
                <span 
                  className="text-xs px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: bgColor }}
                >
                  {currentLetter.type === 'peltek' 
                    ? (language === 'tr' ? 'Peltek' : 'Peltek')
                    : currentLetter.type === 'heavy'
                    ? (language === 'tr' ? 'Kalın' : 'Zwaar')
                    : currentLetter.type === 'throat'
                    ? (language === 'tr' ? 'Boğaz' : 'Keel')
                    : ''}
                </span>
              </div>
            )}
            
            {/* Letter and Pronunciation - Side by Side */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* Letter Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2" style={{ borderColor: bgColor + '40' }}>
                <p className="text-gray-600 text-xs mb-2">{t.letter}:</p>
                <div 
                  className="flex items-center justify-center arabic-text"
                  style={{ 
                    fontSize: '5rem', 
                    color: bgColor,
                    lineHeight: '1',
                    minHeight: '120px'
                  }}
                >
                  {currentLetter.arabic}
                </div>
                <p className="text-gray-800 text-center mt-2">{currentLetter.name}</p>
              </div>

              {/* Pronunciation Section */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 relative">
                {/* Sound Button - Top Right */}
                <button
                  onClick={() => console.log('Play sound for letter:', currentLetter.arabic)}
                  className="absolute top-3 right-3 p-2 rounded-lg transition-all transform hover:scale-110 flex items-center gap-1 text-white shadow-lg text-xs"
                  style={{ backgroundColor: bgColor }}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                
                <p className="text-gray-600 text-xs mb-2">{t.pronunciation}:</p>
                <div className="flex items-center justify-center" style={{ minHeight: '120px' }}>
                  <p className="text-gray-800 text-3xl">
                    {language === 'tr' ? currentLetter.pronunciation.tr : currentLetter.pronunciation.nl}
                  </p>
                </div>
              </div>
            </div>

            {/* Example Word - Full Width */}
            {currentLetter.example && currentLetter.example[language] !== '-' && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border-2 border-green-200 mb-3">
                <p className="text-gray-600 text-xs mb-1">{t.wordStartsWith}:</p>
                <p className="text-gray-800 text-xl">
                  {language === 'tr' ? currentLetter.example.tr : currentLetter.example.nl}
                </p>
              </div>
            )}

            {/* Special Note - Full Width */}
            {currentLetter.specialNote && (
              <div 
                className="rounded-xl p-3 border-2"
                style={{ 
                  backgroundColor: bgColor + '10',
                  borderColor: bgColor + '40'
                }}
              >
                <p className="text-gray-700 text-sm">
                  💡 {language === 'tr' ? currentLetter.specialNote.tr : currentLetter.specialNote.nl}
                </p>
              </div>
            )}
          </div>

          {/* Unified Navigation Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-3 border-4 border-gray-200">
            <div className="flex gap-2">
              {/* Previous + Next = 50% */}
              <div className="flex gap-2 flex-1">
                <button
                  onClick={handleLetterPrevious}
                  disabled={isFirstLetter}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.previous}
                </button>

                <button
                  onClick={handleLetterNext}
                  disabled={isLastLetter}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {t.next}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Go to Questions = 50% */}
              <button
                onClick={handleGoToQuestions}
                className="flex-1 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-white"
                style={{ background: `linear-gradient(to right, ${lesson.content.color}, ${lesson.content.color}dd)` }}
              >
                {validQuizzes.length > 0 ? t.goToQuestions : t.complete}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {showContentWarning && (
              <div className="mt-2 text-red-500 text-sm text-center">
                {language === 'tr' ? 'Tüm harfleri gördüğünüzden emin misiniz?' : 'Heeft u alle letters gezien?'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Handle letter-grid type (no items to iterate)
  if (lesson.content.type === 'letter-grid') {
    if (completed) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-3 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border-4 border-purple-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-purple-800 mb-3">{t.lessonComplete}</h1>
              <p className="text-gray-600 mb-3">{lesson.content.title}</p>
              <p className="text-green-600 mb-6">
                {language === 'tr' ? '🎉 Harika iş! Sonraki derse geçiyorsun...' : '🎉 Geweldig werk! Naar de volgende les...'}
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onComplete()}
                  className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg"
                >
                  {language === 'tr' ? 'Sonraki Derse Geç' : 'Ga naar Volgende Les'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-3" style={{ background: `linear-gradient(to bottom right, ${lesson.content.color}15, ${lesson.content.color}30)` }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-4 border-4" style={{ borderColor: lesson.content.color }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: lesson.content.color }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-800">{lesson.content.title}</h2>
                  <p className="text-gray-600 text-sm">{lesson.content.instruction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Letter Grid Display */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 mb-4" style={{ borderColor: lesson.content.color }}>
            <div className="space-y-4">
              {lesson.content.letterGroups?.map((group, groupIndex) => (
                <div key={groupIndex} className="flex justify-center gap-6 flex-wrap">
                  {group.map((letter, letterIndex) => (
                    <div
                      key={letterIndex}
                      className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300 flex items-center justify-center"
                      style={{ minWidth: '80px', minHeight: '80px' }}
                    >
                      <div className="arabic-text" style={{ fontSize: '3rem', color: '#1f2937' }}>
                        {letter}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-gray-200">
            <button
              onClick={() => setCompleted(true)}
              className="w-full py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-white"
              style={{ background: `linear-gradient(to right, ${lesson.content.color}, ${lesson.content.color}dd)` }}
            >
              {t.complete}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // For item-based lessons (letter-practice, letter-positions, etc.)
  const currentItem = lesson.content.items[currentItemIndex];
  const totalItems = lesson.content.items.length;
  const isLastItem = currentItemIndex === totalItems - 1;
  const isFirstItem = currentItemIndex === 0;

  const handleNext = () => {
    if (isLastItem) {
      setCompleted(true);
    } else {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstItem) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-purple-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-purple-800 mb-4">{t.lessonComplete}</h1>
            <p className="text-gray-600 mb-4 text-xl">{lesson.content.title}</p>
            <p className="text-green-600 mb-8">
              {language === 'tr' ? '🎉 Harika iş! Sonraki derse geçiyorsun...' : '🎉 Geweldig werk! Naar de volgende les...'}
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleComplete}
                className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg text-xl"
              >
                {language === 'tr' ? 'Sonraki Derse Geç' : 'Ga naar Volgende Les'}
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3" style={{ background: `linear-gradient(to bottom right, ${lesson.content.color}15, ${lesson.content.color}30)` }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-4 border-4" style={{ borderColor: lesson.content.color }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: lesson.content.color }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-gray-800">{lesson.content.title}</h2>
                <p className="text-gray-600 text-sm">{lesson.content.instruction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Simple Arabic Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-4 mb-3" style={{ borderColor: lesson.content.color }}>
          <div className="text-center">
            <div 
              className="arabic-text p-6 rounded-xl flex items-center justify-center"
              style={{ 
                fontSize: '6rem',
                backgroundColor: `${lesson.content.color}10`,
                color: '#1f2937',
                minHeight: '150px'
              }}
            >
              {currentItem.arabic}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">
              {currentItemIndex + 1} {t.of} {totalItems}
            </span>
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentItemIndex + 1) / totalItems) * 100}%`,
                  backgroundColor: lesson.content.color
                }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={isFirstItem}
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.previous}
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-white"
              style={{ background: `linear-gradient(to right, ${lesson.content.color}, ${lesson.content.color}dd)` }}
            >
              {isLastItem ? t.complete : t.next}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}