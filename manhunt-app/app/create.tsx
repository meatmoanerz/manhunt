import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import { useGameStore } from '../src/store/gameStore';

export default function CreateScreen() {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const createSession = useGameStore((s) => s.createSession);

  const handleCreate = () => {
    if (!name.trim()) return;
    createSession(name.trim());
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
        <Text style={styles.title}>SKAPA SPEL</Text>

        {/* Name input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DITT NAMN</Text>
          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            title="SKAPA LOBBY"
            size="lg"
            onPress={handleCreate}
            disabled={!name.trim()}
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
