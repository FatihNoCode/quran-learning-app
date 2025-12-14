import { useState, useEffect } from 'react';
import { Lesson } from '../data/lessons';
import { CheckCircle, ArrowLeft, Sparkles, BookOpen, Info } from 'lucide-react';
import { getLetterProperty, typeColors } from '../data/letterProperties';

interface LessonViewerProps {
  lesson: Lesson;
  language: 'tr' | 'nl';
  onComplete: (lessonId: string) => void;
  onBack: () => void;
}

const translations = {
  tr: {
    complete: 'Dersi Tamamla',
    examples: 'Örnekler',
    pronunciation: 'Telaffuz',
    back: 'Geri',
    completed: 'Tamamlandı',
    letterType: 'Harf Tipi',
    letterName: 'Harf Adı'
  },
  nl: {
    complete: 'Les Voltooien',
    examples: 'Voorbeelden',
    pronunciation: 'Uitspraak',
    back: 'Terug',
    completed: 'Voltooid',
    letterType: 'Lettertype',
    letterName: 'Letternaam'
  }
};

export default function LessonViewer({ lesson, language, onComplete, onBack }: LessonViewerProps) {
  const t = translations[language];
  const letterProp = lesson.content.letter ? getLetterProperty(lesson.content.letter) : undefined;
  const typeColor = letterProp ? typeColors[letterProp.type] : null;

  const handleComplete = () => {
    onComplete(lesson.id);
  };

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
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
              <Sparkles className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-purple-800">{lesson.title[language]}</h1>
              <p className="text-gray-600">{lesson.description[language]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Letter Display */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-12 text-center border-4 border-blue-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6 flex items-center justify-center min-h-[200px]">
            <div className="text-9xl text-white drop-shadow-2xl arabic-text flex items-center justify-center">
              {lesson.content.letter}
            </div>
          </div>
          
          {/* Letter Properties */}
          {letterProp && typeColor && (
            <div className="bg-white rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.letterName}:</span>
                <span className="text-purple-800 arabic-text text-xl">{letterProp.name.ar}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.pronunciation}:</span>
                <span className="text-purple-800">{letterProp.pronunciation}</span>
              </div>
              <div className={`${typeColor.bg} ${typeColor.border} border-2 rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className={typeColor.text} size={20} />
                  <span className={`${typeColor.text}`}>{t.letterType}</span>
                </div>
                <p className={`text-sm ${typeColor.text}`}>
                  {letterProp.typeDescription[language]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pronunciation Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-green-200">
          <h2 className="text-green-800 mb-6">{t.pronunciation}</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-300">
              <p className="text-green-800 text-center text-3xl">
                {lesson.content.pronunciation}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300">
              <div className="flex items-center justify-center gap-3 mb-3">
                <BookOpen className="text-blue-600" size={24} />
                <p className="text-blue-800">{language === 'tr' ? 'Harfi Oku' : 'Lees de letter'}</p>
              </div>
              <div className="text-7xl text-blue-800 text-center arabic-text">
                {lesson.content.letter}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-orange-200 mb-6">
        <h2 className="text-orange-800 mb-6">{t.examples}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lesson.content.examples.map((example, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-8 text-center border-2 border-orange-300"
            >
              <div className="text-6xl text-orange-800 mb-3 arabic-text">
                {example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Button */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-200">
        <button
          onClick={handleComplete}
          className="w-full py-6 rounded-xl transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105"
        >
          <CheckCircle size={28} />
          <span>{t.complete}</span>
        </button>
      </div>
    </div>
  );
}