import { projectId } from './supabase/info';
import { Lesson } from '../data/notionLessons';

export type LearningMode = 'yes-no' | 'multiple-choice' | 'matching' | 'open-ended';

export interface QuizQuestion {
  id: string;
  prompt: string;
  type: LearningMode;
  options?: string[];
  pairs?: { left: string; right: string }[];
  answer?: string;
  explanation?: string;
}

export interface QuizRecord {
  id: string;
  title: string;
  description?: string;
  learningModes?: LearningMode[];
  questions: QuizQuestion[];
  lastEditedAt?: string;
  lastEditedBy?: string;
}

export interface ContentResponse {
  lessons: Lesson[];
  quizzes: QuizRecord[];
  lastEditedAt?: string;
  lastEditedBy?: string;
}

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-33549613`;

const apiRequest = async <T>(path: string, options: RequestInit & { accessToken: string }): Promise<T> => {
  const { accessToken, ...rest } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...(rest.headers || {})
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request to ${path} failed with ${res.status}`);
  }

  return res.json();
};

export const fetchContent = (accessToken: string) =>
  apiRequest<ContentResponse>('/content', { method: 'GET', accessToken });

export const saveLesson = (lesson: Partial<Lesson>, accessToken: string) =>
  apiRequest<{ lesson: Lesson; lessons: Lesson[]; lastEditedAt?: string; lastEditedBy?: string }>(
    '/content/lessons',
    {
      method: 'POST',
      accessToken,
      body: JSON.stringify(lesson)
    }
  );

export const deleteLesson = (lessonId: string, accessToken: string) =>
  apiRequest<{ lessons: Lesson[] }>(`/content/lessons/${lessonId}`, {
    method: 'DELETE',
    accessToken
  });

export const saveQuiz = (quiz: Partial<QuizRecord>, accessToken: string) =>
  apiRequest<{ quiz: QuizRecord; quizzes: QuizRecord[]; lastEditedAt?: string; lastEditedBy?: string }>(
    '/content/quizzes',
    {
      method: 'POST',
      accessToken,
      body: JSON.stringify(quiz)
    }
  );

export const deleteQuiz = (quizId: string, accessToken: string) =>
  apiRequest<{ quizzes: QuizRecord[] }>(`/content/quizzes/${quizId}`, {
    method: 'DELETE',
    accessToken
  });

export const requestAiSuggestion = (
  params: { topic?: string; type?: 'lesson' | 'quiz' },
  accessToken: string
) =>
  apiRequest<{ suggestion: any; configured: boolean; requestedBy: string; type: string }>(
    '/ai/suggest',
    {
      method: 'POST',
      accessToken,
      body: JSON.stringify(params)
    }
  );
