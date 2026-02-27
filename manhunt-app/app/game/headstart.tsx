import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders } from '../../src/theme';
import { useGameStore } from '../../src/store/gameStore';

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function HeadstartScreen() {
  const session = useGameStore((s) => s.session);
  const currentPlayerId = useGameStore((s) => s.currentPlayerId);
  const startHunt = useGameStore((s) => s.startHunt);

  const currentPlayer = session?.players.find((p) => p.id === currentPlayerId);
  const isHunted = currentPlayer?.team === 'hunted';

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!session?.headStartEndsAt) return 0;
    return Math.max(0, Math.ceil((session.headStartEndsAt - Date.now()) / 1000));
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!session?.headStartEndsAt) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.ceil((session.headStartEndsAt! - now) / 1000)
      );
      setRemainingSeconds(remaining);

      if (remaining <= 0 && !hasNavigated.current) {
        hasNavigated.current = true;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        startHunt();
        router.replace('/game/active');
      }
    }, 200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session?.headStartEndsAt, startHunt]);

  // Determine progress for visual feedback
  const totalSeconds = session?.config.headStartMinutes
    ? session.config.headStartMinutes * 60
    : 1;
  const progress = 1 - remainingSeconds / totalSeconds;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Team indicator */}
        <View
          style={[
            styles.teamBadge,
            isHunted ? styles.teamBadgeHunted : styles.teamBadgeHunter,
          ]}
        >
          <Text style={styles.teamBadgeText}>
            {isHunted ? 'JAGAD' : 'JAGANDE'}
          </Text>
        </View>

        {/* Main message */}
        <Text style={styles.mainMessage}>
          {isHunted ? 'SPRING IVÄG!' : 'VÄNTA...'}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {isHunted
            ? 'Du har försprång — spring så långt du kan!'
            : 'Jakten startar snart...'}
        </Text>

        {/* Big timer */}
        <View style={styles.timerContainer}>
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
          </View>
          <Text style={styles.timerLabel}>ÅTERSTÅENDE TID</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, progress * 100)}%`,
                  backgroundColor: isHunted ? colors.red : colors.blue,
                },
              ]}
            />
          </View>
        </View>

        {/* Bottom hint */}
        <Text style={styles.hint}>
          {isHunted
            ? 'Jakten börjar när tiden tar slut'
            : 'Förbered er — snart börjar jakten'}
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  teamBadge: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[6],
    ...borders.md,
    marginBottom: spacing[8],
  },
  teamBadgeHunted: {
    backgroundColor: colors.red,
  },
  teamBadgeHunter: {
    backgroundColor: colors.blue,
  },
  teamBadgeText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  mainMessage: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['4xl'],
    color: colors.yellow,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  subtitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray300,
    textAlign: 'center',
    marginBottom: spacing[12],
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  timerBox: {
    backgroundColor: colors.gray900,
    ...borders.lg,
    borderColor: colors.yellow,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[10],
  },
  timerText: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['5xl'],
    color: colors.yellow,
    letterSpacing: 8,
  },
  timerLabel: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    letterSpacing: 3,
    marginTop: spacing[3],
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: spacing[8],
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.gray900,
    ...borders.sm,
    borderColor: colors.gray600,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  hint: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    textAlign: 'center',
  },
});
