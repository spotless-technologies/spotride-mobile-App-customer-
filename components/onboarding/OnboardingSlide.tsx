import React from 'react';
import {
  Dimensions,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  imageSource: ImageSourcePropType;
  accentColor?: string;
}

interface OnboardingSlideProp {
  slide: SlideData;
}

export default function OnboardingSlide({ slide }: OnboardingSlideProp) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: slide.backgroundColor }]}>
      <ImageBackground
        source={slide.imageSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark vignette overlay — mimics photo darkening from mockup */}
        <View style={styles.overlay} />

        {/* Bottom-anchored text block */}
        <View
          style={[
            styles.textBlock,
            { paddingBottom: insets.bottom + 110 },
          ]}
        >
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  textBlock: {
    paddingHorizontal: 28,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Platform.select({ ios: 30, android: 28 }),
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 8,
    lineHeight: Platform.select({ ios: 38, android: 36 }),
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Platform.select({ ios: 17, android: 16 }),
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
