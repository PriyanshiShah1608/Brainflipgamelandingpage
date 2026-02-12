import { X, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
  username: string;
  onUsernameChange: (username: string) => void;
  profilePic: number;
  onProfilePicChange: (pic: number) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const avatarOptions = [
  // Animals - Mammals
  { id: 1, emoji: '🐱', color: '#FFB6C1' },
  { id: 2, emoji: '🐶', color: '#98D8C8' },
  { id: 3, emoji: '🐼', color: '#F7DC6F' },
  { id: 4, emoji: '🐨', color: '#BB8FCE' },
  { id: 5, emoji: '🦊', color: '#F8B88B' },
  { id: 6, emoji: '🐰', color: '#AED6F1' },
  { id: 7, emoji: '🦄', color: '#F5B7B1' },
  { id: 8, emoji: '🐻', color: '#D7BDE2' },
  { id: 9, emoji: '🐻‍❄️', color: '#E0F7FA' },
  { id: 10, emoji: '🐼', color: '#F0F0F0' },
  { id: 11, emoji: '🦁', color: '#FAD7A0' },
  { id: 12, emoji: '🐯', color: '#EDBB99' },
  { id: 13, emoji: '🐮', color: '#D5F4E6' },
  { id: 14, emoji: '🐷', color: '#FADBD8' },
  { id: 15, emoji: '🐵', color: '#FFE4B5' },
  { id: 16, emoji: '🐭', color: '#E8E8E8' },
  { id: 17, emoji: '🐹', color: '#FFDAB9' },
  { id: 18, emoji: '🐺', color: '#D3D3D3' },
  { id: 19, emoji: '🦝', color: '#C9C9C9' },
  { id: 20, emoji: '🐴', color: '#DEB887' },
  // Animals - Birds
  { id: 21, emoji: '🐥', color: '#FCF3CF' },
  { id: 22, emoji: '🐦', color: '#D6EAF8' },
  { id: 23, emoji: '🦉', color: '#E8DAEF' },
  { id: 24, emoji: '🦆', color: '#AED6F1' },
  { id: 25, emoji: '🦅', color: '#F5CBA7' },
  { id: 26, emoji: '🦜', color: '#85C1E2' },
  { id: 27, emoji: '🦩', color: '#FFB6C1' },
  { id: 28, emoji: '🐧', color: '#D5F4E6' },
  { id: 29, emoji: '🕊️', color: '#F5F5F5' },
  { id: 30, emoji: '🦚', color: '#A2D9CE' },
  // Animals - Aquatic
  { id: 31, emoji: '🐸', color: '#A9DFBF' },
  { id: 32, emoji: '🐙', color: '#E8DAEF' },
  { id: 33, emoji: '🐬', color: '#AED6F1' },
  { id: 34, emoji: '🐠', color: '#85C1E2' },
  { id: 35, emoji: '🐟', color: '#A9CCE3' },
  { id: 36, emoji: '🐡', color: '#F9E79F' },
  { id: 37, emoji: '🦈', color: '#AAB7B8' },
  { id: 38, emoji: '🐳', color: '#AED6F1' },
  { id: 39, emoji: '🐋', color: '#85C1E2' },
  { id: 40, emoji: '🦭', color: '#D5DBDB' },
  // Animals - Insects & Others
  { id: 41, emoji: '🦋', color: '#EBDEF0' },
  { id: 42, emoji: '🐝', color: '#F9E79F' },
  { id: 43, emoji: '🐞', color: '#F5B7B1' },
  { id: 44, emoji: '🐛', color: '#ABEBC6' },
  { id: 45, emoji: '🦗', color: '#A9DFBF' },
  { id: 46, emoji: '🕷️', color: '#D5DBDB' },
  { id: 47, emoji: '🦂', color: '#F5CBA7' },
  { id: 48, emoji: '🐌', color: '#F0B27A' },
  { id: 49, emoji: '🐢', color: '#82E0AA' },
  { id: 50, emoji: '🦎', color: '#7DCEA0' },
  // Food & Drinks
  { id: 51, emoji: '🍕', color: '#FADBD8' },
  { id: 52, emoji: '🍔', color: '#F5CBA7' },
  { id: 53, emoji: '🍦', color: '#D5F4E6' },
  { id: 54, emoji: '🍩', color: '#FFB6C1' },
  { id: 55, emoji: '🍪', color: '#F5CBA7' },
  { id: 56, emoji: '🎂', color: '#FADBD8' },
  { id: 57, emoji: '🍰', color: '#FFF0F5' },
  { id: 58, emoji: '🧁', color: '#F8BBD0' },
  { id: 59, emoji: '🍓', color: '#F5B7B1' },
  { id: 60, emoji: '🍒', color: '#EC7063' },
  { id: 61, emoji: '🍑', color: '#FADBD8' },
  { id: 62, emoji: '🍊', color: '#F5CBA7' },
  { id: 63, emoji: '🍋', color: '#FCF3CF' },
  { id: 64, emoji: '🍌', color: '#F9E79F' },
  { id: 65, emoji: '🍉', color: '#ABEBC6' },
  { id: 66, emoji: '🍇', color: '#D7BDE2' },
  { id: 67, emoji: '🥤', color: '#FADBD8' },
  { id: 68, emoji: '☕', color: '#D7BDE2' },
  { id: 69, emoji: '🍵', color: '#ABEBC6' },
  { id: 70, emoji: '🧃', color: '#F9E79F' },
  // Nature & Plants
  { id: 71, emoji: '🌸', color: '#F8BBD0' },
  { id: 72, emoji: '🌺', color: '#F5B7B1' },
  { id: 73, emoji: '🌻', color: '#F9E79F' },
  { id: 74, emoji: '🌹', color: '#EC7063' },
  { id: 75, emoji: '🌷', color: '#FADBD8' },
  { id: 76, emoji: '🌼', color: '#FCF3CF' },
  { id: 77, emoji: '🌿', color: '#ABEBC6' },
  { id: 78, emoji: '🍀', color: '#82E0AA' },
  { id: 79, emoji: '🌵', color: '#A9DFBF' },
  { id: 80, emoji: '🌴', color: '#7DCEA0' },
  // Weather & Sky
  { id: 81, emoji: '⭐', color: '#F9E79F' },
  { id: 82, emoji: '🌟', color: '#FCF3CF' },
  { id: 83, emoji: '✨', color: '#EBDEF0' },
  { id: 84, emoji: '🌙', color: '#D6EAF8' },
  { id: 85, emoji: '☀️', color: '#F9E79F' },
  { id: 86, emoji: '🌈', color: '#EBDEF0' },
  { id: 87, emoji: '☁️', color: '#ECF0F1' },
  { id: 88, emoji: '⛅', color: '#D6EAF8' },
  { id: 89, emoji: '🌤️', color: '#AED6F1' },
  { id: 90, emoji: '❄️', color: '#E0F7FA' },
  // Objects & Symbols
  { id: 91, emoji: '🎈', color: '#F5B7B1' },
  { id: 92, emoji: '🎀', color: '#F8BBD0' },
  { id: 93, emoji: '🎁', color: '#FADBD8' },
  { id: 94, emoji: '🎨', color: '#D7BDE2' },
  { id: 95, emoji: '🎭', color: '#EBDEF0' },
  { id: 96, emoji: '🎪', color: '#F5CBA7' },
  { id: 97, emoji: '🎯', color: '#F5B7B1' },
  { id: 98, emoji: '🎮', color: '#D6EAF8' },
  { id: 99, emoji: '🎵', color: '#D7BDE2' },
  { id: 100, emoji: '💝', color: '#FFB6C1' },
];

export default function SettingsModal({
  onClose,
  username,
  onUsernameChange,
  profilePic,
  onProfilePicChange,
  soundEnabled,
  onSoundToggle,
  volume,
  onVolumeChange,
}: SettingsModalProps) {
  const [tempUsername, setTempUsername] = useState(username);

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const handleSave = () => {
    onUsernameChange(tempUsername);
    soundManager.playClick();
    onClose();
  };

  const handleVolumeChange = (newVolume: number) => {
    onVolumeChange(newVolume);
    soundManager.playClick();
  };

  const handleSoundToggle = () => {
    onSoundToggle();
    soundManager.playClick();
  };

  const handleProfilePicChange = (picId: number) => {
    onProfilePicChange(picId);
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1b179a] via-[#674ce0] to-[#9b7fd4] bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#eccaff] to-[#9b7fd4] p-6 rounded-3xl shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-auto">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-[rgba(91,91,202,0.6)] hover:bg-[rgba(91,91,202,0.8)] p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="font-['Luckiest_Guy:Regular',sans-serif] text-[32px] text-[#1b179a] mb-6 text-center pr-8">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Sound Section */}
          <div className="bg-[rgba(255,255,255,0.2)] p-4 rounded-2xl">
            <h3 className="font-['Luckiest_Guy:Regular',sans-serif] text-[20px] text-[#1b179a] mb-3">
              Audio
            </h3>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span className="font-['Sansita:Regular',sans-serif] text-[16px]">
                  Sound Effects
                </span>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  soundEnabled ? 'bg-[#1b179a]' : 'bg-gray-400'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Sansita:Regular',sans-serif] text-[16px]">
                  Volume
                </span>
                <span className="font-['Sansita:Regular',sans-serif] text-[14px] text-[#1b179a]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                disabled={!soundEnabled}
                className="w-full h-2 bg-white bg-opacity-50 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: soundEnabled
                    ? `linear-gradient(to right, #1b179a 0%, #1b179a ${volume * 100}%, rgba(255,255,255,0.5) ${volume * 100}%, rgba(255,255,255,0.5) 100%)`
                    : 'rgba(255,255,255,0.5)',
                }}
              />
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-[rgba(255,255,255,0.2)] p-4 rounded-2xl">
            <h3 className="font-['Luckiest_Guy:Regular',sans-serif] text-[20px] text-[#1b179a] mb-3">
              Profile
            </h3>
            
            {/* Username */}
            <div className="mb-4">
              <label className="font-['Sansita:Regular',sans-serif] text-[16px] block mb-2">
                Username
              </label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-50 font-['Sansita:Regular',sans-serif] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#1b179a]"
                placeholder="Enter your username"
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label className="font-['Sansita:Regular',sans-serif] text-[16px] block mb-3">
                Choose Profile Picture
              </label>
              <div className="grid grid-cols-10 gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleProfilePicChange(avatar.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-110 ${
                      profilePic === avatar.id
                        ? 'ring-4 ring-[#1b179a] scale-110'
                        : 'hover:ring-2 hover:ring-white'
                    }`}
                    style={{ backgroundColor: avatar.color }}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={handleClose}
            className="bg-[rgba(91,91,202,0.6)] hover:bg-[rgba(91,91,202,0.8)] px-5 py-2 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[14px] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[rgba(91,91,202,0.8)] hover:bg-[rgba(91,91,202,1)] px-5 py-2 rounded-[20px] font-['Luckiest_Guy:Regular',sans-serif] text-[14px] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}