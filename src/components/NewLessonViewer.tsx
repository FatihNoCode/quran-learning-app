import { useState, useMemo, useRef, useEffect } from 'react';
import { Lesson, Quiz } from '../data/notionLessons';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Volume2 } from 'lucide-react';
import BookIcon from './icons/BookIcon';
import { QuizComponent } from './QuizComponent';
import { filterValidQuizzes } from '../utils/quizFilters';
import { Button } from './ui/button';

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
    wordMeaning: 'AnlamÄ±',
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

const lesson4Combos = [
  { separated: ['د', 'ر', 'ك'], connected: 'درك' },
  { separated: ['د', 'ر', 'ج'], connected: 'درج' },
  { separated: ['ا', 'م', 'ل'], connected: 'امل' },
  { separated: ['ف', 'ت', 'ح'], connected: 'فتح' },
  { separated: ['و', 'ج', 'د'], connected: 'وجد' },
  { separated: ['ك', 'ت', 'ب'], connected: 'كتب' },
  { separated: ['ذ', 'ه', 'ب'], connected: 'ذهب' },
  { separated: ['ن', 'ص', 'ر'], connected: 'نصر' },
  { separated: ['ت', 'ر', 'ك'], connected: 'ترك' },
  { separated: ['خ', 'ل', 'ق'], connected: 'خلق' },
  { separated: ['ح', 'س', 'د'], connected: 'حسد' },
  { separated: ['ص', 'ب', 'ر'], connected: 'صبر' },
  { separated: ['ا', 'خ', 'ذ'], connected: 'اخذ' },
  { separated: ['ر', 'ز', 'ق'], connected: 'رزق' },
  { separated: ['ع', 'د', 'ل'], connected: 'عدل' },
  { separated: ['ن', 'ز', 'ل'], connected: 'نزل' },
  { separated: ['ك', 'ل', 'م'], connected: 'كلم' },
  { separated: ['س', 'م', 'ع'], connected: 'سمع' },
  { separated: ['ف', 'ه', 'م'], connected: 'فهم' },
  { separated: ['ق', 'ر', 'ب'], connected: 'قرب' },
  { separated: ['ص', 'د', 'ق'], connected: 'صدق' },
  { separated: ['ش', 'ك', 'ر'], connected: 'شكر' },
  { separated: ['غ', 'ف', 'ر'], connected: 'غفر' },
  { separated: ['ه', 'د', 'ي'], connected: 'هدي' },
  { separated: ['ل', 'ع', 'ب'], connected: 'لعب' },
  { separated: ['ب', 'د', 'ل'], connected: 'بدل' },
  { separated: ['ت', 'و', 'ب'], connected: 'توب' },
  { separated: ['ي', 'س', 'ر'], connected: 'يسر' }
];

