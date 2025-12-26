// Placeholder lessons and quizzes for 25 lessons
// These will be replaced with real content later

export interface Lesson {
  id: string;
  order: number;
  title: {
    tr: string;
    nl: string;
  };
  skills: string[]; // Skills taught in this lesson
  content: {
    tr: string;
    nl: string;
  };
  summary: {
    tr: string;
    nl: string;
  };
  quizzes: Quiz[];
}

export type QuizType = 'multiple-choice' | 'drag-drop' | 'listen-choose' | 'true-false' | 'order-sequence';

export interface Quiz {
  id: string;
  type: QuizType;
  skill: string; // Which skill this quiz tests
  question: {
    tr: string;
    nl: string;
  };
  // For multiple-choice, listen-choose, true-false
  options?: {
    tr: string;
    nl: string;
  }[];
  correctAnswer?: number; // Index of correct option
  // For drag-drop
  items?: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
  }[];
  correctPairs?: { sourceId: string; targetId: string }[];
  // For order-sequence
  sequence?: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
  }[];
  correctOrder?: string[]; // Array of IDs in correct order
  // For listen-choose (audio URL)
  audioUrl?: string;
}

// Generate 25 placeholder lessons
export const placeholderLessons: Lesson[] = Array.from({ length: 25 }, (_, i) => {
  const lessonNum = i + 1;
  
  return {
    id: `lesson-${lessonNum}`,
    order: lessonNum,
    title: {
      // Keep a single, consistent label used everywhere (overview and in-lesson)
      tr:
        lessonNum === 1
          ? 'Ders 1: Arap alfabesi'
          : lessonNum === 2
          ? 'Ders 2: alfabe farklı sırada'
          : `Ders ${lessonNum}: Arapça harfler`,
      nl:
        lessonNum === 1
          ? 'Les 1: Arabisch alfabet'
          : lessonNum === 2
          ? 'Les 2: alfabet in andere volgorde'
          : `Les ${lessonNum}: Arabische letters`
    },
    skills: [
      `letter-recognition-${lessonNum}`,
      `letter-sound-${lessonNum}`,
      `letter-writing-${lessonNum}`
    ],
    content: {
      tr: `Bu derste ${lessonNum}. grup Arapça harfleri öğreniyoruz. Bu harfler Kur'an okumak için çok önemlidir.\n\nÖğreneceğimiz harfler:\n- Harf özellikleri\n- Doğru telaffuz\n- Yazım şekilleri\n\nDikkatli dinleyin ve pratik yapın!`,
      nl: `In deze les leren we de ${lessonNum}e groep Arabische letters. Deze letters zijn heel belangrijk voor het lezen van de Koran.\n\nWat we gaan leren:\n- Letter eigenschappen\n- Correcte uitspraak\n- Schrijfvormen\n\nLuister goed en oefen veel!`
    },
    summary: {
      tr: `Harika! ${lessonNum}. dersi tamamladınız. Bu derste öğrendikleriniz:\n\n✓ Yeni Arapça harfler\n✓ Harf telaffuzları\n✓ Yazım becerileri\n\nPratik yapmaya devam edin!`,
      nl: `Geweldig! Je hebt les ${lessonNum} voltooid. Wat je hebt geleerd:\n\n✓ Nieuwe Arabische letters\n✓ Letter uitspraken\n✓ Schrijfvaardigheden\n\nBlijf oefenen!`
    },
    quizzes: [
      // Multiple choice
      {
        id: `quiz-${lessonNum}-1`,
        type: 'multiple-choice',
        skill: `letter-recognition-${lessonNum}`,
        question: {
          tr: `Hangisi doğru harftir?`,
          nl: `Welke is de juiste letter?`
        },
        options: [
          { tr: 'Seçenek A', nl: 'Optie A' },
          { tr: 'Seçenek B', nl: 'Optie B' },
          { tr: 'Seçenek C', nl: 'Optie C' },
          { tr: 'Seçenek D', nl: 'Optie D' }
        ],
        correctAnswer: 0
      },
      // Drag and drop
      {
        id: `quiz-${lessonNum}-2`,
        type: 'drag-drop',
        skill: `letter-sound-${lessonNum}`,
        question: {
          tr: 'Harfleri doğru seslerle eşleştirin',
          nl: 'Match de letters met de juiste geluiden'
        },
        items: [
          { id: 'letter-1', content: { tr: 'Harf 1', nl: 'Letter 1' } },
          { id: 'letter-2', content: { tr: 'Harf 2', nl: 'Letter 2' } },
          { id: 'sound-1', content: { tr: 'Ses 1', nl: 'Geluid 1' } },
          { id: 'sound-2', content: { tr: 'Ses 2', nl: 'Geluid 2' } }
        ],
        correctPairs: [
          { sourceId: 'letter-1', targetId: 'sound-1' },
          { sourceId: 'letter-2', targetId: 'sound-2' }
        ]
      },
      // True/False
      {
        id: `quiz-${lessonNum}-3`,
        type: 'true-false',
        skill: `letter-writing-${lessonNum}`,
        question: {
          tr: 'Bu harf doğru yazılmış mı?',
          nl: 'Is deze letter correct geschreven?'
        },
        options: [
          { tr: 'Doğru', nl: 'Waar' },
          { tr: 'Yanlış', nl: 'Onwaar' }
        ],
        correctAnswer: 0
      },
      // Order sequence
      {
        id: `quiz-${lessonNum}-4`,
        type: 'order-sequence',
        skill: `letter-recognition-${lessonNum}`,
        question: {
          tr: 'Harfleri doğru sıraya koyun',
          nl: 'Plaats de letters in de juiste volgorde'
        },
        sequence: [
          { id: 'seq-1', content: { tr: 'İlk Harf', nl: 'Eerste Letter' } },
          { id: 'seq-2', content: { tr: 'İkinci Harf', nl: 'Tweede Letter' } },
          { id: 'seq-3', content: { tr: 'Üçüncü Harf', nl: 'Derde Letter' } }
        ],
        correctOrder: ['seq-1', 'seq-2', 'seq-3']
      },
      // Listen and choose (audio-based)
      {
        id: `quiz-${lessonNum}-5`,
        type: 'listen-choose',
        skill: `letter-sound-${lessonNum}`,
        question: {
          tr: 'Hangi harf duyuluyor?',
          nl: 'Welke letter hoor je?'
        },
        options: [
          { tr: 'Harf A', nl: 'Letter A' },
          { tr: 'Harf B', nl: 'Letter B' },
          { tr: 'Harf C', nl: 'Letter C' },
          { tr: 'Harf D', nl: 'Letter D' }
        ],
        correctAnswer: 1,
        audioUrl: `/audio/lesson-${lessonNum}-sound.mp3` // Placeholder audio path
      }
    ]
  };
});
