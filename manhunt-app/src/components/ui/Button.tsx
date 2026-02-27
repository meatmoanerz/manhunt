import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { colors, typography, fontSizes, borders, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
}

const PRESS_OFFSET = 3;

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: colors.yellow,
      ...borders.md,
    },
    text: {
      color: colors.black,
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.white,
      ...borders.md,
    },
    text: {
      color: colors.black,
    },
  },
  danger: {
    container: {
      backgroundColor: colors.red,
      ...borders.md,
    },
    text: {
      color: '#FFFFFF',
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    text: {
      color: colors.black,
    },
  },
  dark: {
    container: {
      backgroundColor: colors.black,
      ...borders.md,
    },
    text: {
      color: colors.yellow,
    },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    text: {
      fontSize: fontSizes.sm,
    },
  },
  md: {
    container: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    text: {
      fontSize: fontSizes.base,
    },
  },
  lg: {
    container: {
      paddingVertical: 16,
      paddingHorizontal: 32,
    },
    text: {
      fontSize: fontSizes.lg,
    },
  },
};

export function Button({
  variant = 'primary',
  title,
  onPress,
  disabled = false,
  size = 'md',
  style,
}: ButtonProps) {
  const animatedValue = useMemo(() => new Animated.Value(0), []);

  const hasShadow = variant !== 'ghost';

  const handlePressIn = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const handlePressOut = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PRESS_OFFSET],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PRESS_OFFSET],
  });

  const shadowTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 2],
  });

  const shadowTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 2],
  });

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX }, { translateY }],
        },
        hasShadow && {
          ...shadows.md,
          shadowOffset: { width: 5, height: 5 },
        },
        style,
      ]}
    >
      {/* Shadow layer for Android (elevation doesn't animate well) */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.base,
          variantStyle.container,
          sizeStyle.container,
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.text,
            variantStyle.text,
            sizeStyle.text,
            disabled && styles.disabledText,
          ]}
        >
          {title.toUpperCase()}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  text: {
    fontFamily: typography.display.fontFamily,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export type { ButtonProps, ButtonVariant, ButtonSize };
