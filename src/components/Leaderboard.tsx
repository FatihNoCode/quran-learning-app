import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, User } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface LeaderboardEntry {
  userId: string;
  username: string;
  name: string;
  totalPoints: number;
  rank: number;
}

interface LeaderboardProps {
  currentUserId: string;
  accessToken: string;
  language: 'tr' | 'nl';
}

const translations = {
  tr: {
    leaderboard: 'Lider Tablosu',
    topStudents: 'En İyi 5 Öğrenci',
    yourRank: 'Senin Sıralaman',
    rank: 'Sıra',
    student: 'Öğrenci',
    points: 'Puan',
    loading: 'Yükleniyor...',
    noData: 'Henüz veri yok',
    notReady: 'Leaderboard henüz hazır değil.',
    failed: 'Leaderboard yüklenemedi.',
    you: 'Sen'
  },
  nl: {
    leaderboard: 'Ranglijst',
    topStudents: 'Top 5 Studenten',
    yourRank: 'Jouw Positie',
    rank: 'Rang',
    student: 'Student',
    points: 'Punten',
    loading: 'Laden...',
    noData: 'Nog geen gegevens',
    notReady: 'Leaderboard is nog niet beschikbaar.',
    failed: 'Leaderboard kon niet worden geladen.',
    you: 'Jij'
  }
};

export function Leaderboard({ currentUserId, accessToken, language }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  useEffect(() => {
    fetchLeaderboard();
  }, [accessToken]);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-33549613/leaderboard`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setError(response.status === 404 ? t.notReady : t.failed);
        setLeaderboard([]);
        return;
      }

      try {
        const data = text ? JSON.parse(text) : {};
        setLeaderboard(data.leaderboard || []);
      } catch (parseError) {
        setError(t.failed);
        setLeaderboard([]);
      }
    } catch (error) {
      setError(t.failed);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-yellow-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  const top5 = leaderboard.slice(0, 5);
  const currentUserEntry = leaderboard.find(entry => entry.userId === currentUserId);
  const isInTop5 = currentUserEntry && currentUserEntry.rank <= 5;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={28} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <Award className="text-blue-500" size={20} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-yellow-200 border-yellow-400';
      case 2:
        return 'from-gray-100 to-gray-200 border-gray-400';
      case 3:
        return 'from-amber-100 to-amber-200 border-amber-400';
      default:
        return 'from-blue-50 to-blue-100 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-yellow-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-100 p-3 rounded-xl">
          <Trophy className="text-yellow-600" size={28} />
        </div>
        <div>
          <h2 className="text-yellow-800">{t.leaderboard}</h2>
          <p className="text-sm text-gray-600">{t.topStudents}</p>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8 text-gray-500">
          <Trophy size={48} className="mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t.noData}</p>
          </div>
      ) : (
        <div className="space-y-3">
          {/* Top 5 Students */}
          {top5.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <div
                key={entry.userId}
                className={`bg-gradient-to-r ${getRankColor(entry.rank)} rounded-xl p-4 border-2 transition-all ${
                  isCurrentUser ? 'ring-4 ring-purple-400' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800">
                          {entry.name}
                        </p>
                        {isCurrentUser && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            {t.you}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">@{entry.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t.points}</p>
                    <p className="text-2xl font-bold text-gray-800">{entry.totalPoints}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Current User's Rank (if not in top 5) */}
          {!isInTop5 && currentUserEntry && (
            <>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">• • •</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-300 ring-4 ring-purple-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full text-white font-bold">
                      #{currentUserEntry.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800">
                          {currentUserEntry.name}
                        </p>
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          {t.you}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">@{currentUserEntry.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t.points}</p>
                    <p className="text-2xl font-bold text-gray-800">{currentUserEntry.totalPoints}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
