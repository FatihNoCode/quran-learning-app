// Interactive lesson data for the Alif Ba site.
// Keeps lesson structure small (5 seeded lessons) so the teacher panel can manage them easily.

export type LessonContentType =
  | 'image-lesson'
  | 'letter-grid'
  | 'letter-practice'
  | 'letter-positions'
  | 'letter-connected'
  | 'letter-haraka'
  | 'haraka-practice';

export type LessonActivityType =
  | 'yes-no'
  | 'multiple-choice'
  | 'matching'
  | 'open-ended';

export interface LessonItem {
  arabic: string;
  transliteration?: string;
  explanation?: string;
  audioUrl?: string;
}

export interface LessonContent {
  type: LessonContentType;
  title: string;
  titleNl?: string;
  instruction: string;
  instructionNl?: string;
  letterGroups?: string[][];
  items?: LessonItem[];
  color?: string;
  imagePath?: string;
  audioUrl?: string;
  learningModes?: LessonActivityType[];
}

export interface Lesson {
  id: string;
  order: number;
  level: string;
  content: LessonContent;
  lastEditedAt?: string;
  lastEditedBy?: string;
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    order: 1,
    level: 'Alif-Ba',
    lastEditedAt: '2025-12-16T12:00:00.000Z',
    lastEditedBy: 'system',
    content: {
      type: 'letter-grid',
      title: 'Alif ve Ba Temelleri',
      titleNl: 'Alif en Ba Basis',
      instruction:
        'Harfleri tanıyın, sesli okuyun ve çizgi defterinde tekrar edin.',
      instructionNl:
        'Herken de letters, lees ze hardop en oefen ze in je schrift.',
      letterGroups: [['ا', 'ب', 'ت'], ['ث', 'ن', 'م']],
      color: '#7C3AED',
      learningModes: ['multiple-choice', 'yes-no'],
    },
  },
  {
    id: 'lesson-2',
    order: 2,
    level: 'Alif-Ba',
    lastEditedAt: '2025-12-16T12:00:00.000Z',
    lastEditedBy: 'system',
    content: {
      type: 'letter-practice',
      title: 'Harf Seslendirme',
      titleNl: 'Letter Uitspraak',
      instruction:
        'Her harfi dinleyin ve ardından tekrar edin. Sesleri heceleyin.',
      instructionNl:
        'Luister naar elke letter en herhaal. Spreek de klanken uit.',
      color: '#2563EB',
      items: [
        { arabic: 'ا', transliteration: 'Alif', explanation: 'Düz ses (Elif)' },
        { arabic: 'ب', transliteration: 'Ba', explanation: 'Dudak sesi' },
        { arabic: 'ت', transliteration: 'Ta', explanation: 'Dil ucu dişler' },
        { arabic: 'ث', transliteration: 'Tha', explanation: 'Dil ucu dişlerin önüsü' },
      ],
      learningModes: ['multiple-choice', 'open-ended'],
    },
  },
  {
    id: 'lesson-3',
    order: 3,
    level: 'Alif-Ba',
    lastEditedAt: '2025-12-16T12:00:00.000Z',
    lastEditedBy: 'system',
    content: {
      type: 'letter-positions',
      title: 'Ba Harfi Bağlantıları',
      titleNl: 'Ba in Verbinding',
      instruction:
        'Harfin başta, ortada ve sonda nasıl yazıldığını gör.',
      instructionNl:
        'Zie hoe de letter aan het begin, midden en eind wordt geschreven.',
      color: '#059669',
      items: [
        { arabic: 'بـ', explanation: 'Ba başlangıç' },
        { arabic: 'ـبـ', explanation: 'Ba orta' },
        { arabic: 'ـب', explanation: 'Ba son' },
      ],
      learningModes: ['matching'],
    },
  },
  {
    id: 'lesson-4',
    order: 4,
    level: 'Harakat',
    lastEditedAt: '2025-12-16T12:00:00.000Z',
    lastEditedBy: 'system',
    content: {
      type: 'letter-haraka',
      title: 'Fetha ile Harfler',
      titleNl: 'Letters met Fatha',
      instruction:
        'Fetha işaretiyle harflerin sesini dinleyin ve tekrar edin.',
      instructionNl:
        'Luister naar de klank met fatha en herhaal.',
      color: '#D97706',
      items: [
        { arabic: 'بَ', transliteration: 'Ba', explanation: 'Açık a sesi' },
        { arabic: 'تَ', transliteration: 'Ta', explanation: 'A sesi ile' },
        { arabic: 'نَ', transliteration: 'Na', explanation: 'Burundan gelen a sesi' },
      ],
      learningModes: ['yes-no', 'multiple-choice'],
    },
  },
  {
    id: 'lesson-5',
    order: 5,
    level: 'Kelimeler',
    lastEditedAt: '2025-12-16T12:00:00.000Z',
    lastEditedBy: 'system',
    content: {
      type: 'letter-connected',
      title: 'Bağlantılı Harflerle Kelimeler',
      titleNl: 'Woorden met Verbonden Letters',
      instruction:
        'Harfleri birleştirerek basit kelimeler oku ve anlamlandır.',
      instructionNl:
        'Lees eenvoudige woorden met verbonden letters en begrijp de betekenis.',
      color: '#EC4899',
      items: [
        { arabic: 'بَاب', transliteration: 'baab', explanation: 'Kapı' },
        { arabic: 'بِنْت', transliteration: 'bint', explanation: 'Kız' },
        { arabic: 'ثَوْب', transliteration: 'thawb', explanation: 'Elbise' },
      ],
      learningModes: ['open-ended', 'matching'],
    },
  },
];

export const getLessonByOrder = (order: number): Lesson | undefined =>
  lessons.find((lesson) => lesson.order === order);

export const getNextLesson = (currentOrder: number): Lesson | undefined =>
  lessons.find((lesson) => lesson.order === currentOrder + 1);

export const getTotalLessons = (): number => lessons.length;

export const getLessonsByLevel = (level: string): Lesson[] =>
  lessons.filter((lesson) => lesson.level === level);

export default lessons;
