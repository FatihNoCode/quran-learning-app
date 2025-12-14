# Arabic Reading Learning App 📚

A comprehensive web application for teaching children (ages 5-10) how to read Arabic, with a focus on Quran reading.

## 🌟 Features

### Learning System
- **Structured Curriculum**: 50+ lessons covering Arabic letters, harakaat, sukun/shadda, madd, and tanween
- **Adaptive Lessons**: Progression-based learning that advances students through levels
- **Speech Coaching**: Browser-based speech recognition for pronunciation practice
- **Spaced Repetition**: Smart review system that schedules reviews at optimal intervals

### User Management
- **Student Accounts**: Track individual progress and learning journey
- **Teacher Dashboard**: Monitor all students' progress in one place
- **Simple Authentication**: Username and password login system

### User Experience
- **Bilingual Interface**: Full support for Turkish and Dutch languages
- **Child-Friendly Design**: Colorful, engaging UI designed for young learners
- **Progress Tracking**: Visual indicators of learning progress and achievements
- **Interactive Lessons**: Audio pronunciation, speech practice, and quizzes

## 🏗️ Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Key-Value Store)
- **Server**: Deno with Hono web framework
- **Speech**: Web Speech API (Speech Recognition & Text-to-Speech)
- **Icons**: Lucide React

## 📂 Project Structure

```
/
├── App.tsx                      # Main app component with routing
├── components/
│   ├── Auth.tsx                 # Login/signup page
│   ├── StudentDashboard.tsx     # Student home page
│   ├── TeacherDashboard.tsx     # Teacher dashboard
│   ├── LessonViewer.tsx         # Individual lesson component
│   ├── ReviewSession.tsx        # Spaced repetition quiz
│   └── WelcomeGuide.tsx         # First-time user guide
├── data/
│   └── lessons.ts               # Curriculum data (50+ lessons)
├── supabase/functions/server/
│   ├── index.tsx                # Backend API routes
│   └── kv_store.tsx             # Database utilities
├── utils/
│   ├── supabase/info.tsx        # Supabase configuration
│   └── demoAccounts.ts          # Demo account info
├── styles/
│   └── globals.css              # Global styles and Tailwind config
├── INSTRUCTIONS.md              # Detailed user instructions
├── QUICKSTART.md                # Quick start guide
└── README.md                    # This file
```

## 🚀 Getting Started

### Quick Start

1. **Create a Teacher Account**
   - Sign up with role "Teacher"
   - Access teacher dashboard to monitor students

2. **Create Student Accounts**
   - Sign up students with role "Student"
   - Students can start learning immediately

3. **Start Learning**
   - Students complete lessons in order
   - Practice pronunciation with microphone
   - Review past lessons with quiz system

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 📖 Curriculum Overview

### Level 1: Arabic Letters (حروف)
28 lessons covering all Arabic alphabet letters including:
- ا (Alif), ب (Ba), ت (Ta), ث (Tha), ج (Jeem), ح (Ha), خ (Kha)
- د (Dal), ذ (Thal), ر (Ra), ز (Zay), س (Seen), ش (Sheen)
- ص (Sad), ض (Dad), ط (Ta heavy), ظ (Dha heavy)
- ع (Ayn), غ (Ghayn), ف (Fa), ق (Qaf), ك (Kaf)
- ل (Lam), م (Meem), ن (Noon), ه (Ha), و (Waw), ي (Ya)

### Level 2: Harakaat (حركات)
- Fatha (َ) - short "a" sound
- Kasra (ِ) - short "i" sound  
- Damma (ُ) - short "u" sound

### Level 3: Sukun & Shadda
- Sukun (ْ) - silence/no vowel marker
- Shadda (ّ) - consonant doubling

### Level 4: Madd (مد)
- Madd with Alif - long "a"
- Madd with Waw - long "u"
- Madd with Ya - long "i"

### Level 5: Tanween (تنوين)
- Tanween Fath (ً) - "an" sound
- Tanween Kasr (ٍ) - "in" sound
- Tanween Damm (ٌ) - "un" sound

## 🔧 API Endpoints

### Authentication
- `POST /make-server-33549613/signup` - Create new user
- `POST /make-server-33549613/signin` - User login

### Progress
- `GET /make-server-33549613/progress/:userId` - Get student progress
- `POST /make-server-33549613/progress/:userId` - Update progress

### Teacher
- `GET /make-server-33549613/students` - Get all students (teacher only)

## 🎯 Key Features Explained

### Spaced Repetition Algorithm
The app uses a spaced repetition algorithm to schedule reviews:
- Items reviewed correctly appear less frequently
- Items that need practice appear more often
- Intervals increase with successful reviews
- Helps with long-term retention

### Speech Recognition
- Uses Web Speech API for pronunciation practice
- Provides real-time feedback (Excellent/Good/Close)
- Helps students improve pronunciation
- Works best in Chrome and Edge browsers

### Progress Tracking
- **Students**: See completion percentage, current level, review items
- **Teachers**: Monitor all students, view statistics, track activity
- **Visual Indicators**: Progress bars, achievement badges, level displays

## 🌐 Language Support

Full bilingual support for:
- **Turkish (Türkçe)**: Complete interface translation
- **Dutch (Nederlands)**: Complete interface translation
- Easy language switching with toggle button

## 👥 User Roles

### Student Role
- Access to learning dashboard
- Take lessons sequentially
- Practice pronunciation
- Review past lessons
- Track personal progress

### Teacher Role
- Monitor all students
- View progress statistics
- See activity logs
- Track level distribution
- Identify struggling students

## 📊 Data Storage

Uses Supabase Key-Value Store for:
- `user:{username}` - User profile data
- `progress:{userId}` - Student progress and completed lessons
- `students` - List of all student IDs

## 🔒 Security

- Passwords handled securely through Supabase Auth
- JWT tokens for API authentication
- Service role key kept server-side only
- User data isolated per account

## 🎨 Design Principles

- **Child-Friendly**: Large text, bright colors, playful animations
- **Clear Hierarchy**: Visual distinction between different lesson types
- **Immediate Feedback**: Instant responses to user actions
- **Progress Visualization**: Clear indicators of achievements
- **Responsive**: Works on desktop and tablet devices

## 🔍 Browser Compatibility

- **Recommended**: Chrome, Edge, or other Chromium browsers
- **Speech Recognition**: Requires Chrome/Edge for best results
- **Text-to-Speech**: Works in all modern browsers
- **Minimum**: Modern browser with ES6+ support

## 📝 Notes

- This is an educational demo application
- For production use with real students, implement additional data protection
- Speech recognition requires microphone permissions
- Internet connection required for all features
- Progress is saved automatically to the cloud

## 🎓 Educational Approach

Based on traditional Quran reading (Tajweed) teaching methods:
1. **Sequential Learning**: Letters → Marks → Rules
2. **Active Practice**: Students must engage, not just watch
3. **Repetition**: Multiple exposures to each concept
4. **Immediate Feedback**: Correction in real-time
5. **Progress Tracking**: Motivation through visible achievement

## 🤝 Support

For questions or issues:
- Check [INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed user guide
- See [QUICKSTART.md](QUICKSTART.md) for setup instructions
- Review browser console for technical errors

## 📜 License

Educational project - Free to use and modify for educational purposes.

---

**Built with ❤️ for young learners embarking on their Quran reading journey**

الحمد لله (Alhamdulillah)
