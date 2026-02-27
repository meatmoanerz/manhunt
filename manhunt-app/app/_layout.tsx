import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  BarlowCondensed_800ExtraBold,
  BarlowCondensed_900Black,
} from '@expo-google-fonts/barlow-condensed';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BarlowCondensed_800ExtraBold,
    BarlowCondensed_900Black,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashTitle}>MANHUNT</Text>
        <ActivityIndicator
          size="large"
          color="#FFE040"
          style={styles.splashLoader}
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A0A' },
        animation: 'slide_from_right',
      }}
    />
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontWeight: '900',
    fontSize: 72,
    color: '#FFE040',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  splashLoader: {
    marginTop: 32,
  },
});
