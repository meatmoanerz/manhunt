import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders, shadows } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import { Badge } from '../src/components/ui/Badge';
import { useGameStore } from '../src/store/gameStore';
import type { Player, TeamRole } from '../src/types/game';

export default function LobbyScreen() {
  const session = useGameStore((s) => s.session);
  const currentPlayerId = useGameStore((s) => s.currentPlayerId);
  const assignTeam = useGameStore((s) => s.assignTeam);
  const autoAssignTeams = useGameStore((s) => s.autoAssignTeams);
  const addMockPlayers = useGameStore((s) => s.addMockPlayers);

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Ingen aktiv session</Text>
          <Button
            variant="primary"
            title="TILLBAKA"
            onPress={() => router.replace('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentPlayer = session.players.find((p) => p.id === currentPlayerId);
  const isHost = currentPlayer?.isHost ?? false;

  const huntedPlayers = session.players.filter((p) => p.team === 'hunted');
  const hunterPlayers = session.players.filter((p) => p.team === 'hunter');
  const unassignedPlayers = session.players.filter((p) => p.team === null || p.team === 'spectator');

  const handleToggleTeam = (player: Player) => {
    if (!isHost) return;
    let nextTeam: TeamRole;
    if (player.team === null || player.team === 'spectator') {
      nextTeam = 'hunted';
    } else if (player.team === 'hunted') {
      nextTeam = 'hunter';
    } else {
      nextTeam = 'hunted';
    }
    assignTeam(player.id, nextTeam);
  };

  const renderPlayerCard = (player: Player) => {
    const isCurrentPlayer = player.id === currentPlayerId;

    return (
      <Pressable
        key={player.id}
        style={[styles.playerCard, isCurrentPlayer && styles.playerCardCurrent]}
        onPress={() => handleToggleTeam(player)}
        disabled={!isHost}
      >
        <View style={styles.playerInfo}>
          {/* Avatar color dot */}
          <View
            style={[styles.avatarDot, { backgroundColor: player.avatarColor }]}
          />
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>
              {player.name}
              {player.isHost ? ' (HOST)' : ''}
              {isCurrentPlayer ? ' (DU)' : ''}
            </Text>
          </View>
        </View>
        {player.team && (
          <Badge
            variant={player.team === 'hunted' ? 'jagade' : 'jagande'}
            label={player.team === 'hunted' ? 'JAGAD' : 'JAGANDE'}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Session code header */}
        <View style={styles.codeSection}>
          <Text style={styles.lobbyTitle}>LOBBY</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>SPELKOD</Text>
            <Text style={styles.codeValue}>{session.code}</Text>
          </View>
          <Text style={styles.helperText}>Dela koden med dina vänner!</Text>
        </View>

        {/* Player count */}
        <View style={styles.playerCountRow}>
          <Text style={styles.playerCount}>
            {session.players.length} SPELARE
          </Text>
        </View>

        {/* Unassigned players */}
        {unassignedPlayers.length > 0 && (
          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>OTILLDELADE</Text>
            {unassignedPlayers.map(renderPlayerCard)}
          </View>
        )}

        {/* Hunted team (JAGADE) - red section */}
        <View style={styles.teamSection}>
          <View style={[styles.teamHeader, styles.teamHeaderHunted]}>
            <Text style={styles.teamHeaderText}>
              JAGADE ({huntedPlayers.length})
            </Text>
          </View>
          {huntedPlayers.length === 0 ? (
            <View style={styles.emptyTeam}>
              <Text style={styles.emptyTeamText}>Inga spelare tilldelade</Text>
            </View>
          ) : (
            huntedPlayers.map(renderPlayerCard)
          )}
        </View>

        {/* Hunter team (JAGANDE) - blue section */}
        <View style={styles.teamSection}>
          <View style={[styles.teamHeader, styles.teamHeaderHunter]}>
            <Text style={styles.teamHeaderText}>
              JAGANDE ({hunterPlayers.length})
            </Text>
          </View>
          {hunterPlayers.length === 0 ? (
            <View style={styles.emptyTeam}>
              <Text style={styles.emptyTeamText}>Inga spelare tilldelade</Text>
            </View>
          ) : (
            hunterPlayers.map(renderPlayerCard)
          )}
        </View>

        {/* Host controls */}
        {isHost && (
          <View style={styles.hostControls}>
            <Button
              variant="secondary"
              title="AUTO-FÖRDELA LAG"
              size="md"
              onPress={autoAssignTeams}
              style={styles.controlButton}
            />
            <Button
              variant="primary"
              title="KONFIGURERA REGLER →"
              size="lg"
              onPress={() => router.push('/config')}
              style={styles.controlButton}
            />
          </View>
        )}

        {/* Dev controls */}
        <View style={styles.devSection}>
          <Button
            variant="dark"
            title="ADD MOCK PLAYERS"
            size="sm"
            onPress={addMockPlayers}
            style={styles.devButton}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
  },
  emptyText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xl,
    color: colors.gray300,
  },
  codeSection: {
    alignItems: 'center',
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  lobbyTitle: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['2xl'],
    color: colors.white,
    letterSpacing: 4,
    marginBottom: spacing[4],
  },
  codeCard: {
    backgroundColor: colors.gray900,
    ...borders.lg,
    borderColor: colors.yellow,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    alignItems: 'center',
    ...shadows.yellow,
  },
  codeLabel: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray300,
    letterSpacing: 2,
    marginBottom: spacing[1],
  },
  codeValue: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['3xl'],
    color: colors.yellow,
    letterSpacing: 8,
  },
  helperText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    marginTop: spacing[3],
  },
  playerCountRow: {
    marginBottom: spacing[4],
  },
  playerCount: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: colors.gray300,
    letterSpacing: 2,
  },
  teamSection: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  teamHeader: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    ...borders.md,
  },
  teamHeaderHunted: {
    backgroundColor: colors.red,
  },
  teamHeaderHunter: {
    backgroundColor: colors.blue,
  },
  teamHeaderText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  emptyTeam: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.gray900,
    ...borders.sm,
    borderColor: colors.gray600,
    borderStyle: 'dashed',
  },
  emptyTeamText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    textAlign: 'center',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray900,
    ...borders.sm,
    borderColor: colors.gray600,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  playerCardCurrent: {
    borderColor: colors.yellow,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    ...borders.sm,
    marginRight: spacing[3],
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontFamily: typography.bodyBold.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  hostControls: {
    gap: spacing[3],
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  controlButton: {
    width: '100%',
  },
  devSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray600,
    paddingTop: spacing[4],
    alignItems: 'center',
  },
  devButton: {
    alignSelf: 'center',
  },
  bottomSpacer: {
    height: spacing[10],
  },
});
