import imgScreenshot20250913115751RemovebgPreview1 from "figma:asset/abe594080355fdaec03445dce2e328a252a16017.png";
import imgScreenshot20250907221439RemovebgPreview1 from "figma:asset/631424197bca0a891639344db4301a6714a59bba.png";
import imgBook1 from "figma:asset/7e6d502b2baf611b276e3d3450836d61a7ffebf9.png";
import imgStar1 from "figma:asset/1374530e4b9bd61ddb1f4c2b7931ee05e8e62d29.png";
import imgTrophy1 from "figma:asset/f83b30e009d25aa4ac62593899e72078f1cf0c89.png";
import imgGear1 from "figma:asset/24240376b4ff4a80dbd0e7c302dcaf473b6f5e0a.png";
import imgScreenshot20250913114703RemovebgPreview1 from "figma:asset/8bd5ba1a7c4baec4ca1a53abfb6d52139c92f04c.png";
import imgImage1 from "figma:asset/996eb83ba160df3eaba2d06356f76a9154b6006a.png";
import imgImage2 from "figma:asset/a9dfdbb21ef5fad53b93bc7efd5590bf5715a7e8.png";
import { soundManager } from '../utils/sounds';

interface LandingPageProps {
  onStartGame: () => void;
  onShowLevels: () => void;
  onShowLeaderboard: () => void;
  onShowHowToPlay: () => void;
  onShowSettings: () => void;
}

export default function LandingPage({ onStartGame, onShowLevels, onShowLeaderboard, onShowHowToPlay, onShowSettings }: LandingPageProps) {
  const handleStartGame = () => {
    soundManager.playNavigate();
    onStartGame();
  };

  const handleShowLevels = () => {
    soundManager.playNavigate();
    onShowLevels();
  };

  const handleShowLeaderboard = () => {
    soundManager.playNavigate();
    onShowLeaderboard();
  };

  const handleShowHowToPlay = () => {
    soundManager.playNavigate();
    onShowHowToPlay();
  };

  const handleShowSettings = () => {
    soundManager.playClick();
    onShowSettings();
  };

  return (
    <div className="relative size-full overflow-hidden">
      {/* Navigation Buttons */}
      <button
        onClick={handleShowHowToPlay}
        onMouseEnter={() => soundManager.playHover()}
        className="absolute bg-[rgba(91,91,202,0.44)] h-[7.2%] left-[6.6%] rounded-[20px] top-[4.2%] w-[15.5%] cursor-pointer hover:bg-[rgba(91,91,202,0.6)] transition-colors"
      />
      <button
        onClick={handleShowLevels}
        onMouseEnter={() => soundManager.playHover()}
        className="absolute bg-[rgba(91,91,202,0.44)] h-[7.2%] left-[24.1%] rounded-[20px] top-[4.2%] w-[12.5%] cursor-pointer hover:bg-[rgba(91,91,202,0.6)] transition-colors"
      />
      <button
        onClick={handleShowLeaderboard}
        onMouseEnter={() => soundManager.playHover()}
        className="absolute bg-[rgba(91,91,202,0.44)] h-[7.2%] left-[38.8%] rounded-[20px] top-[4.2%] w-[15.5%] cursor-pointer hover:bg-[rgba(91,91,202,0.6)] transition-colors"
      />

      {/* Navigation Icons - All aligned at same vertical position */}
      <div className="absolute left-[7.4%] w-[2.6%] aspect-square top-[5.7%] pointer-events-none">
        <img alt="" className="w-full h-full object-contain" src={imgBook1} />
      </div>
      <div className="absolute left-[25%] w-[2%] aspect-square top-[5.7%] pointer-events-none">
        <img alt="" className="w-full h-full object-contain" src={imgStar1} />
      </div>
      <div className="absolute left-[39.7%] w-[2%] aspect-square top-[5.7%] pointer-events-none">
        <img alt="" className="w-full h-full object-contain" src={imgTrophy1} />
      </div>

      {/* Navigation Labels - All aligned at same vertical position */}
      <p className="absolute font-['Luckiest_Guy:Regular',sans-serif] leading-[normal] left-[10.9%] not-italic text-[clamp(14px,1.67vw,24px)] text-black text-nowrap top-[6.5%] whitespace-pre pointer-events-none">How to play</p>
      <p className="absolute font-['Luckiest_Guy:Regular',sans-serif] leading-[normal] left-[28.2%] not-italic text-[clamp(14px,1.67vw,24px)] text-black text-nowrap top-[6.5%] whitespace-pre pointer-events-none">Levels</p>
      <p className="absolute font-['Luckiest_Guy:Regular',sans-serif] leading-[normal] left-[42.6%] not-italic text-[clamp(14px,1.67vw,24px)] text-black text-nowrap top-[6.5%] whitespace-pre pointer-events-none">leaderboard</p>

      {/* Settings Icon */}
      <button
        onClick={handleShowSettings}
        onMouseEnter={() => soundManager.playHover()}
        className="absolute left-[1.2%] w-[3.5%] aspect-square top-[5.1%] cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        aria-label="Settings"
      >
        <img alt="Settings" className="w-full h-full object-contain" src={imgGear1} />
      </button>

      {/* Flag Images - Equal spacing with VS text */}
      <div className="absolute h-[13.8%] left-[31%] rounded-[20px] top-[23.8%] w-[14.6%]">
        <img alt="UK Flag" className="w-full h-full object-cover rounded-[20px]" src={imgImage1} />
      </div>
      <div className="absolute h-[13.8%] left-[54.4%] rounded-[20px] top-[23.8%] w-[14.6%]">
        <img alt="US Flag" className="w-full h-full object-cover rounded-[20px]" src={imgImage2} />
      </div>

      {/* VS Text */}
      <p className="absolute font-['Luckiest_Guy:Regular',sans-serif] leading-[normal] left-[50%] -translate-x-1/2 not-italic text-[#1b179a] text-[clamp(20px,2.22vw,32px)] text-nowrap top-[28.5%] whitespace-pre pointer-events-none drop-shadow-md">VS</p>

      {/* Title Section - BrainFlip */}
      <div className="absolute left-[25.8%] top-[45.2%] w-[53.5%]">
        <img 
          alt="BrainFlip" 
          className="w-full drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]" 
          src={imgScreenshot20250913115751RemovebgPreview1} 
        />
      </div>
      
      {/* Tagline */}
      <p className="absolute font-['Sansita:Regular',sans-serif] leading-[normal] left-[35.9%] not-italic text-[#af2626] text-[clamp(18px,2.22vw,32px)] text-nowrap top-[62.2%] whitespace-pre drop-shadow-md">A puzzle adventure for curious minds</p>

      {/* Play Button */}
      <button
        onClick={handleShowLevels}
        className="absolute left-[47.7%] top-[69.3%] w-[9.4%] aspect-square cursor-pointer hover:scale-110 active:scale-95 transition-transform drop-shadow-[0px_4px_4px_#000000]"
        aria-label="Start Game"
      >
        <img 
          alt="Play Button" 
          className="w-full h-full object-contain" 
          src={imgScreenshot20250907221439RemovebgPreview1} 
        />
      </button>

      {/* Decorative Image - Bottom Left (fully visible) */}
      <div className="absolute h-[32.4%] left-[-1.3%] bottom-0 w-[38.3%]">
        <img alt="" className="w-full h-full object-contain" src={imgScreenshot20250913114703RemovebgPreview1} />
      </div>
    </div>
  );
}