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
    type: 'letter-practice',
    title: 'Ders 2: alfabe farklı sırada',
    titleTranslations: {
      tr: 'Ders 2: alfabe farklı sırada',
      nl: 'Les 2: alfabet in andere volgorde'
    },
    instruction: 'Harfleri sağdan başlayarak okuyunuz!',
    items: [
      { arabic: 'ج' },
      { arabic: 'ا' },
      { arabic: 'ت' },
      { arabic: 'م' },
      { arabic: 'ب' },
      { arabic: 'ر' },
      { arabic: 'ح' },
      { arabic: 'د' },
      { arabic: 'ي' },
      { arabic: 'ظ' },
      { arabic: 'ض' },
      { arabic: 'ز' },
      { arabic: 'ش' },
      { arabic: 'ل' },
      { arabic: 'س' },
      { arabic: 'ن' },
      { arabic: 'ط' },
      { arabic: 'ع' },
      { arabic: 'ذ' },
      { arabic: 'ه' },
      { arabic: 'غ' },
      { arabic: 'و' },
      { arabic: 'لا' },
      { arabic: 'ك' },
      { arabic: 'ف' },
      { arabic: 'خ' },
      { arabic: 'ق' },
      { arabic: 'ت' },
      { arabic: 'ص' }
    ],
    color: '#3B82F6' // Blue
  }
};

// Lesson 3: HARFLERİN BAŞTA, ORTADA VE SONDA YAZILIŞLARI (Letter forms at beginning, middle, and end)
const lesson3: Lesson = {
  id: 'lesson-3',
  order: 3,
  level: 'Sayfa 3',
  content: {
    type: 'letter-positions',
    title: 'Harflerin başta, ortada ve sonda yazılışları',
    titleTranslations: {
      tr: 'Harflerin başta, ortada ve sonda yazılışları',
      nl: 'Lettervormen aan begin, midden en einde'
    },
    instruction: 'Sonda – Ortada – Başta – Harf',
    items: [
      { arabic: 'ط – ط – ط – ط' },
      { arabic: 'ا – ا – ا – ا' },
      { arabic: 'ظ – ظ – ظ – ظ' },
      { arabic: 'ب – ـبـ – بـ – ب' },
      { arabic: 'ع – ـعـ – ع – ع' },
      { arabic: 'ت – ـتـ – تـ – ت' },
      { arabic: 'غ – ـغـ – غ – غ' },
      { arabic: 'ث – ـثـ – ثـ – ث' },
      { arabic: 'ف – ـفـ – ف – ف' },
      { arabic: 'ج – ـجـ – جـ – ج' },
      { arabic: 'ق – ـقـ – ق – ق' },
      { arabic: 'ح – ـحـ – حـ – ح' },
      { arabic: 'ك – ـكـ – ك – ك' },
      { arabic: 'خ – ـخـ – خـ – خ' },
      { arabic: 'ل – ـلـ – ل – ل' },
      { arabic: 'د – د – د – د' },
      { arabic: 'م – ـمـ – م – م' },
      { arabic: 'ذ – ذ – ذ – ذ' },
      { arabic: 'ن – ـنـ – ن – ن' },
      { arabic: 'ر – ر – р – ر' },
      { arabic: 'و – و – و – و' },
      { arabic: 'ز – ز – ز – ز' },
      { arabic: 'ه – ـهـ – هـ – ه' },
      { arabic: 'س – ـسـ – سـ – س' },
      { arabic: 'لا – la – la – la' },
      { arabic: 'ش – ـشـ – شـ – ش' },
      { arabic: 'ي – ـيـ – يـ – ي' },
      { arabic: 'ص – ـصـ – صـ – ص' },
      { arabic: 'ض – ـضـ – ضـ – ض' }
    ],
    color: '#F59E0B' // Amber
  }
};

export const lessons: Lesson[] = [
  lesson1,
  lesson2,
  lesson3
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

