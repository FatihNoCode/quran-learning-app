import { ARABIC_LETTERS, getLetter, ArabicLetter } from './arabicLetters';

// Lesson content structure
export interface LessonContent {
  type: 'alphabet-detail' | 'letter-grid' | 'letter-practice' | 'letter-positions' | 'letter-connected' | 
        'letter-haraka' | 'haraka-practice';
  title: string; // Only Turkish as in original pages
  instruction: string; // Only Turkish as in original pages
  letterGroups?: string[][]; // For grouped letter display
  items?: LessonItem[];
  letterIds?: string[]; // Reference to letter IDs in ARABIC_LETTERS
  color?: string;
}

export interface LessonItem {
  arabic: string;
  transliteration?: string;
  explanation?: string;
}

// Legacy support - will be replaced by letter references
export interface AlphabetLetter {
  arabic: string;
  name: string;
  pronunciation: {
    tr: string;
    nl: string;
  };
  example?: {
    tr: string;
    nl: string;
  };
  type?: string;
  specialNote?: {
    tr: string;
    nl: string;
  };
}

export interface Lesson {
  id: string;
  order: number;
  level: string;
  content: LessonContent;
  quizzes?: Quiz[];
}

// Quiz types
export type QuizType = 'multiple-choice' | 'drag-drop' | 'listen-choose' | 'true-false' | 'order-sequence';

export interface Quiz {
  id: string;
  type: QuizType;
  skill: string;
  question: {
    tr: string;
    nl: string;
  };
  options?: {
    tr: string;
    nl: string;
  }[];
  correctAnswer?: number;
  items?: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
  }[];
  correctPairs?: { sourceId: string; targetId: string }[];
  sequence?: {
    id: string;
    content: {
      tr: string;
      nl: string;
    };
  }[];
  correctOrder?: string[];
  audioUrl?: string;
}

