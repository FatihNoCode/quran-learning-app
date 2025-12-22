import { useEffect, useMemo, useState } from 'react';
import { Lesson } from '../data/notionLessons';
import {
  fetchContent,
  saveLesson,
  deleteLesson,
  saveQuiz,
  deleteQuiz,
  QuizRecord,
} from '../utils/contentApi';
import { User } from '../App';
import {
  BookOpen,
  Shield,
  ShieldCheck,
  PenSquare,
  Save,
  Trash2,
  Plus,
  Loader2,
  BarChart3,
} from 'lucide-react';

interface StudentSnapshot {
  userId: string;
  completedLessons: string[];
  currentLessonOrder: number;
}

interface LessonQuizPanelProps {
  accessToken: string;
  language: 'tr' | 'nl';
  isMasterTeacher: boolean;
  user: User;
  students: StudentSnapshot[];
}

const defaultLesson = (order: number): Partial<Lesson> => ({
  order,
  level: 'Alif-Ba',
  content: {
    type: 'letter-grid',
    title: '',
    instruction: '',
    letterGroups: [['ا', 'ب', 'ت']],
    color: '#7C3AED',
    learningModes: ['multiple-choice'],
  },
});

const defaultQuiz: Partial<QuizRecord> = {
  title: '',
  description: '',
  learningModes: ['multiple-choice'],
  questions: [
    {
      id: 'q-temp',
      prompt: '',
      type: 'multiple-choice',
      options: [],
      answer: '',
    },
  ],
};

