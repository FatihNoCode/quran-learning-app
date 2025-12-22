# Arabic Reading Learning App - System Overview

## ✅ Implemented Features

### 1. **Clear Next Activity Guidance**
- Students see a recommended next activity after login
- System intelligently chooses between:
  - Next lesson (default progression)
  - Review session (when 5+ questions are due)
  - Completion message (all lessons finished)

### 2. **Lesson Structure**
Each lesson follows a 3-phase structure:
- **Explanation Phase**: Introduction to lesson content with skill preview
- **Practice Phase**: 5 quizzes per lesson testing different skills
- **Summary Phase**: Results, stats, badges, and lesson summary

### 3. **Mastery Tracking System**
- **Per-Skill Mastery**: Tracks mastery level (0-100%) for each skill
- **Progress Factors**: Based on both accuracy AND practice volume
- **Visible in Profile**: Students can view all skill mastery levels
- **Color-Coded**:
  - Green: 80%+ (High Mastery)
  - Yellow: 60-79% (Medium Mastery)
  - Red: <60% (Needs Practice)

### 4. **Points System**
Points awarded based on:
- ✓ **Base Points**: 10 points per correct answer
- ✓ **Mastery Improvement Bonus**: Extra points for improving skill mastery
- ✓ **First-Time Bonus**: 5 extra points for getting it right on first attempt

### 5. **Badge System**
Four types of badges with multiple tiers:

**Accuracy Badges:**
- Bronze: 5 correct answers in a row
- Silver: 10 correct answers in a row
- Gold: 20 correct answers in a row

**Mastery Badges:**
- Beginner: 3 skills at 80%+
- Intermediate: 10 skills at 80%+
- Expert: 20 skills at 90%+

**Completion Badges:**
- 5 lessons completed
- 15 lessons completed
- 25 lessons completed (all)

**Streak Badges:**
- 3-day streak
- 7-day streak
- 30-day streak

### 6. **Spaced Repetition Review Queue**
- **Per-Question Tracking**: Each question has individual review schedule
- **Smart Intervals**: 
  - Correct answer → Increase interval (up to 30 days)
  - Incorrect answer → Reset to 1 day
- **Difficulty Adjustment**: Questions get easier/harder based on performance
- **Persistent**: Remains valid when new lessons are added
- **Auto-Removal**: Questions removed from queue after 3 consecutive correct answers

### 7. **"Practice Weak Areas" Mode**
- Draws from review queue (due questions)
- Targets skills with <60% mastery
- Includes questions with high difficulty or recent failures
- Up to 10 questions per session
- Full stats and badge rewards

### 8. **Quiz Types Implemented**
All 5 quiz types are functional:

1. **Multiple Choice**: Single correct answer selection
2. **Drag and Drop**: Match items by dragging
3. **Listen and Choose**: Audio-based multiple choice (audio placeholder ready)
4. **True/False**: Binary choice questions
5. **Order/Sequence**: Arrange items in correct order

### 9. **Student Profile Page**
Displays comprehensive statistics:
- Total points
- Average accuracy
- Current & best streak
- Completed lessons count
- Skill mastery breakdown (high/medium/low)
- Individual skill progress bars
- All earned badges
- Review queue size

### 10. **Dashboard Features**
- **Quick Stats**: Points, Accuracy, Streak, Badges
- **Overall Progress**: Visual progress bar for lesson completion
- **Next Activity Card**: Smart recommendation with call-to-action
- **Action Buttons**: Study Lesson, Practice Weak Areas, View Profile
- **Recent Badges**: Shows last 3 earned badges

## 📊 Data Structure

### Student Progress
```typescript
{
  userId: string;
  username: string;
  name: string;
  currentLessonOrder: number;
  completedLessons: string[];
  skillMastery: {
    [skillId]: {
      level: 0-100;
      attempts: number;
      correctAnswers: number;
      lastPracticed: date;
      nextReview: date;
      reviewInterval: days;
    }
  };
  reviewQueue: [
    {
      questionId: string;
      skillId: string;
      difficulty: 0-10;
      lastAttempt: date;
      nextReview: date;
      correctStreak: number;
      incorrectStreak: number;
    }
  ];
  totalPoints: number;
  badges: Badge[];
  stats: {
    totalQuizzesCompleted: number;
    averageAccuracy: number;
    currentStreak: number;
    bestStreak: number;
    lastActive: date;
  }
}
```

## 📚 Placeholder Content

- **25 Lessons** generated with placeholder content
- **5 Quizzes per lesson** (125 total quizzes)
- **3 Skills per lesson** (75 total skills)
- Each quiz type represented multiple times

## 🎨 User Experience Flow

### For Students:

1. **Login** → Dashboard with next activity recommendation
2. **Choose Activity**:
   - Start Next Lesson → Explanation → 5 Quizzes → Summary → Dashboard
   - Practice Weak Areas → 10 Targeted Quizzes → Results → Dashboard
   - View Profile → See all stats, mastery, badges
3. **Earn Rewards**: Points and badges earned during activities
4. **Progress Saved**: All progress auto-saved to backend

### For Teachers:
- Teacher dashboard remains unchanged
- Can view all student progress via existing interface
- Student progress now includes new mastery and points data

## 🔄 Automatic Features

- **Daily Streak Tracking**: Auto-updates on login
- **Review Queue Management**: Auto-schedules based on performance
- **Badge Detection**: Auto-awards when milestones reached
- **Progress Saving**: Auto-saves after each activity
- **Smart Recommendations**: Auto-selects next best activity

## 🚀 Ready for Real Content

The system is fully functional with placeholder data. When ready to add real lessons:

1. Replace `/data/placeholderLessons.ts` with real lesson content
2. Update quiz questions and answers
3. Add real audio files for "Listen and Choose" quizzes
4. Keep all the mastery, points, and badge logic intact

## 📱 Bilingual Support

All text in both **Turkish (TR)** and **Dutch (NL)**:
- Dashboard
- Lessons
- Quizzes
- Profile
- Badges
- Notifications

## 🎯 Key Algorithms

1. **Mastery Calculation**: `(Accuracy × Practice Factor)` where practice factor = min(attempts/5, 1)
2. **Points Calculation**: Base + Mastery Improvement Bonus + First Time Bonus
3. **Review Scheduling**: Exponential backoff (1, 2, 4, 8, 16, 30 days)
4. **Weak Skill Detection**: Mastery <60% OR difficulty ≥7 OR 2+ incorrect in a row
5. **Badge Awards**: Real-time detection after each quiz

## 🔧 Technical Stack

- **Frontend**: React + TypeScript
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase KV Store
- **UI**: Tailwind CSS + shadcn/ui components
- **Drag & Drop**: react-dnd
- **Notifications**: Sonner
- **Icons**: Lucide React

## ✨ Next Steps

To add real lessons, you'll need to:
1. Create lessons with actual Arabic content
2. Add authentic Uthmani font Arabic text
3. Record or source audio for pronunciation quizzes
4. Replace placeholder quiz questions with real educational content
5. Test mastery tracking with real student usage
