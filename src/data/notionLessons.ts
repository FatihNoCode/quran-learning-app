// Interactive lesson data built from the provided lesson images.
// Titles/instructions include TR and NL. Audio URLs are placeholders for future assets.

export type LessonContentType =
  | 'image-lesson'
  | 'letter-grid'
  | 'letter-practice'
  | 'letter-positions'
  | 'letter-connected'
  | 'letter-haraka'
  | 'haraka-practice';

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
}

export interface Lesson {
  id: string;
  order: number;
  level: string;
  content: LessonContent;
}

const palette = [
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#D97706',
  '#EC4899',
  '#0EA5E9',
];

const lessonImages = Array.from({ length: 24 }, (_, i) => {
  const idx = i + 1;
  const num = idx.toString().padStart(2, '0');
  return {
    id: `lesson-${idx}`,
    order: idx,
    level: `Ünite 1`,
    imagePath: `/lesson-images/lesson-${num}.jpeg`,
  };
});

export const lessons: Lesson[] = lessonImages.map((l, i) => {
  const color = palette[i % palette.length];
  return {
    id: l.id,
    order: l.order,
    level: l.level,
    content: {
      type: 'image-lesson',
      title: `Ders ${l.order}: Görsel`,
      titleNl: `Les ${l.order}: Afbeelding`,
      instruction:
        'Görseldeki notları inceleyin, harfleri sesli okuyun ve sonraki adıma geçin.',
      instructionNl:
        'Bekijk de notities in de afbeelding, lees de letters hardop en ga verder naar de volgende stap.',
      imagePath: l.imagePath,
      color,
      audioUrl: '',
    },
  };
});

export const getLessonByOrder = (order: number): Lesson | undefined =>
  lessons.find((lesson) => lesson.order === order);

export const getNextLesson = (currentOrder: number): Lesson | undefined =>
  lessons.find((lesson) => lesson.order === currentOrder + 1);

export const getTotalLessons = (): number => lessons.length;

export const getLessonsByLevel = (level: string): Lesson[] =>
  lessons.filter((lesson) => lesson.level === level);

export default lessons;
