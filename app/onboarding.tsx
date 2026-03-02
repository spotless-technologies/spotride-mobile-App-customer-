import { OnboardingScreen, SplashScreen } from '@/components/onboarding';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Stage = 'splash' | 'slides';

export default function OnboardingRoute() {
    const [stage, setStage] = useState<Stage>('splash');

    const handleSplashFinish = () => {
        setStage('slides');
    };

    const handleOnboardingDone = () => {
        // Replace so user cannot back-navigate to onboarding
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {stage === 'splash' ? (
                <SplashScreen onFinish={handleSplashFinish} />
            ) : (
                <OnboardingScreen onDone={handleOnboardingDone} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111218',
    },
});
