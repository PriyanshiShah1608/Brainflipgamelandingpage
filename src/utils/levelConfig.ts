// Get the maximum number of moves allowed for each level
export const getMaxMovesForLevel = (level: number): number => {
  // Progressive card pairs: starts at 4 pairs (8 cards) and goes up to 12 pairs (24 cards)
  const pairsCount = Math.min(3 + level, 12);
  
  // Give players 4x the number of pairs as moves
  // This provides a good balance - challenging but achievable
  const baseMultiplier = 4;
  
  return Math.floor(pairsCount * baseMultiplier);
};

// Get move limits breakdown:
// Level 1: 4 pairs (8 cards) = 16 moves
// Level 2: 5 pairs (10 cards) = 20 moves
// Level 3: 6 pairs (12 cards) = 24 moves
// Level 4: 7 pairs (14 cards) = 28 moves
// Level 5: 8 pairs (16 cards) = 32 moves
// Level 6: 9 pairs (18 cards) = 36 moves
// Level 7: 10 pairs (20 cards) = 40 moves
// Level 8: 11 pairs (22 cards) = 44 moves
// Level 9+: 12 pairs (24 cards) = 48 moves