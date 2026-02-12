import { X } from 'lucide-react';
import { soundManager } from '../utils/sounds';

interface HowToPlayModalProps {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1b179a] via-[#674ce0] to-[#9b7fd4] bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#eccaff] to-[#9b7fd4] p-6 rounded-3xl shadow-2xl max-w-xl w-full relative max-h-[90vh] overflow-auto">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-[rgba(91,91,202,0.6)] hover:bg-[rgba(91,91,202,0.8)] p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="font-['Luckiest_Guy:Regular',sans-serif] text-[32px] text-[#1b179a] mb-4 text-center pr-8">
          How to Play
        </h2>

        <div className="space-y-4 font-['Sansita:Regular',sans-serif] text-[16px]">
          <div className="bg-[rgba(255,255,255,0.2)] p-4 rounded-2xl">
            <h3 className="font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-[#1b179a] mb-2">
              🎯 Objective
            </h3>
            <p>
              Match British English words with their American English equivalents by flipping cards. 
              Find all pairs to win the level!
            </p>
          </div>

          <div className="bg-[rgba(255,255,255,0.2)] p-4 rounded-2xl">
            <h3 className="font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-[#1b179a] mb-2">
              🎮 How to Play
            </h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Click on a card to flip it and reveal the word</li>
              <li>Click on another card to find its matching pair</li>
              <li>🇬🇧 Pink cards are British English words</li>
              <li>🇺🇸 Blue cards are American English words</li>
              <li>If the cards match, they stay flipped</li>
              <li>If they don't match, they flip back over</li>
              <li>Match all pairs with the fewest moves possible!</li>
            </ul>
          </div>

          <div className="bg-[rgba(255,255,255,0.2)] p-4 rounded-2xl">
            <h3 className="font-['Luckiest_Guy:Regular',sans-serif] text-[18px] text-[#1b179a] mb-2">
              💡 Example
            </h3>
            <p>
              "Lift" (British) matches with "Elevator" (American)<br/>
              "Lorry" (British) matches with "Truck" (American)
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="mt-6 w-full bg-[rgba(91,91,202,0.8)] hover:bg-[rgba(91,91,202,1)] px-5 py-3 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[18px] transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}