// Lesson 1: ARAP ALFABESİ (Arabic Alphabet)
const lesson1: Lesson = {
  id: 'lesson-1',
  order: 1,
  level: 'Sayfa 1',
  content: {
    type: 'alphabet-detail',
    title: 'ARAP ALFABESİ - Kur\'an Harfleri',
    instruction: 'Her harfi dikkatle inceleyin ve telaffuzunu öğrenin!',
    alphabetLetters: [
      {
        arabic: 'ا',
        name: 'Alif',
        pronunciation: { tr: 'a / e', nl: 'a / e' },
        example: { tr: 'Allah', nl: 'Allah' }
      },
      {
        arabic: 'ب',
        name: 'Bā',
        pronunciation: { tr: 'be', nl: 'be' },
        example: { tr: 'baba', nl: 'bal' }
      },
      {
        arabic: 'ت',
        name: 'Tā',
        pronunciation: { tr: 'te', nl: 'te' },
        example: { tr: 'tesbih', nl: 'tas' }
      },
      {
        arabic: 'ث',
        name: 'Thā',
        pronunciation: { tr: 'tha (peltek)', nl: 'tha (peltek)' },
        example: { tr: '-', nl: '-' },
        type: 'peltek',
        specialNote: {
          tr: 'Dilin ucunu üst ve alt dişler arasına hafifçe koyun ve hava üfleyin. İngilizce "think" kelimesindeki "th" gibi.',
          nl: 'Plaats de punt van je tong licht tussen je boven- en ondertanden en blaas lucht. Zoals "th" in het Engelse "think".'
        }
      },
      {
        arabic: 'ج',
        name: 'Cīm',
        pronunciation: { tr: 'cim', nl: 'cim' },
        example: { tr: 'cami', nl: 'Jummuah' }
      },
      {
        arabic: 'ح',
        name: 'Ḥā',
        pronunciation: { tr: 'h (sert, boğaz)', nl: 'h (diep, keel)' },
        example: { tr: '-', nl: '-' },
        type: 'throat',
        specialNote: {
          tr: 'Boğazın derinliklerinden nefes verin, ağız veya dudakları kullanmadan. Güçlü, nefesli bir "h", ama daha derin.',
          nl: 'Adem uit vanuit diep in de keel, zonder de mond of lippen te gebruiken. Een sterke, luchtige "h", maar dieper.'
        }
      },
      {
        arabic: 'خ',
        name: 'Khā',
        pronunciation: { tr: 'gha', nl: 'gha' },
        example: { tr: '-', nl: 'goed' },
        type: 'throat',
        specialNote: {
          tr: 'Boğazın arkasından hafif bir sürtünme sesiyle hava basın. Hollandaca "gracht" kelimesindeki "g" gibi.',
          nl: 'Duw lucht vanuit de achterkant van de keel met een licht schrapend geluid. Zoals Nederlandse "g" in "gracht".'
        }
      },
      {
        arabic: 'د',
        name: 'Dāl',
        pronunciation: { tr: 'de', nl: 'de' },
        example: { tr: 'dua', nl: 'doek' }
      },
      {
        arabic: 'ذ',
        name: 'Dhāl',
        pronunciation: { tr: 'dza', nl: 'dza' },
        example: { tr: '-', nl: '-' },
        type: 'peltek',
        specialNote: {
          tr: 'Dilinizi üst dişlerinize değdirin ve yumuşak bir z sesi çıkarın. İngilizce "this" kelimesindeki "th" gibi.',
          nl: 'Plaats je tong tegen je boventanden en maak een zachte z-klank. Zoals "th" in het Engelse "this".'
        }
      },
      {
        arabic: 'ر',
        name: 'Rā',
        pronunciation: { tr: 'r', nl: 'r' },
        example: { tr: 'ramazan', nl: 'ramadan' }
      },
      {
        arabic: 'ز',
        name: 'Zāy',
        pronunciation: { tr: 'z', nl: 'z' },
        example: { tr: 'zekat', nl: 'zon' }
      },
      {
        arabic: 'س',
        name: 'Sīn',
        pronunciation: { tr: 's', nl: 's' },
        example: { tr: 'secde', nl: 'soera' }
      },
      {
        arabic: 'ش',
        name: 'Shīn',
        pronunciation: { tr: 'ş', nl: 'sj' },
        example: { tr: 'şükür', nl: 'sjaal' }
      },
      {
        arabic: 'ص',
        name: 'Ṣād',
        pronunciation: { tr: 'sa (kalın)', nl: 'sa (zwaar)' },
        example: { tr: 'sabır', nl: 'soera' },
        type: 'heavy'
      },
      {
        arabic: 'ض',
        name: 'Ḍād',
        pronunciation: { tr: 'da (kalın)', nl: 'da (zwaar)' },
        example: { tr: 'dua', nl: '-' },
        type: 'heavy'
      },
      {
        arabic: 'ط',
        name: 'Ṭā',
        pronunciation: { tr: 'ta (kalın)', nl: 'ta (zwaar)' },
        example: { tr: 'tavaf', nl: '-' },
        type: 'heavy',
        specialNote: {
          tr: 't harfini söyleyin ama dili düz ve ağır tutun. Kalın, güçlü bir "t" sesi.',
          nl: 'Zeg t, maar houd de tong plat en zwaar. Een dikke, sterke t.'
        }
      },
      {
        arabic: 'ظ',
        name: 'Ẓā',
        pronunciation: { tr: 'za (kalın, peltek)', nl: 'za (zwaar, peltek)' },
        example: { tr: '-', nl: 'zon' },
        type: 'heavy',
        specialNote: {
          tr: 'Dil üst dişlere + kalın z sesi. Ağır ذ versiyonu.',
          nl: 'Tong tegen boventanden + zware z-klank. Zware versie van ذ.'
        }
      },
      {
        arabic: 'ع',
        name: 'ʿAyn',
        pronunciation: { tr: 'boğazdan "â"', nl: 'vanuit keel "â"' },
        example: { tr: '-', nl: '-' },
        type: 'throat',
        specialNote: {
          tr: 'Boğaz kaslarını sıkın ve içeriden kısa bir ses başlatın. Türkçe veya Hollandaca eşdeğeri yok.',
          nl: 'Span de keelspieren en start een kort geluid van diep binnenin. Geen Turks of Nederlands equivalent.'
        }
      },
      {
        arabic: 'غ',
        name: 'Ghayn',
        pronunciation: { tr: 'ğ / g (boğaz)', nl: 'g (keel)' },
        example: { tr: 'gayret', nl: '-' },
        type: 'throat',
        specialNote: {
          tr: 'خ gibi ama sesli. Sesli Hollandaca "g".',
          nl: 'Zoals خ, maar met stem toegevoegd. Een stemhebbende Nederlandse g.'
        }
      },
      {
        arabic: 'ف',
        name: 'Fā',
        pronunciation: { tr: 'fe', nl: 'fe' },
        example: { tr: 'fatiha', nl: 'fiets' }
      },
      {
        arabic: 'ق',
        name: 'Qāf',
        pronunciation: { tr: 'k (kalın)', nl: 'k (zwaar)' },
        example: { tr: '-', nl: '-' },
        type: 'throat',
        specialNote: {
          tr: 'k deyin ama dilin arkasından, boğazda derin. Ağır bir "k", normal Türkçe "k" değil.',
          nl: 'Zeg k, maar vanuit de achterkant van de tong, diep in de keel. Een zware k, geen normale Turkse k.'
        }
      },
      {
        arabic: 'ك',
        name: 'Kef',
        pronunciation: { tr: 'k', nl: 'k' },
        example: { tr: 'kitap', nl: 'kaart' }
      },
      {
        arabic: 'ل',
        name: 'Lām',
        pronunciation: { tr: 'l', nl: 'l' },
        example: { tr: 'lamba', nl: 'lamp' }
      },
      {
        arabic: 'م',
        name: 'Mīm',
        pronunciation: { tr: 'm', nl: 'm' },
        example: { tr: 'mescid', nl: 'maan' }
      },
      {
        arabic: 'ن',
        name: 'Nūn',
        pronunciation: { tr: 'n', nl: 'n' },
        example: { tr: 'namaz', nl: 'noer' }
      },
      {
        arabic: 'ه',
        name: 'Hā',
        pronunciation: { tr: 'he', nl: 'he' },
        example: { tr: 'helal', nl: 'huis' }
      },
      {
        arabic: 'و',
        name: 'Vav',
        pronunciation: { tr: 'wa / va', nl: 'wa / va' },
        example: { tr: 'vakit', nl: 'water' }
      },
      {
        arabic: 'ي',
        name: 'Yā',
        pronunciation: { tr: 'ye', nl: 'ye' },
        example: { tr: 'yasin', nl: 'jas' }
      },
      {
        arabic: 'لا',
        name: 'Lām–Alif',
        pronunciation: { tr: 'La', nl: 'La' },
        example: { tr: '-', nl: '-' }
      }
    ],
    color: '#10B981' // Green
  },
  quizzes: [
    // Multiple Choice Questions - Letter Recognition
    {
      id: 'quiz-1-mc-1',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'ا harfinin adı nedir?', nl: 'Wat is de naam van de letter ا?' },
      options: [
        { tr: 'Alif', nl: 'Alif' },
        { tr: 'Bā', nl: 'Bā' },
        { tr: 'Tā', nl: 'Tā' },
        { tr: 'Thā', nl: 'Thā' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-2',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'ب harfinin adı nedir?', nl: 'Wat is de naam van de letter ب?' },
      options: [
        { tr: 'Alif', nl: 'Alif' },
        { tr: 'Bā', nl: 'Bā' },
        { tr: 'Tā', nl: 'Tā' },
        { tr: 'Nūn', nl: 'Nūn' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-3',
      type: 'multiple-choice',
      skill: 'letter-pronunciation',
      question: { tr: 'ت harfi nasıl okunur?', nl: 'Hoe spreek je de letter ت uit?' },
      options: [
        { tr: 'be', nl: 'be' },
        { tr: 'te', nl: 'te' },
        { tr: 'tha', nl: 'tha' },
        { tr: 'cim', nl: 'cim' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-4',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'Hangi harf "Cīm" adını taşır?', nl: 'Welke letter heet "Cīm"?' },
      options: [
        { tr: 'ج', nl: 'ج' },
        { tr: 'ح', nl: 'ح' },
        { tr: 'خ', nl: 'خ' },
        { tr: 'د', nl: 'د' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-5',
      type: 'multiple-choice',
      skill: 'letter-type',
      question: { tr: 'ث (Thā) hangi türdendir?', nl: 'Wat voor type letter is ث (Thā)?' },
      options: [
        { tr: 'Peltek harf', nl: 'Peltek letter' },
        { tr: 'Kalın harf', nl: 'Zware letter' },
        { tr: 'Boğaz harfi', nl: 'Keelletter' },
        { tr: 'Normal harf', nl: 'Normale letter' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-6',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'ح harfinin adı nedir?', nl: 'Wat is de naam van de letter ح?' },
      options: [
        { tr: 'Cīm', nl: 'Cīm' },
        { tr: 'Ḥā', nl: 'Ḥā' },
        { tr: 'Khā', nl: 'Khā' },
        { tr: 'Hā', nl: 'Hā' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-7',
      type: 'multiple-choice',
      skill: 'letter-pronunciation',
      question: { tr: 'ر harfi nasıl okunur?', nl: 'Hoe spreek je de letter ر uit?' },
      options: [
        { tr: 'r', nl: 'r' },
        { tr: 'z', nl: 'z' },
        { tr: 's', nl: 's' },
        { tr: 'l', nl: 'l' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-8',
      type: 'multiple-choice',
      skill: 'letter-example',
      question: { tr: '"ramazan" kelimesi hangi harfle başlar?', nl: 'Met welke letter begint het woord "ramadan"?' },
      options: [
        { tr: 'ر', nl: 'ر' },
        { tr: 'ز', nl: 'ز' },
        { tr: 'د', nl: 'د' },
        { tr: 'ذ', nl: 'ذ' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-9',
      type: 'multiple-choice',
      skill: 'letter-type',
      question: { tr: 'ص (Ṣād) hangi türdendir?', nl: 'Wat voor type letter is ص (Ṣād)?' },
      options: [
        { tr: 'Peltek harf', nl: 'Peltek letter' },
        { tr: 'Kalın harf', nl: 'Zware letter' },
        { tr: 'Boğaz harfi', nl: 'Keelletter' },
        { tr: 'Normal harf', nl: 'Normale letter' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-10',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'ع harfinin adı nedir?', nl: 'Wat is de naam van de letter ع?' },
      options: [
        { tr: 'ʿAyn', nl: 'ʿAyn' },
        { tr: 'Ghayn', nl: 'Ghayn' },
        { tr: 'Ḥā', nl: 'Ḥā' },
        { tr: 'Khā', nl: 'Khā' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-11',
      type: 'multiple-choice',
      skill: 'letter-pronunciation',
      question: { tr: 'ف harfi nasıl okunur?', nl: 'Hoe spreek je de letter ف uit?' },
      options: [
        { tr: 'fe', nl: 'fe' },
        { tr: 'k', nl: 'k' },
        { tr: 'l', nl: 'l' },
        { tr: 'm', nl: 'm' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-12',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'Hangi harf "Lām" adını taşır?', nl: 'Welke letter heet "Lām"?' },
      options: [
        { tr: 'ك', nl: 'ك' },
        { tr: 'ق', nl: 'ق' },
        { tr: 'ل', nl: 'ل' },
        { tr: 'م', nl: 'م' }
      ],
      correctAnswer: 2
    },
    {
      id: 'quiz-1-mc-13',
      type: 'multiple-choice',
      skill: 'letter-example',
      question: { tr: '"namaz" kelimesi hangi harfle başlar?', nl: 'Met welke letter begint het woord "namaz"?' },
      options: [
        { tr: 'م', nl: 'م' },
        { tr: 'ن', nl: 'ن' },
        { tr: 'ل', nl: 'ل' },
        { tr: 'ه', nl: 'ه' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-14',
      type: 'multiple-choice',
      skill: 'letter-pronunciation',
      question: { tr: 'ي harfi nasıl okunur?', nl: 'Hoe spreek je de letter ي uit?' },
      options: [
        { tr: 'he', nl: 'he' },
        { tr: 'wa', nl: 'wa' },
        { tr: 'ye', nl: 'ye' },
        { tr: 'la', nl: 'la' }
      ],
      correctAnswer: 2
    },
    {
      id: 'quiz-1-mc-15',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'لا harfinin adı nedir?', nl: 'Wat is de naam van de letter لا?' },
      options: [
        { tr: 'Lām', nl: 'Lām' },
        { tr: 'Alif', nl: 'Alif' },
        { tr: 'Lām–Alif', nl: 'Lām–Alif' },
        { tr: 'Yā', nl: 'Yā' }
      ],
      correctAnswer: 2
    },

    // Drag and Drop Questions - Matching letters to pronunciations
    {
      id: 'quiz-1-dd-1',
      type: 'drag-drop',
      skill: 'letter-pronunciation',
      question: { tr: 'Harfleri telaffuzlarıyla eşleştirin', nl: 'Match de letters met hun uitspraak' },
      items: [
        { id: 'letter-alif', content: { tr: ARABIC_LETTERS.ALIF.arabic, nl: ARABIC_LETTERS.ALIF.arabic } },
        { id: 'letter-ba', content: { tr: ARABIC_LETTERS.BA.arabic, nl: ARABIC_LETTERS.BA.arabic } },
        { id: 'letter-ta', content: { tr: ARABIC_LETTERS.TA.arabic, nl: ARABIC_LETTERS.TA.arabic } },
        { id: 'letter-jim', content: { tr: ARABIC_LETTERS.JIM.arabic, nl: ARABIC_LETTERS.JIM.arabic } },
        { id: 'sound-alif', content: ARABIC_LETTERS.ALIF.pronunciation },
        { id: 'sound-ba', content: ARABIC_LETTERS.BA.pronunciation },
        { id: 'sound-ta', content: ARABIC_LETTERS.TA.pronunciation },
        { id: 'sound-jim', content: ARABIC_LETTERS.JIM.pronunciation }
      ],
      correctPairs: [
        { sourceId: 'letter-alif', targetId: 'sound-alif' },
        { sourceId: 'letter-ba', targetId: 'sound-ba' },
        { sourceId: 'letter-ta', targetId: 'sound-ta' },
        { sourceId: 'letter-jim', targetId: 'sound-jim' }
      ]
    },
    {
      id: 'quiz-1-dd-2',
      type: 'drag-drop',
      skill: 'letter-name',
      question: { tr: 'Harfleri isimleriyle eşleştirin', nl: 'Match de letters met hun namen' },
      items: [
        { id: 'letter-dal', content: { tr: ARABIC_LETTERS.DAL.arabic, nl: ARABIC_LETTERS.DAL.arabic } },
        { id: 'letter-ra', content: { tr: ARABIC_LETTERS.RA.arabic, nl: ARABIC_LETTERS.RA.arabic } },
        { id: 'letter-zay', content: { tr: ARABIC_LETTERS.ZAY.arabic, nl: ARABIC_LETTERS.ZAY.arabic } },
        { id: 'letter-sin', content: { tr: ARABIC_LETTERS.SIN.arabic, nl: ARABIC_LETTERS.SIN.arabic } },
        { id: 'sound-dal', content: { tr: ARABIC_LETTERS.DAL.name, nl: ARABIC_LETTERS.DAL.name } },
        { id: 'sound-ra', content: { tr: ARABIC_LETTERS.RA.name, nl: ARABIC_LETTERS.RA.name } },
        { id: 'sound-zay', content: ARABIC_LETTERS.ZAY.pronunciation },
        { id: 'sound-sin', content: { tr: ARABIC_LETTERS.SIN.name, nl: ARABIC_LETTERS.SIN.name } }
      ],
      correctPairs: [
        { sourceId: 'letter-dal', targetId: 'sound-dal' },
        { sourceId: 'letter-ra', targetId: 'sound-ra' },
        { sourceId: 'letter-zay', targetId: 'sound-zay' },
        { sourceId: 'letter-sin', targetId: 'sound-sin' }
      ]
    },
    {
      id: 'quiz-1-dd-3',
      type: 'drag-drop',
      skill: 'letter-example',
      question: { tr: 'Harfleri örneklerle eşleştirin', nl: 'Match de letters met voorbeelden' },
      items: [
        { id: 'mim', content: { tr: ARABIC_LETTERS.MIM.arabic, nl: ARABIC_LETTERS.MIM.arabic } },
        { id: 'nun', content: { tr: ARABIC_LETTERS.NUN.arabic, nl: ARABIC_LETTERS.NUN.arabic } },
        { id: 'ha', content: { tr: ARABIC_LETTERS.HA_END.arabic, nl: ARABIC_LETTERS.HA_END.arabic } },
        { id: 'waw', content: { tr: ARABIC_LETTERS.WAW.arabic, nl: ARABIC_LETTERS.WAW.arabic } },
        { id: 'ex-mim', content: ARABIC_LETTERS.MIM.example! },
        { id: 'ex-nun', content: ARABIC_LETTERS.NUN.example! },
        { id: 'ex-ha', content: ARABIC_LETTERS.HA_END.example! },
        { id: 'ex-waw', content: ARABIC_LETTERS.WAW.example! }
      ],
      correctPairs: [
        { sourceId: 'mim', targetId: 'ex-mim' },
        { sourceId: 'nun', targetId: 'ex-nun' },
        { sourceId: 'ha', targetId: 'ex-ha' },
        { sourceId: 'waw', targetId: 'ex-waw' }
      ]
    },
    {
      id: 'quiz-1-dd-4',
      type: 'drag-drop',
      skill: 'letter-type',
      question: { tr: 'Harfleri türleriyle eşleştirin', nl: 'Match de letters met hun types' },
      items: [
        { id: 'tha', content: { tr: 'ث', nl: 'ث' } },
        { id: 'ha-throat', content: { tr: 'ح', nl: 'ح' } },
        { id: 'sad', content: { tr: 'ص', nl: 'ص' } },
        { id: 'ba-normal', content: { tr: 'ب', nl: 'ب' } },
        { id: 'type-peltek', content: { tr: 'Peltek harf', nl: 'Peltek letter' } },
        { id: 'type-throat', content: { tr: 'Boğaz harfi', nl: 'Keelletter' } },
        { id: 'type-heavy', content: { tr: 'Kalın harf', nl: 'Zware letter' } },
        { id: 'type-normal', content: { tr: 'Normal harf', nl: 'Normale letter' } }
      ],
      correctPairs: [
        { sourceId: 'tha', targetId: 'type-peltek' },
        { sourceId: 'ha-throat', targetId: 'type-throat' },
        { sourceId: 'sad', targetId: 'type-heavy' },
        { sourceId: 'ba-normal', targetId: 'type-normal' }
      ]
    },
    {
      id: 'quiz-1-dd-5',
      type: 'drag-drop',
      skill: 'letter-pronunciation',
      question: { tr: 'Harfleri telaffuzlarıyla eşleştirin', nl: 'Match de letters met hun uitspraak' },
      items: [
        { id: 'shin', content: { tr: ARABIC_LETTERS.SHIN.arabic, nl: ARABIC_LETTERS.SHIN.arabic } },
        { id: 'fa', content: { tr: ARABIC_LETTERS.FA.arabic, nl: ARABIC_LETTERS.FA.arabic } },
        { id: 'kaf', content: { tr: ARABIC_LETTERS.KAF.arabic, nl: ARABIC_LETTERS.KAF.arabic } },
        { id: 'lam', content: { tr: ARABIC_LETTERS.LAM.arabic, nl: ARABIC_LETTERS.LAM.arabic } },
        { id: 'pron-shin', content: ARABIC_LETTERS.SHIN.pronunciation },
        { id: 'pron-fa', content: ARABIC_LETTERS.FA.pronunciation },
        { id: 'pron-kaf', content: ARABIC_LETTERS.KAF.pronunciation },
        { id: 'pron-lam', content: ARABIC_LETTERS.LAM.pronunciation }
      ],
      correctPairs: [
        { sourceId: 'shin', targetId: 'pron-shin' },
        { sourceId: 'fa', targetId: 'pron-fa' },
        { sourceId: 'kaf', targetId: 'pron-kaf' },
        { sourceId: 'lam', targetId: 'pron-lam' }
      ]
    },

    // True/False Questions - Letter Properties
    {
      id: 'quiz-1-tf-1',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ا (Alif) harfi "Allah" kelimesinde bulunur.', nl: 'De letter ا (Alif) komt voor in het woord "Allah".' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-2',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ث (Thā) peltek bir harftir.', nl: 'ث (Thā) is een peltek letter.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-3',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ح (Ḥā) boğazdan söylenir.', nl: 'ح (Ḥā) wordt vanuit de keel uitgesproken.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-4',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ص (Ṣād) kalın bir harftir.', nl: 'ص (Ṣād) is een zware letter.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-5',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ع (ʿAyn) Türkçede eşdeğeri olan bir sestir.', nl: 'ع (ʿAyn) heeft een equivalent in het Turks.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-tf-6',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ذ (Dhāl) peltek bir harftir.', nl: 'ذ (Dhāl) is een peltek letter.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-7',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ط (Ṭā) kalın bir "t" harfidir.', nl: 'ط (Ṭā) is een zware "t" letter.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-8',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ق (Qāf) normal bir "k" harfidir.', nl: 'ق (Qāf) is een normale "k" letter.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-tf-9',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'ظ (Ẓā) hem peltek hem kalın bir harftir.', nl: 'ظ (Ẓā) is zowel een peltek als zware letter.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-tf-10',
      type: 'true-false',
      skill: 'letter-property',
      question: { tr: 'لا (Lām–Alif) iki harfin birleşimidir.', nl: 'لا (Lām–Alif) is een combinatie van twee letters.' },
      options: [
        { tr: 'Doğru', nl: 'Waar' },
        { tr: 'Yanlış', nl: 'Onwaar' }
      ],
      correctAnswer: 0
    },

    // Order Sequence Questions - Alphabetical Order
    {
      id: 'quiz-1-seq-1',
      type: 'order-sequence',
      skill: 'letter-order',
      question: { tr: 'Harfleri alfabe sırasına göre dizin', nl: 'Zet de letters in alfabetische volgorde' },
      sequence: [
        { id: 'seq-alif', content: { tr: 'ا - Alif', nl: 'ا - Alif' } },
        { id: 'seq-ba', content: { tr: 'ب - Bā', nl: 'ب - Bā' } },
        { id: 'seq-ta', content: { tr: 'ت - Tā', nl: 'ت - Tā' } },
        { id: 'seq-tha', content: { tr: 'ث - Thā', nl: 'ث - Thā' } }
      ],
      correctOrder: ['seq-alif', 'seq-ba', 'seq-ta', 'seq-tha']
    },
    {
      id: 'quiz-1-seq-2',
      type: 'order-sequence',
      skill: 'letter-order',
      question: { tr: 'Harfleri alfabe sırasına göre dizin', nl: 'Zet de letters in alfabetische volgorde' },
      sequence: [
        { id: 'seq-jim', content: { tr: 'ج - Cīm', nl: 'ج - Cīm' } },
        { id: 'seq-ha', content: { tr: 'ح - Ḥā', nl: 'ح - Ḥā' } },
        { id: 'seq-kha', content: { tr: 'خ - Khā', nl: 'خ - Khā' } }
      ],
      correctOrder: ['seq-jim', 'seq-ha', 'seq-kha']
    },
    {
      id: 'quiz-1-seq-3',
      type: 'order-sequence',
      skill: 'letter-order',
      question: { tr: 'Harfleri alfabe sırasına göre dizin', nl: 'Zet de letters in alfabetische volgorde' },
      sequence: [
        { id: 'seq-dal', content: { tr: 'د - Dāl', nl: 'د - Dāl' } },
        { id: 'seq-dhal', content: { tr: 'ذ - Dhāl', nl: 'ذ - Dhāl' } },
        { id: 'seq-ra', content: { tr: 'ر - Rā', nl: 'ر - Rā' } },
        { id: 'seq-zay', content: { tr: 'ز - Zāy', nl: 'ز - Zāy' } }
      ],
      correctOrder: ['seq-dal', 'seq-dhal', 'seq-ra', 'seq-zay']
    },
    {
      id: 'quiz-1-seq-4',
      type: 'order-sequence',
      skill: 'letter-order',
      question: { tr: 'Harfleri alfabe sırasına göre dizin', nl: 'Zet de letters in alfabetische volgorde' },
      sequence: [
        { id: 'seq-sin', content: { tr: 'س - Sīn', nl: 'س - Sīn' } },
        { id: 'seq-shin', content: { tr: 'ش - Shīn', nl: 'ش - Shīn' } },
        { id: 'seq-sad', content: { tr: 'ص - Ṣād', nl: 'ص - Ṣād' } },
        { id: 'seq-dad', content: { tr: 'ض - Ḍād', nl: 'ض - Ḍād' } }
      ],
      correctOrder: ['seq-sin', 'seq-shin', 'seq-sad', 'seq-dad']
    },
    {
      id: 'quiz-1-seq-5',
      type: 'order-sequence',
      skill: 'letter-order',
      question: { tr: 'Harfleri alfabe sırasına göre dizin', nl: 'Zet de letters in alfabetische volgorde' },
      sequence: [
        { id: 'seq-fa', content: { tr: 'ف - Fā', nl: 'ف - Fā' } },
        { id: 'seq-qaf', content: { tr: 'ق - Qāf', nl: 'ق - Qāf' } },
        { id: 'seq-kaf', content: { tr: 'ك - Kef', nl: 'ك - Kef' } },
        { id: 'seq-lam', content: { tr: 'ل - Lām', nl: 'ل - Lām' } },
        { id: 'seq-mim', content: { tr: 'م - Mīm', nl: 'م - Mīm' } }
      ],
      correctOrder: ['seq-fa', 'seq-qaf', 'seq-kaf', 'seq-lam', 'seq-mim']
    },

    // Additional Multiple Choice - Mixed Recognition
    {
      id: 'quiz-1-mc-16',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'Hangi harf "cami" kelimesinde bulunur?', nl: 'Welke letter komt voor in het woord "cami"?' },
      options: [
        { tr: 'ج', nl: 'ج' },
        { tr: 'ح', nl: 'ح' },
        { tr: 'خ', nl: 'خ' },
        { tr: 'ه', nl: 'ه' }
      ],
      correctAnswer: 0
    },
    {
      id: 'quiz-1-mc-17',
      type: 'multiple-choice',
      skill: 'letter-pronunciation',
      question: { tr: 'ش harfi nasıl okunur?', nl: 'Hoe spreek je de letter ش uit?' },
      options: [
        { tr: 's', nl: 's' },
        { tr: 'ş / sj', nl: 'sj' },
        { tr: 'sa (kalın)', nl: 'sa (zwaar)' },
        { tr: 'z', nl: 'z' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-18',
      type: 'multiple-choice',
      skill: 'letter-recognition',
      question: { tr: 'Hangi harf "Shīn" adını taşır?', nl: 'Welke letter heet "Shīn"?' },
      options: [
        { tr: 'س', nl: 'س' },
        { tr: 'ش', nl: 'ش' },
        { tr: 'ص', nl: 'ص' },
        { tr: 'ض', nl: 'ض' }
      ],
      correctAnswer: 1
    },
    {
      id: 'quiz-1-mc-19',
      type: 'multiple-choice',
      skill: 'letter-type',
      question: { tr: 'Hangi harf boğazdan söylenir?', nl: 'Welke letter wordt vanuit de keel uitgesproken?' },
      options: [
        { tr: 'ب', nl: 'ب' },
        { tr: 'ت', nl: 'ت' },
        { tr: 'ح', nl: 'ح' },
        { tr: 'د', nl: 'د' }
      ],
      correctAnswer: 2
    },
    {
      id: 'quiz-1-mc-20',
      type: 'multiple-choice',
      skill: 'letter-example',
      question: { tr: '"zekat" kelimesi hangi harfle başlar?', nl: 'Met welke letter begint het woord "zekat"?' },
      options: [
        { tr: 'ذ', nl: 'ذ' },
        { tr: 'ر', nl: 'ر' },
        { tr: 'ز', nl: 'ز' },
        { tr: 'س', nl: 'س' }
      ],
      correctAnswer: 2
    }
  ]
};

// Lesson 2: Harfleri karışık şekilde okuyalım (Read letters in mixed order)
const lesson2: Lesson = {
  id: 'lesson-2',
  order: 2,
  level: 'Sayfa 2',
  content: {
    type: 'letter-practice',
    title: 'Harfleri karışık şekilde okuyalım',
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
    title: 'HARFLERİN BAŞTA, ORTADA VE SONDA YAZILIŞLARI',
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