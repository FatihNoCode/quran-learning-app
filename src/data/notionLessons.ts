import { ARABIC_LETTERS, getLetter, ArabicLetter } from './arabicLetters';

// Lesson content structure
export interface LessonContent {
  type: 'alphabet-detail' | 'letter-grid' | 'letter-practice' | 'letter-positions' | 'letter-connected' | 
        'letter-haraka' | 'haraka-practice';
  title: string; // Only Turkish as in original pages
  titleTranslations?: { tr: string; nl: string };
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
    title: 'Arap alfabesi - Kur\'an harfleri',
    titleTranslations: {
      tr: 'Arap alfabesi - Kur\'an harfleri',
      nl: 'Arabisch alfabet - Koranletters'
    },
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
  quizzes: [{"id": "quiz-1-mc-1","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Sin\" hangi harftir?","nl": "Welke letter is \"Shin\"?"},"options": [{"tr": "س","nl": "س"},{"tr": "ش","nl": "ش"},{"tr": "ص","nl": "ص"},{"tr": "ث","nl": "ث"}],"correctAnswer": 1},{"id": "quiz-1-tf-1","type": "true-false","skill": "letter-property","question": {"tr": "لا, Lam + Elif birlesimidir.","nl": "لا is een combinatie van Lam + Alif."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 0},{"id": "quiz-1-dd-1","type": "drag-drop","skill": "letter-name","question": {"tr": "Harfleri dogru adlariyla eslestir.","nl": "Koppel de letters aan de juiste naam."},"items": [{"id": "letter-mim","content": {"tr": "م","nl": "م"}},{"id": "letter-ra","content": {"tr": "ر","nl": "ر"}},{"id": "letter-fa","content": {"tr": "ف","nl": "ف"}},{"id": "sound-ra","content": {"tr": "Ra","nl": "Ra"}},{"id": "sound-mim","content": {"tr": "Mim","nl": "Mim"}},{"id": "sound-fa","content": {"tr": "Fe","nl": "Fe"}}],"correctPairs": [{"sourceId": "letter-ra","targetId": "sound-ra"},{"sourceId": "letter-mim","targetId": "sound-mim"},{"sourceId": "letter-fa","targetId": "sound-fa"}]},{"id": "quiz-1-mc-2","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Kef\" hangi Arap harfidir?","nl": "Welke Arabische letter is \"Kef\"?"},"options": [{"tr": "ق","nl": "ق"},{"tr": "ك","nl": "ك"},{"tr": "ل","nl": "ل"},{"tr": "ف","nl": "ف"}],"correctAnswer": 1},{"id": "quiz-1-tf-2","type": "true-false","skill": "letter-property","question": {"tr": "Vav (و), Nun (ن) ile ayni yazilir.","nl": "Waw (و) wordt hetzelfde geschreven als Nun (ن)."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 1},{"id": "quiz-1-mc-3","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Zel\" hangi harftir?","nl": "Welke letter is \"Dhal\"?"},"options": [{"tr": "ز","nl": "ز"},{"tr": "د","nl": "د"},{"tr": "ذ","nl": "ذ"},{"tr": "ر","nl": "ر"}],"correctAnswer": 2},{"id": "quiz-1-dd-2","type": "drag-drop","skill": "letter-sound","question": {"tr": "Sesleri dogru harfle eslestir.","nl": "Koppel de geluiden aan de juiste letter."},"items": [{"id": "letter-alif","content": {"tr": "ا","nl": "ا"}},{"id": "letter-ba","content": {"tr": "ب","nl": "ب"}},{"id": "letter-ta","content": {"tr": "ت","nl": "ت"}},{"id": "sound-ba","content": {"tr": "Ses: \"ba\"","nl": "Geluid: \"ba\""}},{"id": "sound-ta","content": {"tr": "Ses: \"ta\"","nl": "Geluid: \"ta\""}},{"id": "sound-alif","content": {"tr": "Ses: \"elif\"","nl": "Geluid: \"alif\""}}],"correctPairs": [{"sourceId": "letter-ba","targetId": "sound-ba"},{"sourceId": "letter-ta","targetId": "sound-ta"},{"sourceId": "letter-alif","targetId": "sound-alif"}]},{"id": "quiz-1-mc-4","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Ayn\" hangi harftir?","nl": "Welke letter is \"Ayn\"?"},"options": [{"tr": "غ","nl": "غ"},{"tr": "ع","nl": "ع"},{"tr": "ح","nl": "ح"},{"tr": "خ","nl": "خ"}],"correctAnswer": 1},{"id": "quiz-1-tf-3","type": "true-false","skill": "letter-property","question": {"tr": "Sin (س) ustunde uc nokta vardir.","nl": "Sin (س) heeft drie punten erboven."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 1},{"id": "quiz-1-mc-5","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"He\" hangi harftir?","nl": "Welke letter is \"He\"?"},"options": [{"tr": "ه","nl": "ه"},{"tr": "ح","nl": "ح"},{"tr": "ع","nl": "ع"},{"tr": "م","nl": "م"}],"correctAnswer": 0},{"id": "quiz-1-dd-3","type": "drag-drop","skill": "letter-feature","question": {"tr": "Noktali ve noktasiz harfleri kutulara ayir.","nl": "Sorteer in vakken: met punten / zonder punten."},"items": [{"id": "letter-ba","content": {"tr": "ب","nl": "ب"}},{"id": "letter-ta","content": {"tr": "ت","nl": "ت"}},{"id": "letter-ra","content": {"tr": "ر","nl": "ر"}},{"id": "letter-lam","content": {"tr": "ل","nl": "ل"}},{"id": "letter-nun","content": {"tr": "ن","nl": "ن"}},{"id": "letter-sin","content": {"tr": "س","nl": "س"}},{"id": "sound-dots","content": {"tr": "Noktali","nl": "Met punten"}},{"id": "sound-no-dots","content": {"tr": "Noktasiz","nl": "Zonder punten"}}],"correctPairs": [{"sourceId": "letter-ba","targetId": "sound-dots"},{"sourceId": "letter-ta","targetId": "sound-dots"},{"sourceId": "letter-nun","targetId": "sound-dots"},{"sourceId": "letter-sin","targetId": "sound-dots"},{"sourceId": "letter-ra","targetId": "sound-no-dots"},{"sourceId": "letter-lam","targetId": "sound-no-dots"}]},{"id": "quiz-1-mc-6","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Kaf\" hangi harftir?","nl": "Welke letter is \"Kaf\"?"},"options": [{"tr": "ق","nl": "ق"},{"tr": "ك","nl": "ك"},{"tr": "ف","nl": "ف"},{"tr": "غ","nl": "غ"}],"correctAnswer": 0},{"id": "quiz-1-tf-4","type": "true-false","skill": "letter-property","question": {"tr": "Se (ث) ustunde uc nokta vardir.","nl": "Tha (ث) heeft drie punten erboven."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 0},{"id": "quiz-1-mc-7","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Dal\" hangi harftir?","nl": "Welke letter is \"Dal\"?"},"options": [{"tr": "د","nl": "د"},{"tr": "ذ","nl": "ذ"},{"tr": "ز","nl": "ز"},{"tr": "ر","nl": "ر"}],"correctAnswer": 0},{"id": "quiz-1-dd-4","type": "drag-drop","skill": "letter-name","question": {"tr": "Harfleri adlariyla eslestir.","nl": "Koppel de letters aan hun namen."},"items": [{"id": "letter-sad","content": {"tr": "ص","nl": "ص"}},{"id": "letter-ta","content": {"tr": "ط","nl": "ط"}},{"id": "letter-za","content": {"tr": "ظ","nl": "ظ"}},{"id": "sound-sad","content": {"tr": "Sad","nl": "Sad"}},{"id": "sound-ta","content": {"tr": "Ti","nl": "Ti"}},{"id": "sound-za","content": {"tr": "Zi","nl": "Zi"}}],"correctPairs": [{"sourceId": "letter-sad","targetId": "sound-sad"},{"sourceId": "letter-ta","targetId": "sound-ta"},{"sourceId": "letter-za","targetId": "sound-za"}]},{"id": "quiz-1-mc-8","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Mim\" hangi harftir?","nl": "Welke letter is \"Mim\"?"},"options": [{"tr": "ن","nl": "ن"},{"tr": "ل","nl": "ل"},{"tr": "م","nl": "م"},{"tr": "ه","nl": "ه"}],"correctAnswer": 2},{"id": "quiz-1-tf-5","type": "true-false","skill": "letter-property","question": {"tr": "Fe (ف) ustunde bir nokta vardir.","nl": "Fa (ف) heeft een punt erboven."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 0},{"id": "quiz-1-mc-9","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Ze\" hangi harftir?","nl": "Welke letter is \"Ze\"?"},"options": [{"tr": "ر","nl": "ر"},{"tr": "ذ","nl": "ذ"},{"tr": "ز","nl": "ز"},{"tr": "د","nl": "د"}],"correctAnswer": 2},{"id": "quiz-1-dd-5","type": "drag-drop","skill": "letter-sound","question": {"tr": "Sesleri dogru harfe birak.","nl": "Sleep het geluid naar de juiste letter."},"items": [{"id": "letter-sin","content": {"tr": "س","nl": "س"}},{"id": "letter-shin","content": {"tr": "ش","nl": "ش"}},{"id": "sound-sin","content": {"tr": "Ses: \"sin\"","nl": "Geluid: \"sin\""}},{"id": "sound-shin","content": {"tr": "Ses: \"sin\" (shin)","nl": "Geluid: \"shin\""}}],"correctPairs": [{"sourceId": "letter-sin","targetId": "sound-sin"},{"sourceId": "letter-shin","targetId": "sound-shin"}]},{"id": "quiz-1-mc-10","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Ha\" hangi harftir?","nl": "Welke letter is \"Ha\"?"},"options": [{"tr": "ه","nl": "ه"},{"tr": "ح","nl": "ح"},{"tr": "خ","nl": "خ"},{"tr": "ع","nl": "ع"}],"correctAnswer": 0},{"id": "quiz-1-tf-6","type": "true-false","skill": "letter-property","question": {"tr": "Cim (ج) ustunde nokta vardir.","nl": "Jim (ج) heeft een punt erboven."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 1},{"id": "quiz-1-mc-11","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Ya\" hangi harftir?","nl": "Welke letter is \"Ya\"?"},"options": [{"tr": "ي","nl": "ي"},{"tr": "و","nl": "و"},{"tr": "ه","nl": "ه"},{"tr": "ن","nl": "ن"}],"correctAnswer": 0},{"id": "quiz-1-seq-1","type": "order-sequence","skill": "letter-order","question": {"tr": "Elif-Ba sirasina gore dizin.","nl": "Zet in Elif-Ba volgorde."},"sequence": [{"id": "seq-alif","content": {"tr": "ا","nl": "ا"}},{"id": "seq-ba","content": {"tr": "ب","nl": "ب"}},{"id": "seq-ta","content": {"tr": "ت","nl": "ت"}},{"id": "seq-tha","content": {"tr": "ث","nl": "ث"}}],"correctOrder": ["seq-alif","seq-ba","seq-ta","seq-tha"]},{"id": "quiz-1-mc-12","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Lam\" hangi harftir?","nl": "Welke letter is \"Lam\"?"},"options": [{"tr": "ل","nl": "ل"},{"tr": "لا","nl": "لا"},{"tr": "م","nl": "م"},{"tr": "ك","nl": "ك"}],"correctAnswer": 0},{"id": "quiz-1-tf-7","type": "true-false","skill": "letter-property","question": {"tr": "Gayn (غ) ve Ayn (ع) benzer gorunur.","nl": "Ghayn (غ) en Ayn (ع) lijken op elkaar."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 0},{"id": "quiz-1-mc-13","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Dad\" hangi harftir?","nl": "Welke letter is \"Dad\"?"},"options": [{"tr": "ص","nl": "ص"},{"tr": "ض","nl": "ض"},{"tr": "ظ","nl": "ظ"},{"tr": "ط","nl": "ط"}],"correctAnswer": 1},{"id": "quiz-1-dd-6","type": "drag-drop","skill": "letter-feature","question": {"tr": "Nokta sayilarini eslestir.","nl": "Koppel letters aan het aantal punten."},"items": [{"id": "letter-ta","content": {"tr": "ت","nl": "ت"}},{"id": "letter-ba","content": {"tr": "ب","nl": "ب"}},{"id": "letter-tha","content": {"tr": "ث","nl": "ث"}},{"id": "sound-one-dot","content": {"tr": "1 nokta","nl": "1 punt"}},{"id": "sound-two-dots","content": {"tr": "2 nokta","nl": "2 punten"}},{"id": "sound-three-dots","content": {"tr": "3 nokta","nl": "3 punten"}}],"correctPairs": [{"sourceId": "letter-ba","targetId": "sound-one-dot"},{"sourceId": "letter-ta","targetId": "sound-two-dots"},{"sourceId": "letter-tha","targetId": "sound-three-dots"}]},{"id": "quiz-1-mc-14","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Nun\" hangi harftir?","nl": "Welke letter is \"Nun\"?"},"options": [{"tr": "ن","nl": "ن"},{"tr": "م","nl": "م"},{"tr": "ي","nl": "ي"},{"tr": "و","nl": "و"}],"correctAnswer": 0},{"id": "quiz-1-tf-8","type": "true-false","skill": "letter-property","question": {"tr": "Ra (ر) noktali midir?","nl": "Ra (ر) heeft punten."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 1},{"id": "quiz-1-mc-15","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Sad\" hangi harftir?","nl": "Welke letter is \"Sad\"?"},"options": [{"tr": "ص","nl": "ص"},{"tr": "س","nl": "س"},{"tr": "ش","nl": "ش"},{"tr": "ض","nl": "ض"}],"correctAnswer": 0},{"id": "quiz-1-dd-7","type": "drag-drop","skill": "letter-match","question": {"tr": "Eslesen sekilleri birlestir.","nl": "Sleep de bijpassende paren."},"items": [{"id": "letter-ayn","content": {"tr": "ع","nl": "ع"}},{"id": "letter-dal","content": {"tr": "د","nl": "د"}},{"id": "letter-sin","content": {"tr": "س","nl": "س"}},{"id": "sound-ghayn","content": {"tr": "غ","nl": "غ"}},{"id": "sound-dhal","content": {"tr": "ذ","nl": "ذ"}},{"id": "sound-shin","content": {"tr": "ش","nl": "ش"}}],"correctPairs": [{"sourceId": "letter-ayn","targetId": "sound-ghayn"},{"sourceId": "letter-dal","targetId": "sound-dhal"},{"sourceId": "letter-sin","targetId": "sound-shin"}]},{"id": "quiz-1-mc-16","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Hi\" hangi harftir?","nl": "Welke letter is \"Kha\"?"},"options": [{"tr": "ح","nl": "ح"},{"tr": "خ","nl": "خ"},{"tr": "ه","nl": "ه"},{"tr": "غ","nl": "غ"}],"correctAnswer": 1},{"id": "quiz-1-tf-9","type": "true-false","skill": "letter-property","question": {"tr": "Lam-Elif (لا) sik kullanilan tek sekil gibidir.","nl": "Lam-Alif (لا) wordt vaak samen als een vorm gebruikt."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 0},{"id": "quiz-1-mc-17","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Te\" hangi harftir?","nl": "Welke letter is \"Te\"?"},"options": [{"tr": "ت","nl": "ت"},{"tr": "ث","nl": "ث"},{"tr": "ب","nl": "ب"},{"tr": "ن","nl": "ن"}],"correctAnswer": 0},{"id": "quiz-1-dd-9","type": "drag-drop","skill": "letter-sound","question": {"tr": "Dinle ve dogru harfe birak (\"kaf\").","nl": "Luister en sleep naar de juiste letter (\"kaf\")."},"items": [{"id": "letter-qaf","content": {"tr": "ق","nl": "ق"}},{"id": "letter-kaf","content": {"tr": "ك","nl": "ك"}},{"id": "letter-fa","content": {"tr": "ف","nl": "ف"}},{"id": "letter-lam","content": {"tr": "ل","nl": "ل"}},{"id": "sound-kaf","content": {"tr": "Ses: \"kaf\"","nl": "Geluid: \"kaf\""}},{"id": "sound-qaf","content": {"tr": "Ses: \"qaf\"","nl": "Geluid: \"qaf\""}},{"id": "sound-fa","content": {"tr": "Ses: \"fe\"","nl": "Geluid: \"fa\""}},{"id": "sound-lam","content": {"tr": "Ses: \"lam\"","nl": "Geluid: \"lam\""}}],"correctPairs": [{"sourceId": "letter-kaf","targetId": "sound-kaf"},{"sourceId": "letter-qaf","targetId": "sound-qaf"},{"sourceId": "letter-fa","targetId": "sound-fa"},{"sourceId": "letter-lam","targetId": "sound-lam"}]},{"id": "quiz-1-mc-18","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Ti\" hangi harftir?","nl": "Welke letter is \"Ta dik\"?"},"options": [{"tr": "ت","nl": "ت"},{"tr": "ط","nl": "ط"},{"tr": "ظ","nl": "ظ"},{"tr": "ض","nl": "ض"}],"correctAnswer": 1},{"id": "quiz-1-tf-10","type": "true-false","skill": "letter-property","question": {"tr": "Za (ظ) noktalidir.","nl": "Za (ظ) heeft een punt."},"options": [{"tr": "Dogru","nl": "Waar"},{"tr": "Yanlis","nl": "Onwaar"}],"correctAnswer": 0},{"id": "quiz-1-mc-19","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Se\" hangi harftir?","nl": "Welke letter is \"Se\"?"},"options": [{"tr": "ش","nl": "ش"},{"tr": "ث","nl": "ث"},{"tr": "س","nl": "س"},{"tr": "ت","nl": "ت"}],"correctAnswer": 1},{"id": "quiz-1-dd-8","type": "drag-drop","skill": "letter-name","question": {"tr": "Hizli eslestirme: isimleri harflere birak.","nl": "Sleep de namen naar de letters."},"items": [{"id": "letter-qaf","content": {"tr": "ق","nl": "ق"}},{"id": "letter-waw","content": {"tr": "و","nl": "و"}},{"id": "letter-ya","content": {"tr": "ي","nl": "ي"}},{"id": "letter-ha","content": {"tr": "ه","nl": "ه"}},{"id": "sound-ha","content": {"tr": "He","nl": "He"}},{"id": "sound-ya","content": {"tr": "Ya","nl": "Ya"}},{"id": "sound-kaf","content": {"tr": "Kaf","nl": "Kaf"}},{"id": "sound-vav","content": {"tr": "Vav","nl": "Waw"}}],"correctPairs": [{"sourceId": "letter-ya","targetId": "sound-ya"},{"sourceId": "letter-waw","targetId": "sound-vav"},{"sourceId": "letter-qaf","targetId": "sound-kaf"},{"sourceId": "letter-ha","targetId": "sound-ha"}]},{"id": "quiz-1-mc-20","type": "multiple-choice","skill": "letter-recognition","question": {"tr": "\"Alif\" hangi harftir?","nl": "Welke letter is \"Alif\"?"},"options": [{"tr": "ب","nl": "ب"},{"tr": "ا","nl": "ا"},{"tr": "ل","nl": "ل"},{"tr": "د","nl": "د"}],"correctAnswer": 1}],
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
