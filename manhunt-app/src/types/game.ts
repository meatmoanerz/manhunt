export type TeamRole = 'hunted' | 'hunter' | 'spectator';
export type ClueType = 'pin' | 'photo' | 'video';
export type GameStatus = 'lobby' | 'configuring' | 'headstart' | 'active' | 'captured' | 'completed' | 'sos';

export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  team: TeamRole | null;
  isHost: boolean;
  isConnected: boolean;
}

export interface ClueScheduleItem {
  type: ClueType;
  triggerAtMinutes: number;
}

export interface GameConfig {
  headStartMinutes: number;
  clueIntervalMinutes: number;
  clueSequence: ClueType[];
  geofenceWaitMinutes: number;
  penaltyOnFenceBreach: boolean;
  maxGameTimeMinutes: number | null;
}

export interface Clue {
  id: string;
  type: ClueType;
  timestamp: number;
  latitude?: number;
  longitude?: number;
  mediaUrl?: string;
  penaltySeconds: number;
  scheduledIndex: number;
}

export interface GameSession {
  id: string;
  code: string;
  status: GameStatus;
  hostId: string;
  config: GameConfig;
  players: Player[];
  clues: Clue[];
  startedAt: number | null;
  headStartEndsAt: number | null;
  endedAt: number | null;
}

export const DEFAULT_CONFIG: GameConfig = {
  headStartMinutes: 10,
  clueIntervalMinutes: 30,
  clueSequence: ['pin', 'photo', 'pin', 'video'],
  geofenceWaitMinutes: 5,
  penaltyOnFenceBreach: false,
  maxGameTimeMinutes: null,
};

export const AVATAR_COLORS = [
  '#FFE040', '#FF2D2D', '#00E676', '#1A6BFF', '#FF6B00',
  '#E040FF', '#40FFE0', '#FF4080',
];
