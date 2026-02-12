import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { soundManager } from '../utils/sounds';
import * as api from '../utils/api';

interface LeaderboardScreenProps {
  onBack: () => void;
  username: string;
  profilePic: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  profilePic: number;
  level: number;
  moves: number;
  time: number;
  score: number;
  stars: number;
}

const avatarOptions = [
  { id: 1, emoji: '🦊', color: '#FFB6C1' },
  { id: 2, emoji: '🐼', color: '#98D8C8' },
  { id: 3, emoji: '🐸', color: '#F7DC6F' },
  { id: 4, emoji: '🐨', color: '#BB8FCE' },
  { id: 5, emoji: '🦁', color: '#F8B88B' },
  { id: 6, emoji: '🐯', color: '#AED6F1' },
];

export default function LeaderboardScreen({ onBack, username, profilePic }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.getLeaderboard();
      
      // Map API response to leaderboard entries
      const entries: LeaderboardEntry[] = response.scores.map((score: any, index: number) => ({
        rank: index + 1,
        username: score.username,
        profilePic: score.profilePic,
        level: score.level,
        moves: score.moves,
        time: score.time,
        score: score.score,
        stars: score.stars,
      }));
      
      setLeaderboard(entries);
    } catch (err: any) {
      console.error('Failed to load leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentUserEntry = leaderboard.find(entry => entry.username === username);
  const topTen = leaderboard.slice(0, 10);
  const showUserSeparately = currentUserEntry && currentUserEntry.rank > 10;

  const getAvatar = (picId: number) => {
    const avatar = avatarOptions.find(a => a.id === picId) || avatarOptions[0];
    return avatar;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
    if (rank === 2) return <Medal className="text-gray-300" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-white">{rank}</span>;
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, isCurrentUser: boolean = false) => {
    const avatar = getAvatar(entry.profilePic);
    
    return (
      <div
        key={`${entry.rank}-${entry.username}`}
        className={`grid grid-cols-5 gap-4 items-center p-3 rounded-xl transition-all ${
          isCurrentUser
            ? 'bg-gradient-to-r from-[rgba(27,23,154,0.5)] to-[rgba(91,91,202,0.5)] ring-2 ring-white'
            : entry.rank <= 3
            ? 'bg-gradient-to-r from-[rgba(255,215,0,0.3)] to-[rgba(255,140,0,0.3)]'
            : 'bg-[rgba(91,91,202,0.3)] hover:bg-[rgba(91,91,202,0.5)]'
        }`}
      >
        <div className="flex items-center justify-center">
          {getRankIcon(entry.rank)}
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: avatar.color }}
          >
            {avatar.emoji}
          </div>
          <span className="font-['Sansita:Regular',sans-serif] text-white text-[14px] truncate">
            {entry.username}
            {isCurrentUser && <span className="ml-1 text-yellow-300">(You)</span>}
          </span>
        </div>
        <div className="flex items-center justify-center font-['Sansita:Regular',sans-serif] text-white text-[14px]">
          {entry.level}
        </div>
        <div className="flex items-center justify-center font-['Sansita:Regular',sans-serif] text-white text-[14px]">
          {entry.score.toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="size-full p-6 overflow-auto">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="bg-[rgba(91,91,202,0.6)] hover:bg-[rgba(91,91,202,0.8)] px-4 py-2 rounded-[20px] flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[16px]">Back</span>
          </button>
          
          <h1 className="font-['Luckiest_Guy:Regular',sans-serif] text-[36px] text-[#1b179a]">Leaderboard</h1>
          
          <div className="w-[100px]"></div>
        </div>

        <div className="bg-[rgba(255,255,255,0.1)] rounded-3xl p-5 backdrop-blur-sm flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-['Sansita:Regular',sans-serif] text-white text-xl">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-['Sansita:Regular',sans-serif] text-red-300 text-xl">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="font-['Luckiest_Guy:Regular',sans-serif] text-white text-2xl mb-2">No scores yet!</p>
                <p className="font-['Sansita:Regular',sans-serif] text-white/70">Be the first to complete a level</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 items-center mb-3 pb-2 border-b-2 border-white/30">
                <div className="flex items-center justify-center font-['Luckiest_Guy:Regular',sans-serif] text-white text-[14px]">Rank</div>
                <div className="col-span-2 font-['Luckiest_Guy:Regular',sans-serif] text-white text-[14px]">Player</div>
                <div className="flex items-center justify-center font-['Luckiest_Guy:Regular',sans-serif] text-white text-[14px]">Level</div>
                <div className="flex items-center justify-center font-['Luckiest_Guy:Regular',sans-serif] text-white text-[14px]">Score</div>
              </div>

              {/* Top 10 Leaderboard Entries */}
              <div className="space-y-2 mb-4">
                {topTen.map(entry => renderLeaderboardEntry(
                  entry, 
                  entry.username === username
                ))}
              </div>

              {/* Current User Entry (if ranked below 10) */}
              {showUserSeparately && currentUserEntry && (
                <>
                  <div className="my-4 border-t-2 border-dashed border-white/30 pt-4">
                    <p className="text-center font-['Sansita:Regular',sans-serif] text-white text-[12px] mb-2 opacity-70">
                      Your Position
                    </p>
                  </div>
                  <div className="space-y-2">
                    {renderLeaderboardEntry(currentUserEntry, true)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}