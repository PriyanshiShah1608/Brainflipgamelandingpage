import { Star, RotateCcw, Play, Grid3x3 } from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { useEffect, useRef } from 'react';
import * as api from '../utils/api';

interface LevelCompleteModalProps {
  level: number;
  moves: number;
  time: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onLevelsPage: () => void;
  isLastLevel: boolean;
  onLevelComplete: (level: number, stars: number) => void;
}

export default function LevelCompleteModal({
  level,
  moves,
  time,
  onNextLevel,
  onRetry,
  onLevelsPage,
  isLastLevel,
  onLevelComplete,
}: LevelCompleteModalProps) {
  const hasCalledComplete = useRef(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate stars based on performance (moves and time)
  const calculateStars = (): number => {
    const pairsCount = Math.min(4 + level, 12);
    const perfectMoves = pairsCount; // Best case: match every pair on first try
    const goodMoves = pairsCount * 1.5;
    const okMoves = pairsCount * 2;

    // Time thresholds (in seconds)
    const perfectTime = 30;
    const goodTime = 60;
    const okTime = 120;

    let stars = 0;

    // Move-based stars
    if (moves <= perfectMoves) {
      stars += 1.5;
    } else if (moves <= goodMoves) {
      stars += 1;
    } else if (moves <= okMoves) {
      stars += 0.5;
    }

    // Time-based stars
    if (time <= perfectTime) {
      stars += 1.5;
    } else if (time <= goodTime) {
      stars += 1;
    } else if (time <= okTime) {
      stars += 0.5;
    }

    // Round to nearest whole number and ensure at least 1 star
    return Math.max(1, Math.min(3, Math.round(stars)));
  };

  const stars = calculateStars();

  // Call onLevelComplete only once when modal appears
  useEffect(() => {
    if (!hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onLevelComplete(level, stars);
      
      // Save score to leaderboard (no auth required)
      const username = localStorage.getItem('username') || 'Player';
      const profilePic = parseInt(localStorage.getItem('profilePic') || '1');
      
      api.saveScore(username, profilePic, level, stars, moves, time)
        .catch(error => console.error('Failed to save score to leaderboard:', error));
      
      // Play appropriate sound based on stars
      if (stars === 1) {
        soundManager.playSadVictory();
      } else {
        soundManager.playHappyVictory();
      }
    }
  }, []); // Empty dependency array - only run once on mount

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center mb-6">
        {[1, 2, 3].map((index) => (
          <Star
            key={index}
            size={48}
            className={`${
              index <= stars
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-400 text-gray-400'
            } drop-shadow-lg transition-all duration-300`}
            style={{
              animation: index <= stars ? `starPop 0.5s ease-out ${index * 0.15}s both` : 'none',
            }}
          />
        ))}
      </div>
    );
  };

  const handleNextLevel = () => {
    soundManager.playClick();
    onNextLevel();
  };

  const handleRetry = () => {
    soundManager.playClick();
    onRetry();
  };

  const handleLevelsPage = () => {
    soundManager.playClick();
    onLevelsPage();
  };

  return (
    <>
      <style>{`
        @keyframes starPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
      `}</style>
      <div className="fixed inset-0 bg-gradient-to-br from-[#1b179a] via-[#674ce0] to-[#9b7fd4] bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-[#eccaff] to-[#9b7fd4] p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center">
          <h2 className="font-['Luckiest_Guy:Regular',sans-serif] text-[48px] text-[#1b179a] mb-2">
            Level Complete!
          </h2>
          
          <p className="font-['Sansita:Regular',sans-serif] text-[24px] text-white mb-6">
            Level {level}
          </p>

          {/* Stars */}
          {renderStars()}

          {/* Stats */}
          <div className="bg-[rgba(255,255,255,0.2)] rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-['Sansita:Regular',sans-serif] text-[14px] text-white opacity-80">
                  Moves
                </p>
                <p className="font-['Luckiest_Guy:Regular',sans-serif] text-[24px] text-white">
                  {moves}
                </p>
              </div>
              <div>
                <p className="font-['Sansita:Regular',sans-serif] text-[14px] text-white opacity-80">
                  Time
                </p>
                <p className="font-['Luckiest_Guy:Regular',sans-serif] text-[24px] text-white">
                  {formatTime(time)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {stars === 1 ? (
              // Only show retry button for 1 star (poor performance)
              <>
                <p className="font-['Sansita:Regular',sans-serif] text-[16px] text-white opacity-90 mb-2">
                  Try again for a better score!
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-[#ff6b9d] to-[#c94277] hover:from-[#ff7bad] hover:to-[#d95287] px-6 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Retry Level
                </button>
              </>
            ) : (
              // Show all navigation options for 2-3 stars (good performance)
              <>
                {!isLastLevel && (
                  <button
                    onClick={handleNextLevel}
                    className="bg-gradient-to-r from-[#1b179a] to-[#5b5bca] hover:from-[#2a2aaa] hover:to-[#6b6bda] px-6 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Next Level
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRetry}
                    className="bg-[rgba(91,91,202,0.8)] hover:bg-[rgba(91,91,202,1)] px-5 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[16px] text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Retry
                  </button>
                  
                  <button
                    onClick={handleLevelsPage}
                    className="bg-[rgba(91,91,202,0.8)] hover:bg-[rgba(91,91,202,1)] px-5 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[16px] text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Grid3x3 size={18} />
                    Levels
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}