export default function NewLessonViewer({ lesson, language, onComplete, onBack }: NewLessonViewerProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showParts, setShowParts] = useState(false);
  const [phase, setPhase] = useState<'study' | 'quiz' | 'complete'>('study');
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentBundleIndex, setCurrentBundleIndex] = useState(0);
  type AnswerRecord = { result: boolean | null; choice: number | null };
  const [bundleResults, setBundleResults] = useState<Record<string, AnswerRecord[]>>({});
  const [showWarning, setShowWarning] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [viewedLetters, setViewedLetters] = useState<Set<number>>(new Set([0])); // Track viewed letters, start with first
  const [showContentWarning, setShowContentWarning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLesson4 = lesson.order === 4;

  const letterTypeColors: { [key: string]: string } = {
    interdental: '#3B82F6', // Blue
    heavy: '#F97316', // Orange
    'heavy-interdental': '#8B5CF6', // Purple
    normal: '#10B981' // Green
  };

  const letterTypeLabels: { [key: string]: { tr: string; nl: string } } = {
    interdental: { tr: 'Peltek', nl: 'Interdentaal' },
    heavy: { tr: 'Kalın', nl: 'Zwaar' },
    'heavy-interdental': { tr: 'Kalın + peltek', nl: 'Zwaar + interdentaal' }
  };

  const typeDescriptions: { [key: string]: { tr: string; nl: string } } = {
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

  const getLetterTypeForChar = (char?: string) => {
    if (!char) return 'normal';
    const heavySet = new Set(['خ', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق']);
    const interdentalSet = new Set(['ث', 'ذ', 'ظ']);
    if (heavySet.has(char)) return 'heavy';
    if (interdentalSet.has(char)) return 'interdental';
    return 'normal';
  };

  const playAudioClip = (clipId?: string) => {
    if (!clipId) return;

    const trimmed = clipId.trim();
    const hasExtension = trimmed.includes('.') || trimmed.includes('/');
    const candidates = hasExtension
      ? [trimmed]
      : [`/audio/${encodeURIComponent(trimmed)}.mp3`, `/Audio/${encodeURIComponent(trimmed)}.mp3`];

    const tryPlay = (index: number) => {
      if (index >= candidates.length) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(candidates[index]);
      audioRef.current = audio;
      audio.onerror = () => tryPlay(index + 1);
      audio.play().catch(() => tryPlay(index + 1));
    };

    tryPlay(0);
  };

  const t = translations[language];
  const localizedTitle = lesson.content.titleTranslations
    ? lesson.content.titleTranslations[language] ?? lesson.content.title
    : lesson.content.title;
  const baseArabicOrder = [
    'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'
  ];
  const letterAudioByOrder = [
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
  const lesson3Forms = [
    { end: 'ـا', middle: 'ـا', beginning: 'ا', isolated: 'ا' },
    { end: 'ـب', middle: 'ـبـ', beginning: 'بـ', isolated: 'ب' },
    { end: 'ـت', middle: 'ـتـ', beginning: 'تـ', isolated: 'ت' },
    { end: 'ـث', middle: 'ـثـ', beginning: 'ثـ', isolated: 'ث' },
    { end: 'ـج', middle: 'ـجـ', beginning: 'جـ', isolated: 'ج' },
    { end: 'ـح', middle: 'ـحـ', beginning: 'حـ', isolated: 'ح' },
    { end: 'ـخ', middle: 'ـخـ', beginning: 'خـ', isolated: 'خ' },
    { end: 'ـد', middle: 'ـد', beginning: 'د', isolated: 'د' },
    { end: 'ـذ', middle: 'ـذ', beginning: 'ذ', isolated: 'ذ' },
    { end: 'ـر', middle: 'ـر', beginning: 'ر', isolated: 'ر' },
    { end: 'ـز', middle: 'ـز', beginning: 'ز', isolated: 'ز' },
    { end: 'ـس', middle: 'ـسـ', beginning: 'سـ', isolated: 'س' },
    { end: 'ـش', middle: 'ـشـ', beginning: 'شـ', isolated: 'ش' },
    { end: 'ـص', middle: 'ـصـ', beginning: 'صـ', isolated: 'ص' },
    { end: 'ـض', middle: 'ـضـ', beginning: 'ضـ', isolated: 'ض' },
    { end: 'ـط', middle: 'ـطـ', beginning: 'طـ', isolated: 'ط' },
    { end: 'ـظ', middle: 'ـظـ', beginning: 'ظـ', isolated: 'ظ' },
    { end: 'ـع', middle: 'ـعـ', beginning: 'عـ', isolated: 'ع' },
    { end: 'ـغ', middle: 'ـغـ', beginning: 'غـ', isolated: 'غ' },
    { end: 'ـف', middle: 'ـفـ', beginning: 'فـ', isolated: 'ف' },
    { end: 'ـق', middle: 'ـقـ', beginning: 'قـ', isolated: 'ق' },
    { end: 'ـك', middle: 'ـكـ', beginning: 'كـ', isolated: 'ك' },
    { end: 'ـل', middle: 'ـلـ', beginning: 'لـ', isolated: 'ل' },
    { end: 'ـم', middle: 'ـمـ', beginning: 'مـ', isolated: 'م' },
    { end: 'ـن', middle: 'ـنـ', beginning: 'نـ', isolated: 'ن' },
    { end: 'ـه', middle: 'ـهـ', beginning: 'هـ', isolated: 'ه' },
    { end: 'ـو', middle: 'ـو', beginning: 'و', isolated: 'و' },
    { end: 'ـي', middle: 'ـيـ', beginning: 'يـ', isolated: 'ي' }
  ];
  const getLetterAudioId = (arabicChar?: string) => {
    if (!arabicChar) return undefined;
    const trimmed = arabicChar.trim();
    const idx = baseArabicOrder.indexOf(trimmed);
    if (idx >= 0) return letterAudioByOrder[idx];
    const formIdx = lesson3Forms.findIndex(form =>
      [form.isolated, form.beginning, form.middle, form.end].includes(trimmed)
    );
    if (formIdx >= 0) return letterAudioByOrder[formIdx];
    return undefined;
  };
  
  // Filter valid quizzes (remove order-sequence and empty quizzes) and group into bundles
  const filteredQuizzes = useMemo(() => {
    return lesson.quizzes ? filterValidQuizzes(lesson.quizzes) : [];
  }, [lesson.quizzes]);

  const lessonLabel = useMemo(
    () => (language === 'tr' ? `Ders ${lesson.order}` : `Les ${lesson.order}`),
    [language, lesson.order]
  );

  useEffect(() => {
    setShowIntro(true);
  }, [lesson.order]);

  const quizBundles = useMemo(() => {
    if (!filteredQuizzes.length) return [];

    const grouped = new Map<string, { title?: string; quizzes: Quiz[] }>();
    filteredQuizzes.forEach((quiz, idx) => {
      const bundleId = quiz.bundleId || `bundle-${idx + 1}`;
      if (!grouped.has(bundleId)) {
        grouped.set(bundleId, { title: quiz.bundleTitle, quizzes: [] });
      }
      const entry = grouped.get(bundleId)!;
      entry.quizzes.push(quiz);
      if (!entry.title && quiz.bundleTitle) {
        entry.title = quiz.bundleTitle;
      }
    });

    return Array.from(grouped.entries()).map(([id, data], idx) => ({
      id,
      title: data.title || `${localizedTitle} - Part ${idx + 1}`,
      quizzes: data.quizzes
    }));
  }, [filteredQuizzes, localizedTitle]);

  // Prepare bundle results structure
  useEffect(() => {
    if (!quizBundles.length) return;

    setBundleResults(prev => {
      const next: Record<string, (boolean | null)[]> = {};
      let changed = false;

      quizBundles.forEach(bundle => {
        const existing = prev[bundle.id] || [];
        const updated = bundle.quizzes.map((_, idx) => existing[idx] ?? { result: null, choice: null });
        next[bundle.id] = updated;
        if (
          updated.length !== existing.length ||
          updated.some((value, idx) => value.result !== (existing[idx]?.result ?? null) || value.choice !== (existing[idx]?.choice ?? null))
        ) {
          changed = true;
        }
      });

      if (Object.keys(prev).length !== Object.keys(next).length) {
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [quizBundles]);
  
  // Handle alphabet-detail type (new comprehensive alphabet lesson)
  if (lesson.content.type === 'alphabet-detail') {

    // Quiz phase
    if (phase === 'quiz' && quizBundles.length > 0) {
      const currentBundle = quizBundles[currentBundleIndex];
      const totalBundles = quizBundles.length;
      const currentQuiz = currentBundle.quizzes[currentQuizIndex];
      const totalQuizzes = currentBundle.quizzes.length;
      const currentBundleResults =
        bundleResults[currentBundle.id]?.length === totalQuizzes
          ? bundleResults[currentBundle.id]!
          : Array.from({ length: totalQuizzes }, () => ({ result: null, choice: null }));
      const currentRecord = currentBundleResults[currentQuizIndex] || { result: null, choice: null };
      const isCurrentAnswered = currentRecord.result !== null || currentQuiz.scoringDisabled;

      const handleQuizAnswer = (isCorrect: boolean, choice: number | null = null) => {
        const wasAnswered = currentRecord.result !== null;
        const bundleArray = [...currentBundleResults];
        while (bundleArray.length < totalQuizzes) {
          bundleArray.push({ result: null, choice: null });
        }
        bundleArray[currentQuizIndex] = { result: isCorrect, choice };
        setBundleResults(prev => ({ ...prev, [currentBundle.id]: bundleArray }));

        const allAnswered = bundleArray.every((record, idx) => record.result !== null || currentBundle.quizzes[idx]?.scoringDisabled);

        if (isCorrect && !wasAnswered && currentQuizIndex < totalQuizzes - 1) {
          setTimeout(() => {
            setCurrentQuizIndex(idx => (idx === currentQuizIndex ? Math.min(idx + 1, totalQuizzes - 1) : idx));
          }, 1000);
        }

        if (allAnswered) {
          setTimeout(() => {
            if (currentBundleIndex < totalBundles - 1) {
              setCurrentBundleIndex(currentBundleIndex + 1);
              setCurrentQuizIndex(0);
            } else {
              setPhase('complete');
            }
          }, 1500);
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

      const handleBundleChange = (index: number) => {
        setCurrentBundleIndex(index);
        setCurrentQuizIndex(0);
      };
      
      const handleFinish = () => {
        let bundleAnswers =
          bundleResults[currentBundle.id]?.length === totalQuizzes
            ? bundleResults[currentBundle.id]!
            : Array.from({ length: totalQuizzes }, () => ({ result: null, choice: null }));

        // Auto-mark non-scored questions as completed
        let updatedAnswers = false;
        bundleAnswers = bundleAnswers.map((record, idx) => {
          if (record.result === null && currentBundle.quizzes[idx]?.scoringDisabled) {
            updatedAnswers = true;
            return { result: true, choice: record.choice };
          }
          return record;
        });
        if (updatedAnswers) {
          setBundleResults(prev => ({ ...prev, [currentBundle.id]: bundleAnswers }));
        }

        const unanswered = bundleAnswers.filter(r => r.result === null).length;
        if (unanswered > 0) {
          const firstUnansweredIndex = bundleAnswers.findIndex(r => r.result === null);
          if (firstUnansweredIndex !== -1) {
            setCurrentQuizIndex(firstUnansweredIndex);
          }
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);
          return;
        }
        
        // Move to next bundle or complete
        if (currentBundleIndex < totalBundles - 1) {
          setTimeout(() => {
            setCurrentBundleIndex(currentBundleIndex + 1);
            setCurrentQuizIndex(0);
          }, 1500);
          return;
        }
        
        // All questions answered, move to complete phase
        setTimeout(() => setPhase('complete'), 1500);
      };
      
      const answeredCount = currentBundleResults.filter((r, idx) => r.result !== null || currentBundle.quizzes[idx]?.scoringDisabled).length;
      const totalAnsweredAcrossBundles = Object.entries(bundleResults).reduce((acc, [bundleId, results]) => {
        const bundle = quizBundles.find(b => b.id === bundleId);
        if (!bundle) return acc;
        bundle.quizzes.forEach((quiz, idx) => {
          const record = results[idx];
          if (record?.result !== null || quiz.scoringDisabled) {
            acc += 1;
          }
        });
        return acc;
      }, 0);
      const totalQuizzesAcrossBundles = quizBundles.reduce((acc, bundle) => acc + bundle.quizzes.length, 0);
      
      return (
        <div className="min-h-screen p-3" style={{ backgroundColor: '#e6f4ff' }}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-3">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 border border-purple-200 rounded-full px-3 py-1 shadow-sm bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </button>
            </div>
            <div className="mb-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border-4" style={{ borderColor: lesson.content.color }}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: lesson.content.color }}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-gray-800">{lessonLabel}</h2>
                      <p className="text-gray-600 text-sm">
                        {currentQuizIndex + 1} {t.questionOf} {totalQuizzes}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <div className="bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all duration-300 shadow-sm"
                        style={{ 
                          width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%`,
                          background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)'
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-700 mt-1 text-right font-medium">
                      {lessonLabel}
                    </div>
                  </div>
                </div>
                {quizBundles.length > 1 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quizBundles.map((bundle, idx) => (
                      <button
                        key={bundle.id}
                        onClick={() => handleBundleChange(idx)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          idx === currentBundleIndex
                            ? 'bg-purple-100 border-purple-400 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400'
                        }`}
                      >
                        {language === 'tr' ? `Bolum ${idx + 1}` : `Deel ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 mb-3" style={{ borderColor: lesson.content.color }}>
              <QuizComponent
                quiz={currentQuiz}
                language={language}
                onAnswer={handleQuizAnswer}
                isAnswered={isCurrentAnswered}
                initialChoice={currentRecord.choice}
                answerResult={currentRecord.result}
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
                  {language === 'tr' ? 'T?m sorular? cevaplad?n?z m??' : 'Heeft u alle vragen beantwoord?'}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    
    // Complete phase
    if (phase === 'complete') {
      const scoringTotals = quizBundles.reduce(
        (acc, bundle) => {
          const results = bundleResults[bundle.id] || [];
          bundle.quizzes.forEach((quiz, idx) => {
            if (quiz.scoringDisabled) return;
            acc.total += 1;
            const res = results[idx]?.result;
            if (res) {
              acc.correct += 1;
            }
          });
          return acc;
        },
        { correct: 0, total: 0 }
      );
      const percentage = scoringTotals.total > 0 ? Math.round((scoringTotals.correct / scoringTotals.total) * 100) : 0;
      
      return (
        <div className="min-h-screen p-3 flex items-center justify-center" style={{ backgroundColor: '#e6f4ff' }}>
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
                  {scoringTotals.correct} {t.of} {scoringTotals.total} {language === 'tr' ? 'doÄŸru cevap' : 'goede antwoorden'}
                </p>
              </div>
              
              <p className="text-green-600 mb-6">
                {percentage >= 80 
                  ? (language === 'tr' ? 'Harika iş! Sonraki derse hazırsın!' : 'Geweldig werk! Je bent klaar voor de volgende les!')
                  : (language === 'tr' ? 'İyi iş! Pratiğe devam et!' : 'Goed gedaan! Blijf oefenen!')
                }
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onComplete()}
                  className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg"
                >
                  {language === 'tr' ? 'Ana sayfaya d?n' : 'Terug naar dashboard'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

// Study phase - Show one letter at a time (or combos for lesson 4)
  const totalLetters = isLesson4 ? lesson4Combos.length : lesson.content.alphabetLetters?.length || 0;
  const currentCombo = isLesson4 ? lesson4Combos[currentLetterIndex] : null;
  const currentLetter = lesson.content.alphabetLetters?.[currentLetterIndex];
  const isFirstLetter = currentLetterIndex === 0;
  const isLastLetter = currentLetterIndex === totalLetters - 1;

  if (!isLesson4 && !currentLetter) return null;

    const bgColor = isLesson4
      ? letterTypeColors[getLetterTypeForChar(currentCombo?.separated?.[0])]
      : currentLetter && currentLetter.type
        ? letterTypeColors[currentLetter.type]
        : letterTypeColors['normal'];
    const currentTypeLabel =
      !isLesson4 && currentLetter?.type && currentLetter.type !== 'normal'
        ? (language === 'tr' ? letterTypeLabels[currentLetter.type]?.tr : letterTypeLabels[currentLetter.type]?.nl)
        : null;
    const neutralLabel = language === 'tr' ? 'Nötr' : 'Neutraal';
    const isNeutral = currentLetter?.type === 'normal';
    const typeText = !isLesson4 && currentLetter?.type
      ? (currentLetter.note
          ? (language === 'tr' ? currentLetter.note.tr : currentLetter.note.nl)
          : (language === 'tr' ? typeDescriptions[currentLetter.type]?.tr : typeDescriptions[currentLetter.type]?.nl))
      : null;
    const currentLesson3Forms =
      lesson.order === 3
        ? (() => {
            const idx = baseArabicOrder.indexOf((currentLetter?.arabic || '').trim());
            const safeIndex = idx >= 0 ? idx : Math.min(currentLetterIndex, lesson3Forms.length - 1);
            return lesson3Forms[safeIndex];
          })()
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

      const fileName =
        getLetterAudioId(currentLetter.arabic) ||
        letterAudioByOrder[currentLetterIndex % letterAudioByOrder.length];
      playAudioClip(fileName);
    };

    const handleGoToQuestions = () => {
      if (!allLettersViewed) {
        setShowContentWarning(true);
        setTimeout(() => setShowContentWarning(false), 3000);
        return;
      }
      
      if (quizBundles.length > 0) {
        setCurrentBundleIndex(0);
        setCurrentQuizIndex(0);
        setPhase('quiz');
      } else {
        setPhase('complete');
      }
    };

if (showIntro) {
      return (
        <div className="min-h-screen p-3" style={{ backgroundColor: '#e6f4ff' }}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200">
              <h1 className="text-3xl text-purple-800 mb-3 text-center">
                {language === 'tr' ? `${lesson.order}. Derse Başla` : `Start met les ${lesson.order}`}
              </h1>
              <p className="text-gray-700 text-center mb-6">
                {lesson.order === 1
                  ? (language === 'tr'
                    ? 'Bu derste Arap harflerini tanıyacak, sesleri dinleyip ayırt edecek ve hızlı tanıma alıştırmaları yapacaksın.'
                    : 'In deze les leer je de Arabische letters herkennen, luister je naar de klanken en oefen je met snelle herkenning.')
                  : lesson.order === 2
                    ? (language === 'tr'
                      ? 'Bu derste Arapça harfleri karışık sırayla tekrar ediyorsun, seslerini dinliyorsun ve hızlı tanımayı pekiştiriyorsun.'
                      : 'In deze les herhaal je de Arabische letters in een willekeurige volgorde, luister je naar de klanken en oefen je met herkenning.')
                    : lesson.order === 3
                      ? (language === 'tr'
                        ? 'Bu derste Arapça harflerin kelimenin başında, ortasında ve sonunda nasıl yazıldığını öğreniyorsun. Ayrıca harflerin birbirine nasıl bağlandığını da görüyorsun.'
                        : 'In deze les leer je hoe de Arabische letters eruitzien aan het begin, in het midden en aan het einde van een woord. Je ziet ook hoe de letters met elkaar worden verbonden.')
                      : lesson.order === 4
                        ? (language === 'tr'
                          ? 'Bu derste 3. derste öğrendiğin bağlama kurallarını kullanarak üç harfli kombinasyonların nasıl birleştiğini dinleyip inceleyeceksin.'
                          : 'In deze les pas je de verbindingsregels uit les 3 toe en hoor je hoe drieletterige combinaties samenkomen.')
                        : (language === 'tr'
                          ? 'Bu derste Arapça harfleri pratik ederek kelimeler içinde kullanmayı öğreneceksin.'
                          : 'In deze les oefen je de Arabische letters verder binnen woorden.')}
              </p>
              <div className="text-center">
                <button
                  onClick={() => setShowIntro(false)}
                  className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md transition-all"
                >
                  {language === 'tr' ? `${lesson.order}. Derse Başla` : `Begin met les ${lesson.order}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-3" style={{ backgroundColor: '#e6f4ff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 border border-purple-200 rounded-full px-3 py-1 shadow-sm bg-white transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-3 border-4" style={{ borderColor: lesson.content.color }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookIcon className="w-[30px] h-[30px]" />
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
                      background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Compact Letter Card Display */}
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-3 border-4" style={{ borderColor: bgColor }}>
            {lesson.order === 3 && currentLesson3Forms ? (
              <div className="grid md:grid-cols-4 gap-4 mb-3">
                {[
                  { key: 'end', label: language === 'tr' ? 'Son' : 'Einde', value: currentLesson3Forms.end },
                  { key: 'middle', label: language === 'tr' ? 'Orta' : 'Midden', value: currentLesson3Forms.middle },
                  { key: 'beginning', label: language === 'tr' ? 'Başlangıç' : 'Begin', value: currentLesson3Forms.beginning },
                  { key: 'isolated', label: language === 'tr' ? 'Bağsız' : 'Losstaand', value: currentLesson3Forms.isolated, canListen: true }
                ].map(card => (
                  <div
                    key={card.key}
                    className="bg-gray-50 rounded-xl p-4 border-2 flex flex-col items-center justify-center text-center"
                    style={{ borderColor: bgColor + '40' }}
                  >
                    <p className="text-gray-600 text-xs mb-2">{card.label}</p>
                    <div
                      className="arabic-text flex items-center justify-center mb-3"
                      style={{
                        fontSize: '3.5rem',
                        color: bgColor,
                        lineHeight: '1',
                        minHeight: '100px'
                      }}
                    >
                      {card.value}
                    </div>
                    {card.canListen && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const audioId =
                            getLetterAudioId(currentLesson3Forms.isolated) ||
                            letterAudioByOrder[currentLetterIndex % letterAudioByOrder.length];
                          playAudioClip(audioId);
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <Volume2 className="w-4 h-4 mr-1" />
                        {language === 'tr' ? 'Dinle' : 'Luister'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (isLesson4 && currentCombo ? (
              <div className="relative">
                <div
                  className="grid gap-4 mb-3"
                  style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr' }}
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 relative" style={{ borderColor: bgColor + '40' }}>
                    <p className="text-gray-600 text-xs mb-2">{language === 'tr' ? 'Bağlı kelime' : 'Verbonden woord'}</p>
                    <div 
                      className="flex items-center justify-center arabic-text"
                      style={{ 
                        fontSize: '4rem', 
                        color: bgColor,
                        lineHeight: '1',
                        minHeight: '120px'
                      }}
                    >
                      {currentCombo.connected}
                    </div>
                  </div>

                  {currentCombo.separated.slice().reverse().map((char, idx) => {
                    const type = getLetterTypeForChar(char);
                    const color = letterTypeColors[type];
                    return (
                      <div
                        key={`${char}-${idx}`}
                        className="bg-white rounded-xl p-4 border-2 shadow-sm flex flex-col items-center gap-3"
                        style={{ 
                          borderColor: color + '40',
                          backgroundColor: color + '0d'
                        }}
                      >
                        <p className="text-gray-600 text-xs">{language === 'tr' ? 'Harf' : 'Letter'}</p>
                        <div className="arabic-text text-4xl" style={{ color, fontSize: '3.5rem', lineHeight: '1' }}>
                          {char}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => playAudioClip(getLetterAudioId(char) || char)}
                          className="bg-purple-500 hover:bg-purple-600 text-white w-full justify-center"
                        >
                          <Volume2 className="w-4 h-4 mr-1" />
                          {language === 'tr' ? 'Dinle' : 'Luister'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 relative" style={{ borderColor: bgColor + '40' }}>
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
                  <div className="flex items-center gap-3">
                    <p className="text-gray-800 text-lg">
                      {language === 'tr' ? currentLetter.pronunciation.tr : currentLetter.pronunciation.nl}
                    </p>
                    <Button
                      size="sm"
                      onClick={playLetterAudio}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Volume2 className="w-4 h-4 mr-1" />
                      {language === 'tr' ? 'Dinle' : 'Luister'}
                    </Button>
                  </div>
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
            ))}

            {!isLesson4 && currentLetter?.type && (
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
                  {(currentTypeLabel || isNeutral) && (
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {currentTypeLabel || neutralLabel}
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
                {quizBundles.length > 0 ? t.goToQuestions : t.complete}
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
        <div className="min-h-screen p-3 flex items-center justify-center" style={{ backgroundColor: '#e6f4ff' }}>
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
      <div className="min-h-screen p-3" style={{ backgroundColor: '#e6f4ff' }}>
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
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: "#e6f4ff" }}>
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
    <div className="min-h-screen p-3" style={{ backgroundColor: '#e6f4ff' }}>
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
                fontSize: '5rem',
                backgroundColor: `${lesson.content.color}10`,
                color: '#1f2937',
                minHeight: '120px'
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
                    background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)'
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
