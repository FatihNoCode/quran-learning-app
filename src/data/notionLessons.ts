import { ARABIC_LETTERS, getLetter, ArabicLetter } from './arabicLetters';

// Lesson content structure
export interface LessonContent {
  type: 'alphabet-detail' | 'letter-grid' | 'letter-practice' | 'letter-positions' | 'letter-connected' | 
        'letter-haraka' | 'haraka-practice';
  title: string; // Only Turkish as in original pages
  titleTranslations: { tr: string; nl: string };
  instruction: string; // Only Turkish as in original pages
  alphabetLetters: AlphabetLetter[];
  letterGroups: string[][]; // For grouped letter display
  items: LessonItem[];
  letterIds: string[]; // Reference to letter IDs in ARABIC_LETTERS
  color: string;
}

export interface LessonItem {
  arabic: string;
  transliteration: string;
  explanation: string;
}

export type AlphabetLetterType = 'normal' | 'heavy' | 'interdental' | 'heavy-interdental';

export interface AlphabetLetter {
  arabic: string;
  name: string; // Letter name (e.g., Alif, Bā’)
  pronunciation: { tr: string; nl: string }; // Letter pronunciation (favored/Classical)
  word: {
    pronunciation: { tr: string; nl: string }; // Word that starts with the letter
    translation: { tr: string; nl: string }; // Meaning of the example word
  };
  type: AlphabetLetterType;
  note: { tr: string; nl: string }; // Optional extra note for the letter type
}

export interface Lesson {
  id: string;
  order: number;
  level: string;
  content: LessonContent;
  quizzes: Quiz[];
}

// Quiz types
export type QuizType =
  | 'multiple-choice'
  | 'drag-drop'
  | 'listen-choose'
  | 'true-false'
  | 'order-sequence'
  | 'audio-mc'
  | 'timed-audio-mc'
  | 'error-detection'
  | 'production';

export interface Quiz {
  id: string;
  type: QuizType;
  skill: string;
  bundleId: string;
  bundleTitle: string;
  audioId: string;
  timeLimitSeconds: number;
  promptLetter: string;
  shuffleOptions: boolean;
  scoringDisabled: boolean;
  promptWord: string;
  promptAudioId?: string;
  promptMeaning?: {
    tr: string;
    nl: string;
  };
  question: {
    tr: string;
    nl: string;
  };
  options: {
    tr: string;
    nl: string;
  }[];
  correctAnswer: number;
  items: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
  }[];
  correctPairs: { sourceId: string; targetId: string }[];
  sequence: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
  }[];
  correctOrder: string[];
  audioUrl: string;
}

