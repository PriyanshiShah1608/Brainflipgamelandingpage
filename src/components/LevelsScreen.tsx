import { ArrowLeft, Star, Lock, Check } from 'lucide-react';
import { soundManager } from '../utils/sounds';

interface LevelsScreenProps {
  onSelectLevel: (level: number) => void;
  onBack: () => void;
  completedLevels: Record<number, { completed: boolean; stars: number }>;
  unlockedLevel: number;
}

export default function LevelsScreen({ onSelectLevel, onBack, completedLevels, unlockedLevel }: LevelsScreenProps) {
  const levels = Array.from({ length: 15 }, (_, i) => i + 1);

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
          
          <div className="text-center">
            <h1 className="font-['Luckiest_Guy:Regular',sans-serif] text-[36px] text-[#1b179a]">Levels</h1>
            <p className="font-['Sansita:Regular',sans-serif] text-[14px] text-white">
              {Object.keys(completedLevels).length} / {levels.length} Completed
            </p>
          </div>
          
          <div className="w-[100px]"></div>
        </div>

        <div className="grid grid-cols-5 gap-4 flex-1 content-start">
          {levels.map(level => {
            const isUnlocked = level <= unlockedLevel;
            const levelData = completedLevels[level];
            const isCompleted = levelData?.completed || false;
            const stars = levelData?.stars || 0;
            
            return (
              <button
                key={level}
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.playClick();
                    onSelectLevel(level);
                  }
                }}
                onMouseEnter={() => isUnlocked && soundManager.playHover()}
                disabled={!isUnlocked}
                className={`aspect-square rounded-2xl shadow-lg transition-all relative overflow-hidden ${
                  isCompleted
                    ? 'bg-gradient-to-br from-[#4ade80] to-[#22c55e] hover:scale-105 cursor-pointer'
                    : isUnlocked
                    ? 'bg-gradient-to-br from-[#ffd700] to-[#ff8c00] hover:scale-105 cursor-pointer'
                    : 'bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-1 right-1 bg-white rounded-full p-1">
                    <Check size={16} className="text-green-600" />
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center h-full p-3">
                  {isUnlocked ? (
                    <>
                      <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[28px] text-white mb-1">
                        {level}
                      </span>
                      {isCompleted ? (
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < stars ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-white/70 font-['Sansita:Regular',sans-serif]">
                          Play Now
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Lock size={24} className="text-white mb-1" />
                      <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-white">
                        {level}
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}