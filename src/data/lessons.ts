import { placeholderLessons } from './placeholderLessons';

// Lesson level definitions derived from placeholder lessons (plus a legacy "letters" entry)
export const LESSON_LEVELS = placeholderLessons.reduce((acc, lesson) => {
  acc[lesson.id] = {
    tr: lesson.title.tr,
    nl: lesson.title.nl,
  };
  return acc;
}, {
  letters: {
    // Map legacy "letters" level to the real first lesson title so it doesn't show as a bogus "Les 1"
    tr: placeholderLessons[0]?.title.tr || 'Ders 1: Arap alfabesi',
    nl: placeholderLessons[0]?.title.nl || 'Les 1: Arabisch alfabet',
  }
} as Record<string, { tr: string; nl: string }>);

// Export for backward compatibility
export const lessons = [];
