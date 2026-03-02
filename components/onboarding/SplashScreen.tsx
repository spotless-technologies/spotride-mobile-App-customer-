import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Fade in + scale up the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/onboarding/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay for better logo visibility */}
        <View style={styles.overlay} />

        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* SpotRide Text Logo */}
          <View style={styles.logoRow}>
            <Animated.Text style={styles.logoText}>
              {'sp'}
            </Animated.Text>
            {/* Simulated pin icon dot */}
            <View style={styles.pinContainer}>
              <View style={styles.pinOuter}>
                <View style={styles.pinInner} />
              </View>
            </View>
            <Animated.Text style={styles.logoText}>
              {'tride'}
            </Animated.Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111218',
  },
  backgroundImage: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: Platform.select({ ios: 42, android: 40 }),
    fontWeight: '700',
    letterSpacing: 1,
  },
  pinContainer: {
    marginTop: -6,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8440A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
});