export default function LessonQuizPanel({
  accessToken,
  language,
  isMasterTeacher,
  user,
  students,
}: LessonQuizPanelProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastEdited, setLastEdited] = useState<{ by?: string; at?: string }>({});
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>(defaultLesson(1));
  const [quizForm, setQuizForm] = useState<Partial<QuizRecord>>(defaultQuiz);

  const masterLockLabel =
    language === 'tr' ? 'Sadece ana öğretmen düzenleyebilir' : 'Alleen hoofdleraar mag wijzigen';

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContent(accessToken);
      setLessons(data.lessons || []);
      setQuizzes(data.quizzes || []);
      setLastEdited({ by: data.lastEditedBy, at: data.lastEditedAt });
      setLessonForm(defaultLesson((data.lessons?.length || 0) + 1));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'İçerik yüklenemedi';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!isMasterTeacher) return;
    try {
      setStatus(language === 'tr' ? 'Kaydediliyor...' : 'Opslaan...');
      const payload = { ...lessonForm };
      const res = await saveLesson(payload, accessToken);
      setLessons(res.lessons);
      setLastEdited({ by: res.lastEditedBy, at: res.lastEditedAt });
      setLessonForm(defaultLesson(res.lessons.length + 1));
      setStatus(language === 'tr' ? 'Ders kaydedildi' : 'Les opgeslagen');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydedilemedi');
    } finally {
      setTimeout(() => setStatus(null), 1500);
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonForm(lesson);
  };

  const handleDeleteLesson = async (id?: string) => {
    if (!id || !isMasterTeacher) return;
    setStatus(language === 'tr' ? 'Siliniyor...' : 'Verwijderen...');
    try {
      const res = await deleteLesson(id, accessToken);
      setLessons(res.lessons);
      setLessonForm(defaultLesson((res.lessons?.length || 0) + 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silinemedi');
    } finally {
      setTimeout(() => setStatus(null), 1200);
    }
  };

  const handleSaveQuiz = async () => {
    if (!isMasterTeacher) return;
    try {
      setStatus(language === 'tr' ? 'Kaydediliyor...' : 'Opslaan...');
      const payload = { ...quizForm, questions: quizForm.questions || [] };
      const res = await saveQuiz(payload, accessToken);
      setQuizzes(res.quizzes);
      setQuizForm(defaultQuiz);
      setStatus(language === 'tr' ? 'Quiz kaydedildi' : 'Quiz opgeslagen');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydedilemedi');
    } finally {
      setTimeout(() => setStatus(null), 1500);
    }
  };

  const handleDeleteQuiz = async (id?: string) => {
    if (!id || !isMasterTeacher) return;
    setStatus(language === 'tr' ? 'Siliniyor...' : 'Verwijderen...');
    try {
      const res = await deleteQuiz(id, accessToken);
      setQuizzes(res.quizzes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silinemedi');
    } finally {
      setTimeout(() => setStatus(null), 1200);
    }
  };


  const lessonCompletion = useMemo(() => {
    return lessons.map((lesson) => {
      const completed = students.filter((s) => (s.completedLessons || []).includes(lesson.id)).length;
      return {
        id: lesson.id,
        title: lesson.content.title,
        order: lesson.order,
        completed,
      };
    });
  }, [lessons, students]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-200">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          <p className="text-gray-700">
            {language === 'tr' ? 'Ders paneli yükleniyor...' : 'Lespaneel laden...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(status || error) && (
        <div
          className={`rounded-xl px-4 py-3 border ${
            error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {error || status}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-purple-200 flex items-center gap-3">
        <div className="bg-purple-100 p-3 rounded-xl">
          <BookOpen className="text-purple-600" size={22} />
        </div>
        <div>
          <p className="text-gray-800 font-semibold">
            {language === 'tr' ? 'Ders ve Quiz Paneli' : 'Les- en quizpaneel'}
          </p>
          <p className="text-sm text-gray-600">
            {language === 'tr'
              ? 'Öğretmenler görüntüleyebilir, ana öğretmen düzenleyebilir.'
              : 'Leraren kunnen bekijken, hoofdleraar mag bewerken.'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'tr' ? 'Son düzenleme:' : 'Last edited:'}{' '}
            {lastEdited.at ? new Date(lastEdited.at).toLocaleDateString() : '–'}{' '}
            {lastEdited.by ? `(${lastEdited.by})` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="text-blue-500" size={18} />
                <p className="text-gray-800 font-semibold">
                  {language === 'tr' ? 'Dersler' : 'Lessen'}
                </p>
              </div>
              {!isMasterTeacher && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} />
                  {masterLockLabel}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border-2 border-blue-100 rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {lesson.order}. {lesson.content.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lesson.content.learningModes?.join(', ') || '—'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'tr' ? 'Düzenleyen:' : 'Bewerkt door:'} {lesson.lastEditedBy || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
                      onClick={() => handleEditLesson(lesson)}
                    >
                      <PenSquare size={16} />
                    </button>
                    {isMasterTeacher && (
                      <button
                        className="px-3 py-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-green-600" size={18} />
              <p className="text-gray-800 font-semibold">
                {lessonForm.id ? (language === 'tr' ? 'Dersi Güncelle' : 'Les bijwerken') : (language === 'tr' ? 'Yeni Ders' : 'Nieuwe les')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Başlık' : 'Titel'}
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.content?.title || ''}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      content: { ...(lessonForm.content || {}), title: e.target.value },
                    })
                  }
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Başlık (NL)' : 'Titel (NL)'}
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.content?.titleNl || ''}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      content: { ...(lessonForm.content || {}), titleNl: e.target.value },
                    })
                  }
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Talimat' : 'Instructie'}
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.content?.instruction || ''}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      content: { ...(lessonForm.content || {}), instruction: e.target.value },
                    })
                  }
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Talimat (NL)' : 'Instructie (NL)'}
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.content?.instructionNl || ''}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      content: { ...(lessonForm.content || {}), instructionNl: e.target.value },
                    })
                  }
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Sıra' : 'Volgorde'}
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.order || 1}
                  onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Seviye' : 'Niveau'}
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.level || ''}
                  onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Öğrenme türleri' : 'Leerwijzen'}
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="yes-no, multiple-choice, matching..."
                  value={lessonForm.content?.learningModes?.join(', ') || ''}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      content: {
                        ...(lessonForm.content || {}),
                        learningModes: e.target.value
                          .split(',')
                          .map((v) => v.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'İçerik tipi' : 'Content type'}
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={lessonForm.content?.type || 'letter-grid'}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      content: { ...(lessonForm.content || {}), type: e.target.value as any },
                    })
                  }
                  disabled={!isMasterTeacher}
                >
                  <option value="letter-grid">Letter grid</option>
                  <option value="letter-practice">Letter practice</option>
                  <option value="letter-positions">Letter positions</option>
                  <option value="letter-connected">Letter connected</option>
                  <option value="letter-haraka">Haraka</option>
                  <option value="image-lesson">Image lesson</option>
                </select>
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 ${
                  isMasterTeacher ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleSaveLesson}
                disabled={!isMasterTeacher}
              >
                <Save size={16} />
                {language === 'tr' ? 'Kaydet' : 'Opslaan'}
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 flex items-center gap-2"
                onClick={() => setLessonForm(defaultLesson((lessons.length || 0) + 1))}
              >
                <Plus size={16} />
                {language === 'tr' ? 'Yeni' : 'Nieuw'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="text-emerald-600" size={18} />
              <p className="text-gray-800 font-semibold">
                {language === 'tr' ? 'İlerleme' : 'Voortgang'}
              </p>
            </div>
            <div className="space-y-2">
              {lessonCompletion.map((item) => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {item.order}. {item.title}
                    </span>
                    <span>{item.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{
                        width: `${students.length ? (item.completed / students.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-xs text-gray-500">
                  {language === 'tr' ? 'Henüz öğrenci yok' : 'Nog geen studenten'}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-pink-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-pink-500" size={18} />
              <p className="text-gray-800 font-semibold">
                {language === 'tr' ? 'Quizler' : 'Quizzes'}
              </p>
            </div>
            <div className="space-y-2">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="border border-pink-100 rounded-xl p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-gray-800 font-semibold">{quiz.title}</p>
                      <p className="text-xs text-gray-500">{quiz.description}</p>
                      <p className="text-xs text-gray-500">
                        {language === 'tr' ? 'Soru sayısı:' : 'Aantal vragen:'}{' '}
                        {quiz.questions?.length || 0}
                      </p>
                    </div>
                    {isMasterTeacher && (
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {quizzes.length === 0 && (
                <p className="text-xs text-gray-500">
                  {language === 'tr' ? 'Henüz quiz yok' : 'Nog geen quizzen'}
                </p>
              )}
            </div>
            <div className="mt-3">
              <label className="text-sm text-gray-700">
                {language === 'tr' ? 'Quiz başlığı' : 'Quiz titel'}
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={quizForm.title || ''}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  disabled={!isMasterTeacher}
                />
              </label>
              <label className="text-sm text-gray-700 block mt-2">
                {language === 'tr' ? 'Açıklama' : 'Omschrijving'}
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={quizForm.description || ''}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  disabled={!isMasterTeacher}
                />
              </label>
              <button
                className={`mt-3 w-full px-4 py-2 rounded-xl text-white flex items-center justify-center gap-2 ${
                  isMasterTeacher ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleSaveQuiz}
                disabled={!isMasterTeacher}
              >
                <Save size={16} />
                {language === 'tr' ? 'Quiz Kaydet' : 'Quiz Opslaan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
