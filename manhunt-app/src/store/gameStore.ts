import { create } from 'zustand';
import {
  type GameSession,
  type GameConfig,
  type Player,
  type TeamRole,
  type ClueType,
  type Clue,
  DEFAULT_CONFIG,
  AVATAR_COLORS,
} from '../types/game';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function generateSessionCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function pickRandomColor(usedColors: string[]): string {
  const available = AVATAR_COLORS.filter((c) => !usedColors.includes(c));
  const pool = available.length > 0 ? available : AVATAR_COLORS;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface GameStore {
  session: GameSession | null;
  currentPlayerId: string | null;

  createSession: (hostName: string) => void;
  joinSession: (code: string, playerName: string) => void;
  assignTeam: (playerId: string, team: TeamRole) => void;
  autoAssignTeams: () => void;
  updateConfig: (config: Partial<GameConfig>) => void;
  addClueToSequence: (type: ClueType) => void;
  removeClueFromSequence: (index: number) => void;
  startGame: () => void;
  startHunt: () => void;
  sendClue: (clue: Omit<Clue, 'id'>) => void;
  captureRequest: () => void;
  confirmCapture: () => void;
  denyCapture: () => void;
  triggerSOS: () => void;
  resetSession: () => void;
  getCurrentPlayer: () => Player | null;
  addMockPlayers: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  session: null,
  currentPlayerId: null,

  createSession: (hostName: string) => {
    const hostId = generateId();
    const host: Player = {
      id: hostId,
      name: hostName,
      avatarColor: AVATAR_COLORS[0],
      team: null,
      isHost: true,
      isConnected: true,
    };

    const session: GameSession = {
      id: generateId(),
      code: generateSessionCode(),
      status: 'lobby',
      hostId,
      config: { ...DEFAULT_CONFIG, clueSequence: [...DEFAULT_CONFIG.clueSequence] },
      players: [host],
      clues: [],
      startedAt: null,
      headStartEndsAt: null,
      endedAt: null,
    };

    set({ session, currentPlayerId: hostId });
  },

  joinSession: (_code: string, playerName: string) => {
    const { session } = get();
    if (!session) return;

    const usedColors = session.players.map((p) => p.avatarColor);
    const newPlayer: Player = {
      id: generateId(),
      name: playerName,
      avatarColor: pickRandomColor(usedColors),
      team: null,
      isHost: false,
      isConnected: true,
    };

    set({
      session: {
        ...session,
        players: [...session.players, newPlayer],
      },
    });
  },

  assignTeam: (playerId: string, team: TeamRole) => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        players: session.players.map((p) =>
          p.id === playerId ? { ...p, team } : p
        ),
      },
    });
  },

  autoAssignTeams: () => {
    const { session } = get();
    if (!session) return;

    const shuffled = [...session.players].sort(() => Math.random() - 0.5);
    const huntedCount = Math.max(1, Math.floor(shuffled.length / 3));

    const assigned = shuffled.map((player, index) => ({
      ...player,
      team: (index < huntedCount ? 'hunted' : 'hunter') as TeamRole,
    }));

    set({
      session: {
        ...session,
        players: assigned,
      },
    });
  },

  updateConfig: (config: Partial<GameConfig>) => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        config: { ...session.config, ...config },
      },
    });
  },

  addClueToSequence: (type: ClueType) => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        config: {
          ...session.config,
          clueSequence: [...session.config.clueSequence, type],
        },
      },
    });
  },

  removeClueFromSequence: (index: number) => {
    const { session } = get();
    if (!session) return;

    const newSequence = session.config.clueSequence.filter((_, i) => i !== index);
    set({
      session: {
        ...session,
        config: {
          ...session.config,
          clueSequence: newSequence,
        },
      },
    });
  },

  startGame: () => {
    const { session } = get();
    if (!session) return;

    const now = Date.now();
    const headStartEndsAt = now + session.config.headStartMinutes * 60 * 1000;

    set({
      session: {
        ...session,
        status: 'headstart',
        startedAt: now,
        headStartEndsAt,
      },
    });
  },

  startHunt: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        status: 'active',
      },
    });
  },

  sendClue: (clue: Omit<Clue, 'id'>) => {
    const { session } = get();
    if (!session) return;

    const newClue: Clue = {
      ...clue,
      id: generateId(),
    };

    set({
      session: {
        ...session,
        clues: [...session.clues, newClue],
      },
    });
  },

  captureRequest: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        status: 'captured',
      },
    });
  },

  confirmCapture: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        status: 'completed',
        endedAt: Date.now(),
      },
    });
  },

  denyCapture: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        status: 'active',
      },
    });
  },

  triggerSOS: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        status: 'sos',
      },
    });
  },

  resetSession: () => {
    set({ session: null, currentPlayerId: null });
  },

  getCurrentPlayer: () => {
    const { session, currentPlayerId } = get();
    if (!session || !currentPlayerId) return null;
    return session.players.find((p) => p.id === currentPlayerId) ?? null;
  },

  addMockPlayers: () => {
    const { session } = get();
    if (!session) return;

    const mockNames = ['Erik', 'Sara', 'Oscar', 'Linnea', 'Viktor'];
    const usedColors = session.players.map((p) => p.avatarColor);

    const mockPlayers: Player[] = mockNames.map((name) => {
      const color = pickRandomColor(usedColors);
      usedColors.push(color);
      return {
        id: generateId(),
        name,
        avatarColor: color,
        team: null,
        isHost: false,
        isConnected: true,
      };
    });

    set({
      session: {
        ...session,
        players: [...session.players, ...mockPlayers],
      },
    });
  },
}));
