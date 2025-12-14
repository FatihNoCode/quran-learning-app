// Arabic learning curriculum based on Notion pages
// 8 lessons following the exact structure from Alif Ba Notion workspace

export interface LessonContent {
  type: 'letter-grid' | 'letter-practice' | 'letter-positions' | 'letter-connected' | 
        'letter-haraka' | 'haraka-practice';
  title: string; // Only Turkish as in original pages
  instruction: string; // Only Turkish as in original pages
  letterGroups?: string[][]; // For grouped letter display
  items?: LessonItem[];
  color?: string;
}

export interface LessonItem {
  arabic: string;
  transliteration?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  order: number;
  level: string;
  content: LessonContent;
}

// Lesson 1: KUR'AN HARFLERİ (Quran Letters)
const lesson1: Lesson = {
  id: 'lesson-1',
  order: 1,
  level: 'Sayfa 1',
  content: {
    type: 'letter-grid',
    title: 'KUR\'AN HARFLERİ',
    instruction: 'Harfleri sağdan başlayarak okuyunuz!',
    letterGroups: [
      ['ا', 'ب', 'ت', 'ث'],
      ['ج', 'ح', 'خ'],
      ['د', 'ذ', 'ر', 'ز'],
      ['س', 'ش', 'ص', 'ض'],
      ['ط', 'ظ', 'ع', 'غ'],
      ['ف', 'ق', 'ك', 'ل', 'م'],
      ['ن', 'و', 'هـ', 'لا', 'ي']
    ],
    color: '#10B981' // Green
  }
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