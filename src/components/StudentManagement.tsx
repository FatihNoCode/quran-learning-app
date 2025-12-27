import { useState } from 'react';
import { projectId } from '../utils/supabase/info';
import { placeholderLessons } from '../data/placeholderLessons';
import { Trash2, Unlock, Eye, EyeOff, AlertTriangle, RotateCcw } from 'lucide-react';

interface StudentManagementProps {
  student: any;
  accessToken: string;
  language: 'tr' | 'nl';
  onUpdate: () => void;
  isMasterTeacher?: boolean;
}

const translations = {
  tr: {
    actions: 'ŽøYlemler',
    delete: 'Sil',
    unlockLevel: 'Seviye AÇõ',
    viewPassword: 'zifre GÇôster',
    hidePassword: 'zifre Gizle',
    password: 'zifre',
    confirmDelete: 'Bu ÇôŽYrenciyi silmek istediŽYinizden emin misiniz?',
    deleteWarning: 'Bu iYlem geri alŽñnamaz. TÇ¬m ilerleme kaydŽñ silinecektir.',
    cancel: 'Žøptal',
    confirm: 'Onayla',
    selectLesson: 'Ders SeÇõ',
    unlock: 'AÇõ',
    deleting: 'Siliniyor...',
    unlocking: 'AÇõŽñlŽñyor...',
    username: 'KullanŽñcŽñ AdŽñ',
    resetProgress: 'Žølerlemeyi SŽñfŽñrla',
    confirmReset: 'Bu ÇôŽYrencinin ilerlemesini sŽñfŽñrlamak istediŽYinizden emin misiniz?',
    resetWarning: 'TÇ¬m tamamlanmŽñY dersler sŽñfŽñrlanacak ve ÇôŽYrenci baYtan baYlayacak.',
    resetting: 'SŽñfŽñrlanŽñyor...',
    reset: 'SŽñfŽñrla'
  },
  nl: {
    actions: 'Acties',
    delete: 'Verwijderen',
    unlockLevel: 'Niveau Ontgrendelen',
    viewPassword: 'Wachtwoord Tonen',
    hidePassword: 'Wachtwoord Verbergen',
    password: 'Wachtwoord',
    confirmDelete: 'Weet je zeker dat je deze student wilt verwijderen?',
    deleteWarning: 'Deze actie kan niet ongedaan worden gemaakt. Alle voortgang wordt gewist.',
    cancel: 'Annuleren',
    confirm: 'Bevestigen',
    selectLesson: 'Selecteer Les',
    unlock: 'Ontgrendelen',
    deleting: 'Verwijderen...',
    unlocking: 'Ontgrendelen...',
    username: 'Gebruikersnaam',
    resetProgress: 'Voortgang Resetten',
    confirmReset: 'Weet je zeker dat je de voortgang van deze student wilt resetten?',
    resetWarning: 'Alle voltooide lessen worden gewist en de student begint opnieuw.',
    resetting: 'Resetten...',
    reset: 'Reset'
  }
};

export default function StudentManagement({ student, accessToken, language, onUpdate, isMasterTeacher = false }: StudentManagementProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedLessonOrder, setSelectedLessonOrder] = useState<number>(student.currentLessonOrder || 1);
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/students/${student.userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        setShowDeleteDialog(false);
        onUpdate();
      } else {
        const data = await response.json();
        console.error('Error deleting student:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockLevel = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/students/${student.userId}/unlock-level`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            lessonOrder: selectedLessonOrder
          })
        }
      );

      if (response.ok) {
        setShowUnlockDialog(false);
        setSelectedLessonOrder(student.currentLessonOrder || 1);
        onUpdate();
      } else {
        const data = await response.json();
        console.error('Error unlocking level:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error unlocking level:', error);
      alert('Failed to unlock level');
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/students/${student.userId}/reset-progress`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        setShowResetDialog(false);
        onUpdate();
      } else {
        const data = await response.json();
        console.error('Error resetting progress:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert('Failed to reset progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Password Button - Only for Master Teachers */}
      {isMasterTeacher && (
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
          title={showPassword ? t.hidePassword : t.viewPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {/* Unlock Level Button - Only for Master Teachers */}
      {isMasterTeacher && (
        <button
          onClick={() => setShowUnlockDialog(true)}
          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
          title={t.unlockLevel}
        >
          <Unlock size={18} />
        </button>
      )}

      {/* Delete Button - Only for Master Teachers */}
      {isMasterTeacher && (
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
          title={t.delete}
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Reset Progress Button - Only for Master Teachers */}
      {isMasterTeacher && (
        <button
          onClick={() => setShowResetDialog(true)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          title={t.resetProgress}
        >
          <RotateCcw size={18} />
        </button>
      )}

      {/* Password Display */}
      {showPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border-4 border-blue-200 shadow-2xl">
            <h3 className="text-blue-800 mb-4">{student.name} - {t.password}</h3>
            <div className="bg-gray-100 p-4 rounded-xl mb-4">
              <p className="text-sm text-gray-600 mb-2">{t.username}:</p>
              <p className="text-lg mb-3">{student.username}</p>
              <p className="text-sm text-gray-600 mb-2">{t.password}:</p>
              <p className="text-lg">{student.password || 'ƒ?½ƒ?½ƒ?½ƒ?½ƒ?½ƒ?½ƒ?½ƒ?½ '}</p>
            </div>
            <button
              onClick={() => setShowPassword(false)}
              className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Unlock Level Dialog */}
      {showUnlockDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border-4 border-green-200 shadow-2xl">
            <h3 className="text-green-800 mb-4">{student.name} - {t.unlockLevel}</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">{t.selectLesson}</label>
                <select
                  value={selectedLessonOrder}
                  onChange={(e) => setSelectedLessonOrder(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500"
                >
                  {placeholderLessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.order}>
                      {lesson.title[language]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowUnlockDialog(false);
                  setSelectedLessonOrder(student.currentLessonOrder || 1);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleUnlockLevel}
                disabled={loading}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.unlocking : t.unlock}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border-4 border-red-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-red-800">{t.confirmDelete}</h3>
            </div>
            <p className="text-gray-600 mb-4">{student.name} (@{student.username})</p>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700">{t.deleteWarning}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.deleting : t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Progress Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border-4 border-gray-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 p-3 rounded-xl">
                <AlertTriangle className="text-gray-600" size={24} />
              </div>
              <h3 className="text-gray-800">{t.confirmReset}</h3>
            </div>
            <p className="text-gray-600 mb-4">{student.name} (@{student.username})</p>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
              <p className="text-gray-700">{t.resetWarning}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetDialog(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleResetProgress}
                disabled={loading}
                className="flex-1 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.resetting : t.reset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
