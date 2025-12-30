// Mastery tracking and spaced repetition system

export interface SkillMastery {
  skillId: string;
  level: number; // 0-100
  attempts: number;
  correctAnswers: number;
  lastPracticed: string; // ISO date
  nextReview: string; // ISO date for spaced repetition
  reviewInterval: number; // Days until next review
}

export interface ReviewQueueItem {
  questionId: string;
  skillId: string;
  difficulty: number; // 0-10
  lastAttempt: string;
  nextReview: string;
  correctStreak: number; // How many times answered correctly in a row
  incorrectStreak: number; // How many times answered incorrectly in a row
}

export interface StudentProgress {
  userId: string;
  username: string;
  name: string;
  currentLessonOrder: number;
  completedLessons: string[];
  skillMastery: Record<string, SkillMastery>; // skillId -> mastery data
  reviewQueue: ReviewQueueItem[];
  totalPoints: number;
  badges: Badge[];
  stats: {
    totalQuizzesCompleted: number;
    averageAccuracy: number;
    currentStreak: number; // Days in a row
    bestStreak: number;
    lastActive: string;
  };
}

export interface Badge {
  id: string;
  type: 'accuracy' | 'mastery' | 'completion' | 'streak';
  name: {
    tr: string;
    nl: string;
  };
  description: {
    tr: string;
    nl: string;
  };
  icon: string;
  earnedAt: string;
}

// Badge definitions
export const BADGES: Omit<Badge, 'earnedAt'>[] = [
  // Accuracy badges
  {
    id: 'accuracy-bronze',
    type: 'accuracy',
    name: { tr: 'Bronz İsabet', nl: 'Bronzen Nauwkeurigheid' },
    description: { tr: '5 soruyu üst üste doğru cevapladın!', nl: 'Je hebt 5 vragen achter elkaar goed beantwoord!' },
    icon: '🥉'
  },
  {
    id: 'accuracy-silver',
    type: 'accuracy',
    name: { tr: 'Gümüş İsabet', nl: 'Zilveren Nauwkeurigheid' },
    description: { tr: '10 soruyu üst üste doğru cevapladın!', nl: 'Je hebt 10 vragen achter elkaar goed beantwoord!' },
    icon: '🥈'
  },
  {
    id: 'accuracy-gold',
    type: 'accuracy',
    name: { tr: 'Altın İsabet', nl: 'Gouden Nauwkeurigheid' },
    description: { tr: '20 soruyu üst üste doğru cevapladın!', nl: 'Je hebt 20 vragen achter elkaar goed beantwoord!' },
    icon: '🥇'
  },
  
  // Mastery badges
  {
    id: 'mastery-beginner',
    type: 'mastery',
    name: { tr: 'Yeni Başlayan', nl: 'Beginner' },
    description: { tr: '3 beceriyi %80 üstünde tamamladın!', nl: 'Je hebt 3 vaardigheden op 80%+ voltooid!' },
    icon: '⭐'
  },
  {
    id: 'mastery-intermediate',
    type: 'mastery',
    name: { tr: 'Orta Seviye', nl: 'Gevorderde' },
    description: { tr: '10 beceriyi %80 üstünde tamamladın!', nl: 'Je hebt 10 vaardigheden op 80%+ voltooid!' },
    icon: '🌟'
  },
  {
    id: 'mastery-expert',
    type: 'mastery',
    name: { tr: 'Uzman', nl: 'Expert' },
    description: { tr: '20 beceriyi %90 üstünde tamamladın!', nl: 'Je hebt 20 vaardigheden op 90%+ voltooid!' },
    icon: '💫'
  },
  
  // Completion badges
  {
    id: 'completion-5',
    type: 'completion',
    name: { tr: '5 Ders Tamamlandı', nl: '5 Lessen Voltooid' },
    description: { tr: '5 dersi başarıyla bitirdin!', nl: 'Je hebt 5 lessen succesvol afgerond!' },
    icon: '📚'
  },
  {
    id: 'completion-15',
    type: 'completion',
    name: { tr: '15 Ders Tamamlandı', nl: '15 Lessen Voltooid' },
    description: { tr: '15 dersi başarıyla bitirdin!', nl: 'Je hebt 15 lessen succesvol afgerond!' },
    icon: '📖'
  },
  {
    id: 'completion-25',
    type: 'completion',
    name: { tr: 'Tüm Dersler Tamamlandı', nl: 'Alle Lessen Voltooid' },
    description: { tr: 'Tüm 25 dersi bitirdin! Harika!', nl: 'Je hebt alle 25 lessen afgerond! Geweldig!' },
    icon: '🏆'
  },
  
  // Streak badges
  {
    id: 'streak-3',
    type: 'streak',
    name: { tr: '3 Günlük Seri', nl: '3-Daagse Streak' },
    description: { tr: '3 gün üst üste pratik yaptın!', nl: 'Je hebt 3 dagen achter elkaar geoefend!' },
    icon: '🔥'
  },
  {
    id: 'streak-7',
    type: 'streak',
    name: { tr: '1 Haftalık Seri', nl: '1 Week Streak' },
    description: { tr: '7 gün üst üste pratik yaptın!', nl: 'Je hebt 7 dagen achter elkaar geoefend!' },
    icon: '🔥🔥'
  },
  {
    id: 'streak-30',
    type: 'streak',
    name: { tr: '1 Aylık Seri', nl: '1 Maand Streak' },
    description: { tr: '30 gün üst üste pratik yaptın!', nl: 'Je hebt 30 dagen achter elkaar geoefend!' },
    icon: '🔥🔥🔥'
  }
];

