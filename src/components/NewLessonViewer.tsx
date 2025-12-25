import { useState, useMemo, useRef } from 'react';
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
    continue: 'Devam et',
    previous: 'Geri',
    next: 'İleri',
    complete: 'Dersi tamamla',
    lessonComplete: 'Ders tamamlandı!',
    back: 'Geri',
    item: 'Öğe',
    of: '/',
    showParts: 'Parçaları göster',
    hideParts: 'Parçaları gizle',
    soundItOut: 'Seslendir',
    isolated: 'Tek başına',
    inWord: 'Kelimede',
    startQuiz: 'Sınava başla',
    quiz: 'Sınav',
    questionOf: '/',
    finishQuestions: 'Soruları bitir',
    goToQuestions: 'Sorulara git',
    backToLesson: 'Derse geri dön',
    letter: 'Harf',
    pronunciation: 'Telaffuz',
    wordStartsWith: 'Harfle başlayan kelime',
    letterName: 'Harf ismi',
    letterPronunciationLabel: 'Harf telaffuzu',
    wordMeaning: 'Anlamı',
    typeInfo: 'Harf tipi'
  },
  nl: {
    continue: 'Doorgaan',
    previous: 'Vorige',
    next: 'Volgende',
    complete: 'Les voltooien',
    lessonComplete: 'Les voltooid!',
    back: 'Terug',
    item: 'Item',
    of: 'van',
    showParts: 'Onderdelen tonen',
    hideParts: 'Onderdelen verbergen',
    soundItOut: 'Uitspreken',
    isolated: 'Losstaand',
    inWord: 'In woord',
    startQuiz: 'Quiz starten',
    quiz: 'Quiz',
    questionOf: 'van',
    finishQuestions: 'Vragen afronden',
    goToQuestions: 'Ga naar vragen',
    backToLesson: 'Terug naar les',
    letter: 'Letter',
    pronunciation: 'Uitspraak',
    wordStartsWith: 'Woord begint met de letter',
    letterName: 'Letternaam',
    letterPronunciationLabel: 'Letteruitspraak',
    wordMeaning: 'Betekenis',
    typeInfo: 'Lettertype'
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = translations[language];
  const localizedTitle = lesson.content.titleTranslations
    ? lesson.content.titleTranslations[language] ?? lesson.content.title
    : lesson.content.title;
  
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
                    className="flex-1 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t.previous}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentQuizIndex === totalQuizzes - 1}
                    className="flex-1 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <p className="text-gray-600 mb-3">{localizedTitle}</p>
              
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
                  {language === 'tr' ? 'Ana sayfaya dön' : 'Terug naar dashboard'}
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
      'interdental': '#3B82F6', // Blue
      'heavy': '#F97316', // Orange
      'heavy-interdental': '#8B5CF6', // Purple
      'normal': '#10B981' // Green
    };
    const bgColor = currentLetter.type ? letterTypeColors[currentLetter.type] : letterTypeColors['normal'];
    const letterTypeLabels: {[key: string]: { tr: string; nl: string }} = {
      interdental: { tr: 'Peltek', nl: 'Interdentaal' },
      heavy: { tr: 'Kalın', nl: 'Zwaar' },
      'heavy-interdental': { tr: 'Kalın + peltek', nl: 'Zwaar + interdentaal' },
    };
    const typeDescriptions: {[key: string]: { tr: string; nl: string }} = {
      normal: {
        tr: 'Nötr harf: dili rahat bırakın, standart ağız açıklığıyla okuyun.',
        nl: 'Neutrale letter: tong ontspannen, normale mondstand.'
      },
      heavy: {
        tr: 'Kalın harf: dili biraz geriye çekip kalınlaştırarak, güçlü bir tonla çıkarın.',
        nl: 'Zware letter: tong iets naar achteren, brede en volle klank.'
      },
      interdental: {
        tr: 'Peltek harf: dil ucunu ön dişler arasında hafifçe çıkararak yumuşak üfleyin.',
        nl: 'Interdentale letter: tongpunt licht tussen de tanden, zacht uitblazen.'
      },
      'heavy-interdental': {
        tr: 'Kalın + peltek: dil ucunu dişler arasında tutup sesi kalınlaştırın.',
        nl: 'Zwaar + interdentaal: tongpunt tussen de tanden, met een diepe, zware klank.'
      }
    };
    const currentTypeLabel =
      currentLetter.type && currentLetter.type !== 'normal'
        ? (language === 'tr' ? letterTypeLabels[currentLetter.type]?.tr : letterTypeLabels[currentLetter.type]?.nl)
        : null;
    const typeText = currentLetter.type
      ? (currentLetter.note
          ? (language === 'tr' ? currentLetter.note.tr : currentLetter.note.nl)
          : (language === 'tr' ? typeDescriptions[currentLetter.type]?.tr : typeDescriptions[currentLetter.type]?.nl))
      : null;

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
    const playLetterAudio = () => {
      if (!currentLetter) return;

      const normalizeName = (value: string) =>
        value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9 ()'-]+/g, '')
          .replace(/\s+/g, ' ')
          .trim();

      const letterAudioByArabic: Record<string, string> = {
        'õ': 'alif',
        'ù': 'ba',
        '¦': 'ta (neutral)',
        '®': 'tha',
        'ª': 'jim',
        'ð': 'ha early',
        '©': 'kha',
        'î': 'dal',
        'ø': 'dhal',
        'ñ': 'ra',
        'ý': 'ze',
        'ü': 'sin',
        'ï': 'shin',
        'æ': 'sad',
        'ô': 'dad',
        'ú': 'ta (heavy)',
        '÷': 'za',
        'û': 'ayn',
        '§': 'ghayn',
        'ë?': 'fa',
        "ë'": 'qaf',
        'ëŸ': 'kaf',
        'ë"': 'lam',
        'ë.': 'mim',
        'ëÅ': 'nun',
        'ëÎ': 'ha later',
        'ë^': 'waw',
        'ëS': 'ya'
      };

      const letterAudioByName: Record<string, string> = {
        'alif': 'alif',
        'ba': 'ba',
        'ta': 'ta (neutral)',
        'tha': 'tha',
        'jim': 'jim',
        'ha': 'ha later',
        'ha neutral': 'ha later',
        'ha later': 'ha later',
        'ha earlier': 'ha early',
        'ha early': 'ha early',
        'ha neutral earlier in alphabet': 'ha early',
        'ha neutral later in alphabet': 'ha later',
        'kha': 'kha',
        'dal': 'dal',
        'dhal': 'dhal',
        'ra': 'ra',
        'ze': 'ze',
        'zay': 'ze',
        'sin': 'sin',
        'seen': 'sin',
        'shin': 'shin',
        'sad': 'sad',
        'dad': 'dad',
        'ta heavy': 'ta (heavy)',
        'ta neutral': 'ta (neutral)',
        'za': 'za',
        'ayn': 'ayn',
        'ghayn': 'ghayn',
        'fa': 'fa',
        'qaf': 'qaf',
        'kaf': 'kaf',
        'lam': 'lam',
        'mim': 'mim',
        'nun': 'nun',
        'waw': 'waw',
        'waaw': 'waw',
        'ya': 'ya',
        'yaa': 'ya'
      };

      const letterAudioByIndex: string[] = [
        'alif',
        'ba',
        'ta (neutral)',
        'tha',
        'jim',
        'ha early',
        'kha',
        'dal',
        'dhal',
        'ra',
        'ze',
        'sin',
        'shin',
        'sad',
        'dad',
        'ta (heavy)',
        'za',
        'ayn',
        'ghayn',
        'fa',
        'qaf',
        'kaf',
        'lam',
        'mim',
        'nun',
        'ha later',
        'waw',
        'ya'
      ];

      const nameKey = normalizeName(currentLetter.name || '');
      const fileName =
        letterAudioByArabic[currentLetter.arabic] ||
        letterAudioByName[nameKey] ||
        letterAudioByIndex[currentLetterIndex];

      if (!fileName) {
        console.error('No audio mapping for letter', currentLetter);
        return;
      }

      const candidatePaths = [`/audio/${encodeURIComponent(fileName)}.mp3`, `/Audio/${encodeURIComponent(fileName)}.mp3`];

      const tryPlay = (index: number) => {
        if (index >= candidatePaths.length) {
          console.error('Failed to play letter audio for', currentLetter.name, 'tried', candidatePaths);
          return;
        }

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        const audio = new Audio(candidatePaths[index]);
        audioRef.current = audio;
        // Try next path only once on error; avoid duplicate retries from play().catch
        audio.onerror = () => tryPlay(index + 1);
        audio.play().catch(() => {});
      };

      tryPlay(0);
    };

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
                    <h2 className="text-gray-800 text-lg">{localizedTitle}</h2>
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
            <div className="grid md:grid-cols-3 gap-4 mb-3">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 relative" style={{ borderColor: bgColor + '40' }}>
                <button
                  onClick={playLetterAudio}
                  className="absolute top-2 right-2 p-2 rounded-full transition-all transform hover:scale-110 flex items-center justify-center text-white shadow-lg text-xs"
                  style={{ backgroundColor: bgColor }}
                  aria-label="Play letter sound"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
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
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 relative">
                <p className="text-gray-600 text-xs mb-1">{t.letterName}</p>
                <p className="text-xl font-semibold text-gray-900">{currentLetter.name}</p>
                <p className="text-gray-600 text-xs mt-3 mb-1">{t.letterPronunciationLabel}</p>
                <p className="text-gray-800 text-lg">
                  {language === 'tr' ? currentLetter.pronunciation.tr : currentLetter.pronunciation.nl}
                </p>
              </div>

              {currentLetter.word && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                  <p className="text-gray-600 text-xs mb-1">{t.wordStartsWith}</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {language === 'tr' ? currentLetter.word.pronunciation.tr : currentLetter.word.pronunciation.nl}
                  </p>
                  <p className="text-gray-600 text-xs mt-3 mb-1">{t.wordMeaning}</p>
                  <p className="text-gray-800 text-sm">
                    {language === 'tr' ? currentLetter.word.translation.tr : currentLetter.word.translation.nl}
                  </p>
                </div>
              )}
            </div>

            {currentLetter.type && (
              <div 
                className="rounded-xl p-3 border-2 flex items-start gap-2"
                style={{ 
                  backgroundColor: bgColor + '10',
                  borderColor: bgColor + '40'
                }}
              >
                <div className="w-16 h-12 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow px-2" style={{ backgroundColor: bgColor }}>
                  {t.typeInfo}
                </div>
                <div className="flex-1">
                  {currentTypeLabel && (
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {currentTypeLabel}
                    </p>
                  )}
                  {typeText && (
                    <p className="text-gray-700 text-sm">
                      {typeText}
                    </p>
                  )}
                </div>
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
                  className="flex-1 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.previous}
                </button>

                <button
                  onClick={handleLetterNext}
                  disabled={isLastLetter}
                  className="flex-1 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <p className="text-gray-600 mb-3">{localizedTitle}</p>
              <p className="text-green-600 mb-6">
                {language === 'tr' ? '🎉 Harika iş! Sonraki derse geçiyorsun...' : '🎉 Geweldig werk! Naar de volgende les...'}
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onComplete()}
                  className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg"
                >
                  {language === 'tr' ? 'Sonraki derse geç' : 'Ga naar volgende les'}
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
                  <h2 className="text-gray-800">{localizedTitle}</h2>
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
            <p className="text-gray-600 mb-4 text-xl">{localizedTitle}</p>
            <p className="text-green-600 mb-8">
              {language === 'tr' ? '🎉 Harika iş! Sonraki derse geçiyorsun...' : '🎉 Geweldig werk! Naar de volgende les...'}
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleComplete}
                className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg text-xl"
              >
                {language === 'tr' ? 'Sonraki derse geç' : 'Ga naar volgende les'}
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
                <h2 className="text-gray-800">{localizedTitle}</h2>
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
