import { useState, useEffect } from 'react';
import { Quiz } from '../data/notionLessons';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, X, Volume2 } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface QuizComponentProps {
  quiz: Quiz;
  language: 'tr' | 'nl';
  onAnswer: (isCorrect: boolean) => void;
  isAnswered?: boolean; // Whether this question was already answered
}

export function QuizComponent({ quiz, language, onAnswer, isAnswered = false }: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Reset state when quiz changes (new question)
  useEffect(() => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setAttempts(0);
  }, [quiz.id]);
  
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
            <span key={idx} className="arabic-text text-3xl mx-1">{part.text}</span>
          ) : (
            <span key={idx}>{part.text}</span>
          )
        )}
      </>
    );
  };
  
  const handleSelect = (answer: number) => {
    if (!submitted && !isAnswered) {
      setSelectedAnswer(answer);
    }
  };
  
  const handleSubmit = () => {
    if (selectedAnswer === null || isAnswered) return;
    
    setSubmitted(true);
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    
    if (isCorrect) {
      // Correct answer - move to next question after delay
      setTimeout(() => {
        onAnswer(true);
      }, 1500);
    } else {
      // Wrong answer - check attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 2) {
        // Second attempt failed - move to next question
        setTimeout(() => {
          onAnswer(false);
        }, 1500);
      } else {
        // First attempt failed - allow retry
        setTimeout(() => {
          setSubmitted(false);
          setSelectedAnswer(null);
        }, 1500);
      }
    }
  };
  
  const isCorrect = submitted && selectedAnswer === quiz.correctAnswer;
  const isIncorrect = submitted && selectedAnswer !== quiz.correctAnswer;

  if (quiz.type === 'multiple-choice' || quiz.type === 'listen-choose' || quiz.type === 'true-false') {
    return (
      <div className="space-y-6">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-2xl mb-4 flex items-center justify-center gap-2">
            {renderTextWithArabic(quiz.question[language])}
          </h3>
          {quiz.type === 'listen-choose' && quiz.audioUrl && (
            <Button
              onClick={() => {
                // Play audio (placeholder - would need actual audio implementation)
                console.log('Playing audio:', quiz.audioUrl);
              }}
              className="mx-auto mb-4 bg-purple-500 hover:bg-purple-600"
            >
              <Volume2 className="mr-2" size={20} />
              {language === 'tr' ? 'Dinle' : 'Luister'}
            </Button>
          )}
        </div>

        {/* Options */}
        <div className="grid gap-3 max-w-2xl mx-auto">
          {quiz.options?.map((option, index) => {
            const optionText = option[language];
            
            return (
              <button
                key={index}
                onClick={() => !submitted && !isAnswered && handleSelect(index)}
                disabled={submitted || isAnswered}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  submitted || isAnswered
                    ? index === selectedAnswer
                      ? isCorrect
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-gray-100 border-gray-300'
                    : selectedAnswer === index
                    ? 'bg-purple-100 border-purple-500'
                    : 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg flex items-center gap-2">
                    {renderTextWithArabic(optionText)}
                  </span>
                  {(submitted || isAnswered) && index === selectedAnswer && (
                    isCorrect ? (
                      <Check className="text-green-600" size={24} />
                    ) : (
                      <X className="text-red-600" size={24} />
                    )
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted && !isAnswered && selectedAnswer !== null && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={isAnswered}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-3"
            >
              {language === 'tr' ? 'Cevabı Kontrol Et' : 'Controleer Antwoord'}
            </Button>
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div className={`text-center p-4 rounded-xl ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect 
              ? (language === 'tr' ? '✓ Doğru!' : '✓ Correct!')
              : (language === 'tr' ? '✗ Yanlış. Tekrar dene!' : '✗ Verkeerd. Probeer opnieuw!')
            }
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
    const sources = quiz.items?.filter(item => item.id.startsWith('letter-')) || [];
    return [...sources].sort(() => Math.random() - 0.5);
  });

  const targets = quiz.items?.filter(item => item.id.startsWith('sound-')) || [];

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
      className={`p-4 border-2 rounded-xl transition-all ${
        submitted
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
          : isDragging
          ? 'opacity-50 bg-purple-100 border-purple-500 cursor-grabbing'
          : 'bg-white border-purple-300 cursor-grab hover:border-purple-500 hover:bg-purple-50'
      } ${isPaired && !submitted ? 'border-purple-500 bg-purple-100' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">{item.content[language]}</span>
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
      className={`p-4 border-2 rounded-xl min-h-[100px] transition-all ${
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
      <div className="text-sm font-semibold mb-2 text-purple-700">{target.content[language]}</div>
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