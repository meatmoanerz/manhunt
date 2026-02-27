import React, { useMemo } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { colors, typography, fontSizes, borders } from '../../theme';

type TimerState = 'normal' | 'warning' | 'critical';

interface TimerProps {
  timeInSeconds: number;
  label?: string;
  sublabel?: string;
  state?: TimerState;
}

function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const stateColors: Record<TimerState, { digits: string; border: string; shadow: string }> = {
  normal: {
    digits: colors.yellow,
    border: colors.yellow,
    shadow: colors.yellow,
  },
  warning: {
    digits: colors.orange,
    border: colors.yellow,
    shadow: colors.yellow,
  },
  critical: {
    digits: colors.red,
    border: colors.red,
    shadow: colors.red,
  },
};

export function Timer({ timeInSeconds, label, sublabel, state = 'normal' }: TimerProps) {
  const formatted = useMemo(() => formatTime(timeInSeconds), [timeInSeconds]);
  const stateColor = stateColors[state];

  const containerStyle: ViewStyle = {
    ...styles.container,
    borderColor: stateColor.border,
    shadowColor: stateColor.shadow,
  };

  const digitsStyle: TextStyle = {
    ...styles.digits,
    color: stateColor.digits,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      <Text style={digitsStyle}>{formatted}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    borderWidth: 4,
    borderColor: colors.yellow,
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  label: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  digits: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['4xl'],
    color: colors.yellow,
    letterSpacing: 4,
    lineHeight: fontSizes['4xl'] * 1.1,
  },
  sublabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    marginTop: 4,
  },
});

export type { TimerProps, TimerState };
