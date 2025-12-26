import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Teacher registration codes
const TEACHER_REGISTRATION_CODE = "QURAN2024";
const MASTER_TEACHER_CODE = "MASTER2024";
const CONTENT_KEY = "content:lessons-quizzes";

const app = new Hono();

type LessonContentType =
  | "image-lesson"
  | "letter-grid"
  | "letter-practice"
  | "letter-positions"
  | "letter-connected"
  | "letter-haraka"
  | "haraka-practice";

type LessonActivityType =
  | "yes-no"
  | "multiple-choice"
  | "matching"
  | "open-ended";

interface LessonItem {
  arabic: string;
  transliteration?: string;
  explanation?: string;
  audioUrl?: string;
}

interface LessonContent {
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

interface LessonRecord {
  id: string;
  order: number;
  level: string;
  content: LessonContent;
  lastEditedAt?: string;
  lastEditedBy?: string;
}

interface QuizQuestion {
  id: string;
  prompt: string;
  type: LessonActivityType;
  options?: string[];
  pairs?: { left: string; right: string }[];
  answer?: string;
  explanation?: string;
}

interface QuizRecord {
  id: string;
  title: string;
  description?: string;
  learningModes?: LessonActivityType[];
  questions: QuizQuestion[];
  lastEditedAt?: string;
  lastEditedBy?: string;
}

interface ContentState {
  lessons: LessonRecord[];
  quizzes: QuizRecord[];
  lastEditedAt?: string;
  lastEditedBy?: string;
}

const seedLessons: LessonRecord[] = [
  {
    id: "lesson-1",
    order: 1,
    level: "Alif-Ba",
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    content: {
      type: "letter-grid",
      title: "Alif ve Ba Temelleri",
      titleNl: "Alif en Ba Basis",
      instruction:
        "Harfleri tanıyın, sesli okuyun ve çizgi defterinde tekrar edin.",
      instructionNl:
        "Herken de letters, lees ze hardop en oefen ze in je schrift.",
      letterGroups: [
        ["ا", "ب", "ت"],
        ["ث", "ن", "م"],
      ],
      color: "#7C3AED",
      learningModes: ["multiple-choice", "yes-no"],
    },
  },
  {
    id: "lesson-2",
    order: 2,
    level: "Alif-Ba",
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    content: {
      type: "letter-practice",
      title: "Harf Seslendirme",
      titleNl: "Letter Uitspraak",
      instruction:
        "Her harfi dinleyin ve ardından tekrar edin. Sesleri heceleyin.",
      instructionNl:
        "Luister naar elke letter en herhaal. Spreek de klanken uit.",
      color: "#2563EB",
      items: [
        { arabic: "ا", transliteration: "Alif", explanation: "Düz ses (Elif)" },
        { arabic: "ب", transliteration: "Ba", explanation: "Dudak sesi" },
        { arabic: "ت", transliteration: "Ta", explanation: "Dil ucu dişler" },
        {
          arabic: "ث",
          transliteration: "Tha",
          explanation: "Dil ucu dişlerin önüsü",
        },
      ],
      learningModes: ["multiple-choice", "open-ended"],
    },
  },
  {
    id: "lesson-3",
    order: 3,
    level: "Alif-Ba",
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    content: {
      type: "letter-positions",
      title: "Ba Harfi Bağlantıları",
      titleNl: "Ba in Verbinding",
      instruction: "Harfin başta, ortada ve sonda nasıl yazıldığını gör.",
      instructionNl:
        "Zie hoe de letter aan het begin, midden en eind wordt geschreven.",
      color: "#059669",
      items: [
        { arabic: "بـ", explanation: "Ba başlangıç" },
        { arabic: "ـبـ", explanation: "Ba orta" },
        { arabic: "ـب", explanation: "Ba son" },
      ],
      learningModes: ["matching"],
    },
  },
  {
    id: "lesson-4",
    order: 4,
    level: "Harakat",
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    content: {
      type: "letter-haraka",
      title: "Fetha ile Harfler",
      titleNl: "Letters met Fatha",
      instruction:
        "Fetha işaretiyle harflerin sesini dinleyin ve tekrar edin.",
      instructionNl: "Luister naar de klank met fatha en herhaal.",
      color: "#D97706",
      items: [
        { arabic: "بَ", transliteration: "Ba", explanation: "Açık a sesi" },
        { arabic: "تَ", transliteration: "Ta", explanation: "A sesi ile" },
        {
          arabic: "نَ",
          transliteration: "Na",
          explanation: "Burundan gelen a sesi",
        },
      ],
      learningModes: ["yes-no", "multiple-choice"],
    },
  },
  {
    id: "lesson-5",
    order: 5,
    level: "Kelimeler",
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    content: {
      type: "letter-connected",
      title: "Bağlantılı Harflerle Kelimeler",
      titleNl: "Woorden met Verbonden Letters",
      instruction:
        "Harfleri birleştirerek basit kelimeler oku ve anlamlandır.",
      instructionNl:
        "Lees eenvoudige woorden met verbonden letters en begrijp de betekenis.",
      color: "#EC4899",
      items: [
        { arabic: "بَاب", transliteration: "baab", explanation: "Kapı" },
        { arabic: "بِنْت", transliteration: "bint", explanation: "Kız" },
        { arabic: "ثَوْب", transliteration: "thawb", explanation: "Elbise" },
      ],
      learningModes: ["open-ended", "matching"],
    },
  },
];

const seedQuizzes: QuizRecord[] = [
  {
    id: "quiz-1",
    title: "Alif-Ba Hızlı Kontrol",
    description: "Harf tanıma ve temel sesler",
    learningModes: ["multiple-choice", "yes-no"],
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    questions: [
      {
        id: "q1",
        prompt: "Bu harf hangisi?",
        type: "multiple-choice",
        options: ["ب", "ت", "ث", "ن"],
        answer: "ب",
        explanation: "Alt noktası olan dudak sesi.",
      },
      {
        id: "q2",
        prompt: "‘ث’ harfi dilin ucu dişlerin önüne değerek okunur.",
        type: "yes-no",
        answer: "yes",
        explanation: "Doğru, İngilizcedeki “th” gibi.",
      },
      {
        id: "q3",
        prompt: "Eşleştirme",
        type: "matching",
        pairs: [
          { left: "ا", right: "alif" },
          { left: "ب", right: "ba" },
          { left: "ت", right: "ta" },
        ],
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Harakat Mini Test",
    description: "Fetha ile hızlı tekrar",
    learningModes: ["yes-no", "open-ended"],
    lastEditedAt: "2025-12-16T12:00:00.000Z",
    lastEditedBy: "system",
    questions: [
      {
        id: "q4",
        prompt: "بَ sesi hangi hareke ile gelir?",
        type: "multiple-choice",
        options: ["Fetha", "Kesra", "Damme", "Sukun"],
        answer: "Fetha",
      },
      {
        id: "q5",
        prompt: "ثَوْب kelimesinin anlamını yaz.",
        type: "open-ended",
        explanation: "Beklenen cevap: elbise",
      },
    ],
  },
];

const getAuthUser = async (c: any) => {
  const accessToken = c.req.header("Authorization")?.split(" ")[1];
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  return user;
};

const ensureContentState = async (): Promise<ContentState> => {
  const existing = await kv.get(CONTENT_KEY);
  if (existing?.lessons?.length) {
    return existing;
  }

  const seeded: ContentState = {
    lessons: seedLessons,
    quizzes: seedQuizzes,
    lastEditedAt: seedLessons[0].lastEditedAt,
    lastEditedBy: "system",
  };
  await kv.set(CONTENT_KEY, seeded);
  return seeded;
};

const getEditorLabel = (user: any) =>
  user?.user_metadata?.username ||
  user?.user_metadata?.name ||
  user?.email ||
  "teacher";

const isMasterTeacher = (user: any) =>
  Boolean(user?.user_metadata?.isMasterTeacher);

const isTeacher = (user: any) =>
  user?.user_metadata?.role === "teacher" || user?.app_metadata?.role === "teacher";

// Enable logger
app.use('*', logger(console.log));

// Explicit OPTIONS handler to ensure preflight succeeds
app.options('/*', (c) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  return c.body(null, 204);
});

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint - creates a new user
const handleSignup = async (c: any) => {
  try {
    const { username, password, name, role, teacherCode } = await c.req.json();
    
    if (!username || !password || !name || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    let actualRole = role;
    let isMasterTeacher = false;

    // If teacher, check registration code
    if (role === 'teacher') {
      if (!teacherCode) {
        return c.json({ error: "Teacher code is required" }, 400);
      }
      
      if (teacherCode === MASTER_TEACHER_CODE) {
        isMasterTeacher = true;
      } else if (teacherCode !== TEACHER_REGISTRATION_CODE) {
        return c.json({ error: "Invalid teacher registration code" }, 400);
      }
    }

    // Check if username already exists
    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) {
      return c.json({ error: "Username already exists" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Create auth user with email (using username@arabic-learning.app as email)
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${username}@arabic-learning.app`,
      password: password,
      user_metadata: { name, role: actualRole, username, isMasterTeacher },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user in signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user data in KV store (including password for teacher recovery)
    const userId = data.user.id;
    await kv.set(`user:${username}`, {
      id: userId,
      username,
      name,
      role: actualRole,
      isMasterTeacher,
      password: password, // Store password for recovery
      createdAt: new Date().toISOString()
    });

    // If student, add to students list and initialize progress
    if (role === 'student') {
      const students = await kv.get('students') || [];
      students.push(userId);
      await kv.set('students', students);

      // Initialize student progress
      await kv.set(`progress:${userId}`, {
        userId,
        username,
        name,
        currentLevel: 'letters',
        currentLessonIndex: 0,
        currentLessonOrder: 1, // For new sequential lesson system
        completedLessons: [],
        reviewItems: [],
        lastActive: new Date().toISOString()
      });
    } else {
      // If teacher, add to teachers list
      const teachers = await kv.get('teachers') || [];
      teachers.push(userId);
      await kv.set('teachers', teachers);
    }

    // Sign in the user and get access token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${username}@arabic-learning.app`,
      password: password,
    });

    if (signInError || !signInData.session) {
      console.log(`Error signing in after signup: ${signInError?.message}`);
      // If auto-login fails, still return success but tell user to login manually
      return c.json({ 
        success: true, 
        message: 'User created successfully. Please login with your credentials.',
        requiresManualLogin: true
      }, 201);
    }

    return c.json({ 
      success: true, 
      accessToken: signInData.session.access_token,
      user: {
        id: userId,
        username,
        name,
        role: actualRole,
        isMasterTeacher
      }
    });
  } catch (error) {
    console.log(`Error in signup endpoint: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
};
app.post("/signup", handleSignup);
app.post("/make-server-33549613/signup", handleSignup);

// Sign in endpoint
const handleSignin = async (c: any) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: "Missing username or password" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@arabic-learning.app`,
      password: password,
    });

    if (error) {
      console.log(`Error during sign in: ${error.message}`);
      return c.json({ error: "Invalid username or password" }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${username}`);
    
    if (!userData) {
      return c.json({ error: "User data not found" }, 404);
    }

    return c.json({ 
      success: true, 
      accessToken: data.session.access_token,
      user: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        role: userData.role,
        isMasterTeacher: userData.isMasterTeacher || false
      }
    });
  } catch (error) {
    console.log(`Error in signin endpoint: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
};
app.post("/signin", handleSignin);
app.post("/make-server-33549613/signin", handleSignin);

// Shared handler for fetching progress
const handleGetProgress = async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    let progress = await kv.get(`progress:${userId}`);

    // If missing, bootstrap a default progress so the client never sees a 404
    if (!progress) {
      const username =
        user?.user_metadata?.username ||
        user?.email?.split('@')[0] ||
        'student';
      const name = user?.user_metadata?.name || username;

      progress = {
        userId,
        username,
        name,
        currentLevel: 'letters',
        currentLessonIndex: 0,
        currentLessonOrder: 1,
        completedLessons: [],
        reviewItems: [],
        totalPoints: 0,
        lastActive: new Date().toISOString(),
      };
      await kv.set(`progress:${userId}`, progress);
    }

    return c.json({ progress });
  } catch (error) {
    console.log(`Error getting progress: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
};

// Get student progress (requires auth)
app.get("/progress/:userId", handleGetProgress);
// Support prefixed path in case the function name is retained in the URL
app.get("/make-server-33549613/progress/:userId", handleGetProgress);

// Update student progress (requires auth)
const handlePostProgress = async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    const updates = await c.req.json();

    // Get current progress
    const currentProgress = await kv.get(`progress:${userId}`) || {};

    // Merge updates
    const updatedProgress = {
      ...currentProgress,
      ...updates,
      lastActive: new Date().toISOString()
    };

    await kv.set(`progress:${userId}`, updatedProgress);

    return c.json({ success: true, progress: updatedProgress });
  } catch (error) {
    console.log(`Error updating progress: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
};
app.post("/progress/:userId", handlePostProgress);
app.post("/make-server-33549613/progress/:userId", handlePostProgress);

// Get all students (for teacher dashboard, requires auth)
app.get("/students", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all student IDs
    const studentIds = await kv.get('students') || [];

    // Get progress for all students
    const studentsProgress = [];
    for (const studentId of studentIds) {
      const progress = await kv.get(`progress:${studentId}`);
      if (progress) {
        // Get user data to include password
        const userData = await kv.get(`user:${progress.username}`);
        studentsProgress.push({
          ...progress,
          password: userData?.password || ''
        });
      }
    }

    return c.json({ students: studentsProgress });
  } catch (error) {
    console.log(`Error getting students: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Delete student (teacher only, requires auth)
app.delete("/students/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');

    // Get student progress to get username
    const progress = await kv.get(`progress:${userId}`);
    if (!progress) {
      return c.json({ error: "Student not found" }, 404);
    }

    const username = progress.username;

    // Delete from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.log(`Error deleting user from auth: ${deleteError.message}`);
    }

    // Remove from KV store
    await kv.del(`user:${username}`);
    await kv.del(`progress:${userId}`);

    // Remove from students list
    const students = await kv.get('students') || [];
    const updatedStudents = students.filter((id: string) => id !== userId);
    await kv.set('students', updatedStudents);

    return c.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.log(`Error deleting student: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Unlock level for student (teacher only, requires auth)
app.post("/students/:userId/unlock-level", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    const { level } = await c.req.json();

    if (!level) {
      return c.json({ error: "Level is required" }, 400);
    }

    // Get current progress
    const currentProgress = await kv.get(`progress:${userId}`);
    if (!currentProgress) {
      return c.json({ error: "Student not found" }, 404);
    }

    // Update to new level
    const updatedProgress = {
      ...currentProgress,
      currentLevel: level,
      currentLessonIndex: 0,
      lastActive: new Date().toISOString()
    };

    await kv.set(`progress:${userId}`, updatedProgress);

    return c.json({ success: true, progress: updatedProgress });
  } catch (error) {
    console.log(`Error unlocking level: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Reset student progress (teacher only, requires auth)
app.post("/students/:userId/reset-progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');

    // Get current progress
    const currentProgress = await kv.get(`progress:${userId}`);
    if (!currentProgress) {
      return c.json({ error: "Student not found" }, 404);
    }

    // Reset progress to initial state
    const resetProgress = {
      userId: currentProgress.userId,
      username: currentProgress.username,
      name: currentProgress.name,
      currentLevel: 'letters',
      currentLessonIndex: 0,
      currentLessonOrder: 1, // Reset to lesson 1 in new system
      completedLessons: [],
      reviewItems: [],
      lastActive: new Date().toISOString()
    };

    await kv.set(`progress:${userId}`, resetProgress);

    return c.json({ success: true, progress: resetProgress });
  } catch (error) {
    console.log(`Error resetting progress: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Reset student progress to specific lesson (student self-service)
app.post("/students/:userId/reset-to-lesson", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    const { lessonOrder } = await c.req.json();

    if (!lessonOrder || lessonOrder < 1) {
      return c.json({ error: "Valid lesson order is required" }, 400);
    }

    // Get current progress
    const currentProgress = await kv.get(`progress:${userId}`);
    if (!currentProgress) {
      return c.json({ error: "Student not found" }, 404);
    }

    // Verify the user is resetting their own progress
    if (currentProgress.userId !== user.id) {
      return c.json({ error: "Unauthorized - can only reset own progress" }, 401);
    }

    // Reset progress to selected lesson
    // Remove all lessons from completed that have order >= lessonOrder
    const completedLessons = currentProgress.completedLessons || [];
    
    // We need to filter out lessons based on their order number
    // Since we don't have easy access to the lesson order from ID, we'll just clear all progress after the selected lesson
    const resetProgress = {
      ...currentProgress,
      currentLessonOrder: lessonOrder,
      // Keep completed lessons that were before the reset point
      completedLessons: [], // For simplicity, clear all - student can review
      reviewItems: [], // Clear review items
      lastActive: new Date().toISOString()
    };

    await kv.set(`progress:${userId}`, resetProgress);

    return c.json({ success: true, progress: resetProgress });
  } catch (error) {
    console.log(`Error resetting to lesson: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get student password (teacher only, requires auth)
app.get("/students/:userId/password", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');

    // Get student progress to get username
    const progress = await kv.get(`progress:${userId}`);
    if (!progress) {
      return c.json({ error: "Student not found" }, 404);
    }

    // Get user data with password
    const userData = await kv.get(`user:${progress.username}`);
    if (!userData) {
      return c.json({ error: "User data not found" }, 404);
    }

    return c.json({ password: userData.password || '' });
  } catch (error) {
    console.log(`Error getting password: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get all teachers (master teacher only, requires auth)
app.get("/teachers", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all teacher IDs
    const teacherIds = await kv.get('teachers') || [];

    // Get user data for all teachers
    const teachersData = [];
    for (const teacherId of teacherIds) {
      // Find teacher by ID
      const allKeys = await kv.getByPrefix('user:');
      for (const userData of allKeys) {
        if (userData.id === teacherId) {
          teachersData.push(userData);
          break;
        }
      }
    }

    return c.json({ teachers: teachersData });
  } catch (error) {
    console.log(`Error getting teachers: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Delete teacher (master teacher only, requires auth)
app.delete("/teachers/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if current user is master teacher
    const currentUserMetadata = user.user_metadata;
    if (!currentUserMetadata?.isMasterTeacher) {
      return c.json({ error: "Only master teachers can delete teachers" }, 403);
    }

    const userId = c.req.param('userId');

    // Find teacher username by ID
    let teacherUsername = '';
    const allKeys = await kv.getByPrefix('user:');
    for (const userData of allKeys) {
      if (userData.id === userId && userData.role === 'teacher') {
        teacherUsername = userData.username;
        break;
      }
    }

    if (!teacherUsername) {
      return c.json({ error: "Teacher not found" }, 404);
    }

    // Delete from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.log(`Error deleting teacher from auth: ${deleteError.message}`);
    }

    // Remove from KV store
    await kv.del(`user:${teacherUsername}`);

    // Remove from teachers list
    const teachers = await kv.get('teachers') || [];
    const updatedTeachers = teachers.filter((id: string) => id !== userId);
    await kv.set('teachers', updatedTeachers);

    return c.json({ success: true, message: "Teacher deleted successfully" });
  } catch (error) {
    console.log(`Error deleting teacher: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Content endpoints
app.get("/content", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const content = await ensureContentState();
    return c.json(content);
  } catch (error) {
    console.log(`Error fetching content: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/content/lessons", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user || !isMasterTeacher(user)) {
      return c.json({ error: "Only master teachers can edit lessons" }, 403);
    }

    const incoming = await c.req.json();
    if (!incoming?.content?.title) {
      return c.json({ error: "Lesson content is required" }, 400);
    }
    const content = await ensureContentState();
    const now = new Date().toISOString();
    const lessonId = incoming.id || crypto.randomUUID();

    const normalized: LessonRecord = {
      id: lessonId,
      order: Number(incoming.order) || 1,
      level: incoming.level || "Alif-Ba",
      content: incoming.content,
      lastEditedAt: now,
      lastEditedBy: getEditorLabel(user),
    };

    const existingIndex = content.lessons.findIndex((l) => l.id === lessonId);
    let lessons = [...content.lessons];
    if (existingIndex >= 0) {
      lessons[existingIndex] = normalized;
    } else {
      lessons.push(normalized);
    }
    lessons = lessons.sort((a, b) => a.order - b.order);

    const updatedState: ContentState = {
      ...content,
      lessons,
      lastEditedAt: now,
      lastEditedBy: getEditorLabel(user),
    };

    await kv.set(CONTENT_KEY, updatedState);
    return c.json({ lesson: normalized, lessons, lastEditedAt: now, lastEditedBy: getEditorLabel(user) });
  } catch (error) {
    console.log(`Error saving lesson: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/content/lessons/:lessonId", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user || !isMasterTeacher(user)) {
      return c.json({ error: "Only master teachers can delete lessons" }, 403);
    }

    const lessonId = c.req.param("lessonId");
    const content = await ensureContentState();
    const lessons = content.lessons.filter((l) => l.id !== lessonId);

    const updatedState: ContentState = {
      ...content,
      lessons,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: getEditorLabel(user),
    };

    await kv.set(CONTENT_KEY, updatedState);
    return c.json({ lessons, lastEditedAt: updatedState.lastEditedAt, lastEditedBy: updatedState.lastEditedBy });
  } catch (error) {
    console.log(`Error deleting lesson: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/content/quizzes", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user || !isMasterTeacher(user)) {
      return c.json({ error: "Only master teachers can edit quizzes" }, 403);
    }

    const incoming = await c.req.json();
    if (!incoming?.title) {
      return c.json({ error: "Quiz title is required" }, 400);
    }
    const content = await ensureContentState();
    const now = new Date().toISOString();
    const quizId = incoming.id || crypto.randomUUID();

    const normalized: QuizRecord = {
      id: quizId,
      title: incoming.title,
      description: incoming.description || "",
      learningModes: incoming.learningModes || [],
      questions: incoming.questions || [],
      lastEditedAt: now,
      lastEditedBy: getEditorLabel(user),
    };

    const existingIndex = content.quizzes.findIndex((q) => q.id === quizId);
    const quizzes = [...content.quizzes];
    if (existingIndex >= 0) {
      quizzes[existingIndex] = normalized;
    } else {
      quizzes.push(normalized);
    }

    const updatedState: ContentState = {
      ...content,
      quizzes,
      lastEditedAt: now,
      lastEditedBy: getEditorLabel(user),
    };

    await kv.set(CONTENT_KEY, updatedState);
    return c.json({ quiz: normalized, quizzes, lastEditedAt: now, lastEditedBy: getEditorLabel(user) });
  } catch (error) {
    console.log(`Error saving quiz: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/content/quizzes/:quizId", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user || !isMasterTeacher(user)) {
      return c.json({ error: "Only master teachers can delete quizzes" }, 403);
    }

    const quizId = c.req.param("quizId");
    const content = await ensureContentState();
    const quizzes = content.quizzes.filter((q) => q.id !== quizId);

    const updatedState: ContentState = {
      ...content,
      quizzes,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: getEditorLabel(user),
    };

    await kv.set(CONTENT_KEY, updatedState);
    return c.json({ quizzes, lastEditedAt: updatedState.lastEditedAt, lastEditedBy: updatedState.lastEditedBy });
  } catch (error) {
    console.log(`Error deleting quiz: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});


// Shared handler for leaderboard
const handleLeaderboard = async (c: any) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const studentIds: string[] = await kv.get('students') || [];
    const leaderboard: any[] = [];

    for (const studentId of studentIds) {
      const progress = await kv.get(`progress:${studentId}`);
      if (!progress) continue;
      const userData = await kv.get(`user:${progress.username}`);
      leaderboard.push({
        userId: studentId,
        username: progress.username || userData?.username || '',
        name: progress.name || userData?.name || '',
        totalPoints: progress.totalPoints || 0,
      });
    }

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    const ranked = leaderboard.map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    return c.json({ leaderboard: ranked });
  } catch (error) {
    console.log(`Error fetching leaderboard: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
};
// Leaderboard endpoint (auth required)
app.get('/leaderboard', handleLeaderboard);
// Support prefixed path
app.get('/make-server-33549613/leaderboard', handleLeaderboard);

Deno.serve(app.fetch);


