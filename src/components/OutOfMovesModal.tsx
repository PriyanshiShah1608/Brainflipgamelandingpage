import { Star, RotateCcw, Grid3x3 } from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { useEffect } from 'react';

interface OutOfMovesModalProps {
  level: number;
  moves: number;
  time: number;
  onRetry: () => void;
  onLevelsPage: () => void;
}

export default function OutOfMovesModal({
  level,
  moves,
  time,
  onRetry,
  onLevelsPage,
}: OutOfMovesModalProps) {
  // Play sad sound only once
  useEffect(() => {
    soundManager.playSadVictory();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div className="fixed inset-0 bg-gradient-to-br from-[#1b179a] via-[#674ce0] to-[#9b7fd4] bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div 
          className="bg-gradient-to-b from-[#eccaff] to-[#9b7fd4] p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center"
          style={{ animation: 'fadeInScale 0.4s ease-out' }}
        >
          {/* Sad emoji */}
          <div className="text-6xl mb-4" style={{ animation: 'shake 0.5s ease-in-out' }}>
            😞
          </div>

          <h2 className="font-['Luckiest_Guy:Regular',sans-serif] text-[42px] text-[#af2626] mb-2">
            Ohh, you're out of moves!
          </h2>
          
          <p className="font-['Sansita:Regular',sans-serif] text-[20px] text-white mb-6">
            Level {level}
          </p>

          {/* 1 Star */}
          <div className="flex gap-2 justify-center mb-6">
            {[1, 2, 3].map((index) => (
              <Star
                key={index}
                size={48}
                className={
                  index === 1
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-400 text-gray-400'
                }
              />
            ))}
          </div>

          {/* Stats */}
          <div className="bg-[rgba(255,255,255,0.2)] rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-['Sansita:Regular',sans-serif] text-[14px] text-white opacity-80">
                  Moves Used
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
            <p className="font-['Sansita:Regular',sans-serif] text-[16px] text-white opacity-90 mb-2">
              Try again and complete it with fewer moves!
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-[#ff6b9d] to-[#c94277] hover:from-[#ff7bad] hover:to-[#d95287] px-6 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Retry
              </button>
              
              <button
                onClick={handleLevelsPage}
                className="bg-[rgba(91,91,202,0.8)] hover:bg-[rgba(91,91,202,1)] px-6 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <Grid3x3 size={20} />
                Levels
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}