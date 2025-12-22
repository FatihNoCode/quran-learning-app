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

    // For multiple-choice, listen-choose, and true-false: check options
    if (quiz.type === 'multiple-choice' || quiz.type === 'listen-choose' || quiz.type === 'true-false') {
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
      
      // Check if correctAnswer is valid
      if (quiz.correctAnswer === undefined || quiz.correctAnswer === null || quiz.correctAnswer >= quiz.options.length) {
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
