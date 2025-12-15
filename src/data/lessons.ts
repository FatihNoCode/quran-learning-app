// Compatibility layer to expose lessons for components that expect
// `content.letter`, `title`, and `description`. The source of truth is
// the Notion-based lessons defined in `notionLessons.ts`.
import {
  lessons as notionLessons,
  getLessonByOrder as getNotionLessonByOrder,
  getNextLesson as getNotionNextLesson,
  getTotalLessons as getNotionTotalLessons,
  getLessonsByLevel as getNotionLessonsByLevel,
  Lesson as NotionLesson,
} from './notionLessons';

export type Lesson = NotionLesson & {
  title?: { tr: string; nl: string };
  description?: { tr: string; nl: string };
  content: NotionLesson['content'] & {
    letter?: string;
    pronunciation?: string;
    examples?: string[];
  };
};

// Derive a representative letter and basic metadata so legacy components
// (LessonViewer, ReviewSession, TeacherDashboard, StudentManagement)
// can continue to function.
export const lessons: Lesson[] = notionLessons.map((lesson) => {
  const letterFromGroups = lesson.content.letterGroups?.[0]?.[0];
  const letterFromItems = lesson.content.items?.[0]?.arabic;
  const letter = letterFromGroups || letterFromItems || '';

  return {
    ...lesson,
    title: {
      tr: lesson.content.title,
      nl: lesson.content.titleNl || lesson.content.title,
    },
    description: {
      tr: lesson.content.instruction || '',
      nl: lesson.content.instructionNl || lesson.content.instruction || '',
    },
    content: {
      ...lesson.content,
      letter,
      pronunciation: letter || undefined,
      examples:
        lesson.content.items?.map((item) => item.arabic) ??
        lesson.content.letterGroups?.flat() ??
        [],
    },
  };
});

// Level labels used by TeacherDashboard/StudentManagement UI.
export const LESSON_LEVELS: Record<
  string,
  { tr: string; nl: string }
> = Array.from(
  new Set(notionLessons.map((lesson) => lesson.level))
).reduce((acc, level) => {
  acc[level] = { tr: level, nl: level };
  return acc;
}, {} as Record<string, { tr: string; nl: string }>);

export const getLessonByOrder = (order: number) =>
  getNotionLessonByOrder(order);
export const getNextLesson = (currentOrder: number) =>
  getNotionNextLesson(currentOrder);
export const getTotalLessons = () => getNotionTotalLessons();
export const getLessonsByLevel = (level: string) =>
  getNotionLessonsByLevel(level);

export default lessons;
