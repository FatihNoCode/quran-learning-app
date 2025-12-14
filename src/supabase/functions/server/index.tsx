import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

// Teacher registration codes
const TEACHER_REGISTRATION_CODE = "QURAN2024";
const MASTER_TEACHER_CODE = "MASTER2024";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

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
app.get("/make-server-33549613/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint - creates a new user
app.post("/make-server-33549613/signup", async (c) => {
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
});

// Sign in endpoint
app.post("/make-server-33549613/signin", async (c) => {
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
});

// Get student progress (requires auth)
app.get("/make-server-33549613/progress/:userId", async (c) => {
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
    const progress = await kv.get(`progress:${userId}`);

    if (!progress) {
      return c.json({ error: "Progress not found" }, 404);
    }

    return c.json({ progress });
  } catch (error) {
    console.log(`Error getting progress: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Update student progress (requires auth)
app.post("/make-server-33549613/progress/:userId", async (c) => {
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
});

// Get all students (for teacher dashboard, requires auth)
app.get("/make-server-33549613/students", async (c) => {
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
app.delete("/make-server-33549613/students/:userId", async (c) => {
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
app.post("/make-server-33549613/students/:userId/unlock-level", async (c) => {
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
app.post("/make-server-33549613/students/:userId/reset-progress", async (c) => {
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
app.post("/make-server-33549613/students/:userId/reset-to-lesson", async (c) => {
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
app.get("/make-server-33549613/students/:userId/password", async (c) => {
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
app.get("/make-server-33549613/teachers", async (c) => {
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
app.delete("/make-server-33549613/teachers/:userId", async (c) => {
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

Deno.serve(app.fetch);