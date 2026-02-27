import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, typography, fontSizes, borders } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, containerStyle, style, onFocus, onBlur, ...rest }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputWrapperFocused : styles.inputWrapperDefault,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.gray300}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.black,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 0,
  },
  inputWrapperDefault: {
    ...borders.md,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  inputWrapperFocused: {
    borderWidth: 3,
    borderColor: colors.yellow,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: colors.yellow,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  input: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    color: colors.black,
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
});

export type { InputProps };
