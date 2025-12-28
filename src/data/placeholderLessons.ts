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

export interface QuizOption {
  tr: string;
  nl: string;
  audioIds?: string[]; // Optional per-letter audio for this option
  audioId?: string; // Single clip
}

export interface Quiz {
  id: string;
  type: QuizType;
  skill: string; // Which skill this quiz tests
  question: {
    tr: string;
    nl: string;
  };
  // For multiple-choice, listen-choose, true-false
  options?: QuizOption[];
  correctAnswer?: number; // Index of correct option
  // For drag-drop
  items?: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
    audioId?: string;
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
  audioId?: string;
  promptWord?: string;
  promptMeaning?: { tr: string; nl: string };
  promptLetter?: string;
  promptAudioId?: string;
  promptLetters?: { text: string; audioIds?: string[] };
  shuffleOptions?: boolean;
  bundleId?: string;
}

const letterAudioMap: Record<string, string> = {
  'ا': 'alif',
  'ب': 'ba',
  'ت': 'ta (neutral)',
  'ث': 'tha',
  'ج': 'jim',
  'ح': 'ha early',
  'خ': 'kha',
  'د': 'dal',
  'ذ': 'dhal',
  'ر': 'ra',
  'ز': 'ze',
  'س': 'sin',
  'ش': 'shin',
  'ص': 'sad',
  'ض': 'dad',
  'ط': 'ta (heavy)',
  'ظ': 'za',
  'ع': 'ayn',
  'غ': 'ghayn',
  'ف': 'fa',
  'ق': 'qaf',
  'ك': 'kaf',
  'ل': 'lam',
  'م': 'mim',
  'ن': 'nun',
  'ه': 'ha later',
  'و': 'waw',
  'ي': 'ya'
};

const lettersToAudioIds = (letters: string) =>
  letters.split(' ').map(l => letterAudioMap[l] || '');

