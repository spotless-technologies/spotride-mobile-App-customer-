import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const ARCH_WIDTH = width * 1.0;
const ARCH_RADIUS = ARCH_WIDTH / 2;

const ChooseMode = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const handleSelectMode = (mode: 'passenger' | 'driver') => {
        router.push({
            pathname: '/(auth)/enable-location',
            params: { mode },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView bounces={true} showsVerticalScrollIndicator={false}>

                {/* ── HEADER — same structure as Login/Verify ── */}
                <View style={styles.header}>
                    {/* bgImage wrapper is intentionally taller than header so image always fills */}
                    <View style={styles.bgImage}>
                        <Image
                            source={require('@/assets/images/onboarding/verify.png')}
                            style={styles.headerImage}
                        />
                    </View>

                    {/* Dark overlay */}
                    <View style={styles.darkOverlay} />

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/onboarding/Untitled-1 2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Title block */}
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Choose Your Mode</Text>
                        <Text style={styles.subtitle}>Select how you want to use SpotRide</Text>
                    </View>

                </View>

                {/* ── ORANGE DIVIDER STRIP ── */}
                <View style={styles.dividerStrip} />

                {/* No divider strip needed — arch handles the transition */}

                {/* ── CONTENT ── */}
                <View style={styles.content}>

                    {/* Passenger Card */}
                    <View style={styles.cardWrapper}>
                        <Image
                            source={require('@/assets/images/onboarding/passenger.png')}
                            style={styles.passengerImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            style={[styles.card, { borderColor: '#E8440A' }]}
                            onPress={() => handleSelectMode('passenger')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>I'm a Passenger</Text>
                                <Text style={styles.cardSubtitle}>
                                    Book rides and get to your destination safely
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Driver Card */}
                    <View style={styles.cardWrapper}>
                        {/* Car image behind the card — left edge overflow */}
                        <Image
                            source={require('@/assets/images/onboarding/car.png')}
                            style={styles.carImage}
                            resizeMode="contain"
                        />
                        {/* Chauffeur figure overlapping on top of car */}
                        <Image
                            source={require('@/assets/images/onboarding/driver.png')}
                            style={styles.driverImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            style={[styles.card, { borderColor: '#DDD' }]}
                            onPress={() => handleSelectMode('driver')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>I'm a Driver</Text>
                                <Text style={styles.cardSubtitle}>
                                    Earn money by giving rides to passengers
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── FOOTER ── */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <Text
                            style={styles.link}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            Sign In
                        </Text>
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF5ED',
    },

    /* ── HEADER ── */
    header: {
        paddingVertical: 20,
        height: height * 0.48,
        width: '100%',
        overflow: 'hidden',          // clips the taller bgImage cleanly
        backgroundColor: '#111218', // fallback while image loads
    },
    bgImage: {
        height: height * 0.6,        // taller than header — ensures full fill, no gap
    },
    headerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.44)',
    },
    logoContainer: {
        position: 'absolute',
        top: '28%',
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
    },
    logo: {
        width: 160,
        height: 50,
    },
    headerContent: {
        position: 'absolute',
        top: '52%',
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#FFF',
        opacity: 0.88,
        textAlign: 'center',
    },
    /* ── ORANGE DIVIDER STRIP ── */
    dividerStrip: {
        width: '100%',
        height: 8,
        backgroundColor: '#F9731673',
    },

    /* ── CONTENT ── */
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16, // Matches Login screen padding
        backgroundColor: '#FDF5ED',
    },

    /* ── CARD WRAPPER ── shared by both cards ── */
    cardWrapper: {
        marginBottom: 36,
        position: 'relative',
        height: 110,
        justifyContent: 'flex-end',
    },

    /* ── PASSENGER IMAGE ── */
    passengerImage: {
        position: 'absolute',
        left: -8,
        top: -28,
        width: 105,
        height: 138,
        zIndex: 10,
    },

    /* ── DRIVER: CAR IMAGE ── */
    carImage: {
        position: 'absolute',
        left: -18,
        bottom: 0,
        width: 130,
        height: 88,
        zIndex: 8,
    },

    /* ── DRIVER: CHAUFFEUR FIGURE ── */
    driverImage: {
        position: 'absolute',
        left: 40,
        top: -20,
        width: 55,
        height: 115,
        zIndex: 10,
    },

    /* ── CARD ── */
    card: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1.5,
        height: 88,
        paddingLeft: 108,
        paddingRight: 18,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 4,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111218',
        marginBottom: 3,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#666',
        lineHeight: 17,
    },

    /* ── FOOTER ── */
    footer: {
        paddingVertical: 28,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: '#555',
    },
    link: {
        fontWeight: '900',
        color: '#E8440A',
    },
});

export default ChooseMode;
