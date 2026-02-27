import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders, shadows } from '../src/theme';
import { Button } from '../src/components/ui/Button';
import { useGameStore } from '../src/store/gameStore';
import type { ClueType } from '../src/types/game';

// +/- stepper component
function Stepper({
  value,
  min,
  max,
  step = 1,
  onIncrement,
  onDecrement,
  suffix = '',
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  suffix?: string;
}) {
  return (
    <View style={stepperStyles.container}>
      <Pressable
        style={[stepperStyles.button, value <= min && stepperStyles.buttonDisabled]}
        onPress={onDecrement}
        disabled={value <= min}
      >
        <Text style={[stepperStyles.buttonText, value <= min && stepperStyles.buttonTextDisabled]}>
          -
        </Text>
      </Pressable>
      <View style={stepperStyles.valueContainer}>
        <Text style={stepperStyles.value}>
          {value}{suffix}
        </Text>
      </View>
      <Pressable
        style={[stepperStyles.button, value >= max && stepperStyles.buttonDisabled]}
        onPress={onIncrement}
        disabled={value >= max}
      >
        <Text style={[stepperStyles.buttonText, value >= max && stepperStyles.buttonTextDisabled]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  button: {
    width: 44,
    height: 44,
    backgroundColor: colors.gray900,
    ...borders.md,
    borderColor: colors.gray600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes.xl,
    color: colors.yellow,
  },
  buttonTextDisabled: {
    color: colors.gray600,
  },
  valueContainer: {
    minWidth: 80,
    alignItems: 'center',
    paddingHorizontal: spacing[3],
  },
  value: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes.xl,
    color: colors.white,
  },
});

// Clue type chip
const CLUE_LABELS: Record<ClueType, string> = {
  pin: 'PIN',
  photo: 'FOTO',
  video: 'VIDEO',
};

const CLUE_COLORS: Record<ClueType, string> = {
  pin: colors.yellow,
  photo: colors.green,
  video: colors.orange,
};

