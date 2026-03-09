import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEnableLocation } from './useEnableLocation';

const EnableLocation = () => {
    // ✅ useWindowDimensions re-reads on orientation change / foldables
    const { width } = useWindowDimensions();

    const { mode } = useLocalSearchParams<{ mode: 'passenger' | 'driver' }>();
    const safeMode: 'passenger' | 'driver' = mode === 'driver' ? 'driver' : 'passenger';

    const { isRequesting, handleGrantPermission, handleMaybeLater } = useEnableLocation(safeMode);

    // ✅ Tablet-aware card width: cap at 420 for large screens
    const cardWidth = Math.min(width * 0.86, 420);

    // ✅ Platform-aware blur — Android amplifies the value significantly
    const blurAmount = Platform.OS === 'android' ? 3 : 8;

    return (
        // ✅ SafeAreaView handles notch / Dynamic Island on iOS and camera punch-out on Android
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <ImageBackground
                source={require('@/assets/images/onboarding/mapbg.png')}
                style={styles.background}
                resizeMode="cover"
                blurRadius={blurAmount}
            >
                {/* Semi-transparent overlay */}
                <View style={styles.overlay} />

                {/* ✅ ScrollView ensures the card doesn't clip on very small screens (iPhone SE etc.) */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Glass-morphism card */}
                    <View style={[styles.card, { width: cardWidth }]}>

                        {/* Location pin circle */}
                        <View style={styles.iconCircle}>
                            <Ionicons name="location" size={38} color="#FFF" />
                        </View>

                        <Text style={styles.title}>Enable Location</Text>
                        <Text style={styles.subtitle}>
                            We need your location to find nearby drivers and provide accurate pickup times
                        </Text>

                        {/* Grant Permission */}
                        <TouchableOpacity
                            style={styles.grantButton}
                            onPress={handleGrantPermission}
                            activeOpacity={0.85}
                            disabled={isRequesting}
                            accessibilityRole="button"
                            accessibilityLabel="Grant location permission"
                        >
                            {isRequesting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.grantButtonText}>Grant Permission</Text>
                            )}
                        </TouchableOpacity>

                        {/* Maybe Later */}
                        <TouchableOpacity
                            style={styles.laterButton}
                            onPress={handleMaybeLater}
                            activeOpacity={0.85}
                            disabled={isRequesting}
                            accessibilityRole="button"
                            accessibilityLabel="Skip location permission for now"
                        >
                            <Text style={styles.laterButtonText}>Maybe Later</Text>
                        </TouchableOpacity>

                        {/* Privacy note */}
                        <Text style={styles.privacyNote}>
                            Your location data is only used to improve your ride experience
                        </Text>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#111218', // fallback while image loads
    },
    background: {
        flex: 1,
        // ✅ Use '100%' not a static pixel value — adapts to every screen size
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Vertical padding keeps card away from edges on landscape / tablets
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: 'rgba(55,55,55,0.74)',
        borderRadius: 24,
        paddingHorizontal: 28,
        paddingTop: 36,
        paddingBottom: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        // ✅ Elevation/shadow handled per-platform
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.28,
                shadowRadius: 12,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#A05A2C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 14,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.82)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    grantButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#E8440A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    grantButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    laterButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    laterButtonText: {
        color: '#333333',
        fontSize: 16,
        // ✅ '600' is not supported on Android — use '700' or fallback to bold
        fontWeight: Platform.OS === 'android' ? '700' : '600',
        letterSpacing: 0.2,
    },
    privacyNote: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default EnableLocation;
