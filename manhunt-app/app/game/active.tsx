import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, fontSizes, spacing, borders, shadows } from '../../src/theme';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { useGameStore } from '../../src/store/gameStore';
import type { ClueType } from '../../src/types/game';

type TabName = 'clues' | 'map' | 'chat';

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

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ---- Tab: Clues (Hunted view) ----
function HuntedCluesTab() {
  const session = useGameStore((s) => s.session);
  const config = session?.config;
  const clues = session?.clues ?? [];

  // Compute next clue countdown from the start time
  const [nextClueSeconds, setNextClueSeconds] = useState(0);

  useEffect(() => {
    if (!session?.startedAt || !config) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - session.startedAt!;
      const headStartMs = config.headStartMinutes * 60 * 1000;
      const activeElapsed = Math.max(0, elapsed - headStartMs);
      const intervalMs = config.clueIntervalMinutes * 60 * 1000;
      const nextClueAt =
        (Math.floor(activeElapsed / intervalMs) + 1) * intervalMs;
      const remaining = Math.max(
        0,
        Math.ceil((nextClueAt - activeElapsed) / 1000)
      );
      setNextClueSeconds(remaining);
    }, 500);

    return () => clearInterval(interval);
  }, [session?.startedAt, config]);

  // Next clue type
  const nextClueIndex = clues.length;
  const nextClueType: ClueType | null =
    config && nextClueIndex < config.clueSequence.length
      ? config.clueSequence[nextClueIndex]
      : null;

  return (
    <ScrollView
      style={tabStyles.scrollView}
      contentContainerStyle={tabStyles.scrollContent}
    >
      {/* Next clue timer */}
      <View style={tabStyles.nextClueSection}>
        <Text style={tabStyles.sectionLabel}>NÄSTA LEDTRÅD</Text>
        <View style={tabStyles.timerBox}>
          <Text style={tabStyles.timerText}>
            {formatCountdown(nextClueSeconds)}
          </Text>
        </View>
        {nextClueType && (
          <View
            style={[
              tabStyles.clueTypeBadge,
              { backgroundColor: CLUE_COLORS[nextClueType] },
            ]}
          >
            <Text style={tabStyles.clueTypeBadgeText}>
              {CLUE_LABELS[nextClueType]}
            </Text>
          </View>
        )}
        {!nextClueType && (
          <Text style={tabStyles.allCluesSentText}>
            Alla ledtrådar skickade
          </Text>
        )}
      </View>

      {/* Sent clues list */}
      <Text style={tabStyles.sectionLabel}>SKICKADE LEDTRÅDAR</Text>
      {clues.length === 0 ? (
        <View style={tabStyles.emptyClue}>
          <Text style={tabStyles.emptyClueText}>
            Inga ledtrådar skickade ännu
          </Text>
        </View>
      ) : (
        clues.map((clue, index) => (
          <View key={clue.id} style={tabStyles.clueCard}>
            <View style={tabStyles.clueCardHeader}>
              <View
                style={[
                  tabStyles.clueTypeTag,
                  { backgroundColor: CLUE_COLORS[clue.type] },
                ]}
              >
                <Text style={tabStyles.clueTypeTagText}>
                  {CLUE_LABELS[clue.type]}
                </Text>
              </View>
              <Text style={tabStyles.clueIndex}>#{index + 1}</Text>
            </View>
            <Text style={tabStyles.clueTimestamp}>
              {new Date(clue.timestamp).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// ---- Tab: Clues (Hunter view) ----
function HunterCluesTab() {
  const session = useGameStore((s) => s.session);
  const clues = session?.clues ?? [];

  return (
    <ScrollView
      style={tabStyles.scrollView}
      contentContainerStyle={tabStyles.scrollContent}
    >
      <Text style={tabStyles.sectionLabel}>MOTTAGNA LEDTRÅDAR</Text>

      {clues.length === 0 ? (
        <View style={tabStyles.emptyClue}>
          <Text style={tabStyles.emptyClueText}>
            Inga ledtrådar mottagna ännu
          </Text>
          <Text style={tabStyles.emptyClueSubtext}>
            Vänta på nästa ledtråd...
          </Text>
        </View>
      ) : (
        clues.map((clue, index) => (
          <View key={clue.id} style={tabStyles.clueCard}>
            <View style={tabStyles.clueCardHeader}>
              <View
                style={[
                  tabStyles.clueTypeTag,
                  { backgroundColor: CLUE_COLORS[clue.type] },
                ]}
              >
                <Text style={tabStyles.clueTypeTagText}>
                  {CLUE_LABELS[clue.type]}
                </Text>
              </View>
              <Text style={tabStyles.clueIndex}>#{index + 1}</Text>
            </View>
            <Text style={tabStyles.clueTimestamp}>
              {new Date(clue.timestamp).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {clue.latitude != null && clue.longitude != null && (
              <Text style={tabStyles.clueCoords}>
                {clue.latitude.toFixed(4)}, {clue.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

// ---- Tab: Map ----
function MapTab() {
  return (
    <View style={tabStyles.placeholderContainer}>
      <View style={tabStyles.placeholderBox}>
        <Text style={tabStyles.placeholderTitle}>KARTA KOMMER SNART</Text>
        <Text style={tabStyles.placeholderSubtext}>
          Kartvisning är under utveckling
        </Text>
      </View>
    </View>
  );
}

// ---- Tab: Chat ----
function ChatTab() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string; time: string }[]
  >([
    {
      id: '1',
      text: 'Chatten är redo!',
      sender: 'System',
      time: new Date().toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'Du',
        time: new Date().toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setMessage('');
  };

  return (
    <View style={tabStyles.chatContainer}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={tabStyles.chatList}
        contentContainerStyle={tabStyles.chatListContent}
        renderItem={({ item }) => {
          const isSelf = item.sender === 'Du';
          return (
            <View
              style={[
                tabStyles.chatBubble,
                isSelf
                  ? tabStyles.chatBubbleSelf
                  : tabStyles.chatBubbleOther,
              ]}
            >
              <Text style={[tabStyles.chatSender, isSelf && { color: colors.gray900 }]}>
                {item.sender}
              </Text>
              <Text style={[tabStyles.chatText, isSelf && { color: colors.black }]}>
                {item.text}
              </Text>
              <Text style={[tabStyles.chatTime, isSelf && { color: colors.gray900 }]}>
                {item.time}
              </Text>
            </View>
          );
        }}
      />
      <View style={tabStyles.chatInputRow}>
        <View style={tabStyles.chatInputWrapper}>
          <TextInput
            style={tabStyles.chatInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Skriv meddelande..."
            placeholderTextColor={colors.gray600}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>
        <Pressable style={tabStyles.chatSendButton} onPress={handleSend}>
          <Text style={tabStyles.chatSendText}>SKICKA</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---- Main screen ----
export default function ActiveGameScreen() {
  const session = useGameStore((s) => s.session);
  const currentPlayerId = useGameStore((s) => s.currentPlayerId);
  const captureRequest = useGameStore((s) => s.captureRequest);
  const triggerSOS = useGameStore((s) => s.triggerSOS);

  const currentPlayer = session?.players.find((p) => p.id === currentPlayerId);
  const isHunted = currentPlayer?.team === 'hunted';

  const [activeTab, setActiveTab] = useState<TabName>('clues');
  const [elapsedMs, setElapsedMs] = useState(0);

  // Game timer
  useEffect(() => {
    if (!session?.startedAt) return;

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - session.startedAt!);
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.startedAt]);

  // Navigate to result if game is completed
  useEffect(() => {
    if (session?.status === 'completed') {
      router.replace('/game/result');
    }
  }, [session?.status]);

  const handleCapture = () => {
    captureRequest();
    router.replace('/game/result');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'clues':
        return isHunted ? <HuntedCluesTab /> : <HunterCluesTab />;
      case 'map':
        return <MapTab />;
      case 'chat':
        return <ChatTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.timerPill}>
            <Text style={styles.timerPillText}>
              {formatElapsed(elapsedMs)}
            </Text>
          </View>
        </View>
        <View style={styles.topBarCenter}>
          {isHunted && (
            <Pressable style={styles.capturedButton} onPress={handleCapture}>
              <Text style={styles.capturedButtonText}>FÅNGADE</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.topBarRight}>
          <Pressable style={styles.sosButton} onPress={triggerSOS}>
            <Text style={styles.sosButtonText}>SOS</Text>
          </Pressable>
        </View>
      </View>

      {/* Tab content */}
      <View style={styles.tabContent}>{renderTab()}</View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(
          [
            { key: 'clues', label: 'LEDTRÅDAR' },
            { key: 'map', label: 'KARTA' },
            { key: 'chat', label: 'CHATT' },
          ] as { key: TabName; label: string }[]
        ).map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.key && styles.tabButtonTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ---- Tab-specific styles ----
const tabStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  nextClueSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  sectionLabel: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray300,
    letterSpacing: 2,
    marginBottom: spacing[3],
  },
  timerBox: {
    backgroundColor: colors.gray900,
    ...borders.lg,
    borderColor: colors.yellow,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[8],
    marginBottom: spacing[3],
  },
  timerText: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes['3xl'],
    color: colors.yellow,
    letterSpacing: 6,
    textAlign: 'center',
  },
  clueTypeBadge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[4],
    ...borders.sm,
  },
  clueTypeBadgeText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.black,
    letterSpacing: 2,
  },
  allCluesSentText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
  },
  emptyClue: {
    backgroundColor: colors.gray900,
    ...borders.sm,
    borderColor: colors.gray600,
    borderStyle: 'dashed',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  emptyClueText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    textAlign: 'center',
  },
  emptyClueSubtext: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  clueCard: {
    backgroundColor: colors.gray900,
    ...borders.sm,
    borderColor: colors.gray600,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  clueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  clueTypeTag: {
    paddingVertical: 2,
    paddingHorizontal: spacing[2],
    ...borders.sm,
  },
  clueTypeTagText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.black,
    letterSpacing: 1,
  },
  clueIndex: {
    fontFamily: typography.bodyBold.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
  },
  clueTimestamp: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray300,
  },
  clueCoords: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    marginTop: spacing[1],
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  placeholderBox: {
    backgroundColor: colors.gray900,
    ...borders.lg,
    borderColor: colors.gray600,
    borderStyle: 'dashed',
    padding: spacing[8],
    alignItems: 'center',
    width: '100%',
  },
  placeholderTitle: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes.xl,
    color: colors.gray300,
    letterSpacing: 3,
    marginBottom: spacing[2],
  },
  placeholderSubtext: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  chatBubble: {
    maxWidth: '80%',
    padding: spacing[3],
    marginBottom: spacing[2],
    ...borders.sm,
  },
  chatBubbleSelf: {
    alignSelf: 'flex-end',
    backgroundColor: colors.yellow,
    borderColor: colors.black,
  },
  chatBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray900,
    borderColor: colors.gray600,
  },
  chatSender: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.gray600,
    letterSpacing: 1,
    marginBottom: 2,
  },
  chatText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  chatTime: {
    fontFamily: typography.body.fontFamily,
    fontSize: 10,
    color: colors.gray600,
    marginTop: 2,
    textAlign: 'right',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderTopWidth: 2,
    borderTopColor: colors.gray600,
    backgroundColor: colors.black,
    gap: spacing[2],
  },
  chatInputWrapper: {
    flex: 1,
    ...borders.sm,
    borderColor: colors.gray600,
  },
  chatInput: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    backgroundColor: colors.gray900,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: 0,
  },
  chatSendButton: {
    backgroundColor: colors.yellow,
    ...borders.sm,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  chatSendText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.black,
    letterSpacing: 1,
  },
});

// ---- Main styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: 2,
    borderBottomColor: colors.gray600,
  },
  topBarLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timerPill: {
    backgroundColor: colors.gray900,
    ...borders.sm,
    borderColor: colors.gray600,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
  },
  timerPillText: {
    fontFamily: typography.displayBold.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.white,
    letterSpacing: 2,
  },
  capturedButton: {
    backgroundColor: colors.orange,
    ...borders.md,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[4],
  },
  capturedButtonText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  sosButton: {
    backgroundColor: colors.red,
    ...borders.md,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[4],
  },
  sosButtonText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tabContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 3,
    borderTopColor: colors.gray600,
    backgroundColor: colors.gray900,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.black,
    borderTopWidth: 3,
    borderTopColor: colors.yellow,
    marginTop: -3,
  },
  tabButtonText: {
    fontFamily: typography.display.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.gray600,
    letterSpacing: 2,
  },
  tabButtonTextActive: {
    color: colors.yellow,
  },
});