export default function ConfigScreen() {
  const session = useGameStore((s) => s.session);
  const updateConfig = useGameStore((s) => s.updateConfig);
  const addClueToSequence = useGameStore((s) => s.addClueToSequence);
  const removeClueFromSequence = useGameStore((s) => s.removeClueFromSequence);
  const startGame = useGameStore((s) => s.startGame);

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Ingen aktiv session</Text>
        </View>
      </SafeAreaView>
    );
  }

  const config = session.config;

  const handleStartGame = () => {
    startGame();
    router.push('/game/headstart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{'< TILLBAKA'}</Text>
          </Pressable>
          <Text style={styles.title}>SPELREGLER</Text>
        </View>

        {/* Head start */}
        <View style={styles.configCard}>
          <Text style={styles.configLabel}>FÖRSPRÅNG</Text>
          <Text style={styles.configDescription}>
            Tid för jagade att springa iväg
          </Text>
          <Stepper
            value={config.headStartMinutes}
            min={1}
            max={30}
            suffix=" min"
            onIncrement={() =>
              updateConfig({
                headStartMinutes: Math.min(30, config.headStartMinutes + 1),
              })
            }
            onDecrement={() =>
              updateConfig({
                headStartMinutes: Math.max(1, config.headStartMinutes - 1),
              })
            }
          />
        </View>

        {/* Clue interval */}
        <View style={styles.configCard}>
          <Text style={styles.configLabel}>LEDTRÅDSINTERVALL</Text>
          <Text style={styles.configDescription}>
            Tid mellan varje ledtråd
          </Text>
          <Stepper
            value={config.clueIntervalMinutes}
            min={5}
            max={120}
            step={5}
            suffix=" min"
            onIncrement={() =>
              updateConfig({
                clueIntervalMinutes: Math.min(120, config.clueIntervalMinutes + 5),
              })
            }
            onDecrement={() =>
              updateConfig({
                clueIntervalMinutes: Math.max(5, config.clueIntervalMinutes - 5),
              })
            }
          />
        </View>

        {/* Clue sequence */}
        <View style={styles.configCard}>
          <Text style={styles.configLabel}>LEDTRÅDSSEKVENS</Text>
          <Text style={styles.configDescription}>
            Ordningen för ledtrådstyper
          </Text>
          <View style={styles.clueChipsContainer}>
            {config.clueSequence.map((type, index) => (
              <View
                key={`${type}-${index}`}
                style={[styles.clueChip, { backgroundColor: CLUE_COLORS[type] }]}
              >
                <Text style={styles.clueChipText}>{CLUE_LABELS[type]}</Text>
                <Pressable
                  onPress={() => removeClueFromSequence(index)}
                  style={styles.clueChipRemove}
                >
                  <Text style={styles.clueChipRemoveText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <View style={styles.addClueRow}>
            {(['pin', 'photo', 'video'] as ClueType[]).map((type) => (
              <Pressable
                key={type}
                style={[styles.addClueButton, { borderColor: CLUE_COLORS[type] }]}
                onPress={() => addClueToSequence(type)}
              >
                <Text style={[styles.addClueText, { color: CLUE_COLORS[type] }]}>
                  + {CLUE_LABELS[type]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Geofence wait time */}
        <View style={styles.configCard}>
          <Text style={styles.configLabel}>GEOFENCE-VÄNTETID</Text>
          <Text style={styles.configDescription}>
            Väntetid vid geofence-kontroll
          </Text>
          <Stepper
            value={config.geofenceWaitMinutes}
            min={1}
            max={15}
            suffix=" min"
            onIncrement={() =>
              updateConfig({
                geofenceWaitMinutes: Math.min(15, config.geofenceWaitMinutes + 1),
              })
            }
            onDecrement={() =>
              updateConfig({
                geofenceWaitMinutes: Math.max(1, config.geofenceWaitMinutes - 1),
              })
            }
          />
        </View>

        {/* Penalty toggle */}
        <View style={styles.configCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.configLabel}>STRAFFTID VID FENCE-BROTT</Text>
              <Text style={styles.configDescription}>
                Lägg till strafftid vid brott
              </Text>
            </View>
            <Switch
              value={config.penaltyOnFenceBreach}
              onValueChange={(value) =>
                updateConfig({ penaltyOnFenceBreach: value })
              }
              trackColor={{ false: colors.gray600, true: colors.yellow }}
              thumbColor={config.penaltyOnFenceBreach ? colors.black : colors.gray300}
            />
          </View>
        </View>

        {/* Max game time */}
        <View style={styles.configCard}>
          <Text style={styles.configLabel}>MAX SPELTID</Text>
          <Text style={styles.configDescription}>
            Valfri maximal speltid (0 = obegränsad)
          </Text>
          <Stepper
            value={config.maxGameTimeMinutes ?? 0}
            min={0}
            max={480}
            step={15}
            suffix=" min"
            onIncrement={() =>
              updateConfig({
                maxGameTimeMinutes: Math.min(
                  480,
                  (config.maxGameTimeMinutes ?? 0) + 15
                ),
              })
            }
            onDecrement={() => {
              const next = Math.max(0, (config.maxGameTimeMinutes ?? 0) - 15);
              updateConfig({
                maxGameTimeMinutes: next === 0 ? null : next,
              });
            }}
          />
        </View>

        {/* Rule summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>SAMMANFATTNING</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Försprång</Text>
            <Text style={styles.summaryValue}>{config.headStartMinutes} min</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ledtrådsintervall</Text>
            <Text style={styles.summaryValue}>{config.clueIntervalMinutes} min</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sekvens</Text>
            <Text style={styles.summaryValue}>
              {config.clueSequence.map((t) => CLUE_LABELS[t]).join(' → ')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Geofence-väntetid</Text>
            <Text style={styles.summaryValue}>{config.geofenceWaitMinutes} min</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Strafftid</Text>
            <Text style={styles.summaryValue}>
              {config.penaltyOnFenceBreach ? 'JA' : 'NEJ'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Max speltid</Text>
            <Text style={styles.summaryValue}>
              {config.maxGameTimeMinutes ? `${config.maxGameTimeMinutes} min` : 'Obegränsad'}
            </Text>
          </View>
        </View>

        {/* Start game */}
        <View style={styles.startSection}>
          <Button
            variant="primary"
            title="STARTA SPEL"
            size="lg"
            onPress={handleStartGame}
            style={styles.startButton}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xl,
    color: colors.gray300,
  },
  header: {
    paddingTop: spacing[2],
    paddingBottom: spacing[6],
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing[2],
    marginBottom: spacing[4],
  },
  backText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: colors.yellow,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['3xl'],
    color: colors.yellow,
    letterSpacing: 4,
  },
  configCard: {
    backgroundColor: colors.gray900,
    ...borders.md,
    borderColor: colors.gray600,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  configLabel: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: colors.white,
    letterSpacing: 2,
    marginBottom: spacing[1],
  },
  configDescription: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    marginBottom: spacing[3],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: spacing[4],
  },
  clueChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  clueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1],
    paddingLeft: spacing[3],
    paddingRight: spacing[1],
    ...borders.sm,
  },
  clueChipText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.black,
    letterSpacing: 1.5,
  },
  clueChipRemove: {
    marginLeft: spacing[1],
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clueChipRemoveText: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes.base,
    color: colors.black,
  },
  addClueRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  addClueButton: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addClueText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
  },
  summaryCard: {
    backgroundColor: colors.gray900,
    ...borders.lg,
    borderColor: colors.yellow,
    padding: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[6],
    ...shadows.yellow,
  },
  summaryTitle: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.base,
    color: colors.yellow,
    letterSpacing: 2,
    marginBottom: spacing[3],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray600,
  },
  summaryLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray300,
  },
  summaryValue: {
    fontFamily: typography.bodyBold.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  startSection: {
    marginBottom: spacing[6],
  },
  startButton: {
    width: '100%',
  },
  bottomSpacer: {
    height: spacing[10],
  },
});
