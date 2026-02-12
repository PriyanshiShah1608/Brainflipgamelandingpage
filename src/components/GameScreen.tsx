import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { vocabularyData } from '../data/vocabulary';
import { soundManager } from '../utils/sounds';
import LevelCompleteModal from './LevelCompleteModal';
import OutOfMovesModal from './OutOfMovesModal';
import { getMaxMovesForLevel } from '../utils/levelConfig';

interface Card {
  id: number;
  word: string;
  type: 'british' | 'american';
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameScreenProps {
  level: number;
  onBackToMenu: () => void;
  onNextLevel: () => void;
  onLevelsPage: () => void;
  onLevelComplete: (level: number, stars: number) => void;
}

export default function GameScreen({ level, onBackToMenu, onNextLevel, onLevelsPage, onLevelComplete }: GameScreenProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [outOfMoves, setOutOfMoves] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Progressive card pairs: starts at 4 pairs (8 cards) and goes up to 12 pairs (24 cards)
  const pairsCount = Math.min(3 + level, 12);
  const maxMoves = getMaxMovesForLevel(level);

  useEffect(() => {
    initializeGame();
  }, [level]);

  useEffect(() => {
    if (cards.length > 0 && !gameWon && !outOfMoves) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cards, gameWon, outOfMoves]);

  const initializeGame = () => {
    // Calculate the starting index for this level's vocabulary
    // Each level uses unique words, no repeats
    let startIndex = 0;
    for (let i = 1; i < level; i++) {
      const levelPairs = Math.min(3 + i, 12);
      startIndex += levelPairs;
    }
    
    // Get vocabulary for this specific level
    const levelVocab = vocabularyData.slice(startIndex, startIndex + pairsCount);
    const gameCards: Card[] = [];
    
    levelVocab.forEach((pair, index) => {
      gameCards.push({
        id: index * 2,
        word: pair.british,
        type: 'british',
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        word: pair.american,
        type: 'american',
        pairId: index,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setOutOfMoves(false);
    setTimeElapsed(0);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Play flip sound
    soundManager.playFlip();

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          soundManager.playMatch();
          const matchedCards = newCards.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(matches + 1);

          // Check if game is won
          if (matches + 1 === pairsCount) {
            setTimeout(() => {
              soundManager.playVictory();
              setGameWon(true);
            }, 300);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          soundManager.playNoMatch();
          const unflippedCards = newCards.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          );
          setCards(unflippedCards);
          setFlippedCards([]);
        }, 1000);
      }

      // Check if out of moves
      if (moves + 1 >= maxMoves) {
        setOutOfMoves(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate dynamic grid columns based on number of cards
  // 8 cards (4 pairs) = 4 columns
  // 10-12 cards (5-6 pairs) = 4 columns
  // 14-16 cards (7-8 pairs) = 4 columns
  // 18-20 cards (9-10 pairs) = 5 columns
  // 22-24 cards (11-12 pairs) = 6 columns
  const getGridColumns = () => {
    const totalCards = pairsCount * 2;
    if (totalCards <= 16) return 4;
    if (totalCards <= 20) return 5;
    return 6;
  };

  const gridColumns = getGridColumns();

  return (
    <div className="size-full p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <button
            onClick={onBackToMenu}
            className="bg-[rgba(91,91,202,0.6)] hover:bg-[rgba(91,91,202,0.8)] px-4 py-2 rounded-[20px] flex items-center gap-2 transition-colors"
            onMouseEnter={() => soundManager.playHover()}
          >
            <ArrowLeft size={20} />
            <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[16px]">Back</span>
          </button>
          
          <div className="flex gap-4">
            <div className="bg-[rgba(91,91,202,0.6)] px-4 py-2 rounded-[20px]">
              <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[16px]">Level: {level}</span>
            </div>
            <div className={`px-4 py-2 rounded-[20px] transition-colors ${
              maxMoves - moves <= 3 ? 'bg-[rgba(255,107,157,0.8)] animate-pulse' : 'bg-[rgba(91,91,202,0.6)]'
            }`}>
              <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[16px]">
                Moves: {moves}/{maxMoves}
              </span>
            </div>
            <div className="bg-[rgba(91,91,202,0.6)] px-4 py-2 rounded-[20px]">
              <span className="font-['Luckiest_Guy:Regular',sans-serif] text-[16px]">Time: {formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              maxWidth: gridColumns === 6 ? '100%' : gridColumns === 5 ? '90%' : '80%',
            }}
          >
            <div
              className="w-full"
              style={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                gap: 'clamp(0.5rem, 1vw, 1rem)',
                maxHeight: '100%',
                aspectRatio: 'auto'
              }}
            >
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    card.isMatched ? 'opacity-50 scale-95' : 'hover:scale-105'
                  }`}
                  style={{ 
                    perspective: '1000px',
                    aspectRatio: '3/4',
                    width: '100%',
                    maxHeight: gridColumns >= 5 ? 'min(18vh, 180px)' : 'min(22vh, 220px)'
                  }}
                >
                  <div
                    className={`absolute inset-0 transition-transform duration-500`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Card Back */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#5b5bca] to-[#3a3a8a] rounded-xl shadow-lg flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="text-4xl">🧠</div>
                    </div>

                    {/* Card Front */}
                    <div
                      className={`absolute inset-0 rounded-xl shadow-lg flex flex-col items-center justify-center p-3 ${
                        card.type === 'british' ? 'bg-gradient-to-br from-[#ff6b9d] to-[#c94277]' : 'bg-gradient-to-br from-[#4facfe] to-[#00f2fe]'
                      }`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="text-[10px] mb-1 opacity-90 font-['Sansita:Regular',sans-serif]">
                        {card.type === 'british' ? '🇬🇧 British' : '🇺🇸 American'}
                      </div>
                      <div className="font-['Luckiest_Guy:Regular',sans-serif] text-white text-center break-words max-w-full text-[clamp(11px,1vw,16px)] leading-tight">
                        {card.word}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Win Modal */}
        {gameWon && (
          <LevelCompleteModal
            level={level}
            moves={moves}
            time={timeElapsed}
            onNextLevel={onNextLevel}
            onRetry={() => {
              soundManager.playClick();
              initializeGame();
            }}
            onLevelsPage={onLevelsPage}
            isLastLevel={level >= 15}
            onLevelComplete={onLevelComplete}
          />
        )}

        {/* Out of Moves Modal */}
        {outOfMoves && (
          <OutOfMovesModal
            level={level}
            moves={moves}
            time={timeElapsed}
            onRetry={() => {
              soundManager.playClick();
              initializeGame();
            }}
            onLevelsPage={onLevelsPage}
          />
        )}
      </div>
    </div>
  );
}