// Calculate mastery level for a skill
export function calculateMastery(attempts: number, correctAnswers: number): number {
  if (attempts === 0) return 0;
  
  const accuracy = (correctAnswers / attempts) * 100;
  
  // Mastery increases with both accuracy and practice
  // Need at least 5 attempts to reach high mastery
  const practiceFactor = Math.min(attempts / 5, 1);
  
  return Math.round(accuracy * practiceFactor);
}

// Calculate points for a quiz attempt
export function calculatePoints(
  isCorrect: boolean,
  skillMastery: SkillMastery | undefined,
  previousMastery: number
): number {
  if (!isCorrect) return 0;
  
  let points = 10; // Base points for correct answer
  
  // Bonus for improving mastery
  const currentMastery = skillMastery ? skillMastery.level : 0;
  const masteryImprovement = currentMastery - previousMastery;
  
  if (masteryImprovement > 0) {
    points += Math.round(masteryImprovement / 10);
  }
  
  // Bonus for high accuracy (first time)
  if (skillMastery && skillMastery.attempts === 1 && isCorrect) {
    points += 5; // First time bonus
  }
  
  return points;
}

// Update skill mastery after quiz attempt
export function updateSkillMastery(
  currentMastery: SkillMastery | undefined,
  skillId: string,
  isCorrect: boolean
): SkillMastery {
  const attempts = (currentMastery?.attempts || 0) + 1;
  const correctAnswers = (currentMastery?.correctAnswers || 0) + (isCorrect ? 1 : 0);
  const level = calculateMastery(attempts, correctAnswers);
  
  // Calculate next review date using spaced repetition
  const now = new Date();
  let reviewInterval = 1; // Start with 1 day
  
  if (currentMastery) {
    if (isCorrect) {
      // Increase interval if answered correctly
      reviewInterval = Math.min(currentMastery.reviewInterval * 2, 30);
    } else {
      // Reset to 1 day if answered incorrectly
      reviewInterval = 1;
    }
  }
  
  const nextReview = new Date(now.getTime() + reviewInterval * 24 * 60 * 60 * 1000);
  
  return {
    skillId,
    level,
    attempts,
    correctAnswers,
    lastPracticed: now.toISOString(),
    nextReview: nextReview.toISOString(),
    reviewInterval
  };
}

// Update review queue after quiz attempt
export function updateReviewQueue(
  currentQueue: ReviewQueueItem[],
  questionId: string,
  skillId: string,
  isCorrect: boolean
): ReviewQueueItem[] {
  const existingItem = currentQueue.find(item => item.questionId === questionId);
  
  const now = new Date();
  let reviewInterval = 1;
  let difficulty = 5;
  let correctStreak = 0;
  let incorrectStreak = 0;
  
  if (existingItem) {
    if (isCorrect) {
      correctStreak = existingItem.correctStreak + 1;
      incorrectStreak = 0;
      // Decrease difficulty and increase interval
      difficulty = Math.max(existingItem.difficulty - 1, 1);
      reviewInterval = Math.min(correctStreak * 2, 30);
    } else {
      correctStreak = 0;
      incorrectStreak = existingItem.incorrectStreak + 1;
      // Increase difficulty and reset interval
      difficulty = Math.min(existingItem.difficulty + 2, 10);
      reviewInterval = 0; // due immediately after a wrong first attempt
    }
  } else {
    // New item
    if (isCorrect) {
      correctStreak = 1;
      reviewInterval = 2;
    } else {
      incorrectStreak = 1;
      reviewInterval = 0; // due immediately when first attempt is wrong
    }
  }
  
  const nextReview = new Date(now.getTime() + reviewInterval * 24 * 60 * 60 * 1000);
  
  const updatedItem: ReviewQueueItem = {
    questionId,
    skillId,
    difficulty,
    lastAttempt: now.toISOString(),
    nextReview: nextReview.toISOString(),
    correctStreak,
    incorrectStreak
  };
  
  // Remove old item and add updated one
  const filteredQueue = currentQueue.filter(item => item.questionId !== questionId);
  
  // Only add to queue if not mastered (less than 2 correct in a row)
  if (correctStreak < 2) {
    filteredQueue.push(updatedItem);
  }
  
  return filteredQueue;
}

