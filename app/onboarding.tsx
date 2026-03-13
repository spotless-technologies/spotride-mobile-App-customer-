import { OnboardingScreen, SplashScreen } from '@/components/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ONBOARDING_KEY = 'spotride_has_onboarded';

type Stage = 'splash' | 'slides';

export default function OnboardingRoute() {
    const [stage, setStage] = useState<Stage>('splash');

    const handleSplashFinish = () => {
        setStage('slides');
    };

    const handleOnboardingDone = async () => {
        try {
            // 1. Mark as onboarded
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

            // 2. Short wait to ensure persistence settles
            await new Promise(resolve => setTimeout(resolve, 100));

            // 3. Check for auth status
            const token = await AsyncStorage.getItem('login_token');
            
            if (!token) {
                // No token -> Signup
                console.log('[OnboardingRoute] No auth found, redirecting to Signup');
                router.replace('/(auth)/signup');
            } else {
                // Token found -> Home (or Auth -> Home via RootLayout)
                console.log('[OnboardingRoute] Auth token found, redirecting to Home');
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error('[OnboardingRoute] Transition error:', error);
            router.replace('/(auth)/login');
        }
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
