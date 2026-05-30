export interface Player {
  id: string;
  name: string;
  team: 'A' | 'B';
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface Room {
  id: string;
  createdAt: number;
  status: 'lobby' | 'playing' | 'ended';
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  timerDuration: number;
  timerEndTimestamp: number | null;
  pausedRemaining: number | null;
  timerActive: boolean;
  timerRemaining: number; // calculated from server
  scores: {
    A: number;
    B: number;
  };
  buzzedBy: {
    playerId: string;
    playerName: string;
    team: 'A' | 'B';
    timestamp: number;
  } | null;
  answersSubmitted: {
    [playerId: string]: {
      optionIndex: number;
      isCorrect: boolean;
      timestamp: number;
    }
  };
  teamAName: string;
  teamBName: string;
  isLocalMode?: boolean;
}
