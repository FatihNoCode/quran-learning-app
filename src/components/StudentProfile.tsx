import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge, StudentProgress } from '../utils/masterySystem';
import { Award, TrendingUp, Flame, Star, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { projectId } from '../utils/supabase/info';

interface StudentProfileProps {
  progress: StudentProgress;
  language: 'tr' | 'nl';
  onClose: () => void;
  userId: string;
  accessToken: string;
  onProgressReset: () => void;
  onLogout?: () => void;
}

export function StudentProfile({ progress, language, onClose, userId, accessToken, onProgressReset, onLogout }: StudentProfileProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetting, setResetting] = useState(false);

  const skillsArray = Object.entries(progress.skillMastery);
  const highMasterySkills = skillsArray.filter(([_, m]) => m.level >= 80).length;
  const mediumMasterySkills = skillsArray.filter(([_, m]) => m.level >= 60 && m.level < 80).length;
  const lowMasterySkills = skillsArray.filter(([_, m]) => m.level < 60).length;

  const handleResetProgress = async () => {
    setResetting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/students/${userId}/reset-to-lesson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ lessonOrder: 1 })
        }
      );

      if (response.ok) {
        setShowResetDialog(false);
        onProgressReset(); // Reload progress
        onClose(); // Close profile
      } else {
        const data = await response.json();
        console.error('Error resetting progress:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert(language === 'tr' ? 'İlerleme sıfırlanamadı' : 'Voortgang kon niet worden gereset');
    } finally {
      setResetting(false);
    }
  };

  const translations = {
    tr: {
      myProfile: 'Profilim',
      totalPoints: 'Toplam Puan',
      averageAccuracy: 'Ortalama Doğruluk',
      dailyStreak: 'Günlük Seri',
      completedLessons: 'Tamamlanan Ders',
      skillMastery: 'Beceri Hakimiyeti',
      highMastery: 'Yüksek Hakimiyet (80%+)',
      mediumMastery: 'Orta Hakimiyet (60-79%)',
      needsPractice: 'Pratik Gerekli (<60%)',
      correct: 'doğru',
      lastPractice: 'Son pratik:',
      badges: 'Rozetler',
      noBadges: 'Henüz rozet kazanmadın. Dersleri tamamla ve rozetler kazan!',
      reviewQueue: 'Tekrar Kuyruğu',
      questionsToReview: 'Tekrar edilecek soru',
      resetProgress: 'İlerlemeyi Sıfırla',
      confirmReset: 'Tüm ilerlemenizi sıfırlamak istediğinizden emin misiniz?',
      resetWarning: '⚠️ Bu işlem geri alınamaz! Tüm derslerin, puanların, rozetlerin ve istatistiklerin silinecek ve baştan başlayacaksınız.',
      cancel: 'İptal',
      reset: 'Sıfırla',
      logout: 'Çıkış Yap'
    },
    nl: {
      myProfile: 'Mijn Profiel',
      totalPoints: 'Totaal Punten',
      averageAccuracy: 'Gemiddelde Nauwkeurigheid',
      dailyStreak: 'Dag Streak',
      completedLessons: 'Voltooide Lessen',
      skillMastery: 'Vaardigheidsbeheersing',
      highMastery: 'Hoge Beheersing (80%+)',
      mediumMastery: 'Gemiddelde Beheersing (60-79%)',
      needsPractice: 'Oefening Nodig (<60%)',
      correct: 'correct',
      lastPractice: 'Laatste oefening:',
      badges: 'Badges',
      noBadges: 'Je hebt nog geen badges. Voltooi lessen en verdien badges!',
      reviewQueue: 'Herhaling Wachtrij',
      questionsToReview: 'Vragen om te herhalen',
      resetProgress: 'Voortgang Resetten',
      confirmReset: 'Weet je zeker dat je al je voortgang wilt resetten?',
      resetWarning: '⚠️ Deze actie kan niet ongedaan worden gemaakt! Al je lessen, punten, badges en statistieken worden gewist en je begint opnieuw.',
      cancel: 'Annuleren',
      reset: 'Reset',
      logout: 'Uitloggen'
    }
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl">
              {t.myProfile}
            </h2>
            <div className="flex items-center gap-3">
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t.logout}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center gap-3">
                <Star className="text-purple-600" size={32} />
                <div>
                  <div className="text-3xl">{progress.totalPoints}</div>
                  <div className="text-sm text-purple-700">
                    {t.totalPoints}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-600" size={32} />
                <div>
                  <div className="text-3xl">{Math.round(progress.stats.averageAccuracy)}%</div>
                  <div className="text-sm text-blue-700">
                    {t.averageAccuracy}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center gap-3">
                <Flame className="text-orange-600" size={32} />
                <div>
                  <div className="text-3xl">{progress.stats.currentStreak}</div>
                  <div className="text-sm text-orange-700">
                    {t.dailyStreak}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-3">
                <Award className="text-green-600" size={32} />
                <div>
                  <div className="text-3xl">{progress.completedLessons.length}</div>
                  <div className="text-sm text-green-700">
                    {t.completedLessons}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Skill Mastery Overview */}
          <Card className="p-6">
            <h3 className="text-2xl mb-4">
              {t.skillMastery}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-100 rounded-xl">
                <div className="text-2xl text-green-700 mb-1">{highMasterySkills}</div>
                <div className="text-sm text-green-800">
                  {t.highMastery}
                </div>
              </div>
              <div className="p-4 bg-yellow-100 rounded-xl">
                <div className="text-2xl text-yellow-700 mb-1">{mediumMasterySkills}</div>
                <div className="text-sm text-yellow-800">
                  {t.mediumMastery}
                </div>
              </div>
              <div className="p-4 bg-red-100 rounded-xl">
                <div className="text-2xl text-red-700 mb-1">{lowMasterySkills}</div>
                <div className="text-sm text-red-800">
                  {t.needsPractice}
                </div>
              </div>
            </div>

            {/* Individual Skills */}
            <div className="space-y-3">
              {skillsArray
                .sort((a, b) => b[1].level - a[1].level)
                .map(([skillId, mastery]) => (
                  <div key={skillId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{skillId}</span>
                      <span className="text-sm font-bold">{mastery.level}%</span>
                    </div>
                    <Progress 
                      value={mastery.level} 
                      className={`h-2 ${
                        mastery.level >= 80 
                          ? '[&>div]:bg-green-500' 
                          : mastery.level >= 60 
                          ? '[&>div]:bg-yellow-500' 
                          : '[&>div]:bg-red-500'
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>
                        {language === 'tr' 
                          ? `${mastery.correctAnswers}/${mastery.attempts} ${t.correct}` 
                          : `${mastery.correctAnswers}/${mastery.attempts} ${t.correct}`
                        }
                      </span>
                      <span>
                        {language === 'tr' 
                          ? `${t.lastPractice} ${new Date(mastery.lastPracticed).toLocaleDateString('tr-TR')}` 
                          : `${t.lastPractice} ${new Date(mastery.lastPracticed).toLocaleDateString('nl-NL')}`
                        }
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6">
            <h3 className="text-2xl mb-4">
              {t.badges}
            </h3>
            
            {progress.badges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t.noBadges}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {progress.badges.map(badge => (
                  <Card key={badge.id} className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{badge.icon}</span>
                      <div>
                        <div className="font-bold">{badge.name[language]}</div>
                        <div className="text-sm text-gray-600">{badge.description[language]}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(badge.earnedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'nl-NL')}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Review Queue Info */}
          <Card className="p-6">
            <h3 className="text-2xl mb-4">
              {t.reviewQueue}
            </h3>
            <div className="text-center py-4">
              <div className="text-4xl mb-2">{progress.reviewQueue.length}</div>
              <div className="text-gray-600">
                {t.questionsToReview}
              </div>
            </div>
          </Card>

          {/* Reset Progress Button */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
            <h3 className="text-2xl mb-4 text-red-800">
              {t.resetProgress}
            </h3>
            <p className="text-sm text-red-700 mb-4 text-center">
              {language === 'tr' 
                ? 'Bu işlem tüm ilerlemenizi sıfırlayacak ve baştan başlamanıza neden olacaktır.' 
                : 'Deze actie zal al je voortgang resetten en je opnieuw laten beginnen.'
              }
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowResetDialog(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-105"
              >
                <RotateCcw size={20} />
                {t.resetProgress}
              </button>
            </div>
          </Card>
        </div>

        {/* Reset Progress Dialog */}
        {showResetDialog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-4 border-red-300">
              <div className="p-6 border-b bg-red-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 p-3 rounded-xl">
                      <RotateCcw className="text-white" size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-red-800">
                      {t.resetProgress}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowResetDialog(false)}
                    disabled={resetting}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center py-4">
                  <p className="text-gray-700 mb-4">
                    {t.confirmReset}
                  </p>
                  <p className="text-red-600 text-sm">
                    {t.resetWarning}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowResetDialog(false)}
                    disabled={resetting}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleResetProgress}
                    disabled={resetting}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {resetting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {language === 'tr' ? 'Sıfırlanıyor...' : 'Resetten...'}
                      </>
                    ) : (
                      <>
                        <RotateCcw size={16} />
                        {t.reset}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
