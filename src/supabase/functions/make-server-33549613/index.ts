import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Teacher registration codes
const TEACHER_CODES: Record<string, boolean> = {
  'QURAN2024': false,  // Regular teacher
  'MASTER2024': true   // Master teacher
};

// Helper function to get Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
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
  const usernamePattern = /^[A-Z][a-z]+[A-Z][a-z]+$/;
  if (!usernamePattern.test(username)) {
    return { valid: false, error: 'Username must be in FirstnameLastname format (e.g., YunusYildiz)' };
  }
  return { valid: true };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/make-server-33549613', '');
    const method = req.method;

    console.log(`${method} ${path}`);

    // ==================== AUTH ENDPOINTS ====================
    
    // Signup endpoint
    if (path === '/signup' && method === 'POST') {
      const { username, password, name, role, teacherCode } = await req.json();
      
      console.log(`📝 Signup attempt for: ${username} (role: ${role})`);

      if (!username || !password || !role) {
        return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return new Response(JSON.stringify({ success: false, error: passwordValidation.error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return new Response(JSON.stringify({ success: false, error: usernameValidation.error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (role === 'teacher') {
        if (!teacherCode || !TEACHER_CODES.hasOwnProperty(teacherCode)) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid teacher registration code' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      const supabaseClient = getSupabaseClient();

      const { data: existingUser } = await supabaseClient
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return new Response(JSON.stringify({ success: false, error: 'Username already exists' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email: `${username}@quranapp.internal`,
        password: password,
        email_confirm: true,
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return new Response(JSON.stringify({ success: false, error: authError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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
        await supabaseClient.auth.admin.deleteUser(authData.user.id);
        return new Response(JSON.stringify({ success: false, error: 'Failed to create user record' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`✅ User created successfully: ${username} (ID: ${userData.id})`);

      try {
        const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: `${username}@quranapp.internal`,
          password: password,
        });

        if (signInError) {
          console.log('⚠️ Auto-login failed, user needs to login manually');
          return new Response(JSON.stringify({ 
            success: true, 
            requiresManualLogin: true,
            message: 'User created successfully. Please login with your credentials.'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log(`✅ Auto-login successful for: ${username}`);

        return new Response(JSON.stringify({
          success: true,
          accessToken: signInData.session.access_token,
          user: {
            id: userData.id,
            username: userData.username,
            name: username,
            role: userData.role,
            isMasterTeacher: userData.is_master_teacher || false
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (signInError) {
        console.error('Auto-login error:', signInError);
        return new Response(JSON.stringify({ 
          success: true, 
          requiresManualLogin: true,
          message: 'User created successfully. Please login with your credentials.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Signin endpoint
    if (path === '/signin' && method === 'POST') {
      const { username, password } = await req.json();
      
      console.log(`🔐 Signin request received for username: ${username}`);

      if (!username || !password) {
        return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabaseClient = getSupabaseClient();

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: `${username}@quranapp.internal`,
        password: password,
      });

      if (error) {
        console.error(`❌ Auth error for ${username}:`, error.message);
        return new Response(JSON.stringify({ success: false, error: 'Invalid username or password' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`✅ Auth successful for ${username}, auth ID: ${data.user.id}`);

      const { data: userData, error: dbError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();

      if (dbError || !userData) {
        console.error(`❌ Database error for ${username}:`, dbError);
        return new Response(JSON.stringify({ success: false, error: 'User not found in database' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`🔍 User data from database:`, JSON.stringify(userData));
      console.log(`📤 Returning user ID: ${userData.id} (type: ${typeof userData.id})`);
      console.log(`✅ User signed in successfully: ${username}`);

      return new Response(JSON.stringify({ 
        success: true, 
        accessToken: data.session.access_token,
        user: {
          id: userData.id,
          username: userData.username,
          name: username,
          role: userData.role,
          isMasterTeacher: userData.is_master_teacher || false
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ==================== PROGRESS ENDPOINTS ====================

    // Get user progress
    if (path.startsWith('/progress/') && method === 'GET') {
      const userId = path.split('/')[2];
      console.log(`📊 Fetching progress for user ID: ${userId} (type: ${typeof userId})`);

      const supabaseClient = getSupabaseClient();

      const { data: progressData, error: progressError } = await supabaseClient
        .from('progress')
        .select('*')
        .eq('user_id', parseInt(userId));

      if (progressError) {
        console.error('Progress fetch error:', progressError);
        return new Response(JSON.stringify({ success: false, error: 'Failed to fetch progress' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`✅ Found ${progressData?.length || 0} progress records for user ${userId}`);

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

      return new Response(JSON.stringify({ success: true, progress: progressObject }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update user progress
    if (path.startsWith('/progress/') && method === 'POST') {
      const userId = path.split('/')[2];
      const { lessonId, score, completed, masteryLevel, correctAnswers, totalQuestions } = await req.json();
      
      console.log(`💾 Updating progress for user ${userId}, lesson ${lessonId}`);

      const supabaseClient = getSupabaseClient();

      const { data: existing } = await supabaseClient
        .from('progress')
        .select('*')
        .eq('user_id', parseInt(userId))
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
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
          return new Response(JSON.stringify({ success: false, error: 'Failed to update progress' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else {
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
          return new Response(JSON.stringify({ success: false, error: 'Failed to create progress' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      console.log(`✅ Progress updated for user ${userId}, lesson ${lessonId}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ==================== TEACHER ENDPOINTS ====================

    // Get all students
    if (path === '/students' && method === 'GET') {
      const supabaseClient = getSupabaseClient();

      const { data: students, error: studentsError } = await supabaseClient
        .from('users')
        .select('id, username, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (studentsError) {
        console.error('Students fetch error:', studentsError);
        return new Response(JSON.stringify({ success: false, error: 'Failed to fetch students' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: allProgress } = await supabaseClient
        .from('progress')
        .select('*');

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

      return new Response(JSON.stringify({ success: true, students: studentsWithProgress }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get student by ID
    if (path.startsWith('/students/') && method === 'GET') {
      const studentId = path.split('/')[2];
      const supabaseClient = getSupabaseClient();

      const { data: student, error: studentError } = await supabaseClient
        .from('users')
        .select('id, username, created_at')
        .eq('id', parseInt(studentId))
        .eq('role', 'student')
        .single();

      if (studentError || !student) {
        return new Response(JSON.stringify({ success: false, error: 'Student not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: progress } = await supabaseClient
        .from('progress')
        .select('*')
        .eq('user_id', parseInt(studentId));

      const { data: lessonContent } = await supabaseClient
        .from('lesson_content')
        .select('*')
        .eq('user_id', parseInt(studentId));

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

      return new Response(JSON.stringify({ success: true, student: studentData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete student
    if (path.startsWith('/students/') && method === 'DELETE') {
      const studentId = path.split('/')[2];
      const supabaseClient = getSupabaseClient();

      const { data: student, error: studentError } = await supabaseClient
        .from('users')
        .select('auth_id')
        .eq('id', parseInt(studentId))
        .single();

      if (studentError || !student) {
        return new Response(JSON.stringify({ success: false, error: 'Student not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await supabaseClient.auth.admin.deleteUser(student.auth_id);

      const { error: deleteError } = await supabaseClient
        .from('users')
        .delete()
        .eq('id', parseInt(studentId));

      if (deleteError) {
        console.error('User deletion error:', deleteError);
        return new Response(JSON.stringify({ success: false, error: 'Failed to delete user' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`✅ Student ${studentId} deleted successfully`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ==================== LESSON CONTENT ENDPOINTS ====================

    // Get/Save lesson content
    const lessonContentMatch = path.match(/^\/lesson-content\/(\d+)\/(.+)$/);
    if (lessonContentMatch) {
      const userId = lessonContentMatch[1];
      const lessonId = lessonContentMatch[2];
      const supabaseClient = getSupabaseClient();

      if (method === 'GET') {
        const { data } = await supabaseClient
          .from('lesson_content')
          .select('content')
          .eq('user_id', parseInt(userId))
          .eq('lesson_id', lessonId)
          .single();

        return new Response(JSON.stringify({ success: true, content: data?.content || null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (method === 'POST') {
        const { content } = await req.json();

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
          return new Response(JSON.stringify({ success: false, error: 'Failed to save lesson content' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ==================== REVIEW QUEUE ENDPOINTS ====================

    // Get/Update review queue
    const reviewQueueMatch = path.match(/^\/review-queue\/(\d+)(?:\/(.+))?$/);
    if (reviewQueueMatch) {
      const userId = reviewQueueMatch[1];
      const lessonId = reviewQueueMatch[2];
      const supabaseClient = getSupabaseClient();

      if (method === 'GET' && !lessonId) {
        const { data } = await supabaseClient
          .from('review_queue')
          .select('*')
          .eq('user_id', parseInt(userId))
          .order('next_review', { ascending: true });

        const queue = (data || []).map((item: any) => ({
          lessonId: item.lesson_id,
          nextReview: item.next_review,
          reviewCount: item.review_count,
          lastReviewed: item.last_reviewed,
        }));

        return new Response(JSON.stringify({ success: true, queue }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (method === 'POST' && !lessonId) {
        const { lessonId: lid, nextReview } = await req.json();

        const { data: existing } = await supabaseClient
          .from('review_queue')
          .select('*')
          .eq('user_id', parseInt(userId))
          .eq('lesson_id', lid)
          .single();

        if (existing) {
          await supabaseClient
            .from('review_queue')
            .update({
              next_review: nextReview,
              review_count: existing.review_count + 1,
              last_reviewed: new Date().toISOString(),
            })
            .eq('user_id', parseInt(userId))
            .eq('lesson_id', lid);
        } else {
          await supabaseClient
            .from('review_queue')
            .insert({
              user_id: parseInt(userId),
              lesson_id: lid,
              next_review: nextReview,
              review_count: 1,
              last_reviewed: new Date().toISOString(),
            });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (method === 'DELETE' && lessonId) {
        await supabaseClient
          .from('review_queue')
          .delete()
          .eq('user_id', parseInt(userId))
          .eq('lesson_id', lessonId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Health check
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Not found
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Request error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
