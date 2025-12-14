import { useState } from 'react';
import { Lesson } from '../data/lessons';
import { Volume2, CheckCircle, XCircle, ArrowLeft, Award } from 'lucide-react';

interface ReviewSessionProps {
  lessons: Lesson[];
  language: 'tr' | 'nl';
  onComplete: () => void;
  onBack: () => void;
}

const translations = {
  tr: {
    review: 'Tekrar',
    question: 'Bu harf hangisi?',
    correct: 'Doğru!',
    incorrect: 'Yanlış!',
    next: 'Sonraki',
    finish: 'Bitir',
    complete: 'Harika! Tekrarı Tamamladın!',
    score: 'Skor',
    back: 'Geri',
    of: '/',
    progress: 'İlerleme'
  },
  nl: {
    review: 'Herhaling',
    question: 'Welke letter is dit?',
    correct: 'Correct!',
    incorrect: 'Onjuist!',
    next: 'Volgende',
    finish: 'Voltooien',
    complete: 'Geweldig! Herhaling Voltooid!',
    score: 'Score',
    back: 'Terug',
    of: '/',
    progress: 'Voortgang'
  }
};

export default function ReviewSession({ lessons, language, onComplete, onBack }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const t = translations[language];

  if (lessons.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">
          {language === 'tr' ? 'Tekrar edilecek ders yok!' : 'Geen lessen om te herhalen!'}
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          {t.back}
        </button>
      </div>
    );
  }

  const currentLesson = lessons[currentIndex];

  // Generate answer options (current + 3 random others)
  const generateOptions = () => {
    const options = [currentLesson.content.letter];
    const otherLessons = lessons.filter(l => l.id !== currentLesson.id);
    
    while (options.length < 4 && otherLessons.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherLessons.length);
      const randomLesson = otherLessons[randomIndex];
      if (!options.includes(randomLesson.content.letter)) {
        options.push(randomLesson.content.letter);
      }
      otherLessons.splice(randomIndex, 1);
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  const [options] = useState(generateOptions());

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === currentLesson.content.letter) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    const percentage = Math.round((score / lessons.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-purple-200">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Award className="text-white" size={64} />
          </div>
          
          <h1 className="text-purple-800 mb-4">{t.complete}</h1>
          
          <div className="bg-purple-50 rounded-2xl p-8 mb-6">
            <p className="text-gray-600 mb-2">{t.score}</p>
            <p className="text-purple-800">
              {score} {t.of} {lessons.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-purple-600 mt-2">
              {percentage}%
            </p>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            {t.finish}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-purple-800">{t.review}</h2>
            <div className="text-purple-600">
              {currentIndex + 1} {t.of} {lessons.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-4 border-blue-200">
        <h2 className="text-blue-800 text-center mb-6">{t.question}</h2>
        
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-12 mb-6 text-center">
          <div
            onClick={() => speak(currentLesson.content.pronunciation)}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 cursor-pointer hover:bg-white/30 transition-colors"
          >
            <div className="text-9xl text-white drop-shadow-2xl mb-4">
              {currentLesson.content.letter}
            </div>
            <Volume2 className="mx-auto text-white" size={32} />
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => {
            const isCorrect = option === currentLesson.content.letter;
            const isSelected = option === selectedAnswer;
            
            let bgColor = 'bg-purple-50 hover:bg-purple-100 border-purple-300';
            if (showFeedback && isSelected) {
              bgColor = isCorrect 
                ? 'bg-green-500 border-green-600 text-white' 
                : 'bg-red-500 border-red-600 text-white';
            } else if (showFeedback && isCorrect) {
              bgColor = 'bg-green-500 border-green-600 text-white';
            }

            return (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswer(option)}
                disabled={showFeedback}
                className={`py-8 px-6 rounded-xl border-2 transition-all transform hover:scale-105 ${bgColor} ${
                  showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="text-5xl mb-2">{option}</div>
                {showFeedback && isSelected && (
                  <div className="mt-2">
                    {isCorrect ? (
                      <CheckCircle className="mx-auto" size={24} />
                    ) : (
                      <XCircle className="mx-auto" size={24} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl text-center ${
            selectedAnswer === currentLesson.content.letter
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            <p>
              {selectedAnswer === currentLesson.content.letter ? t.correct : t.incorrect}
            </p>
            <p className="text-sm mt-2">{currentLesson.title[language]}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          {currentIndex < lessons.length - 1 ? t.next : t.finish}
        </button>
      )}
    </div>
  );
}