// Get questions due for review
export function getDueReviewItems(reviewQueue: ReviewQueueItem[]): ReviewQueueItem[] {
  if (!reviewQueue || !Array.isArray(reviewQueue)) {
    return [];
  }
  const now = new Date();
  return reviewQueue.filter(item => new Date(item.nextReview) <= now);
}

// Get weak skills (low mastery or high difficulty in review queue)
export function getWeakSkills(
  skillMastery: Record<string, SkillMastery>,
  reviewQueue: ReviewQueueItem[]
): string[] {
  const weakSkills = new Set<string>();
  
  // Skills with mastery below 60%
  if (skillMastery) {
    Object.entries(skillMastery).forEach(([skillId, mastery]) => {
      if (mastery.level < 60) {
        weakSkills.add(skillId);
      }
    });
  }
  
  // Skills with difficult questions in review queue
  if (reviewQueue && Array.isArray(reviewQueue)) {
    reviewQueue.forEach(item => {
      if (item.difficulty >= 7 || item.incorrectStreak >= 2) {
        weakSkills.add(item.skillId);
      }
    });
  }
  
  return Array.from(weakSkills);
}

// Check and award badges
export function checkAndAwardBadges(
  progress: StudentProgress,
  correctAnswerStreak: number
): Badge[] {
  const newBadges: Badge[] = [];
  const existingBadgeIds = new Set(progress.badges.map(b => b.id));
  
  // Check accuracy badges
  if (correctAnswerStreak >= 5 && !existingBadgeIds.has('accuracy-bronze')) {
    const badge = BADGES.find(b => b.id === 'accuracy-bronze');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (correctAnswerStreak >= 10 && !existingBadgeIds.has('accuracy-silver')) {
    const badge = BADGES.find(b => b.id === 'accuracy-silver');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (correctAnswerStreak >= 20 && !existingBadgeIds.has('accuracy-gold')) {
    const badge = BADGES.find(b => b.id === 'accuracy-gold');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  
  // Check mastery badges
  const highMasterySkills = Object.values(progress.skillMastery).filter(m => m.level >= 80).length;
  const veryHighMasterySkills = Object.values(progress.skillMastery).filter(m => m.level >= 90).length;
  
  if (highMasterySkills >= 3 && !existingBadgeIds.has('mastery-beginner')) {
    const badge = BADGES.find(b => b.id === 'mastery-beginner');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (highMasterySkills >= 10 && !existingBadgeIds.has('mastery-intermediate')) {
    const badge = BADGES.find(b => b.id === 'mastery-intermediate');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (veryHighMasterySkills >= 20 && !existingBadgeIds.has('mastery-expert')) {
    const badge = BADGES.find(b => b.id === 'mastery-expert');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  
  // Check completion badges
  const completedCount = progress.completedLessons.length;
  if (completedCount >= 5 && !existingBadgeIds.has('completion-5')) {
    const badge = BADGES.find(b => b.id === 'completion-5');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (completedCount >= 15 && !existingBadgeIds.has('completion-15')) {
    const badge = BADGES.find(b => b.id === 'completion-15');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (completedCount >= 25 && !existingBadgeIds.has('completion-25')) {
    const badge = BADGES.find(b => b.id === 'completion-25');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  
  // Check streak badges
  const currentStreak = progress.stats.currentStreak;
  if (currentStreak >= 3 && !existingBadgeIds.has('streak-3')) {
    const badge = BADGES.find(b => b.id === 'streak-3');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (currentStreak >= 7 && !existingBadgeIds.has('streak-7')) {
    const badge = BADGES.find(b => b.id === 'streak-7');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  if (currentStreak >= 30 && !existingBadgeIds.has('streak-30')) {
    const badge = BADGES.find(b => b.id === 'streak-30');
    if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
  }
  
  return newBadges;
}

// Update daily streak
export function updateStreak(lastActive: string): { currentStreak: number; shouldReset: boolean } {
  const now = new Date();
  const last = new Date(lastActive);
  
  // Reset time to start of day for comparison
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
  
  if (daysDiff === 0) {
    // Same day, don't change streak
    return { currentStreak: 0, shouldReset: false };
  } else if (daysDiff === 1) {
    // Next day, increment streak
    return { currentStreak: 1, shouldReset: false };
  } else {
    // More than 1 day, reset streak
    return { currentStreak: 1, shouldReset: true };
  }
}
