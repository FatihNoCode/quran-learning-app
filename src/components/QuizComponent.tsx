import { useState, useEffect, useRef } from 'react';
import { Quiz } from '../data/notionLessons';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, X, Volume2 } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface QuizComponentProps {
  quiz: Quiz;
  language: 'tr' | 'nl';
  onAnswer: (isCorrect: boolean, selectedIndex?: number | null) => void;
  isAnswered?: boolean; // Whether this question was already answered
  initialChoice?: number | null; // Persisted answer index
  answerResult?: boolean | null; // Persisted correctness
}

export function QuizComponent({
  quiz,
  language,
  onAnswer,
  isAnswered = false,
  initialChoice = null,
  answerResult = null
}: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(initialChoice);
  const [submitted, setSubmitted] = useState<boolean>(answerResult !== null);
  const [attempts, setAttempts] = useState(initialChoice !== null ? 1 : 0);
  const [optionOrder, setOptionOrder] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const shuffleArray = (arr: number[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  
  // Reset state when quiz changes (new question)
  useEffect(() => {
    setSelectedAnswer(initialChoice);
    setSubmitted(answerResult !== null);
    if (answerResult === false) {
      setAttempts(maxAttempts);
    } else if (initialChoice !== null) {
      setAttempts(1);
    } else {
      setAttempts(0);
    }
    setTimeLeft(null);
    clearTimers();
  }, [quiz.id, initialChoice, answerResult]);

  // Shuffle option order when needed
  useEffect(() => {
    if (!quiz.options) {
      setOptionOrder([]);
      return;
    }
    const indices = quiz.options.map((_, idx) => idx);
    const shouldShuffle =
      quiz.shuffleOptions ??
      ['audio-mc', 'timed-audio-mc', 'error-detection'].includes(quiz.type as any);
    setOptionOrder(shouldShuffle ? shuffleArray(indices) : indices);
  }, [quiz.id, quiz.options, quiz.shuffleOptions, quiz.type]);

  // Timer handling disabled (no countdowns)
  useEffect(() => {
    clearTimers();
    setTimeLeft(null);
    return () => clearTimers();
  }, [quiz.id]);

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
      audio.play().catch(() => {});
    };

    tryPlay(0);
  };

  // Auto-play audio once when question loads for audio-based items
  useEffect(() => {
    if (
      ['audio-mc', 'timed-audio-mc', 'error-detection', 'production'].includes(quiz.type) &&
      quiz.audioId
    ) {
      playAudioClip(quiz.audioId);
    } else if (quiz.type === 'listen-choose' && quiz.audioUrl) {
      playAudioClip(quiz.audioUrl);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [quiz.id, quiz.audioId, quiz.audioUrl, quiz.type]);
  
  // Helper function to render text with Arabic parts styled separately
  const renderTextWithArabic = (text: string) => {
    // Match Arabic characters and non-Arabic characters
    const parts: { text: string; isArabic: boolean }[] = [];
    let currentPart = '';
    let isCurrentArabic = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const isArabic = /[\u0600-\u06FF]/.test(char);
      
      if (i === 0) {
        currentPart = char;
        isCurrentArabic = isArabic;
      } else if (isArabic === isCurrentArabic) {
        currentPart += char;
      } else {
        parts.push({ text: currentPart, isArabic: isCurrentArabic });
        currentPart = char;
        isCurrentArabic = isArabic;
      }
    }
    
    // Add the last part
    if (currentPart) {
      parts.push({ text: currentPart, isArabic: isCurrentArabic });
    }
    
    return (
      <>
        {parts.map((part, idx) => 
          part.isArabic ? (
            <span key={idx} className="arabic-letter-box">
              <span className="arabic-text text-3xl">{part.text}</span>
            </span>
          ) : (
            <span key={idx}>{part.text}</span>
          )
        )}
      </>
    );
  };
  
  const autoSubmit =
    quiz.type === 'audio-mc' || quiz.type === 'timed-audio-mc' || quiz.type === 'error-detection';
  const maxAttempts = 2;
  const correctIndex = quiz.correctAnswer ?? null;
  const getQuestionAudio = () => quiz.audioId || quiz.audioUrl || quiz.promptAudioId;

  const markAnswered = (isCorrectSelection: boolean, choice: number | null, attemptNumber: number) => {
    setSubmitted(true);
    clearTimers();
    if (isCorrectSelection && attemptNumber === 1) {
      setTimeout(() => onAnswer(isCorrectSelection, choice), 2000);
    } else {
      onAnswer(isCorrectSelection, choice);
    }
  };

  const handleSelect = (answer: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);

    if (autoSubmit) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      const isCorrectSelection = correctIndex !== null ? answer === correctIndex : false;

      if (isCorrectSelection) {
        markAnswered(true, answer, nextAttempts);
      } else if (nextAttempts >= maxAttempts) {
        markAnswered(false, answer, nextAttempts);
      } else {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setSelectedAnswer(null);
          const clip = getQuestionAudio();
          if (clip) playAudioClip(clip);
        }, 1500);
      }
    }
  };
  
  const handleSubmit = () => {
    if (selectedAnswer === null || isAnswered) return;
    
    clearTimers();
    
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const isCorrect = correctIndex !== null ? selectedAnswer === correctIndex : false;
    setSubmitted(true);
    
    if (isCorrect || nextAttempts >= maxAttempts) {
      if (isCorrect && nextAttempts === 1) {
        setTimeout(() => onAnswer(isCorrect, selectedAnswer), 2000);
      } else {
        onAnswer(isCorrect, selectedAnswer);
      }
    } else {
      setTimeout(() => {
        setSubmitted(false);
        setSelectedAnswer(null);
        const clip = getQuestionAudio();
        if (clip) playAudioClip(clip);
      }, 1500);
    }
  };
  
  const isCorrect = submitted && selectedAnswer === quiz.correctAnswer;
  const optionsDisabled = isAnswered || (submitted && attempts >= maxAttempts);

  if (quiz.type === 'production') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-2xl mb-2 flex items-center justify-center gap-2">
          {renderTextWithArabic(quiz.question[language])}
        </h3>
        {quiz.promptLetter && (
          <div className="flex justify-center">
            <div className="arabic-letter-box border-2 border-purple-200 rounded-xl shadow-sm bg-purple-50">
              <span className="arabic-text text-6xl inline-block">{quiz.promptLetter}</span>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => playAudioClip(quiz.audioId || quiz.audioUrl)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Volume2 className="mr-2" size={20} />
            {language === 'tr' ? 'Tekrar dinle' : 'Opnieuw afspelen'}
          </Button>
          <Button
            onClick={() => {
              if (!submitted && !isAnswered) {
                setSubmitted(true);
                onAnswer(true);
              }
            }}
            disabled={submitted || isAnswered}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60"
          >
            {language === 'tr' ? 'Volgende' : 'Volgende'}
          </Button>
        </div>
      </div>
    );
  }

  if (
    quiz.type === 'multiple-choice' ||
    quiz.type === 'listen-choose' ||
    quiz.type === 'true-false' ||
    quiz.type === 'audio-mc' ||
    quiz.type === 'timed-audio-mc' ||
    quiz.type === 'error-detection'
  ) {
    const orderedOptions =
      optionOrder.length && quiz.options
        ? optionOrder
        : quiz.options?.map((_, idx) => idx) ?? [];
    const promptAudio = quiz.promptAudioId || quiz.audioId || quiz.audioUrl;
    const hasAudioButton = Boolean(quiz.audioId || quiz.audioUrl);
    const showTimer = false;
    const finalResult =
      answerResult !== null ? answerResult : submitted ? isCorrect : null;
    const showFeedback = finalResult !== null && selectedAnswer !== null;
    const revealCorrect =
      showFeedback && !finalResult && attempts >= maxAttempts && correctIndex !== null && selectedAnswer !== correctIndex;
    const canSubmit = !autoSubmit && !isAnswered && selectedAnswer !== null && attempts < maxAttempts;
    const timePercent =
      showTimer && timeLeft !== null && quiz.timeLimitSeconds
        ? Math.max(0, Math.min(100, (timeLeft / quiz.timeLimitSeconds) * 100))
        : 100;

    return (
      <div className="space-y-6">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-2xl mb-4 flex items-center justify-center gap-2">
            {renderTextWithArabic(quiz.question[language])}
          </h3>
          {quiz.promptWord && (
            <div className="flex justify-center mb-3">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 text-lg bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 shadow-sm">
                <span className="font-semibold text-gray-800">{quiz.promptWord}</span>
                {quiz.promptMeaning && (
                  <span className="text-sm text-gray-700 bg-white rounded-lg px-3 py-1 shadow-inner">
                    {quiz.promptMeaning[language]}
                  </span>
                )}
                {promptAudio && !hasAudioButton && (
                  <Button
                    size="sm"
                    onClick={() => playAudioClip(promptAudio)}
                    className="bg-purple-500 hover:bg-purple-600 px-3"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          {hasAudioButton && (
            <div className="flex justify-center">
              <Button
                onClick={() => playAudioClip(quiz.audioId || quiz.audioUrl)}
                className="mb-4 bg-purple-500 hover:bg-purple-600"
              >
                <Volume2 className="mr-2" size={20} />
                {language === 'tr' ? 'Dinle' : 'Luister'}
              </Button>
            </div>
          )}
          {quiz.promptLetter && (
            <div className="mt-2 flex justify-center">
              <div className="arabic-letter-box">
                <span className="arabic-text text-6xl">{quiz.promptLetter}</span>
              </div>
            </div>
          )}
          {showTimer && quiz.timeLimitSeconds && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{language === 'tr' ? 'Süre' : 'Timer'}</span>
                <span>{timeLeft ?? quiz.timeLimitSeconds}s</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${timePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid gap-3 max-w-2xl mx-auto">
          {orderedOptions.map(optionIndex => {
            const option = quiz.options?.[optionIndex];
            if (!option) return null;
            const optionText = option[language];
            const isUserChoice = selectedAnswer === optionIndex;
            const isCorrectChoice = correctIndex === optionIndex;
            const shouldShowCorrect = revealCorrect && isCorrectChoice;
            
            return (
              <button
                key={optionIndex}
                onClick={() => handleSelect(optionIndex)}
                disabled={optionsDisabled}
                className={`p-2 rounded-xl border-2 transition-all text-left shadow-sm ${
                  showFeedback
                    ? isUserChoice
                      ? finalResult
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : shouldShowCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-100 border-gray-300'
                    : isUserChoice
                    ? 'bg-purple-100 border-purple-500'
                    : 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg flex items-center gap-2">
                    {renderTextWithArabic(optionText)}
                  </span>
                  {showFeedback && isUserChoice && (
                    finalResult ? (
                      <Check className="text-green-600" size={24} />
                    ) : (
                      <X className="text-red-600" size={24} />
                    )
                  )}
                  {shouldShowCorrect && !isUserChoice && (
                    <Check className="text-green-600" size={20} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {canSubmit && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={isAnswered}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-3"
            >
              {language === 'tr' ? 'Cevabını Kontrol Et' : 'Controleer Antwoord'}
            </Button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-4 rounded-xl ${
            finalResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {finalResult 
              ? (language === 'tr' ? 'Doğru!' : 'Correct!')
              : (quiz.type === 'timed-audio-mc' && selectedAnswer === null)
                ? (language === 'tr' ? 'Süre doldu.' : 'Tijd is op.')
                : attempts < maxAttempts
                  ? (language === 'tr' ? 'Yanlış. Tekrar dene!' : 'Verkeerd. Probeer opnieuw!')
                  : (language === 'tr' ? 'Yanlış. Doğru cevabı incele!' : 'Verkeerd. Bekijk het juiste antwoord!')
            }
          </div>
        )}
        {revealCorrect && correctIndex !== null && quiz.options?.[correctIndex] && (
          <div className="text-center text-sm text-gray-700">
            {language === 'tr' ? 'Doğru cevap:' : 'Juiste antwoord:'}{' '}
            <span className="font-semibold arabic-text text-xl">
              {quiz.options[correctIndex][language]}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (quiz.type === 'drag-drop') {
    return <DragDropQuiz quiz={quiz} language={language} onAnswer={onAnswer} />;
  }

  if (quiz.type === 'order-sequence') {
    return <OrderSequenceQuiz quiz={quiz} language={language} onAnswer={onAnswer} />;
  }

  return <div>Unknown quiz type</div>;
}

// Drag and Drop Quiz Component
function DragDropQuiz({ quiz, language, onAnswer }: QuizComponentProps) {
  const [pairs, setPairs] = useState<{ sourceId: string; targetId: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  // Shuffle sources on mount so they're not in the same order as answers
  const [shuffledSources] = useState(() => {
    const sources = quiz.items?.filter(
      item => item.id.startsWith('word-')
    ) || [];
    return [...sources].sort(() => Math.random() - 0.5);
  });

  const targets = quiz.items?.filter(
    item => item.id.startsWith('letter-')
  ) || [];

  const handleDrop = (sourceId: string, targetId: string) => {
    setPairs(currentPairs => {
      // Remove any existing pair that has this target (one letter per sound box)
      const withoutTarget = currentPairs.filter(p => p.targetId !== targetId);
      // Remove any existing pair that has this source (letter can only be in one place)
      const withoutSourceAndTarget = withoutTarget.filter(p => p.sourceId !== sourceId);
      // Add the new pair
      return [...withoutSourceAndTarget, { sourceId, targetId }];
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Check if all pairs match
    const isCorrect = quiz.correctPairs?.every(correctPair => 
      pairs.some(p => p.sourceId === correctPair.sourceId && p.targetId === correctPair.targetId)
    ) && pairs.length === quiz.correctPairs?.length;

    setTimeout(() => {
      onAnswer(isCorrect || false);
    }, 1500);
  };

  const getSourceStatus = (sourceId: string) => {
    return pairs.find(p => p.sourceId === sourceId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <h3 className="text-2xl text-center mb-6">{quiz.question[language]}</h3>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Sources */}
          <div className="space-y-3">
            <h4 className="text-center mb-4">{language === 'tr' ? 'Harfler' : 'Letters'}</h4>
            {shuffledSources.map(source => {
              const pairedWith = getSourceStatus(source.id);
              return (
                <DraggableItem 
                  key={source.id} 
                  item={source} 
                  language={language}
                  isPaired={!!pairedWith}
                  submitted={submitted}
                />
              );
            })}
          </div>

          {/* Targets */}
          <div className="space-y-3">
            <h4 className="text-center mb-4">{language === 'tr' ? 'Sesler' : 'Geluiden'}</h4>
            {targets.map(target => (
              <DropTarget 
                key={target.id} 
                target={target} 
                language={language} 
                onDrop={handleDrop}
                matched={pairs.find(p => p.targetId === target.id)}
                matchedSource={shuffledSources.find(s => s.id === pairs.find(p => p.targetId === target.id)?.sourceId)}
                submitted={submitted}
                correctPair={quiz.correctPairs?.find(cp => cp.targetId === target.id)}
              />
            ))}
          </div>
        </div>

        {!submitted && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={pairs.length !== shuffledSources.length}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {language === 'tr' ? 'Kontrol Et' : 'Controleer'}
            </Button>
          </div>
        )}

        {submitted && (
          <div className={`text-center p-4 rounded-xl ${
            pairs.every(p => quiz.correctPairs?.some(cp => cp.sourceId === p.sourceId && cp.targetId === p.targetId))
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {pairs.every(p => quiz.correctPairs?.some(cp => cp.sourceId === p.sourceId && cp.targetId === p.targetId))
              ? (language === 'tr' ? '✓ Hepsi doğru!' : '✓ Allemaal correct!')
              : (language === 'tr' ? '✗ Bazıları yanlış. Tekrar dene!' : '✗ Sommige zijn verkeerd. Probeer opnieuw!')
            }
          </div>
        )}
      </div>
    </DndProvider>
  );
}

function DraggableItem({ 
  item, 
  language, 
  isPaired,
  submitted 
}: { 
  item: any; 
  language: 'tr' | 'nl';
  isPaired: boolean;
  submitted: boolean;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: item.id },
    canDrag: !submitted,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [submitted]);

  return (
    <div
      ref={drag}
              className={`p-4 border-2 rounded-xl transition-all shadow-sm ${
        submitted
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
          : isDragging
          ? 'opacity-50 bg-purple-100 border-purple-500 cursor-grabbing'
          : 'bg-white border-purple-300 cursor-grab hover:border-purple-500 hover:bg-purple-50'
      } ${isPaired && !submitted ? 'border-purple-500 bg-purple-100' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg">{item.content[language]}</span>
        {item.audioId && !submitted && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const audio = new Audio(`/Audio/${encodeURIComponent(item.audioId)}.mp3`);
              audio.play().catch(() => {});
            }}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        )}
        {isPaired && !submitted && <span className="text-purple-600">✓</span>}
      </div>
    </div>
  );
}

function DropTarget({ 
  target, 
  language, 
  onDrop, 
  matched, 
  matchedSource,
  submitted,
  correctPair 
}: { 
  target: any; 
  language: 'tr' | 'nl'; 
  onDrop: (sourceId: string, targetId: string) => void;
  matched?: { sourceId: string; targetId: string };
  matchedSource?: any;
  submitted: boolean;
  correctPair?: { sourceId: string; targetId: string };
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: { id: string }) => {
      onDrop(item.id, target.id);
    },
    canDrop: () => !submitted,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [submitted, target.id]);

  const isCorrect = submitted && matched && correctPair && matched.sourceId === correctPair.sourceId;
  const isIncorrect = submitted && matched && correctPair && matched.sourceId !== correctPair.sourceId;

  return (
    <div
      ref={drop}
      className={`p-4 border-2 rounded-xl min-h-[100px] transition-all shadow-sm ${
        isOver && !submitted
          ? 'border-purple-500 bg-purple-100 scale-105'
          : submitted
          ? isCorrect
            ? 'border-green-500 bg-green-50'
            : isIncorrect
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-gray-50'
          : matched
          ? 'border-purple-500 bg-purple-50'
          : 'border-dashed border-gray-400 bg-gray-50'
      }`}
    >
      <div className="text-sm font-semibold mb-2 text-purple-700 arabic-text text-xl">
        {target.content[language]}
      </div>
      {matched && matchedSource && (
        <div className={`mt-2 p-3 rounded-lg ${
          submitted
            ? isCorrect
              ? 'bg-green-200 border-2 border-green-400'
              : 'bg-red-200 border-2 border-red-400'
            : 'bg-white border-2 border-purple-300'
        }`}>
          <div className="flex items-center justify-between">
            <span>{matchedSource.content[language]}</span>
            {submitted && (
              isCorrect ? (
                <Check className="text-green-700" size={20} />
              ) : (
                <X className="text-red-700" size={20} />
              )
            )}
          </div>
        </div>
      )}
      {!matched && !submitted && (
        <div className="text-center text-gray-400 text-sm mt-4">
          {language === 'tr' ? 'Buraya sürükle' : 'Sleep hier naartoe'}
        </div>
      )}
    </div>
  );
}

// Order Sequence Quiz Component
function OrderSequenceQuiz({ quiz, language, onAnswer }: QuizComponentProps) {
  const [order, setOrder] = useState<string[]>(
    quiz.sequence?.map(s => s.id).sort(() => Math.random() - 0.5) || []
  );
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...order];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = order.every((id, index) => id === quiz.correctOrder?.[index]);
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl text-center mb-6">{quiz.question[language]}</h3>
      
      <div className="max-w-2xl mx-auto space-y-3">
        {order.map((id, index) => {
          const item = quiz.sequence?.find(s => s.id === id);
          if (!item) return null;

          const isCorrectPosition = submitted && quiz.correctOrder?.[index] === id;
          const isIncorrectPosition = submitted && quiz.correctOrder?.[index] !== id;

          return (
            <Card
              key={id}
              className={`p-4 ${
                submitted
                  ? isCorrectPosition
                    ? 'bg-green-100 border-green-500'
                    : isIncorrectPosition
                    ? 'bg-red-100 border-red-500'
                    : 'bg-gray-100'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{item.content[language]}</span>
                {!submitted && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => moveItem(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      variant="outline"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => moveItem(index, Math.min(order.length - 1, index + 1))}
                      disabled={index === order.length - 1}
                      variant="outline"
                    >
                      ↓
                    </Button>
                  </div>
                )}
                {submitted && (
                  isCorrectPosition ? (
                    <Check className="text-green-600" size={24} />
                  ) : (
                    <X className="text-red-600" size={24} />
                  )
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {!submitted && (
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {language === 'tr' ? 'Kontrol Et' : 'Controleer'}
          </Button>
        </div>
      )}

      {submitted && (
        <div className={`text-center p-4 rounded-xl ${
          order.every((id, index) => id === quiz.correctOrder?.[index])
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {order.every((id, index) => id === quiz.correctOrder?.[index])
            ? (language === 'tr' ? '✓ Doğru sıra!' : '✓ Correcte volgorde!')
            : (language === 'tr' ? '✗ Yanlış sıra. Tekrar dene!' : '✗ Verkeerde volgorde. Probeer opnieuw!')
          }
        </div>
      )}
    </div>
  );
}
