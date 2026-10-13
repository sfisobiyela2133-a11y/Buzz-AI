export type RiskLevel = 'low' | 'medium' | 'high';

export type LeagueId = 
  | 'psl' 
  | 'epl' 
  | 'laliga' 
  | 'ucl' 
  | 'seriea' 
  | 'bundesliga';

export interface League {
  id: LeagueId;
  name: string;
  country: string;
  flag: string;
  logoColor: string;
}

export interface BookmakerOdds {
  bookmaker: 'Betway' | 'Hollywoodbets' | 'Bet365' | '1xBet';
  homeWin: number;
  draw: number;
  awayWin: number;
  updatedAt: string;
}

export interface TeamStats {
  id: string;
  name: string;
  shortName: string;
  leagueId: LeagueId;
  logo: string;
  position: number;
  matchesPlayed: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  form: ('W' | 'D' | 'L')[];
  avgPossession: number;
  avgExpectedGoals: number; // xG
  avgExpectedGoalsConceded: number; // xGA
  homeWinRate: number;
  awayWinRate: number;
  attackRating: number; // 0-100
  defenseRating: number; // 0-100
}

export interface PredictionInsight {
  market: string;
  pick: string;
  confidence: number; // 0-100%
  riskLevel: RiskLevel;
  recommendedOdds: number;
  modelExpectedValue: number; // +EV %
  kellyStakeUnits: number; // Recommended bankroll units 1-5
  rationale: string[];
  keyFactors: {
    tacticalAdvantage: string;
    injuryImpact: string;
    weatherOrPitch: string;
    refereeTendency?: string;
  };
}

export interface Match {
  id: string;
  leagueId: LeagueId;
  leagueName: string;
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  kickoffTime: string; // ISO string
  venue: string;
  city: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  odds: BookmakerOdds[];
  prediction: PredictionInsight;
  headToHead: {
    totalPlayed: number;
    homeWins: number;
    draws: number;
    awayWins: number;
    lastMeetings: {
      date: string;
      homeScore: number;
      awayScore: number;
      winner: 'home' | 'away' | 'draw';
    }[];
  };
  isVipOnly?: boolean;
  actualOutcomeWon?: boolean;
}

export interface UserMatchFeedback {
  id: string;
  matchId: string;
  matchTitle: string;
  predictionPick: string;
  riskLevel: RiskLevel;
  actualResult: string;
  predictionSuccess: boolean;
  userRating: 'accurate' | 'partial' | 'inaccurate'; // 1-tap rating
  numericScore: number; // 1 to 5
  comment?: string;
  feedbackTags: string[]; // e.g. "Value identified", "Odds changed", "xG accurate"
  createdAt: string;
  appliedToModel: boolean;
}

export interface ModelParameters {
  version: string;
  lastRetrainedAt: string;
  homeAdvantageFactor: number; // default 1.15
  pslDefensiveDampener: number; // default 0.88 for PSL low-scoring tendency
  formMomentumWeight: number; // 0.1 - 0.5
  xgWeight: number; // 0.3 - 0.7
  riskToleranceOffset: number; // -0.05 to +0.05
  feedbackCount: number;
  overallAccuracyRate: number; // %
}

export interface HistoricalTrialMatch {
  id: string;
  date: string;
  leagueId: LeagueId;
  match: string;
  pick: string;
  riskLevel: RiskLevel;
  odds: number;
  resultScore: string;
  outcome: 'won' | 'lost';
  confidence: number;
  profitUnits: number; // e.g. +0.85 or -1.0
  userFeedback?: UserMatchFeedback;
}

export interface BacktestSummary {
  totalMatches: number;
  wonMatches: number;
  lostMatches: number;
  winRate: number;
  totalStaked: number;
  totalReturn: number;
  netProfit: number;
  roiPercentage: number;
  maxDrawdown: number;
  longestWinStreak: number;
  profitHistory: { matchIndex: number; cumulativeProfit: number; date: string }[];
}

export type SubscriptionTier = 'free' | 'pro' | 'vip';

export interface PlanDetails {
  id: SubscriptionTier;
  name: string;
  badge: string;
  priceUSD: number;
  priceZAR: number;
  period: string;
  description: string;
  features: string[];
  riskAccess: ('low' | 'medium' | 'high')[];
  includedLeagues: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  category: 'high_value_bet' | 'lineup' | 'odds_shift' | 'outcome_won' | 'psl_special' | 'feedback_request';
  matchId?: string;
  riskLevel?: RiskLevel;
  isRead: boolean;
}
