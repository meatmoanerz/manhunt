import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders, shadows } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { useGameStore } from '../../src/store/gameStore';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

export default function ResultScreen() {
  const session = useGameStore((s) => s.session);
  const resetSession = useGameStore((s) => s.resetSession);

  const handleBackToStart = () => {
    resetSession();
    router.replace('/');
  };

  // Determine result
  const wasCapture = session?.status === 'completed';
  // If it ended by capture, hunters won; if by timeout (or other), hunted survived
  const huntersWon = wasCapture;

  // Calculate stats
  const totalTimeMs =
    session?.startedAt && session?.endedAt
      ? session.endedAt - session.startedAt
      : 0;
  const totalClues = session?.clues.length ?? 0;
  const totalPenalty = session?.clues.reduce(
    (sum, c) => sum + c.penaltySeconds,
    0
  ) ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Game over title */}
        <Text style={styles.gameOverTitle}>SPELET ÄR SLUT!</Text>

        {/* Result */}
        <View
          style={[
            styles.resultCard,
            huntersWon ? styles.resultCardHunter : styles.resultCardHunted,
          ]}
        >
          <Text style={styles.resultText}>
            {huntersWon ? 'JAGANDE VANN!' : 'JAGADE KLARADE SIG!'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL TID</Text>
            <Text style={styles.statValue}>
              {totalTimeMs > 0 ? formatDuration(totalTimeMs) : '--'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ANTAL LEDTRÅDAR</Text>
            <Text style={styles.statValue}>{totalClues}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL STRAFFTID</Text>
            <Text style={styles.statValue}>
              {totalPenalty > 0 ? `${totalPenalty}s` : '0s'}
            </Text>
          </View>
        </View>

        {/* Back button */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            title="TILLBAKA TILL START"
            size="lg"
            onPress={handleBackToStart}
            style={styles.button}
          />
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    alignItems: 'center',
  },
  topSpacer: {
    flex: 1,
  },
  gameOverTitle: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['3xl'],
    color: colors.yellow,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  resultCard: {
    ...borders.lg,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[8],
    marginBottom: spacing[10],
    alignItems: 'center',
    width: '100%',
  },
  resultCardHunter: {
    backgroundColor: colors.blue,
    ...shadows.md,
  },
  resultCardHunted: {
    backgroundColor: colors.red,
    ...shadows.md,
  },
  resultText: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['2xl'],
    color: '#FFFFFF',
    letterSpacing: 4,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    gap: spacing[3],
    marginBottom: spacing[10],
  },
  statCard: {
    backgroundColor: colors.gray900,
    ...borders.md,
    borderColor: colors.gray600,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray300,
    letterSpacing: 2,
  },
  statValue: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes.xl,
    color: colors.yellow,
  },
  buttonSection: {
    width: '100%',
    marginBottom: spacing[6],
  },
  button: {
    width: '100%',
  },
  bottomSpacer: {
    flex: 1,
  },
});
