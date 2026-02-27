import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, borders } from '../../theme';

type CardVariant = 'default' | 'highlight' | 'danger' | 'dark';

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: colors.white,
    ...borders.md,
    shadowColor: colors.black,
  },
  highlight: {
    backgroundColor: colors.yellow,
    ...borders.md,
    shadowColor: colors.black,
  },
  danger: {
    backgroundColor: colors.red,
    ...borders.md,
    shadowColor: colors.black,
  },
  dark: {
    backgroundColor: colors.black,
    borderWidth: 3,
    borderColor: colors.yellow,
    shadowColor: colors.yellow,
  },
};

export function Card({ variant = 'default', children, style }: CardProps) {
  const variantStyle = variantStyles[variant];

  return (
    <View
      style={[
        styles.base,
        variantStyle,
        {
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 6,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 0,
  },
});

export type { CardProps, CardVariant };
