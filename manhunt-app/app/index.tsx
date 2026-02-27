import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing } from '../src/theme';
import { Button } from '../src/components/ui/Button';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Title section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>MANHUNT</Text>
          <Text style={styles.subtitle}>REALTIDS JAKTSPEL</Text>
        </View>

        {/* Buttons section */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            title="SKAPA SPEL"
            size="lg"
            onPress={() => router.push('/create')}
            style={styles.button}
          />
          <Button
            variant="secondary"
            title="GÅ MED"
            size="lg"
            onPress={() => router.push('/join')}
            style={styles.button}
          />
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>Inspirerat av På Rymmen</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  topSpacer: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing[12],
  },
  title: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['4xl'],
    color: colors.yellow,
    letterSpacing: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.gray300,
    letterSpacing: 4,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  buttonSection: {
    gap: spacing[4],
    marginBottom: spacing[12],
  },
  button: {
    width: '100%',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing[6],
  },
  bottomText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    textAlign: 'center',
  },
});