// Lesson 1: ARAP ALFABESİ (Arabic Alphabet)
const lesson1: Lesson = {
  id: 'lesson-1',
  order: 1,
  level: 'Sayfa 1',
  content: {
    type: 'alphabet-detail',
    title: 'Ders 1: Arap alfabesi',
    titleTranslations: {
      tr: 'Ders 1: Arap alfabesi',
      nl: 'Les 1: Arabisch alfabet'
    },
    instruction: 'Her harfi dikkatle inceleyin ve telaffuzunu öğrenin!',
    alphabetLetters: [
      {
        arabic: 'ا',
        name: 'Alif',
        pronunciation: { tr: 'alif (ā)', nl: 'alif (ā)' },
        word: {
          pronunciation: { tr: 'Allah', nl: 'Allah' },
          translation: { tr: 'Allah', nl: 'Allah / God' }
        },
        type: 'normal'
      },
      {
        arabic: 'ب',
        name: 'Bā\'',
        pronunciation: { tr: 'bā\' (b)', nl: 'bā\' (b)' },
        word: {
          pronunciation: { tr: 'bayt', nl: 'bayt' },
          translation: { tr: 'ev', nl: 'huis' }
        },
        type: 'normal'
      },
      {
        arabic: 'ت',
        name: 'Tā\'',
        pronunciation: { tr: 'tā\' (t)', nl: 'tā\' (t)' },
        word: {
          pronunciation: { tr: 'tawbah', nl: 'tawbah' },
          translation: { tr: 'tövbe', nl: 'berouw' }
        },
        type: 'normal'
      },
      {
        arabic: 'ث',
        name: 'Thā\'',
        pronunciation: { tr: 'thā\' (th)', nl: 'thā\' (th)' },
        word: {
          pronunciation: { tr: 'thalātha', nl: 'thalātha' },
          translation: { tr: 'üç', nl: 'drie' }
        },
        type: 'interdental'
      },
      {
        arabic: 'ج',
        name: 'Jīm',
        pronunciation: { tr: 'jīm (j)', nl: 'jīm (j)' },
        word: {
          pronunciation: { tr: 'jannah', nl: 'jannah' },
          translation: { tr: 'cennet', nl: 'paradijs' }
        },
        type: 'normal'
      },
      {
        arabic: 'ح',
        name: 'Ḥā\'',
        pronunciation: { tr: 'ḥā\' (ḥ)', nl: 'ḥā\' (ḥ)' },
        word: {
          pronunciation: { tr: 'hamd', nl: 'hamd' },
          translation: { tr: 'hamd (övgü)', nl: 'lof / prijzing' }
        },
        type: 'normal'
      },
      {
        arabic: 'خ',
        name: 'Khā\'',
        pronunciation: { tr: 'khā\' (kh)', nl: 'khā\' (kh)' },
        word: {
          pronunciation: { tr: 'khayr', nl: 'khayr' },
          translation: { tr: 'hayır / iyilik', nl: 'goedheid' }
        },
        type: 'heavy'
      },
      {
        arabic: 'د',
        name: 'Dāl',
        pronunciation: { tr: 'dāl (d)', nl: 'dāl (d)' },
        word: {
          pronunciation: { tr: 'dīn', nl: 'dīn' },
          translation: { tr: 'din', nl: 'religie / geloof' }
        },
        type: 'normal'
      },
      {
        arabic: 'ذ',
        name: 'Dhāl',
        pronunciation: { tr: 'dhāl (dh)', nl: 'dhāl (dh)' },
        word: {
          pronunciation: { tr: 'dhikr', nl: 'dhikr' },
          translation: { tr: 'zikir', nl: 'gedenken / gedachtenis' }
        },
        type: 'interdental'
      },
      {
        arabic: 'ر',
        name: 'Rā\'',
        pronunciation: { tr: 'rā\' (r)', nl: 'rā\' (r)' },
        word: {
          pronunciation: { tr: 'raḥmah', nl: 'raḥmah' },
          translation: { tr: 'rahmet', nl: 'barmhartigheid' }
        },
        type: 'normal'
      },
      {
        arabic: 'ز',
        name: 'Ze',
        pronunciation: { tr: 'ze (z)', nl: 'ze (z)' },
        word: {
          pronunciation: { tr: 'zakāh', nl: 'zakāh' },
          translation: { tr: 'zekât', nl: 'aalmoes / zakat' }
        },
        type: 'normal'
      },
      {
        arabic: 'س',
        name: 'Sīn',
        pronunciation: { tr: 'sīn (s)', nl: 'sīn (s)' },
        word: {
          pronunciation: { tr: 'salām', nl: 'salām' },
          translation: { tr: 'selam', nl: 'vrede' }
        },
        type: 'normal'
      },
      {
        arabic: 'ش',
        name: 'Shīn',
        pronunciation: { tr: 'shīn (sh)', nl: 'shīn (sh)' },
        word: {
          pronunciation: { tr: 'shams', nl: 'shams' },
          translation: { tr: 'güneş', nl: 'zon' }
        },
        type: 'normal'
      },
      {
        arabic: 'ص',
        name: 'Ṣād',
        pronunciation: { tr: 'ṣād (ṣ)', nl: 'ṣād (ṣ)' },
        word: {
          pronunciation: { tr: 'ṣalāh', nl: 'ṣalāh' },
          translation: { tr: 'namaz', nl: 'gebed' }
        },
        type: 'heavy'
      },
      {
        arabic: 'ض',
        name: 'Ḍād',
        pronunciation: { tr: 'ḍād (ḍ)', nl: 'ḍād (ḍ)' },
        word: {
          pronunciation: { tr: 'ḍuḥā', nl: 'ḍuḥā' },
          translation: { tr: 'duha', nl: 'ochtendlicht / vroege morgen' }
        },
        type: 'heavy'
      },
      {
        arabic: 'ط',
        name: 'Ṭā\'',
        pronunciation: { tr: 'Ṭā\' (ṭ)', nl: 'Ṭā\' (ṭ)' },
        word: {
          pronunciation: { tr: 'ṭayyib', nl: 'ṭayyib' },
          translation: { tr: 'temiz / iyi', nl: 'goed / puur' }
        },
        type: 'heavy'
      },
      {
        arabic: 'ظ',
        name: 'Ẓā\'',
        pronunciation: { tr: 'ẓā\' (ẓ)', nl: 'ẓā\' (ẓ)' },
        word: {
          pronunciation: { tr: 'zann', nl: 'zann' },
          translation: { tr: 'zan', nl: 'vermoeden / gedachte' }
        },
        type: 'heavy-interdental'
      },
      {
        arabic: 'ع',
        name: 'ʿAyn',
        pronunciation: { tr: 'ʿayn (ʿa)', nl: 'ʿayn (ʿa)' },
        word: {
          pronunciation: { tr: 'ʿilm', nl: 'ʿilm' },
          translation: { tr: 'ilim / bilgi', nl: 'kennis' }
        },
        type: 'normal'
      },
      {
        arabic: 'غ',
        name: 'Ghayn',
        pronunciation: { tr: 'ghayn (gh)', nl: 'ghayn (gh)' },
        word: {
          pronunciation: { tr: 'ghafūr', nl: 'ghafūr' },
          translation: { tr: 'çok bağışlayan', nl: 'zeer vergevend' }
        },
        type: 'heavy'
      },
      {
        arabic: 'ف',
        name: 'Fā\'',
        pronunciation: { tr: 'fā\' (f)', nl: 'fā\' (f)' },
        word: {
          pronunciation: { tr: 'fawz', nl: 'fawz' },
          translation: { tr: 'başarı / kurtuluş', nl: 'succes / overwinning' }
        },
        type: 'normal'
      },
      {
        arabic: 'ق',
        name: 'Qāf',
        pronunciation: { tr: 'Qāf (q)', nl: 'Qāf (q)' },
        word: {
          pronunciation: { tr: 'Qur’ān', nl: 'Qur’ān' },
          translation: { tr: 'Kur’an', nl: 'Koran' }
        },
        type: 'heavy'
      },
      {
        arabic: 'ك',
        name: 'Kāf',
        pronunciation: { tr: 'kāf (k)', nl: 'kāf (k)' },
        word: {
          pronunciation: { tr: 'kitāb', nl: 'kitāb' },
          translation: { tr: 'kitap', nl: 'boek' }
        },
        type: 'normal'
      },
      {
        arabic: 'ل',
        name: 'Lām',
        pronunciation: { tr: 'lām (l)', nl: 'lām (l)' },
        word: {
          pronunciation: { tr: 'layl', nl: 'layl' },
          translation: { tr: 'gece', nl: 'nacht' }
        },
        type: 'normal'
      },
      {
        arabic: 'م',
        name: 'Mīm',
        pronunciation: { tr: 'mīm (m)', nl: 'mīm (m)' },
        word: {
          pronunciation: { tr: 'Muḥammad', nl: 'Muḥammad' },
          translation: { tr: 'Muhammed (SAV)', nl: 'Mohammed (VZMH)' }
        },
        type: 'normal'
      },
      {
        arabic: 'ن',
        name: 'Nūn',
        pronunciation: { tr: 'nūn (n)', nl: 'nūn (n)' },
        word: {
          pronunciation: { tr: 'nās', nl: 'nās' },
          translation: { tr: 'insanlar', nl: 'mensen' }
        },
        type: 'normal'
      },
      {
        arabic: 'ه',
        name: 'Hā\'',
        pronunciation: { tr: 'hā\' (h)', nl: 'hā\' (h)' },
        word: {
          pronunciation: { tr: 'hudā', nl: 'hudā' },
          translation: { tr: 'hidayet', nl: 'leiding' }
        },
        type: 'normal'
      },
      {
        arabic: 'و',
        name: 'Wāw',
        pronunciation: { tr: 'wāw (w / ū)', nl: 'wāw (w / ū)' },
        word: {
          pronunciation: { tr: 'waḥy', nl: 'waḥy' },
          translation: { tr: 'vahiy', nl: 'openbaring' }
        },
        type: 'normal'
      },
      {
        arabic: 'ي',
        name: 'Yā\'',
        pronunciation: { tr: 'yā\' (y / ī)', nl: 'yā\' (y / ī)' },
        word: {
          pronunciation: { tr: 'yawm', nl: 'yawm' },
          translation: { tr: 'gün', nl: 'dag' }
        },
        type: 'normal'
      }
    ],
    color: '#10B981' // Green
  },


  quizzes: [
    // Bundle 1
    {
      id: 'l1-b1-q1',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'ba',
      shuffleOptions: true,
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b1-q2',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'ta (neutral)',
      shuffleOptions: true,
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b1-q3',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'nun',
      shuffleOptions: true,
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 2
    },
    {
      id: 'l1-b1-q4',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'sin',
      shuffleOptions: true,
      options: [
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ص', nl: 'ص' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b1-q5',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'shin',
      shuffleOptions: true,
      options: [
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ص', nl: 'ص' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b1-q6',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'sad',
      shuffleOptions: true,
      options: [
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ص', nl: 'ص' }
      ],
      correctAnswer: 2
    },
    {
      id: 'l1-b1-q7',
      bundleId: 'lesson-1-bundle-1',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'dhal',
      shuffleOptions: true,
      options: [
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ز', nl: 'ز' }
      ],
      correctAnswer: 1
    },

    // Bundle 2
    {
      id: 'l1-b2-q1',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'ze',
      shuffleOptions: true,
      options: [
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ز', nl: 'ز' }
      ],
      correctAnswer: 2
    },
    {
      id: 'l1-b2-q2',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'ha early',
      shuffleOptions: true,
      options: [
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'خ', nl: 'خ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b2-q3',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Hangi harfi duyuyorsun?',
        nl: 'Welke letter hoor je?'
      },
      audioId: 'kha',
      shuffleOptions: true,
      options: [
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'خ', nl: 'خ' }
      ],
      correctAnswer: 2
    },
    {
      id: 'l1-b2-q4',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'timed-audio-mc',
      timeLimitSeconds: 5,
      skill: 'fast-recognition',
      question: {
        tr: 'Duyduğun harfe dokun.',
        nl: 'Tik op de letter die je hoort.'
      },
      audioId: 'kaf',
      shuffleOptions: true,
      options: [
        { tr: 'ك', nl: 'ك' },
        { tr: 'ق', nl: 'ق' },
        { tr: 'ف', nl: 'ف' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b2-q5',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'timed-audio-mc',
      timeLimitSeconds: 5,
      skill: 'fast-recognition',
      question: {
        tr: 'Duyduğun harfe dokun.',
        nl: 'Tik op de letter die je hoort.'
      },
      audioId: 'qaf',
      shuffleOptions: true,
      options: [
        { tr: 'ك', nl: 'ك' },
        { tr: 'ق', nl: 'ق' },
        { tr: 'ف', nl: 'ف' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b2-q6',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'error-detection',
      skill: 'error-detection',
      question: {
        tr: 'Ses, gösterilen harfle aynı mı?',
        nl: 'Past het geluid bij de letter?'
      },
      promptLetter: 'س',
      audioId: 'shin',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b2-q7',
      bundleId: 'lesson-1-bundle-2',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Bu kelime hangi harfle başlıyor?',
        nl: 'Met welke letter begint dit woord?'
      },
      promptWord: 'ṭayyib',
      promptMeaning: { tr: 'temiz / iyi', nl: 'goed / puur' },
      audioId: 'ta (heavy)',
      shuffleOptions: true,
      options: [
        { tr: 'ط', nl: 'ط' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'د', nl: 'د' }
      ],
      correctAnswer: 0
    },

    // Bundle 3
    {
      id: 'l1-b3-q1',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harfe sürükle.', nl: 'Sleep het woord naar de juiste letter.' },
      items: [
        { id: 'word-salam', content: { tr: 'salām', nl: 'salām' }, audioId: 'sin' },
        { id: 'word-shams', content: { tr: 'shams', nl: 'shams' }, audioId: 'shin' },
        { id: 'word-salah', content: { tr: 'ṣalāh', nl: 'ṣalāh' }, audioId: 'sad' },
        { id: 'letter-sin', content: { tr: 'س', nl: 'س' } },
        { id: 'letter-shin', content: { tr: 'ش', nl: 'ش' } },
        { id: 'letter-sad', content: { tr: 'ص', nl: 'ص' } }
      ],
      correctPairs: [
        { sourceId: 'word-salam', targetId: 'letter-sin' },
        { sourceId: 'word-shams', targetId: 'letter-shin' },
        { sourceId: 'word-salah', targetId: 'letter-sad' }
      ]
    },
    {
      id: 'l1-b3-q2',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'salām',
      promptMeaning: { tr: 'selam / barış', nl: 'vrede' },
      audioId: 'sin',
      shuffleOptions: true,
      options: [
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ص', nl: 'ص' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b3-q3',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'timed-audio-mc',
      timeLimitSeconds: 5,
      skill: 'fast-recognition',
      question: { tr: 'Duyduğun harfe dokun.', nl: 'Tik op de letter die je hoort.' },
      promptWord: 'qur’ān',
      promptMeaning: { tr: 'Kur’an', nl: 'Koran' },
      audioId: 'qaf',
      shuffleOptions: true,
      options: [
        { tr: 'ك', nl: 'ك' },
        { tr: 'ق', nl: 'ق' },
        { tr: 'ف', nl: 'ف' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b3-q4',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, bu kelimenin ilk harfiyle aynı mı?', nl: 'Past het geluid bij de eerste letter van dit woord?' },
      promptWord: 'kitāb',
      promptMeaning: { tr: 'kitap', nl: 'boek' },
      audioId: 'qaf',
      promptAudioId: 'kaf',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b3-q5',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'dhikr',
      promptMeaning: { tr: 'zikir / anma', nl: 'gedenken / herinnering' },
      audioId: 'dhal',
      shuffleOptions: true,
      options: [
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ز', nl: 'ز' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b3-q6',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harfe sürükle.', nl: 'Sleep het woord naar de juiste letter.' },
      items: [
        { id: 'word-bayt', content: { tr: 'bayt', nl: 'bayt' }, audioId: 'ba' },
        { id: 'word-tawbah', content: { tr: 'tawbah', nl: 'tawbah' }, audioId: 'ta (neutral)' },
        { id: 'word-nas', content: { tr: 'nās', nl: 'nās' }, audioId: 'nun' },
        { id: 'letter-ba', content: { tr: 'ب', nl: 'ب' } },
        { id: 'letter-ta', content: { tr: 'ت', nl: 'ت' } },
        { id: 'letter-nun', content: { tr: 'ن', nl: 'ن' } }
      ],
      correctPairs: [
        { sourceId: 'word-bayt', targetId: 'letter-ba' },
        { sourceId: 'word-tawbah', targetId: 'letter-ta' },
        { sourceId: 'word-nas', targetId: 'letter-nun' }
      ]
    },
    {
      id: 'l1-b3-q7',
      bundleId: 'lesson-1-bundle-3',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'bayt',
      promptMeaning: { tr: 'ev', nl: 'huis' },
      audioId: 'ba',
      shuffleOptions: true,
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 0
    },

    // Bundle 4
    {
      id: 'l1-b4-q1',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'hamd',
      promptMeaning: { tr: 'övgü / hamd', nl: 'lof / prijzing' },
      audioId: 'ha early',
      shuffleOptions: true,
      options: [
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'خ', nl: 'خ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b4-q2',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'hudā',
      promptMeaning: { tr: 'hidayet', nl: 'leiding' },
      audioId: 'ha later',
      shuffleOptions: true,
      options: [
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'خ', nl: 'خ' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b4-q3',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'khayr',
      promptMeaning: { tr: 'hayır / iyilik', nl: 'goedheid' },
      audioId: 'kha',
      shuffleOptions: true,
      options: [
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'خ', nl: 'خ' }
      ],
      correctAnswer: 2
    },
    {
      id: 'l1-b4-q4',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'timed-audio-mc',
      timeLimitSeconds: 5,
      skill: 'fast-recognition',
      question: { tr: 'Duyduğun harfe dokun.', nl: 'Tik op de letter die je hoort.' },
      promptWord: 'ghafūr',
      promptMeaning: { tr: 'çok bağışlayan', nl: 'zeer vergevend' },
      audioId: 'ghayn',
      shuffleOptions: true,
      options: [
        { tr: 'ع', nl: 'ع' },
        { tr: 'غ', nl: 'غ' },
        { tr: 'ق', nl: 'ق' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l1-b4-q5',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, bu kelimenin ilk harfiyle aynı mı?', nl: 'Past het geluid bij de eerste letter van dit woord?' },
      promptWord: 'ʿilm',
      promptMeaning: { tr: 'ilim / bilgi', nl: 'kennis' },
      audioId: 'ayn',
      promptAudioId: 'ayn',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b4-q6',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'timed-audio-mc',
      timeLimitSeconds: 5,
      skill: 'fast-recognition',
      question: { tr: 'Duyduğun harfe dokun.', nl: 'Tik op de letter die je hoort.' },
      promptWord: 'yawm',
      promptMeaning: { tr: 'gün', nl: 'dag' },
      audioId: 'ya',
      shuffleOptions: true,
      options: [
        { tr: 'ي', nl: 'ي' },
        { tr: 'و', nl: 'و' },
        { tr: 'ا', nl: 'ا' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l1-b4-q7',
      bundleId: 'lesson-1-bundle-4',
      bundleTitle: 'Lesson 1',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: {
        tr: 'Bu kelime hangi harfle başlıyor?',
        nl: 'Met welke letter begint dit woord?'
      },
      promptWord: 'ṣalāh',
      promptMeaning: { tr: 'namaz', nl: 'gebed' },
      audioId: 'sad',
      shuffleOptions: true,
      options: [
        { tr: 'ص', nl: 'ص' },
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' }
      ],
      correctAnswer: 0
    },
  ],
};

// Lesson 2: Harfleri karışık şekilde okuyalım (Read letters in mixed order)
const lesson2: Lesson = {
  id: 'lesson-2',
  order: 2,
  level: 'Sayfa 2',
  content: {
    ...lesson1.content,
    title: 'Ders 2: alfabe farklı sırada',
    titleTranslations: {
      tr: 'Ders 2: alfabe farklı sırada',
      nl: 'Les 2: alfabet in andere volgorde'
    },
    // Shuffled order (deterministic) so Lesson 2 isn’t alphabetical
    alphabetLetters: [
      lesson1.content.alphabetLetters[5],
      lesson1.content.alphabetLetters[0],
      lesson1.content.alphabetLetters[12],
      lesson1.content.alphabetLetters[3],
      lesson1.content.alphabetLetters[8],
      lesson1.content.alphabetLetters[17],
      lesson1.content.alphabetLetters[21],
      lesson1.content.alphabetLetters[1],
      lesson1.content.alphabetLetters[14],
      lesson1.content.alphabetLetters[9],
      lesson1.content.alphabetLetters[10],
      lesson1.content.alphabetLetters[6],
      lesson1.content.alphabetLetters[22],
      lesson1.content.alphabetLetters[2],
      lesson1.content.alphabetLetters[4],
      lesson1.content.alphabetLetters[7],
      lesson1.content.alphabetLetters[11],
      lesson1.content.alphabetLetters[15],
      lesson1.content.alphabetLetters[13],
      lesson1.content.alphabetLetters[16],
      lesson1.content.alphabetLetters[18],
      lesson1.content.alphabetLetters[19],
      lesson1.content.alphabetLetters[20],
      lesson1.content.alphabetLetters[23],
      lesson1.content.alphabetLetters[24],
      lesson1.content.alphabetLetters[25],
      lesson1.content.alphabetLetters[26],
      lesson1.content.alphabetLetters[27]
    ]
  },
  quizzes: [
    // Bundle 1
    {
      id: 'l2-b1-q1',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'ta (neutral)',
      shuffleOptions: true,
      options: [
        { tr: 'ت', nl: 'ت' },
        { tr: 'ط', nl: 'ط' },
        { tr: 'ث', nl: 'ث' },
        { tr: 'د', nl: 'د' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b1-q2',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'ha early',
      shuffleOptions: true,
      options: [
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'خ', nl: 'خ' },
        { tr: 'ع', nl: 'ع' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b1-q3',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'ghafūr',
      promptMeaning: { tr: 'çok bağışlayan', nl: 'zeer vergevend' },
      audioId: 'ghayn',
      shuffleOptions: true,
      options: [
        { tr: 'غ', nl: 'غ' },
        { tr: 'ع', nl: 'ع' },
        { tr: 'ق', nl: 'ق' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b1-q4',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, gösterilen harfle aynı mı?', nl: 'Past het geluid bij de letter?' },
      promptLetter: 'ط',
      audioId: 'ta (neutral)',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l2-b1-q5',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'timed-audio-mc',
      timeLimitSeconds: 5,
      skill: 'fast-recognition',
      question: { tr: 'Duyduğun harfe dokun.', nl: 'Tik op de letter die je hoort.' },
      audioId: 'qaf',
      shuffleOptions: true,
      options: [
        { tr: 'ق', nl: 'ق' },
        { tr: 'ك', nl: 'ك' },
        { tr: 'ف', nl: 'ف' },
        { tr: 'غ', nl: 'غ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b1-q6',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harfe sürükle.', nl: 'Sleep het woord naar de juiste letter.' },
      items: [
        { id: 'word-kitab', content: { tr: 'kitāb', nl: 'kitāb' }, audioId: 'kaf' },
        { id: 'word-quran', content: { tr: 'qur’ān', nl: 'qur’ān' }, audioId: 'qaf' },
        { id: 'word-fawz', content: { tr: 'fawz', nl: 'fawz' }, audioId: 'fa' },
        { id: 'word-ghafur', content: { tr: 'ghafūr', nl: 'ghafūr' }, audioId: 'ghayn' },
        { id: 'letter-kaf', content: { tr: 'ك', nl: 'ك' } },
        { id: 'letter-qaf', content: { tr: 'ق', nl: 'ق' } },
        { id: 'letter-fa', content: { tr: 'ف', nl: 'ف' } },
        { id: 'letter-ghayn', content: { tr: 'غ', nl: 'غ' } }
      ],
      correctPairs: [
        { sourceId: 'word-kitab', targetId: 'letter-kaf' },
        { sourceId: 'word-quran', targetId: 'letter-qaf' },
        { sourceId: 'word-fawz', targetId: 'letter-fa' },
        { sourceId: 'word-ghafur', targetId: 'letter-ghayn' }
      ]
    },
    {
      id: 'l2-b1-q7',
      bundleId: 'lesson-2-bundle-1',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'Allah',
      promptMeaning: { tr: 'Allah', nl: 'Allah / God' },
      audioId: 'alif',
      shuffleOptions: true,
      options: [
        { tr: 'ا', nl: 'ا' },
        { tr: 'و', nl: 'و' },
        { tr: 'ي', nl: 'ي' },
        { tr: 'ع', nl: 'ع' }
      ],
      correctAnswer: 0
    },

    // Bundle 2
    {
      id: 'l2-b2-q1',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'sad',
      shuffleOptions: true,
      options: [
        { tr: 'ص', nl: 'ص' },
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ض', nl: 'ض' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b2-q2',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'dad',
      shuffleOptions: true,
      options: [
        { tr: 'ض', nl: 'ض' },
        { tr: 'ص', nl: 'ص' },
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b2-q3',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'dhikr',
      promptMeaning: { tr: 'zikir / anma', nl: 'gedenken / herinnering' },
      audioId: 'dhal',
      shuffleOptions: true,
      options: [
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'د', nl: 'د' },
        { tr: 'ز', nl: 'ز' },
        { tr: 'ض', nl: 'ض' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b2-q4',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, bu kelimenin ilk harfiyle aynı mı?', nl: 'Past het geluid bij de eerste letter van dit woord?' },
      promptWord: 'zakāh',
      promptMeaning: { tr: 'zekât', nl: 'aalmoes / zakat' },
      audioId: 'sin',
      promptAudioId: 'ze',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l2-b2-q5',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'za',
      shuffleOptions: true,
      options: [
        { tr: 'ظ', nl: 'ظ' },
        { tr: 'ز', nl: 'ز' },
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ض', nl: 'ض' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b2-q6',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harfe sürükle.', nl: 'Sleep het woord naar de juiste letter.' },
      items: [
        { id: 'word-salam', content: { tr: 'salām', nl: 'salām' }, audioId: 'sin' },
        { id: 'word-shams', content: { tr: 'shams', nl: 'shams' }, audioId: 'shin' },
        { id: 'word-salah', content: { tr: 'ṣalāh', nl: 'ṣalāh' }, audioId: 'sad' },
        { id: 'word-duha', content: { tr: 'ḍuḥā', nl: 'ḍuḥā' }, audioId: 'dad' },
        { id: 'letter-sin', content: { tr: 'س', nl: 'س' } },
        { id: 'letter-shin', content: { tr: 'ش', nl: 'ش' } },
        { id: 'letter-sad', content: { tr: 'ص', nl: 'ص' } },
        { id: 'letter-dad', content: { tr: 'ض', nl: 'ض' } }
      ],
      correctPairs: [
        { sourceId: 'word-salam', targetId: 'letter-sin' },
        { sourceId: 'word-shams', targetId: 'letter-shin' },
        { sourceId: 'word-salah', targetId: 'letter-sad' },
        { sourceId: 'word-duha', targetId: 'letter-dad' }
      ]
    },
    {
      id: 'l2-b2-q7',
      bundleId: 'lesson-2-bundle-2',
      bundleTitle: 'Lesson 2',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, gösterilen harfle aynı mı?', nl: 'Past het geluid bij de letter?' },
      promptLetter: 'ث',
      audioId: 'ta (neutral)',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },

    // Bundle 3
    {
      id: 'l2-b3-q1',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'ayn',
      shuffleOptions: true,
      options: [
        { tr: 'ع', nl: 'ع' },
        { tr: 'غ', nl: 'غ' },
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b3-q2',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'ʿilm',
      promptMeaning: { tr: 'ilim / bilgi', nl: 'kennis' },
      audioId: 'ayn',
      shuffleOptions: true,
      options: [
        { tr: 'ع', nl: 'ع' },
        { tr: 'غ', nl: 'غ' },
        { tr: 'ق', nl: 'ق' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b3-q3',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'ya',
      shuffleOptions: true,
      options: [
        { tr: 'ي', nl: 'ي' },
        { tr: 'و', nl: 'و' },
        { tr: 'ا', nl: 'ا' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b3-q4',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, bu kelimenin ilk harfiyle aynı mı?', nl: 'Past het geluid bij de eerste letter van dit woord?' },
      promptWord: 'waḥy',
      promptMeaning: { tr: 'vahiy', nl: 'openbaring' },
      audioId: 'ya',
      promptAudioId: 'waw',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l2-b3-q5',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'waw',
      shuffleOptions: true,
      options: [
        { tr: 'و', nl: 'و' },
        { tr: 'ي', nl: 'ي' },
        { tr: 'ا', nl: 'ا' },
        { tr: 'ل', nl: 'ل' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b3-q6',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harfe sürükle.', nl: 'Sleep het woord naar de juiste letter.' },
      items: [
        { id: 'word-yawm', content: { tr: 'yawm', nl: 'yawm' }, audioId: 'ya' },
        { id: 'word-wahy', content: { tr: 'waḥy', nl: 'waḥy' }, audioId: 'waw' },
        { id: 'word-allah', content: { tr: 'Allah', nl: 'Allah' }, audioId: 'alif' },
        { id: 'word-nas', content: { tr: 'nās', nl: 'nās' }, audioId: 'nun' },
        { id: 'letter-ya', content: { tr: 'ي', nl: 'ي' } },
        { id: 'letter-waw', content: { tr: 'و', nl: 'و' } },
        { id: 'letter-alif', content: { tr: 'ا', nl: 'ا' } },
        { id: 'letter-nun', content: { tr: 'ن', nl: 'ن' } }
      ],
      correctPairs: [
        { sourceId: 'word-yawm', targetId: 'letter-ya' },
        { sourceId: 'word-wahy', targetId: 'letter-waw' },
        { sourceId: 'word-allah', targetId: 'letter-alif' },
        { sourceId: 'word-nas', targetId: 'letter-nun' }
      ]
    },
    {
      id: 'l2-b3-q7',
      bundleId: 'lesson-2-bundle-3',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'lam',
      shuffleOptions: true,
      options: [
        { tr: 'ل', nl: 'ل' },
        { tr: 'م', nl: 'م' },
        { tr: 'ن', nl: 'ن' },
        { tr: 'ر', nl: 'ر' }
      ],
      correctAnswer: 0
    },

    // Bundle 4
    {
      id: 'l2-b4-q1',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'jim',
      shuffleOptions: true,
      options: [
        { tr: 'ج', nl: 'ج' },
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ز', nl: 'ز' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b4-q2',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'jannah',
      promptMeaning: { tr: 'cennet', nl: 'paradijs' },
      audioId: 'jim',
      shuffleOptions: true,
      options: [
        { tr: 'ج', nl: 'ج' },
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ز', nl: 'ز' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b4-q3',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'mim',
      shuffleOptions: true,
      options: [
        { tr: 'م', nl: 'م' },
        { tr: 'ن', nl: 'ن' },
        { tr: 'ل', nl: 'ل' },
        { tr: 'ر', nl: 'ر' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b4-q4',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, gösterilen harfle aynı mı?', nl: 'Past het geluid bij de letter?' },
      promptLetter: 'ر',
      audioId: 'lam',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l2-b4-q5',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'raḥmah',
      promptMeaning: { tr: 'rahmet', nl: 'barmhartigheid' },
      audioId: 'ra',
      shuffleOptions: true,
      options: [
        { tr: 'ر', nl: 'ر' },
        { tr: 'ل', nl: 'ل' },
        { tr: 'ن', nl: 'ن' },
        { tr: 'م', nl: 'م' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2-b4-q6',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harfe sürükle.', nl: 'Sleep het woord naar de juiste letter.' },
      items: [
        { id: 'word-layl', content: { tr: 'layl', nl: 'layl' }, audioId: 'lam' },
        { id: 'word-muhammad', content: { tr: 'muḥammad', nl: 'muḥammad' }, audioId: 'mim' },
        { id: 'word-nas', content: { tr: 'nās', nl: 'nās' }, audioId: 'nun' },
        { id: 'word-rahmah', content: { tr: 'raḥmah', nl: 'raḥmah' }, audioId: 'ra' },
        { id: 'letter-lam', content: { tr: 'ل', nl: 'ل' } },
        { id: 'letter-mim', content: { tr: 'م', nl: 'م' } },
        { id: 'letter-nun', content: { tr: 'ن', nl: 'ن' } },
        { id: 'letter-ra', content: { tr: 'ر', nl: 'ر' } }
      ],
      correctPairs: [
        { sourceId: 'word-layl', targetId: 'letter-lam' },
        { sourceId: 'word-muhammad', targetId: 'letter-mim' },
        { sourceId: 'word-nas', targetId: 'letter-nun' },
        { sourceId: 'word-rahmah', targetId: 'letter-ra' }
      ]
    },
    {
      id: 'l2-b4-q7',
      bundleId: 'lesson-2-bundle-4',
      bundleTitle: 'Lesson 2',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Bu kelime hangi harfle başlıyor?', nl: 'Met welke letter begint dit woord?' },
      promptWord: 'khayr',
      promptMeaning: { tr: 'hayır / iyilik', nl: 'goedheid' },
      audioId: 'kha',
      shuffleOptions: true,
      options: [
        { tr: 'خ', nl: 'خ' },
        { tr: 'ح', nl: 'ح' },
        { tr: 'ه', nl: 'ه' },
        { tr: 'غ', nl: 'غ' }
      ],
      correctAnswer: 0
    }
  ]
};

// Lesson 3: Harf Biçimleri (Letter Forms)
const lesson3: Lesson = {
  id: 'lesson-3',
  order: 3,
  level: 'Sayfa 3',
  content: {
    ...lesson1.content,
    title: 'Ders 3: Harf biçimleri',
    titleTranslations: {
      tr: 'Ders 3: Harf biçimleri',
      nl: 'Les 3: Lettervormen'
    },
    instruction: 'Harflerin baş, orta ve son hallerini ve bağlanmalarını inceleyin!',
    alphabetLetters: [...(lesson1.content.alphabetLetters || [])],
    letterGroups: lesson1.content.letterGroups ? [...lesson1.content.letterGroups] : lesson1.content.letterGroups,
    items: lesson1.content.items ? [...lesson1.content.items] : lesson1.content.items
  },
  quizzes: [
    // Bundle 1
    {
      id: 'l3-b1-q1',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin normal hâli hangisi?', nl: 'Welke is de normale vorm van deze letter?' },
      promptLetter: 'بـ',
      shuffleOptions: true,
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b1-q2',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin baştaki hâli hangisi?', nl: 'Welke is de beginvorm van deze letter?' },
      promptLetter: 'ب',
      shuffleOptions: true,
      options: [
        { tr: 'بـ', nl: 'بـ' },
        { tr: 'ـب', nl: 'ـب' },
        { tr: 'ـبـ', nl: 'ـبـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b1-q3',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin ortadaki hâli hangisi?', nl: 'Welke is de middenvorm van deze letter?' },
      promptLetter: 'ت',
      shuffleOptions: true,
      options: [
        { tr: 'تـ', nl: 'تـ' },
        { tr: 'ـتـ', nl: 'ـتـ' },
        { tr: 'ـت', nl: 'ـت' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l3-b1-q4',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin sondaki hâli hangisi?', nl: 'Welke is de eindvorm van deze letter?' },
      promptLetter: 'ث',
      shuffleOptions: true,
      options: [
        { tr: 'ـث', nl: 'ـث' },
        { tr: 'ـثـ', nl: 'ـثـ' },
        { tr: 'ثـ', nl: 'ثـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b1-q5',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'sin',
      shuffleOptions: true,
      options: [
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ص', nl: 'ص' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b1-q6',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'word-start',
      question: { tr: 'Bu kelime hangi harfle başlıyor? (baştaki şekli seç)', nl: 'Met welke letter begint dit woord? (kies de beginvorm)' },
      promptWord: 'salām',
      promptMeaning: { tr: 'selam', nl: 'groet' },
      audioId: 'sin',
      shuffleOptions: true,
      options: [
        { tr: 'سـ', nl: 'سـ' },
        { tr: 'شـ', nl: 'شـ' },
        { tr: 'صـ', nl: 'صـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b1-q7',
      bundleId: 'lesson-3-bundle-1',
      bundleTitle: 'Lesson 3',
      type: 'drag-drop',
      skill: 'form-matching',
      question: { tr: 'Harfi doğru kutuya sürükle.', nl: 'Sleep de letter naar het juiste vak.' },
      items: [
        { id: 'word-ba', content: { tr: 'ب', nl: 'ب' } },
        { id: 'word-ta', content: { tr: 'ت', nl: 'ت' } },
        { id: 'letter-normal', content: { tr: 'Normal (ب)', nl: 'Normaal (ب)' } },
        { id: 'letter-begin', content: { tr: 'Baş (تـ)', nl: 'Begin (تـ)' } }
      ],
      correctPairs: [
        { sourceId: 'word-ba', targetId: 'letter-normal' },
        { sourceId: 'word-ta', targetId: 'letter-begin' }
      ]
    },

    // Bundle 2
    {
      id: 'l3-b2-q1',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin baştaki hâli hangisi?', nl: 'Welke is de beginvorm?' },
      promptLetter: 'ن',
      shuffleOptions: true,
      options: [
        { tr: 'نـ', nl: 'نـ' },
        { tr: 'ـنـ', nl: 'ـنـ' },
        { tr: 'ـن', nl: 'ـن' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b2-q2',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin ortadaki hâli hangisi?', nl: 'Welke is de middenvorm?' },
      promptLetter: 'م',
      shuffleOptions: true,
      options: [
        { tr: 'مـ', nl: 'مـ' },
        { tr: 'ـمـ', nl: 'ـمـ' },
        { tr: 'ـم', nl: 'ـم' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l3-b2-q3',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin sondaki hâli hangisi?', nl: 'Welke is de eindvorm?' },
      promptLetter: 'ل',
      shuffleOptions: true,
      options: [
        { tr: 'ـل', nl: 'ـل' },
        { tr: 'ـلـ', nl: 'ـلـ' },
        { tr: 'لـ', nl: 'لـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b2-q4',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harf ortada nasıl yazılır?', nl: 'Hoe schrijf je deze letter in het midden?' },
      promptLetter: 'د',
      shuffleOptions: true,
      options: [
        { tr: 'ـد', nl: 'ـد' },
        { tr: 'ـدـ', nl: 'ـدـ' },
        { tr: 'ر', nl: 'ر' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b2-q5',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'word-start',
      question: { tr: 'Bu kelimenin ilk harfi hangisi?', nl: 'Wat is de eerste letter van dit woord?' },
      promptWord: 'bayt',
      promptMeaning: { tr: 'ev', nl: 'huis' },
      audioId: 'ba',
      shuffleOptions: true,
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ن', nl: 'ن' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b2-q6',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'form-recognition',
      question: { tr: 'Duyduğun harfin baştaki hâlini seç.', nl: 'Kies de beginvorm van de letter die je hoort.' },
      audioId: 'kaf',
      shuffleOptions: true,
      options: [
        { tr: 'كـ', nl: 'كـ' },
        { tr: 'قـ', nl: 'قـ' },
        { tr: 'فـ', nl: 'فـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b2-q7',
      bundleId: 'lesson-3-bundle-2',
      bundleTitle: 'Lesson 3',
      type: 'drag-drop',
      skill: 'form-matching',
      question: { tr: 'Şekli doğru yere sürükle.', nl: 'Sleep de vorm naar de juiste plek.' },
      items: [
        { id: 'word-begin', content: { tr: 'بـ', nl: 'بـ' } },
        { id: 'word-middle', content: { tr: 'ـبـ', nl: 'ـبـ' } },
        { id: 'word-end', content: { tr: 'ـب', nl: 'ـب' } },
        { id: 'letter-begin', content: { tr: 'Baş', nl: 'Begin' } },
        { id: 'letter-middle', content: { tr: 'Orta', nl: 'Midden' } },
        { id: 'letter-end', content: { tr: 'Son', nl: 'Eind' } }
      ],
      correctPairs: [
        { sourceId: 'word-begin', targetId: 'letter-begin' },
        { sourceId: 'word-middle', targetId: 'letter-middle' },
        { sourceId: 'word-end', targetId: 'letter-end' }
      ]
    },

    // Bundle 3
    {
      id: 'l3-b3-q1',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Ortadaki doğru şekli seç.', nl: 'Kies de juiste middenvorm.' },
      promptLetter: 'س',
      shuffleOptions: true,
      options: [
        { tr: 'ـسـ', nl: 'ـسـ' },
        { tr: 'ـشـ', nl: 'ـشـ' },
        { tr: 'ـصـ', nl: 'ـصـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b3-q2',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Baştaki doğru şekli seç.', nl: 'Kies de juiste beginvorm.' },
      promptLetter: 'ش',
      shuffleOptions: true,
      options: [
        { tr: 'شـ', nl: 'شـ' },
        { tr: 'سـ', nl: 'سـ' },
        { tr: 'صـ', nl: 'صـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b3-q3',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'word-start',
      question: { tr: 'Bu kelime hangi harfle başlıyor? (baştaki şekli seç)', nl: 'Met welke letter begint dit woord? (kies de beginvorm)' },
      promptWord: 'ṣalāh',
      promptMeaning: { tr: 'namaz', nl: 'gebed' },
      audioId: 'sad',
      shuffleOptions: true,
      options: [
        { tr: 'صـ', nl: 'صـ' },
        { tr: 'سـ', nl: 'سـ' },
        { tr: 'شـ', nl: 'شـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b3-q4',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'form-recognition',
      question: { tr: 'Duyduğun harfin sondaki hâlini seç.', nl: 'Kies de eindvorm van de letter die je hoort.' },
      audioId: 'ra',
      shuffleOptions: true,
      options: [
        { tr: 'ـر', nl: 'ـر' },
        { tr: 'ـز', nl: 'ـز' },
        { tr: 'ـذ', nl: 'ـذ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b3-q5',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'position-recognition',
      question: { tr: 'Bu şekil hangi konumda kullanılır?', nl: 'In welke positie gebruik je deze vorm?' },
      promptLetter: 'ـمـ',
      shuffleOptions: true,
      options: [
        { tr: 'Başta', nl: 'Begin' },
        { tr: 'Ortada', nl: 'Midden' },
        { tr: 'Sonda', nl: 'Eind' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l3-b3-q6',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'drag-drop',
      skill: 'word-to-form',
      question: { tr: 'Kelimeyi doğru harf şekline sürükle.', nl: 'Sleep het woord naar de juiste lettervorm.' },
      items: [
        { id: 'word-quran', content: { tr: 'qur’ān', nl: 'qur’ān' }, audioId: 'qaf' },
        { id: 'word-fawz', content: { tr: 'fawz', nl: 'fawz' }, audioId: 'fa' },
        { id: 'word-kitab', content: { tr: 'kitāb', nl: 'kitāb' }, audioId: 'kaf' },
        { id: 'letter-qaf-begin', content: { tr: 'قـ', nl: 'قـ' } },
        { id: 'letter-fa-begin', content: { tr: 'فـ', nl: 'فـ' } },
        { id: 'letter-kaf-begin', content: { tr: 'كـ', nl: 'كـ' } }
      ],
      correctPairs: [
        { sourceId: 'word-quran', targetId: 'letter-qaf-begin' },
        { sourceId: 'word-fawz', targetId: 'letter-fa-begin' },
        { sourceId: 'word-kitab', targetId: 'letter-kaf-begin' }
      ]
    },
    {
      id: 'l3-b3-q7',
      bundleId: 'lesson-3-bundle-3',
      bundleTitle: 'Lesson 3',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Bu şekil bu harfe ait mi?', nl: 'Hoort deze vorm bij deze letter?' },
      promptLetter: 'ن',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1,
      promptWord: 'Şekil: ـمـ',
      audioId: '',
      promptAudioId: ''
    },

    // Bundle 4
    {
      id: 'l3-b4-q1',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin baştaki hâli hangisi?', nl: 'Welke is de beginvorm?' },
      promptLetter: 'و',
      shuffleOptions: true,
      options: [
        { tr: 'و', nl: 'و' },
        { tr: 'ـو', nl: 'ـو' },
        { tr: 'ـوـ', nl: 'ـوـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b4-q2',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin ortadaki hâli hangisi?', nl: 'Welke is de middenvorm?' },
      promptLetter: 'ا',
      shuffleOptions: true,
      options: [
        { tr: 'ـا', nl: 'ـا' },
        { tr: 'ـاـ', nl: 'ـاـ' },
        { tr: 'ا', nl: 'ا' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b4-q3',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'form-recognition',
      question: { tr: 'Bu kelimenin ilk harfinin sondaki hâlini seç.', nl: 'Kies de eindvorm van de eerste letter van dit woord.' },
      promptWord: 'dhikr',
      promptMeaning: { tr: 'zikir', nl: 'gedenken' },
      audioId: 'dhal',
      shuffleOptions: true,
      options: [
        { tr: 'ـذ', nl: 'ـذ' },
        { tr: 'ـز', nl: 'ـز' },
        { tr: 'ـد', nl: 'ـد' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b4-q4',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'form-recognition',
      question: { tr: 'Duyduğun harfin ortadaki hâlini seç.', nl: 'Kies de middenvorm van de letter die je hoort.' },
      audioId: 'ayn',
      shuffleOptions: true,
      options: [
        { tr: 'ـعـ', nl: 'ـعـ' },
        { tr: 'ـغـ', nl: 'ـغـ' },
        { tr: 'ـحـ', nl: 'ـحـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b4-q5',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'position-recognition',
      question: { tr: 'Bu şekil hangi konumda kullanılır?', nl: 'In welke positie gebruik je deze vorm?' },
      promptLetter: 'ـي',
      shuffleOptions: true,
      options: [
        { tr: 'Başta', nl: 'Begin' },
        { tr: 'Ortada', nl: 'Midden' },
        { tr: 'Sonda', nl: 'Eind' }
      ],
      correctAnswer: 2
    },
    {
      id: 'l3-b4-q6',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'drag-drop',
      skill: 'form-matching',
      question: { tr: 'Şekli doğru konuma sürükle.', nl: 'Sleep de vorm naar de juiste positie.' },
      items: [
        { id: 'word-begin', content: { tr: 'كـ', nl: 'كـ' } },
        { id: 'word-middle', content: { tr: 'ـكـ', nl: 'ـكـ' } },
        { id: 'word-end', content: { tr: 'ـك', nl: 'ـك' } },
        { id: 'letter-begin', content: { tr: 'Baş', nl: 'Begin' } },
        { id: 'letter-middle', content: { tr: 'Orta', nl: 'Midden' } },
        { id: 'letter-end', content: { tr: 'Son', nl: 'Eind' } }
      ],
      correctPairs: [
        { sourceId: 'word-begin', targetId: 'letter-begin' },
        { sourceId: 'word-middle', targetId: 'letter-middle' },
        { sourceId: 'word-end', targetId: 'letter-end' }
      ]
    },
    {
      id: 'l3-b4-q7',
      bundleId: 'lesson-3-bundle-4',
      bundleTitle: 'Lesson 3',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Ses, bu kelimenin ilk harfiyle aynı mı?', nl: 'Past het geluid bij de eerste letter van dit woord?' },
      promptWord: 'waḥy',
      promptMeaning: { tr: 'vahiy', nl: 'openbaring' },
      audioId: 'ya',
      promptAudioId: 'waw',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },

    // Bundle 5
    {
      id: 'l3-b5-q1',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin doğru şekillerini seç.', nl: 'Kies de juiste vormen van deze letter.' },
      promptLetter: 'ب',
      shuffleOptions: true,
      options: [
        { tr: 'بـ / ـبـ / ـب', nl: 'بـ / ـبـ / ـب' },
        { tr: 'بـ / ـنـ / ـن', nl: 'بـ / ـنـ / ـن' },
        { tr: 'تـ / ـتـ / ـت', nl: 'تـ / ـتـ / ـت' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b5-q2',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'word-start',
      question: { tr: 'Bu kelime hangi harfle başlıyor? (baştaki şekli seç)', nl: 'Met welke letter begint dit woord? (kies de beginvorm)' },
      promptWord: 'ṭayyib',
      promptMeaning: { tr: 'temiz / iyi', nl: 'goed / puur' },
      audioId: 'ta (heavy)',
      shuffleOptions: true,
      options: [
        { tr: 'طـ', nl: 'طـ' },
        { tr: 'تـ', nl: 'تـ' },
        { tr: 'ثـ', nl: 'ثـ' },
        { tr: 'د', nl: 'د' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b5-q3',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'sound-discrimination',
      question: { tr: 'Hangi harfi duyuyorsun?', nl: 'Welke letter hoor je?' },
      audioId: 'ghayn',
      shuffleOptions: true,
      options: [
        { tr: 'غ', nl: 'غ' },
        { tr: 'ع', nl: 'ع' },
        { tr: 'خ', nl: 'خ' },
        { tr: 'ه', nl: 'ه' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b5-q4',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu şekil hangi harf ve hangi konum?', nl: 'Welke letter en welke positie is dit?' },
      promptLetter: 'ـفـ',
      shuffleOptions: true,
      options: [
        { tr: 'ف - Ortada', nl: 'ف - Midden' },
        { tr: 'ق - Ortada', nl: 'ق - Midden' },
        { tr: 'ف - Sonda', nl: 'ف - Eind' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b5-q5',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'drag-drop',
      skill: 'word-to-form',
      question: { tr: 'Kelimeyi doğru ortadaki harf şekline sürükle.', nl: 'Sleep het woord naar de juiste middenvorm.' },
      items: [
        { id: 'word-muhammad', content: { tr: 'muḥammad', nl: 'muḥammad' }, audioId: 'mim' },
        { id: 'word-nas', content: { tr: 'nās', nl: 'nās' }, audioId: 'nun' },
        { id: 'word-layl', content: { tr: 'layl', nl: 'layl' }, audioId: 'lam' },
        { id: 'letter-mim-mid', content: { tr: 'ـمـ', nl: 'ـمـ' } },
        { id: 'letter-nun-mid', content: { tr: 'ـنـ', nl: 'ـنـ' } },
        { id: 'letter-lam-mid', content: { tr: 'ـلـ', nl: 'ـلـ' } }
      ],
      correctPairs: [
        { sourceId: 'word-muhammad', targetId: 'letter-mim-mid' },
        { sourceId: 'word-nas', targetId: 'letter-nun-mid' },
        { sourceId: 'word-layl', targetId: 'letter-lam-mid' }
      ]
    },
    {
      id: 'l3-b5-q6',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Bu şekil bu harfe ait mi?', nl: 'Hoort deze vorm bij deze letter?' },
      promptLetter: 'ص',
      promptWord: 'Şekil: سـ',
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l3-b5-q7',
      bundleId: 'lesson-3-bundle-5',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'form-recognition',
      question: { tr: 'Bu harfin sondaki hâli hangisi?', nl: 'Welke is de eindvorm?' },
      promptLetter: 'ظ',
      shuffleOptions: true,
      options: [
        { tr: 'ـظ', nl: 'ـظ' },
        { tr: 'ـض', nl: 'ـض' },
        { tr: 'ـص', nl: 'ـص' },
        { tr: 'ـز', nl: 'ـز' }
      ],
      correctAnswer: 0
    },

    // Bundle 6
    {
      id: 'l3-b6-q1',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'form-recognition',
      question: { tr: 'Duyduğun harfin ortadaki hâlini seç.', nl: 'Kies de middenvorm van de letter die je hoort.' },
      audioId: 'shin',
      shuffleOptions: true,
      options: [
        { tr: 'ـشـ', nl: 'ـشـ' },
        { tr: 'ـسـ', nl: 'ـسـ' },
        { tr: 'ـصـ', nl: 'ـصـ' },
        { tr: 'ـثـ', nl: 'ـثـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b6-q2',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'form-recognition',
      question: { tr: 'Bu kelimenin ilk harfinin sondaki hâlini seç.', nl: 'Kies de eindvorm van de eerste letter van dit woord.' },
      promptWord: 'raḥmah',
      promptMeaning: { tr: 'rahmet', nl: 'barmhartigheid' },
      audioId: 'ra',
      shuffleOptions: true,
      options: [
        { tr: 'ـر', nl: 'ـر' },
        { tr: 'ـذ', nl: 'ـذ' },
        { tr: 'ـز', nl: 'ـز' },
        { tr: 'ـد', nl: 'ـد' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b6-q3',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'position-recognition',
      question: { tr: 'Bu şekil hangi konumda kullanılır?', nl: 'In welke positie gebruik je deze vorm?' },
      promptLetter: 'قـ',
      shuffleOptions: true,
      options: [
        { tr: 'Başta', nl: 'Begin' },
        { tr: 'Ortada', nl: 'Midden' },
        { tr: 'Sonda', nl: 'Eind' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b6-q4',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'drag-drop',
      skill: 'word-to-letter',
      question: { tr: 'Kelimeyi doğru harf şekline sürükle.', nl: 'Sleep het woord naar de juiste lettervorm.' },
      items: [
        { id: 'word-salam', content: { tr: 'salām', nl: 'salām' }, audioId: 'sin' },
        { id: 'word-shams', content: { tr: 'shams', nl: 'shams' }, audioId: 'shin' },
        { id: 'word-zakah', content: { tr: 'zakāh', nl: 'zakāh' }, audioId: 'ze' },
        { id: 'word-jannah', content: { tr: 'jannah', nl: 'jannah' }, audioId: 'jim' },
        { id: 'letter-sin-begin', content: { tr: 'سـ', nl: 'سـ' } },
        { id: 'letter-shin-begin', content: { tr: 'شـ', nl: 'شـ' } },
        { id: 'letter-ze-isolated', content: { tr: 'ز', nl: 'ز' } },
        { id: 'letter-jim-begin', content: { tr: 'جـ', nl: 'جـ' } }
      ],
      correctPairs: [
        { sourceId: 'word-salam', targetId: 'letter-sin-begin' },
        { sourceId: 'word-shams', targetId: 'letter-shin-begin' },
        { sourceId: 'word-zakah', targetId: 'letter-ze-isolated' },
        { sourceId: 'word-jannah', targetId: 'letter-jim-begin' }
      ]
    },
    {
      id: 'l3-b6-q5',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'error-detection',
      skill: 'error-detection',
      question: { tr: 'Bu şekil doğru mu?', nl: 'Is deze vorm correct?' },
      promptWord: 'و (ortada/midden)',
      promptMeaning: { tr: 'Gösterilen: ـوـ', nl: 'Getoond: ـوـ' },
      shuffleOptions: true,
      options: [
        { tr: 'Evet', nl: 'Ja' },
        { tr: 'Hayır', nl: 'Nee' }
      ],
      correctAnswer: 1
    },
    {
      id: 'l3-b6-q6',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'multiple-choice',
      skill: 'sequence',
      question: { tr: 'Doğru sırayı seç. (Baş–Orta–Son)', nl: 'Kies de juiste volgorde. (Begin–Midden–Eind)' },
      promptLetter: 'ن',
      shuffleOptions: true,
      options: [
        { tr: 'نـ , ـنـ , ـن', nl: 'نـ , ـنـ , ـن' },
        { tr: 'ـن , نـ , ـنـ', nl: 'ـن , نـ , ـنـ' },
        { tr: 'نـ , ـن , ـنـ', nl: 'نـ , ـن , ـنـ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3-b6-q7',
      bundleId: 'lesson-3-bundle-6',
      bundleTitle: 'Lesson 3',
      type: 'audio-mc',
      skill: 'word-start',
      question: { tr: 'Bu kelime hangi harfle başlıyor? (baştaki şekli seç)', nl: 'Met welke letter begint dit woord? (kies de beginvorm)' },
      promptWord: 'ʿilm',
      promptMeaning: { tr: 'ilim', nl: 'kennis' },
      audioId: 'ayn',
      shuffleOptions: true,
      options: [
        { tr: 'عـ', nl: 'عـ' },
        { tr: 'غـ', nl: 'غـ' },
        { tr: 'حـ', nl: 'حـ' },
        { tr: 'هـ', nl: 'هـ' }
      ],
      correctAnswer: 0
    }
  ]
};

// Create cloned lessons (3..28) from Lesson 1 so they can be customized later
const createLessonFromLesson1 = (order: number): Lesson => ({
  id: `lesson-${order}`,
  order,
  level: `Sayfa ${order}`,
  content: {
    ...lesson1.content,
    title: `Ders ${order}: Arap alfabesi`,
    titleTranslations: {
      tr: `Ders ${order}: Arap alfabesi`,
      nl: `Les ${order}: Arabisch alfabet`
    },
    alphabetLetters: [...(lesson1.content.alphabetLetters || [])],
    letterGroups: lesson1.content.letterGroups ? [...lesson1.content.letterGroups] : lesson1.content.letterGroups,
    items: lesson1.content.items ? [...lesson1.content.items] : lesson1.content.items
  },
  quizzes: lesson1.quizzes.map(quiz => ({
    ...quiz,
    id: quiz.id.replace('l1', `l${order}`),
    bundleId: quiz.bundleId.replace('lesson-1', `lesson-${order}`),
    bundleTitle: quiz.bundleTitle ? quiz.bundleTitle.replace('Lesson 1', `Lesson ${order}`) : quiz.bundleTitle
  }))
});

const clonedLessons = Array.from({ length: 25 }, (_, idx) => createLessonFromLesson1(idx + 4));

export const lessons: Lesson[] = [
  lesson1,
  lesson2,
  lesson3,
  ...clonedLessons
];

// Helper functions
export const getLessonByOrder = (order: number): Lesson | undefined => {
  return lessons.find(lesson => lesson.order === order);
};

export const getNextLesson = (currentOrder: number): Lesson | undefined => {
  return lessons.find(lesson => lesson.order === currentOrder + 1);
};

export const getTotalLessons = (): number => {
  return lessons.length;
};

export const getLessonsByLevel = (level: string): Lesson[] => {
  return lessons.filter(lesson => lesson.level === level);
};

export default lessons;