// Generate 25 placeholder lessons
export const placeholderLessons: Lesson[] = Array.from({ length: 25 }, (_, i) => {
  const lessonNum = i + 1;

  // Custom quizzes for Lesson 4
  if (lessonNum === 4) {
    const lesson4Quizzes: Quiz[] = [
      // Bundle 1
      {
        id: 'lesson-4-b1-q1',
        bundleId: 'lesson-4-bundle-1',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'كتب',
        options: [
          { tr: 'ك ت ب', nl: 'ك ت ب', audioIds: lettersToAudioIds('ك ت ب') },
          { tr: 'ك ث ب', nl: 'ك ث ب', audioIds: lettersToAudioIds('ك ث ب') },
          { tr: 'ق ت ب', nl: 'ق ت ب', audioIds: lettersToAudioIds('ق ت ب') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b1-q2',
        bundleId: 'lesson-4-bundle-1',
        type: 'order-sequence',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Harfleri sürükle ve kelimeyi oluştur.',
          nl: 'Sleep de letters en maak het woord.'
        },
        sequence: [
          { id: 'letter-1', content: { tr: 'ف', nl: 'ف' } },
          { id: 'letter-2', content: { tr: 'ت', nl: 'ت' } },
          { id: 'letter-3', content: { tr: 'ح', nl: 'ح' } }
        ],
        correctOrder: ['letter-1', 'letter-2', 'letter-3']
      },
      {
        id: 'lesson-4-b1-q3',
        bundleId: 'lesson-4-bundle-1',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu harflerden hangi kelime oluşur?',
          nl: 'Welk woord maak je met deze letters?'
        },
        promptLetters: { text: 'ن ص ر', audioIds: lettersToAudioIds('ن ص ر') },
        options: [
          { tr: 'نصر', nl: 'نصر' },
          { tr: 'ترك', nl: 'ترك' },
          { tr: 'رزق', nl: 'رزق' }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b1-q4',
        bundleId: 'lesson-4-bundle-1',
        type: 'true-false',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelime ve harfler eşleşiyor mu?',
          nl: 'Passen het woord en de letters bij elkaar?'
        },
        promptWord: 'عدل',
        promptLetters: { text: 'ع د ل', audioIds: lettersToAudioIds('ع د ل') },
        options: [
          { tr: 'Evet', nl: 'Ja' },
          { tr: 'Hayır', nl: 'Nee' }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b1-q5',
        bundleId: 'lesson-4-bundle-1',
        type: 'drag-drop',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelimeyi doğru harflere sürükle.',
          nl: 'Sleep het woord naar de juiste letters.'
        },
        items: [
          { id: 'word-1', content: { tr: 'ترك', nl: 'ترك' } },
          { id: 'word-2', content: { tr: 'رزق', nl: 'رزق' } },
          { id: 'word-3', content: { tr: 'درك', nl: 'درك' } },
          { id: 'letter-1', content: { tr: 'ت ر ك', nl: 'ت ر ك' } },
          { id: 'letter-2', content: { tr: 'ر ز ق', nl: 'ر ز ق' } },
          { id: 'letter-3', content: { tr: 'د ر ك', nl: 'د ر ك' } }
        ],
        correctPairs: [
          { sourceId: 'word-1', targetId: 'letter-1' },
          { sourceId: 'word-2', targetId: 'letter-2' },
          { sourceId: 'word-3', targetId: 'letter-3' }
        ]
      },
      {
        id: 'lesson-4-b1-q6',
        bundleId: 'lesson-4-bundle-1',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'رزق',
        options: [
          { tr: 'ر ز ق', nl: 'ر ز ق', audioIds: lettersToAudioIds('ر ز ق') },
          { tr: 'ر ذ ق', nl: 'ر ذ ق', audioIds: lettersToAudioIds('ر ذ ق') },
          { tr: 'ز ر ق', nl: 'ز ر ق', audioIds: lettersToAudioIds('ز ر ق') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b1-q7',
        bundleId: 'lesson-4-bundle-1',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu harflerden hangi kelime oluşur?',
          nl: 'Welk woord maak je met deze letters?'
        },
        promptLetters: { text: 'د ر ك', audioIds: lettersToAudioIds('د ر ك') },
        options: [
          { tr: 'درك', nl: 'درك' },
          { tr: 'درج', nl: 'درج' },
          { tr: 'ترك', nl: 'ترك' },
          { tr: 'رزق', nl: 'رزق' }
        ],
        shuffleOptions: true,
        correctAnswer: 0
      },
      // Bundle 2
      {
        id: 'lesson-4-b2-q1',
        bundleId: 'lesson-4-bundle-2',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'ذهب',
        options: [
          { tr: 'ذ ه ب', nl: 'ذ ه ب', audioIds: lettersToAudioIds('ذ ه ب') },
          { tr: 'د ه ب', nl: 'د ه ب', audioIds: lettersToAudioIds('د ه ب') },
          { tr: 'ز ه ب', nl: 'ز ه ب', audioIds: lettersToAudioIds('ز ه ب') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b2-q2',
        bundleId: 'lesson-4-bundle-2',
        type: 'order-sequence',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Harfleri sürükle ve kelimeyi oluştur.',
          nl: 'Sleep de letters en maak het woord.'
        },
        sequence: [
          { id: 'letter-1', content: { tr: 'و', nl: 'و' } },
          { id: 'letter-2', content: { tr: 'ج', nl: 'ج' } },
          { id: 'letter-3', content: { tr: 'د', nl: 'د' } }
        ],
        correctOrder: ['letter-1', 'letter-2', 'letter-3']
      },
      {
        id: 'lesson-4-b2-q3',
        bundleId: 'lesson-4-bundle-2',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'سمع',
        options: [
          { tr: 'س م ع', nl: 'س م ع', audioIds: lettersToAudioIds('س م ع') },
          { tr: 'ش م ع', nl: 'ش م ع', audioIds: lettersToAudioIds('ش م ع') },
          { tr: 'س ن ع', nl: 'س ن ع', audioIds: lettersToAudioIds('س ن ع') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b2-q4',
        bundleId: 'lesson-4-bundle-2',
        type: 'true-false',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelime ve harfler eşleşiyor mu?',
          nl: 'Passen het woord en de letters bij elkaar?'
        },
        promptWord: 'فهم',
        promptLetters: { text: 'ف ح م', audioIds: lettersToAudioIds('ف ح م') },
        options: [
          { tr: 'Evet', nl: 'Ja' },
          { tr: 'Hayır', nl: 'Nee' }
        ],
        correctAnswer: 1
      },
      {
        id: 'lesson-4-b2-q5',
        bundleId: 'lesson-4-bundle-2',
        type: 'drag-drop',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelimeyi doğru harflere sürükle.',
          nl: 'Sleep het woord naar de juiste letters.'
        },
        items: [
          { id: 'word-4', content: { tr: 'قرب', nl: 'قرب' } },
          { id: 'word-5', content: { tr: 'بدل', nl: 'بدل' } },
          { id: 'word-6', content: { tr: 'توب', nl: 'توب' } },
          { id: 'letter-4', content: { tr: 'ق ر ب', nl: 'ق ر ب' } },
          { id: 'letter-5', content: { tr: 'ب د ل', nl: 'ب د ل' } },
          { id: 'letter-6', content: { tr: 'ت و ب', nl: 'ت و ب' } }
        ],
        correctPairs: [
          { sourceId: 'word-4', targetId: 'letter-4' },
          { sourceId: 'word-5', targetId: 'letter-5' },
          { sourceId: 'word-6', targetId: 'letter-6' }
        ]
      },
      {
        id: 'lesson-4-b2-q6',
        bundleId: 'lesson-4-bundle-2',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu harflerden hangi kelime oluşur?',
          nl: 'Welk woord maak je met deze letters?'
        },
        promptLetters: { text: 'و ج د', audioIds: lettersToAudioIds('و ج د') },
        options: [
          { tr: 'وجد', nl: 'وجد' },
          { tr: 'ذهب', nl: 'ذهب' },
          { tr: 'قرب', nl: 'قرب' }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b2-q7',
        bundleId: 'lesson-4-bundle-2',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'بدل',
        options: [
          { tr: 'ب د ل', nl: 'ب د ل', audioIds: lettersToAudioIds('ب د ل') },
          { tr: 'ب ذ ل', nl: 'ب ذ ل', audioIds: lettersToAudioIds('ب ذ ل') },
          { tr: 'ت د ل', nl: 'ت د ل', audioIds: lettersToAudioIds('ت د ل') },
          { tr: 'ب ر ل', nl: 'ب ر ل', audioIds: lettersToAudioIds('ب ر ل') }
        ],
        shuffleOptions: true,
        correctAnswer: 0
      },
      // Bundle 3
      {
        id: 'lesson-4-b3-q1',
        bundleId: 'lesson-4-bundle-3',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'صبر',
        options: [
          { tr: 'ص ب ر', nl: 'ص ب ر', audioIds: lettersToAudioIds('ص ب ر') },
          { tr: 'س ب ر', nl: 'س ب ر', audioIds: lettersToAudioIds('س ب ر') },
          { tr: 'ش ب ر', nl: 'ش ب ر', audioIds: lettersToAudioIds('ش ب ر') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b3-q2',
        bundleId: 'lesson-4-bundle-3',
        type: 'order-sequence',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Harfleri sürükle ve kelimeyi oluştur.',
          nl: 'Sleep de letters en maak het woord.'
        },
        sequence: [
          { id: 'letter-7', content: { tr: 'ش', nl: 'ش' } },
          { id: 'letter-8', content: { tr: 'ك', nl: 'ك' } },
          { id: 'letter-9', content: { tr: 'ر', nl: 'ر' } }
        ],
        correctOrder: ['letter-7', 'letter-8', 'letter-9']
      },
      {
        id: 'lesson-4-b3-q3',
        bundleId: 'lesson-4-bundle-3',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu harflerden hangi kelime oluşur?',
          nl: 'Welk woord maak je met deze letters?'
        },
        promptLetters: { text: 'غ ف ر', audioIds: lettersToAudioIds('غ ف ر') },
        options: [
          { tr: 'غفر', nl: 'غفر' },
          { tr: 'شكر', nl: 'شكر' },
          { tr: 'خلق', nl: 'خلق' }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b3-q4',
        bundleId: 'lesson-4-bundle-3',
        type: 'true-false',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelime ve harfler eşleşiyor mu?',
          nl: 'Passen het woord en de letters bij elkaar?'
        },
        promptWord: 'هدي',
        promptLetters: { text: 'ه د ي', audioIds: lettersToAudioIds('ه د ي') },
        options: [
          { tr: 'Evet', nl: 'Ja' },
          { tr: 'Hayır', nl: 'Nee' }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b3-q5',
        bundleId: 'lesson-4-bundle-3',
        type: 'drag-drop',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelimeyi doğru harflere sürükle.',
          nl: 'Sleep het woord naar de juiste letters.'
        },
        items: [
          { id: 'word-7', content: { tr: 'خلق', nl: 'خلق' } },
          { id: 'word-8', content: { tr: 'حسد', nl: 'حسد' } },
          { id: 'word-9', content: { tr: 'يسر', nl: 'يسر' } },
          { id: 'letter-7', content: { tr: 'خ ل ق', nl: 'خ ل ق' } },
          { id: 'letter-8', content: { tr: 'ح س د', nl: 'ح س د' } },
          { id: 'letter-9', content: { tr: 'ي س ر', nl: 'ي س ر' } }
        ],
        correctPairs: [
          { sourceId: 'word-7', targetId: 'letter-7' },
          { sourceId: 'word-8', targetId: 'letter-8' },
          { sourceId: 'word-9', targetId: 'letter-9' }
        ]
      },
      {
        id: 'lesson-4-b3-q6',
        bundleId: 'lesson-4-bundle-3',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'حسد',
        options: [
          { tr: 'ح س د', nl: 'ح س د', audioIds: lettersToAudioIds('ح س د') },
          { tr: 'خ س د', nl: 'خ س د', audioIds: lettersToAudioIds('خ س د') },
          { tr: 'ح ش د', nl: 'ح ش د', audioIds: lettersToAudioIds('ح ش د') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b3-q7',
        bundleId: 'lesson-4-bundle-3',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu harflerden hangi kelime oluşur?',
          nl: 'Welk woord maak je met deze letters?'
        },
        promptLetters: { text: 'ص ب ر', audioIds: lettersToAudioIds('ص ب ر') },
        options: [
          { tr: 'صبر', nl: 'صبر' },
          { tr: 'شكر', nl: 'شكر' },
          { tr: 'نصر', nl: 'نصر' },
          { tr: 'قرب', nl: 'قرب' }
        ],
        shuffleOptions: true,
        correctAnswer: 0
      },
      // Bundle 4
      {
        id: 'lesson-4-b4-q1',
        bundleId: 'lesson-4-bundle-4',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'امل',
        options: [
          { tr: 'ا م ل', nl: 'ا م ل', audioIds: lettersToAudioIds('ا م ل') },
          { tr: 'ا ن ل', nl: 'ا ن ل', audioIds: lettersToAudioIds('ا ن ل') },
          { tr: 'ا م ر', nl: 'ا م ر', audioIds: lettersToAudioIds('ا م ر') },
          { tr: 'ع م ل', nl: 'ع م ل', audioIds: lettersToAudioIds('ع م ل') }
        ],
        shuffleOptions: true,
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b4-q2',
        bundleId: 'lesson-4-bundle-4',
        type: 'order-sequence',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Harfleri sürükle ve kelimeyi oluştur.',
          nl: 'Sleep de letters en maak het woord.'
        },
        sequence: [
          { id: 'letter-10', content: { tr: 'ا', nl: 'ا' } },
          { id: 'letter-11', content: { tr: 'خ', nl: 'خ' } },
          { id: 'letter-12', content: { tr: 'ذ', nl: 'ذ' } }
        ],
        correctOrder: ['letter-10', 'letter-11', 'letter-12']
      },
      {
        id: 'lesson-4-b4-q3',
        bundleId: 'lesson-4-bundle-4',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'نزل',
        options: [
          { tr: 'ن ز ل', nl: 'ن ز ل', audioIds: lettersToAudioIds('ن ز ل') },
          { tr: 'ن ذ ل', nl: 'ن ذ ل', audioIds: lettersToAudioIds('ن ذ ل') },
          { tr: 'ن ز ر', nl: 'ن ز ر', audioIds: lettersToAudioIds('ن ز ر') }
        ],
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b4-q4',
        bundleId: 'lesson-4-bundle-4',
        type: 'true-false',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelime ve harfler eşleşiyor mu?',
          nl: 'Passen het woord en de letters bij elkaar?'
        },
        promptWord: 'درج',
        promptLetters: { text: 'د ر ك', audioIds: lettersToAudioIds('د ر ك') },
        options: [
          { tr: 'Evet', nl: 'Ja' },
          { tr: 'Hayır', nl: 'Nee' }
        ],
        correctAnswer: 1
      },
      {
        id: 'lesson-4-b4-q5',
        bundleId: 'lesson-4-bundle-4',
        type: 'drag-drop',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Kelimeyi doğru harflere sürükle.',
          nl: 'Sleep het woord naar de juiste letters.'
        },
        items: [
          { id: 'word-10', content: { tr: 'كلم', nl: 'كلم' } },
          { id: 'word-11', content: { tr: 'صدق', nl: 'صدق' } },
          { id: 'word-12', content: { tr: 'درج', nl: 'درج' } },
          { id: 'letter-10', content: { tr: 'ك ل م', nl: 'ك ل م' } },
          { id: 'letter-11', content: { tr: 'ص د ق', nl: 'ص د ق' } },
          { id: 'letter-12', content: { tr: 'د ر ج', nl: 'د ر ج' } }
        ],
        correctPairs: [
          { sourceId: 'word-10', targetId: 'letter-10' },
          { sourceId: 'word-11', targetId: 'letter-11' },
          { sourceId: 'word-12', targetId: 'letter-12' }
        ]
      },
      {
        id: 'lesson-4-b4-q6',
        bundleId: 'lesson-4-bundle-4',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu harflerden hangi kelime oluşur?',
          nl: 'Welk woord maak je met deze letters?'
        },
        promptLetters: { text: 'ك ل م', audioIds: lettersToAudioIds('ك ل م') },
        options: [
          { tr: 'كلم', nl: 'كلم' },
          { tr: 'كتب', nl: 'كتب' },
          { tr: 'خلق', nl: 'خلق' },
          { tr: 'قرب', nl: 'قرب' }
        ],
        shuffleOptions: true,
        correctAnswer: 0
      },
      {
        id: 'lesson-4-b4-q7',
        bundleId: 'lesson-4-bundle-4',
        type: 'multiple-choice',
        skill: 'letter-recognition-4',
        question: {
          tr: 'Bu kelimenin harflerini seç.',
          nl: 'Kies de losse letters van dit woord.'
        },
        promptWord: 'صدق',
        options: [
          { tr: 'ص د ق', nl: 'ص د ق', audioIds: lettersToAudioIds('ص د ق') },
          { tr: 'س د ق', nl: 'س د ق', audioIds: lettersToAudioIds('س د ق') },
          { tr: 'ص ذ ق', nl: 'ص ذ ق', audioIds: lettersToAudioIds('ص ذ ق') },
          { tr: 'ص د ك', nl: 'ص د ك', audioIds: lettersToAudioIds('ص د ك') }
        ],
        shuffleOptions: true,
        correctAnswer: 0
      }
    ];

    return {
      id: `lesson-${lessonNum}`,
      order: lessonNum,
      title: {
        tr: `Ders ${lessonNum}: Arapça harfler`,
        nl: `Les ${lessonNum}: Arabische letters`
      },
      skills: [
        `letter-recognition-${lessonNum}`,
        `letter-sound-${lessonNum}`,
        `letter-writing-${lessonNum}`
      ],
      content: {
        tr: `Bu derste 4. grup harfleri ve harf kombinasyonlarını pratik edeceğiz.`,
        nl: `In deze les oefenen we de 4e groep letters en combinaties.`
      },
      summary: {
        tr: `Harika! 4. dersi tamamladınız.`,
        nl: `Geweldig! Je hebt les 4 voltooid.`
      },
      quizzes: lesson4Quizzes
    };
  }
  
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
