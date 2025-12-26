import { Quiz } from '../data/notionLessons';

/**
 * Filter function to remove invalid quizzes:
 * 1. Remove quizzes with no content (empty questions or no options)
 * 2. Remove order-sequence type quizzes
 */
export function filterValidQuizzes(quizzes: Quiz[]): Quiz[] {
  return quizzes.filter(quiz => {
    // Remove order-sequence quizzes
    if (quiz.type === 'order-sequence') {
      return false;
    }

    // Check if question has content
    if (!quiz.question?.tr || !quiz.question?.nl) {
      return false;
    }

    const optionBasedTypes = [
      'multiple-choice',
      'listen-choose',
      'true-false',
      'audio-mc',
      'timed-audio-mc',
      'error-detection',
      'production'
    ] as const;

    // For multiple-choice style quizzes: check options
    if (optionBasedTypes.includes(quiz.type as any)) {
      if (!quiz.options || quiz.options.length === 0) {
        return false;
      }
      
      // Check if all options have content
      const hasValidOptions = quiz.options.every(
        option => option.tr && option.nl && option.tr.trim() !== '' && option.nl.trim() !== ''
      );
      
      if (!hasValidOptions) {
        return false;
      }
      
      // For practice/production questions, correct answer can be omitted
      const requiresCorrectAnswer = quiz.type !== 'production';
      if (
        requiresCorrectAnswer &&
        (quiz.correctAnswer === undefined || quiz.correctAnswer === null || quiz.correctAnswer >= quiz.options.length)
      ) {
        return false;
      }
    }

    // For drag-drop: check items and correctPairs
    if (quiz.type === 'drag-drop') {
      if (!quiz.items || quiz.items.length === 0) {
        return false;
      }
      
      if (!quiz.correctPairs || quiz.correctPairs.length === 0) {
        return false;
      }
      
      // Check if all items have content
      const hasValidItems = quiz.items.every(
        item => item.content?.tr && item.content?.nl && item.content.tr.trim() !== '' && item.content.nl.trim() !== ''
      );
      
      if (!hasValidItems) {
        return false;
      }
    }

    return true;
  });
}
