import { Hono } from 'https://deno.land/x/hono@v4.0.0/mod.ts';
import { cors } from 'https://deno.land/x/hono@v4.0.0/middleware.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Helper function to get Supabase client
const getSupabaseClient = (authToken?: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = authToken || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
};

// Teacher registration codes
const TEACHER_CODES = {
  'QURAN2024': false,  // Regular teacher
  'MASTER2024': true   // Master teacher
};

// Password validation helper
const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character or number' };
  }
  return { valid: true };
};

// Username validation helper
const validateUsername = (username: string): { valid: boolean; error?: string } => {
  // Username should be firstname+lastname format (e.g., YunusYildiz)
  // Must start with uppercase letter, followed by lowercase letters, then another uppercase letter and more lowercase
  const usernamePattern = /^[A-Z][a-z]+[A-Z][a-z]+$/;
  
  if (!usernamePattern.test(username)) {
    return { valid: false, error: 'Username must be in FirstnameLastname format (e.g., YunusYildiz)' };
  }
  
  return { valid: true };
};

// ==================== AUTH ENDPOINTS ====================

// Signup endpoint
app.post('/signup', async (c) => {
  try {
    const { username, password, name, role, teacherCode } = await c.req.json();
    
    console.log(`📝 Signup attempt for: ${username} (role: ${role})`);

    if (!username || !password || !role) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return c.json({ success: false, error: passwordValidation.error }, 400);
    }

    // Validate username format
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return c.json({ success: false, error: usernameValidation.error }, 400);
    }

    // Validate teacher code if role is teacher
    if (role === 'teacher') {
      if (!teacherCode || !TEACHER_CODES.hasOwnProperty(teacherCode)) {
        return c.json({ success: false, error: 'Invalid teacher registration code' }, 400);
      }
    }

    const supabaseClient = getSupabaseClient();

    // Check if username already exists in users table
    const { data: existingUser } = await supabaseClient
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return c.json({ success: false, error: 'Username already exists' }, 400);
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: `${username}@quranapp.internal`,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return c.json({ success: false, error: authError.message }, 400);
    }

    // Create user record in users table
    const isMasterTeacher = role === 'teacher' && TEACHER_CODES[teacherCode as keyof typeof TEACHER_CODES];
    
    const { data: userData, error: dbError } = await supabaseClient
      .from('users')
      .insert({
        auth_id: authData.user.id,
        username: username,
        role: role,
        is_master_teacher: isMasterTeacher || false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Clean up auth user if database insert fails
      await supabaseClient.auth.admin.deleteUser(authData.user.id);
      return c.json({ success: false, error: 'Failed to create user record' }, 500);
    }

    console.log(`✅ User created successfully: ${username} (ID: ${userData.id})`);

    // Try to sign in the user automatically
    try {
      const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: `${username}@quranapp.internal`,
        password: password,
      });

      if (signInError) {
        console.log('⚠️ Auto-login failed, user needs to login manually');
        return c.json({ 
          success: true, 
          requiresManualLogin: true,
          message: 'User created successfully. Please login with your credentials.'
        });
      }

      console.log(`✅ Auto-login successful for: ${username}`);

      return c.json({
        success: true,
        accessToken: signInData.session.access_token,
        user: {
          id: userData.id,
          username: userData.username,
          name: username,
          role: userData.role,
          isMasterTeacher: userData.is_master_teacher || false
        }
      });
    } catch (signInError) {
      console.error('Auto-login error:', signInError);
      return c.json({ 
        success: true, 
        requiresManualLogin: true,
        message: 'User created successfully. Please login with your credentials.'
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Signin endpoint
app.post('/signin', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    console.log(`🔐 Signin request received for username: ${username}`);

    if (!username || !password) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    const supabaseClient = getSupabaseClient();

    // Sign in with auth
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: `${username}@quranapp.internal`,
      password: password,
    });

    if (error) {
      console.error(`❌ Auth error for ${username}:`, error.message);
      return c.json({ success: false, error: 'Invalid username or password' }, 401);
    }

    console.log(`✅ Auth successful for ${username}, auth ID: ${data.user.id}`);

    // Query the users table to get the user data
    const { data: userData, error: dbError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    if (dbError || !userData) {
      console.error(`❌ Database error for ${username}:`, dbError);
      return c.json({ success: false, error: 'User not found in database' }, 500);
    }

    console.log(`🔍 User data from database:`, JSON.stringify(userData));
    console.log(`📤 Returning user ID: ${userData.id} (type: ${typeof userData.id})`);
    console.log(`✅ User signed in successfully: ${username}`);

    return c.json({ 
      success: true, 
      accessToken: data.session.access_token,
      user: {
        id: userData.id,
        username: userData.username,
        name: username,
        role: userData.role,
        isMasterTeacher: userData.is_master_teacher || false
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// ==================== PROGRESS ENDPOINTS ====================

// Get user progress
app.get('/progress/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    console.log(`📊 Fetching progress for user ID: ${userId} (type: ${typeof userId})`);
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Get progress data
    const { data: progressData, error: progressError } = await supabaseClient
      .from('progress')
      .select('*')
      .eq('user_id', parseInt(userId));

    if (progressError) {
      console.error('Progress fetch error:', progressError);
      return c.json({ success: false, error: 'Failed to fetch progress' }, 500);
    }

    console.log(`✅ Found ${progressData?.length || 0} progress records for user ${userId}`);

    // Convert array to object keyed by lesson_id
    const progressObject = (progressData || []).reduce((acc: any, item: any) => {
      acc[item.lesson_id] = {
        completed: item.completed,
        score: item.score,
        attempts: item.attempts,
        lastAttempt: item.last_attempt,
        masteryLevel: item.mastery_level,
        correctAnswers: item.correct_answers,
        totalQuestions: item.total_questions,
      };
      return acc;
    }, {});

    return c.json({ success: true, progress: progressObject });
  } catch (error) {
    console.error('Get progress error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Update user progress
app.post('/progress/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { lessonId, score, completed, masteryLevel, correctAnswers, totalQuestions } = await c.req.json();
    
    console.log(`💾 Updating progress for user ${userId}, lesson ${lessonId}`);
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Check if progress record exists
    const { data: existing } = await supabaseClient
      .from('progress')
      .select('*')
      .eq('user_id', parseInt(userId))
      .eq('lesson_id', lessonId)
      .single();

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabaseClient
        .from('progress')
        .update({
          completed,
          score,
          attempts: existing.attempts + 1,
          last_attempt: new Date().toISOString(),
          mastery_level: masteryLevel,
          correct_answers: correctAnswers,
          total_questions: totalQuestions,
        })
        .eq('user_id', parseInt(userId))
        .eq('lesson_id', lessonId);

      if (updateError) {
        console.error('Progress update error:', updateError);
        return c.json({ success: false, error: 'Failed to update progress' }, 500);
      }
    } else {
      // Create new record
      const { error: insertError } = await supabaseClient
        .from('progress')
        .insert({
          user_id: parseInt(userId),
          lesson_id: lessonId,
          completed,
          score,
          attempts: 1,
          last_attempt: new Date().toISOString(),
          mastery_level: masteryLevel || 0,
          correct_answers: correctAnswers || 0,
          total_questions: totalQuestions || 0,
        });

      if (insertError) {
        console.error('Progress insert error:', insertError);
        return c.json({ success: false, error: 'Failed to create progress' }, 500);
      }
    }

    console.log(`✅ Progress updated for user ${userId}, lesson ${lessonId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Update progress error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// ==================== TEACHER ENDPOINTS ====================

// Get all students (teacher only)
app.get('/students', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Get all students
    const { data: students, error: studentsError } = await supabaseClient
      .from('users')
      .select('id, username, created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (studentsError) {
      console.error('Students fetch error:', studentsError);
      return c.json({ success: false, error: 'Failed to fetch students' }, 500);
    }

    // Get progress for all students
    const { data: allProgress, error: progressError } = await supabaseClient
      .from('progress')
      .select('*');

    if (progressError) {
      console.error('Progress fetch error:', progressError);
      return c.json({ success: false, error: 'Failed to fetch progress' }, 500);
    }

    // Organize progress by student
    const studentsWithProgress = students.map((student: any) => {
      const studentProgress = allProgress?.filter((p: any) => p.user_id === student.id) || [];
      
      return {
        id: student.id,
        username: student.username,
        createdAt: student.created_at,
        totalLessons: studentProgress.length,
        completedLessons: studentProgress.filter((p: any) => p.completed).length,
        averageScore: studentProgress.length > 0
          ? Math.round(studentProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / studentProgress.length)
          : 0,
        progress: studentProgress.reduce((acc: any, item: any) => {
          acc[item.lesson_id] = {
            completed: item.completed,
            score: item.score,
            attempts: item.attempts,
            lastAttempt: item.last_attempt,
            masteryLevel: item.mastery_level,
            correctAnswers: item.correct_answers,
            totalQuestions: item.total_questions,
          };
          return acc;
        }, {}),
      };
    });

    return c.json({ success: true, students: studentsWithProgress });
  } catch (error) {
    console.error('Get students error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Get student by ID (teacher only)
app.get('/students/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Get student info
    const { data: student, error: studentError } = await supabaseClient
      .from('users')
      .select('id, username, created_at')
      .eq('id', parseInt(studentId))
      .eq('role', 'student')
      .single();

    if (studentError || !student) {
      return c.json({ success: false, error: 'Student not found' }, 404);
    }

    // Get student's progress
    const { data: progress, error: progressError } = await supabaseClient
      .from('progress')
      .select('*')
      .eq('user_id', parseInt(studentId));

    if (progressError) {
      console.error('Progress fetch error:', progressError);
      return c.json({ success: false, error: 'Failed to fetch progress' }, 500);
    }

    // Get lesson content for this student
    const { data: lessonContent, error: contentError } = await supabaseClient
      .from('lesson_content')
      .select('*')
      .eq('user_id', parseInt(studentId));

    if (contentError) {
      console.error('Lesson content fetch error:', contentError);
    }

    const studentData = {
      id: student.id,
      username: student.username,
      createdAt: student.created_at,
      totalLessons: progress?.length || 0,
      completedLessons: progress?.filter((p: any) => p.completed).length || 0,
      averageScore: progress && progress.length > 0
        ? Math.round(progress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / progress.length)
        : 0,
      progress: (progress || []).reduce((acc: any, item: any) => {
        acc[item.lesson_id] = {
          completed: item.completed,
          score: item.score,
          attempts: item.attempts,
          lastAttempt: item.last_attempt,
          masteryLevel: item.mastery_level,
          correctAnswers: item.correct_answers,
          totalQuestions: item.total_questions,
        };
        return acc;
      }, {}),
      lessonContent: (lessonContent || []).reduce((acc: any, item: any) => {
        acc[item.lesson_id] = item.content;
        return acc;
      }, {}),
    };

    return c.json({ success: true, student: studentData });
  } catch (error) {
    console.error('Get student error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Delete student (master teacher only)
app.delete('/students/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Get student's auth_id before deletion
    const { data: student, error: studentError } = await supabaseClient
      .from('users')
      .select('auth_id')
      .eq('id', parseInt(studentId))
      .single();

    if (studentError || !student) {
      return c.json({ success: false, error: 'Student not found' }, 404);
    }

    // Delete from auth
    const { error: authDeleteError } = await supabaseClient.auth.admin.deleteUser(student.auth_id);
    
    if (authDeleteError) {
      console.error('Auth deletion error:', authDeleteError);
      return c.json({ success: false, error: 'Failed to delete user from auth' }, 500);
    }

    // Delete from users table (cascade will handle progress, lesson_content, review_queue)
    const { error: deleteError } = await supabaseClient
      .from('users')
      .delete()
      .eq('id', parseInt(studentId));

    if (deleteError) {
      console.error('User deletion error:', deleteError);
      return c.json({ success: false, error: 'Failed to delete user' }, 500);
    }

    console.log(`✅ Student ${studentId} deleted successfully`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// ==================== LESSON CONTENT ENDPOINTS ====================

// Get lesson content
app.get('/lesson-content/:userId/:lessonId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const lessonId = c.req.param('lessonId');
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    const { data, error } = await supabaseClient
      .from('lesson_content')
      .select('content')
      .eq('user_id', parseInt(userId))
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Lesson content fetch error:', error);
      return c.json({ success: false, error: 'Failed to fetch lesson content' }, 500);
    }

    return c.json({ success: true, content: data?.content || null });
  } catch (error) {
    console.error('Get lesson content error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Save lesson content
app.post('/lesson-content/:userId/:lessonId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const lessonId = c.req.param('lessonId');
    const { content } = await c.req.json();
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Upsert (insert or update)
    const { error } = await supabaseClient
      .from('lesson_content')
      .upsert({
        user_id: parseInt(userId),
        lesson_id: lessonId,
        content: content,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id'
      });

    if (error) {
      console.error('Lesson content save error:', error);
      return c.json({ success: false, error: 'Failed to save lesson content' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Save lesson content error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// ==================== REVIEW QUEUE ENDPOINTS ====================

// Get review queue
app.get('/review-queue/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    const { data, error } = await supabaseClient
      .from('review_queue')
      .select('*')
      .eq('user_id', parseInt(userId))
      .order('next_review', { ascending: true });

    if (error) {
      console.error('Review queue fetch error:', error);
      return c.json({ success: false, error: 'Failed to fetch review queue' }, 500);
    }

    const queue = (data || []).map((item: any) => ({
      lessonId: item.lesson_id,
      nextReview: item.next_review,
      reviewCount: item.review_count,
      lastReviewed: item.last_reviewed,
    }));

    return c.json({ success: true, queue });
  } catch (error) {
    console.error('Get review queue error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Update review queue
app.post('/review-queue/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { lessonId, nextReview } = await c.req.json();
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    // Check if exists
    const { data: existing } = await supabaseClient
      .from('review_queue')
      .select('*')
      .eq('user_id', parseInt(userId))
      .eq('lesson_id', lessonId)
      .single();

    if (existing) {
      // Update
      const { error: updateError } = await supabaseClient
        .from('review_queue')
        .update({
          next_review: nextReview,
          review_count: existing.review_count + 1,
          last_reviewed: new Date().toISOString(),
        })
        .eq('user_id', parseInt(userId))
        .eq('lesson_id', lessonId);

      if (updateError) {
        console.error('Review queue update error:', updateError);
        return c.json({ success: false, error: 'Failed to update review queue' }, 500);
      }
    } else {
      // Insert
      const { error: insertError } = await supabaseClient
        .from('review_queue')
        .insert({
          user_id: parseInt(userId),
          lesson_id: lessonId,
          next_review: nextReview,
          review_count: 1,
          last_reviewed: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Review queue insert error:', insertError);
        return c.json({ success: false, error: 'Failed to add to review queue' }, 500);
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Update review queue error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Remove from review queue
app.delete('/review-queue/:userId/:lessonId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const lessonId = c.req.param('lessonId');
    
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseClient = getSupabaseClient();

    const { error } = await supabaseClient
      .from('review_queue')
      .delete()
      .eq('user_id', parseInt(userId))
      .eq('lesson_id', lessonId);

    if (error) {
      console.error('Review queue delete error:', error);
      return c.json({ success: false, error: 'Failed to remove from review queue' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete from review queue error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
