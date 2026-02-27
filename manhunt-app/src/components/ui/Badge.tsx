import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { colors, typography, fontSizes, borders } from '../../theme';

type BadgeVariant =
  | 'jagade'
  | 'jagande'
  | 'spectator'
  | 'success'
  | 'warning'
  | 'geofence';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  jagade: {
    container: {
      backgroundColor: colors.red,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  jagande: {
    container: {
      backgroundColor: colors.blue,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  spectator: {
    container: {
      backgroundColor: colors.gray300,
    },
    text: {
      color: colors.black,
    },
  },
  success: {
    container: {
      backgroundColor: colors.green,
    },
    text: {
      color: colors.black,
    },
  },
  warning: {
    container: {
      backgroundColor: colors.orange,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  geofence: {
    container: {
      backgroundColor: colors.black,
    },
    text: {
      color: colors.yellow,
    },
  },
};

export function Badge({ variant, label }: BadgeProps) {
  const variantStyle = variantStyles[variant];

  return (
    <View style={[styles.base, variantStyle.container]}>
      <Text style={[styles.text, variantStyle.text]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 0,
    ...borders.sm,
  },
  text: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export type { BadgeProps, BadgeVariant };
