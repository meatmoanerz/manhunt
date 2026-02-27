import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import { useGameStore } from '../src/store/gameStore';

export default function JoinScreen() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const joinSession = useGameStore((s) => s.joinSession);

  const handleJoin = () => {
    if (!code.trim() || !name.trim()) return;
    joinSession(code.trim(), name.trim());
    router.push('/lobby');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'< TILLBAKA'}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>GÅ MED I SPEL</Text>

        {/* Session code input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>SPELKOD</Text>
          <View
            style={[
              styles.inputWrapper,
              codeFocused && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="000000"
              placeholderTextColor={colors.gray600}
              keyboardType="number-pad"
              maxLength={6}
              onFocus={() => setCodeFocused(true)}
              onBlur={() => setCodeFocused(false)}
            />
          </View>
        </View>

        {/* Name input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DITT NAMN</Text>
          <View
            style={[
              styles.inputWrapper,
              nameFocused && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ange ditt namn..."
              placeholderTextColor={colors.gray600}
              autoCapitalize="words"
              autoCorrect={false}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            title="GÅ MED"
            size="lg"
            onPress={handleJoin}
            disabled={!code.trim() || code.length < 6 || !name.trim()}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing[2],
  },
  backText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: colors.yellow,
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  title: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['3xl'],
    color: colors.yellow,
    letterSpacing: 4,
    marginBottom: spacing[10],
  },
  inputGroup: {
    marginBottom: spacing[6],
  },
  label: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray300,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  inputWrapper: {
    ...borders.md,
    borderColor: colors.gray600,
  },
  inputWrapperFocused: {
    borderColor: colors.yellow,
  },
  codeInput: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['2xl'],
    color: colors.yellow,
    backgroundColor: colors.gray900,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 0,
    textAlign: 'center',
    letterSpacing: 12,
  },
  input: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    color: colors.white,
    backgroundColor: colors.gray900,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
  buttonContainer: {
    marginTop: spacing[8],
  },
  button: {
    width: '100%',
  },
});
