import { useState } from 'react';
import { Lesson } from '../data/notionLessons';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

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
    inWord: 'Kelimede'
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
    inWord: 'In Woord'
  }
};

export default function NewLessonViewer({ lesson, language, onComplete, onBack }: NewLessonViewerProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showParts, setShowParts] = useState(false);

  const t = translations[language];
  const localizedTitle = language === 'nl' ? (lesson.content.titleNl || lesson.content.title) : lesson.content.title;
  const localizedInstruction = language === 'nl' ? (lesson.content.instructionNl || lesson.content.instruction) : lesson.content.instruction;

  const playAudio = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(() => {});
  };

  if (lesson.content.type === 'image-lesson') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border-4 border-purple-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl p-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{localizedTitle}</h2>
                <p className="text-sm text-purple-100">{localizedInstruction}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200 overflow-hidden">
              <img
                src={lesson.content.imagePath}
                alt={localizedTitle}
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <p className="text-gray-700">{localizedInstruction}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => playAudio(lesson.content.audioUrl)}
                  disabled={!lesson.content.audioUrl}
                  className={`flex-1 py-3 rounded-xl transition-colors ${
                    lesson.content.audioUrl
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {lesson.content.audioUrl
                    ? (language === 'tr' ? 'Sesli Dinle' : 'Audio afspelen')
                    : (language === 'tr' ? 'Ses eklenecek' : 'Audio komt nog')}
                </button>
                <button
                  onClick={() => setCompleted(true)}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  {t.complete}
                </button>
              </div>
            </div>
          </div>

          {completed && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-green-800 font-semibold">{t.lessonComplete}</p>
                  <p className="text-green-700 text-sm">
                    {language === 'tr' ? 'Sonraki derse geçebilirsiniz.' : 'Je kunt doorgaan naar de volgende les.'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2"
                >
                  {language === 'tr' ? 'Devam et' : 'Ga door'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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
                  <h2 className="text-gray-800">{localizedTitle}</h2>
                  <p className="text-gray-600 text-sm">{localizedInstruction}</p>
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
                <h2 className="text-gray-800">{localizedTitle}</h2>
                <p className="text-gray-600 text-sm">{localizedInstruction}</p>
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
