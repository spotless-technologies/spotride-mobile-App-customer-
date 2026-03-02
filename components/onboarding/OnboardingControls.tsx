import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingDots from './OnboardingDots';

interface OnboardingControlsProps {
    total: number;
    currentIndex: number;
    isLastSlide: boolean;
    onSkip: () => void;
    onNext: () => void;
}

export default function OnboardingControls({
    total,
    currentIndex,
    isLastSlide,
    onSkip,
    onNext,
}: OnboardingControlsProps) {
    const insets = useSafeAreaInsets();

    return (
        <>
            {/* Skip button — top right, hidden on last slide */}
            {!isLastSlide && (
                <View style={[styles.skipWrapper, { top: insets.top + 16 }]}>
                    <TouchableOpacity
                        onPress={onSkip}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom control bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
                {/* Dots */}
                <OnboardingDots total={total} currentIndex={currentIndex} />

                {/* Next / Continue button */}
                {isLastSlide ? (
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={onNext}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.continueText}>Continue  ›</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={onNext}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.arrowText}>›</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    skipWrapper: {
        position: 'absolute',
        right: 24,
        zIndex: 10,
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: Platform.select({ ios: 17, android: 16 }),
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingBottom: 36,
    },
    arrowButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    arrowText: {
        color: '#111218',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28,
        marginTop: -2,
    },
    continueButton: {
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    continueText: {
        color: '#111218',
        fontSize: Platform.select({ ios: 16, android: 15 }),
        fontWeight: '700',
        letterSpacing: 0.4,
    },
});
